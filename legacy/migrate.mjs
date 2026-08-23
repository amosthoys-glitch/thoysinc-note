// 단일 HTML 블로그(index.html)의 데이터를 Astro 콘텐츠로 옮깁니다.
//   node migrate.mjs <프로젝트경로>
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import { GLOSSARY, SITE, ART, POSTS } from './data.mjs';

const OUT = process.argv[2];
if (!OUT) {
	console.error('사용법: node migrate.mjs <프로젝트경로>');
	process.exit(1);
}

const BACKSLASH = String.fromCharCode(92);

/* 글 번호 -> URL 슬러그. ko/en 이 같은 슬러그를 공유해 hreflang 짝을 만듭니다. */
const SLUGS = [
	'retirement-where-to-start',
	'term-vs-whole-life',
	'beneficiary-beats-will',
	'what-is-an-annuity',
	'declared-vs-indexed',
	'401k-ira-roth',
	'business-owner-structures',
];

/* 글 번호 -> 소셜 공유 카드 사진. 애리조나에서 직접 찍은 사진들입니다.
   내용을 주장하는 그림이 아니라 배경이므로 글 성격에 맞춰 느슨하게 배정합니다. */
const PHOTOS = [
	'sedona-road', // 0 은퇴 준비의 시작 — 길
	'sedona-buttes', // 1 텀 vs 홀
	'sedona-chapel', // 2 수익자 — 남기는 것
	'sedona-night', // 3 연금 — 평생
	'sedona-buttes', // 4 확정이율 vs 인덱스
	'sedona-road', // 5 401(k)/IRA/Roth
	'sedona-chapel', // 6 사업주 구조
];

/* 언어별 표시 문자열 -> 언어 중립 키 */
const CAT_KEY = {
	'은퇴 플랜': 'retirement',
	생명보험: 'life',
	연금: 'annuity',
	비즈니스: 'business',
	Retirement: 'retirement',
	Life: 'life',
	Annuity: 'annuity',
	Business: 'business',
};

const warnings = [];

/* ---------- 인라인 변환 ---------- */
function inline(node, ctx) {
	let out = '';
	for (const child of node.childNodes) {
		if (child.nodeType === 3) {
			out += mdEscape(child.rawText);
			continue;
		}
		const tag = child.rawTagName?.toLowerCase();
		if (tag === 'b' || tag === 'strong') out += '**' + inline(child, ctx).trim() + '**';
		// 강조는 반드시 * 를 씁니다. _ 는 단어 중간에서 닫히지 못해
		// "_강조_를" 처럼 한글 조사가 붙으면 강조가 풀리고 밑줄이 그대로 보입니다.
		else if (tag === 'em' || tag === 'i') out += '*' + inline(child, ctx).trim() + '*';
		else if (tag === 'br') out += '\n';
		else {
			warnings.push(`${ctx}: 인라인에서 예상 못 한 <${tag}>`);
			out += inline(child, ctx);
		}
	}
	return out;
}

/* HTML 엔티티 복원 + 마크다운/MDX 에서 의미를 갖는 문자 이스케이프 */
function mdEscape(raw) {
	let s = raw
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ');
	// MDX 는 { 를 표현식으로, < 를 JSX 로 읽습니다.
	s = s.replace(/[{}]/g, (c) => BACKSLASH + c);
	s = s.replace(/<(?=[A-Za-z/])/g, BACKSLASH + '<');
	// 줄바꿈과 들여쓰기로 인한 공백을 한 칸으로 정리
	return s.replace(/\s+/g, ' ');
}

/* ---------- 표 -> 마크다운 ---------- */
function tableToMd(table, ctx) {
	const head = table.querySelectorAll('thead tr');
	const bodyRows = table.querySelectorAll('tbody tr');
	if (head.length !== 1) warnings.push(`${ctx}: thead 행이 ${head.length}개`);

	const cells = (tr) => tr.childNodes.filter((n) => /^(th|td)$/i.test(n.rawTagName || '')).map((td) => inline(td, ctx).trim());

	const header = cells(head[0]);
	const lines = [
		'| ' + header.join(' | ') + ' |',
		'|' + header.map(() => '---').join('|') + '|',
		...bodyRows.map((tr) => '| ' + cells(tr).join(' | ') + ' |'),
	];
	return lines.join('\n');
}

/* ---------- 블록 변환 ---------- */
function blockToMd(node, ctx) {
	const tag = node.rawTagName?.toLowerCase();

	if (tag === 'p') return inline(node, ctx).trim();

	if (tag === 'h2') return '## ' + inline(node, ctx).trim();

	if (tag === 'ul') {
		return node
			.querySelectorAll('li')
			.map((li) => '- ' + inline(li, ctx).trim())
			.join('\n');
	}

	if (tag === 'div' && node.classList.contains('callout')) {
		const tagEl = node.querySelector('span.tag');
		const label = tagEl ? inline(tagEl, ctx).trim() : '';
		if (tagEl) tagEl.remove();
		const inner = inline(node, ctx).trim();
		return `<Callout tag="${label.replace(/"/g, '&quot;')}">\n\n${inner}\n\n</Callout>`;
	}

	if (tag === 'div' && node.classList.contains('tablewrap')) {
		const table = node.querySelector('table');
		if (!table) {
			warnings.push(`${ctx}: tablewrap 안에 table 없음`);
			return '';
		}
		return `<Ledger>\n\n${tableToMd(table, ctx)}\n\n</Ledger>`;
	}

	warnings.push(`${ctx}: 처리 못 한 블록 <${tag} class="${node.getAttribute('class') || ''}">`);
	return '';
}

function bodyToMd(html, ctx) {
	const root = parse(html);
	const blocks = root.childNodes
		.filter((n) => n.nodeType === 1)
		.map((n) => blockToMd(n, ctx))
		.filter(Boolean);
	// 텍스트 노드가 블록 밖에 남아 있으면 유실이므로 경고
	const stray = root.childNodes
		.filter((n) => n.nodeType === 3 && n.rawText.trim())
		.map((n) => n.rawText.trim());
	if (stray.length) warnings.push(`${ctx}: 블록 밖 텍스트 ${JSON.stringify(stray)}`);
	return blocks.join('\n\n') + '\n';
}

/* ---------- YAML ---------- */
/* 작은따옴표가 들어 있고 큰따옴표는 없으면 큰따옴표로 감싸 읽기 쉽게 둡니다. */
const yamlStr = (s) => {
	const v = String(s);
	if (v.includes("'") && !v.includes('"')) return '"' + v + '"';
	return "'" + v.replace(/'/g, "''") + "'";
};

/* ---------- 실행 ---------- */
const usesCallout = (md) => md.includes('<Callout');
const usesLedger = (md) => md.includes('<Ledger');

let written = 0;

for (const lang of ['ko', 'en']) {
	const dir = join(OUT, 'src', 'content', 'notes', lang);
	await mkdir(dir, { recursive: true });

	for (const [i, post] of POSTS[lang].entries()) {
		const ctx = `${lang}[${i}] ${post.title.slice(0, 24)}`;
		const slug = SLUGS[i];
		const cat = CAT_KEY[post.cat];
		if (!cat) throw new Error(`${ctx}: 알 수 없는 카테고리 "${post.cat}"`);

		const md = bodyToMd(post.body, ctx);

		const imports = [];
		if (usesCallout(md)) imports.push("import Callout from '../../../components/Callout.astro';");
		if (usesLedger(md)) imports.push("import Ledger from '../../../components/Ledger.astro';");

		const fm = [
			'---',
			`title: ${yamlStr(post.title)}`,
			`excerpt: ${yamlStr(post.excerpt)}`,
			`cat: ${yamlStr(cat)}`,
			`date: ${yamlStr(post.date.replace(/\./g, '-'))}`,
			`read: ${yamlStr(post.read)}`,
			`lang: ${yamlStr(lang)}`,
			`art: ${i}`,
			`photo: '${PHOTOS[i]}'`,
			'---',
			'',
		].join('\n');

		const file = join(dir, `${slug}.mdx`);
		await writeFile(file, fm + (imports.length ? imports.join('\n') + '\n\n' : '') + md, 'utf8');
		written++;
	}
}

/* 용어사전 / 표지도식 / 사이트 문자열 */
const dataDir = join(OUT, 'src', 'data');
await mkdir(dataDir, { recursive: true });

await writeFile(
	join(dataDir, 'glossary.ts'),
	'// 원본 index.html 에서 이관. 본문 용어 자동 표시와 용어사전 페이지가 함께 씁니다.\n' +
		'export type GlossEntry = { alt: string; def: string };\n' +
		'export const GLOSSARY: Record<"ko" | "en", Record<string, GlossEntry>> = ' +
		JSON.stringify(GLOSSARY, null, '\t') +
		';\n',
	'utf8'
);

await writeFile(
	join(dataDir, 'art.ts'),
	'// 글마다 하나씩 대응하는 표지 도식. 글자가 없어 두 언어가 그대로 공유합니다.\n' +
		'export const ART: string[] = ' +
		JSON.stringify(ART, null, '\t') +
		';\n',
	'utf8'
);

await writeFile(
	join(dataDir, 'site.ts'),
	'// 언어별 사이트 문자열. 원본 index.html 의 SITE 를 그대로 이관했습니다.\n' +
		'export const CATS = ["all", "life", "annuity", "retirement", "business"] as const;\n' +
		'export type Cat = (typeof CATS)[number];\n' +
		'export type Lang = "ko" | "en";\n' +
		'export const SITE = ' +
		JSON.stringify(SITE, null, '\t') +
		' as const;\n',
	'utf8'
);

console.log(`글 ${written}개 생성 (ko ${POSTS.ko.length} + en ${POSTS.en.length})`);
console.log(`용어사전 ${Object.keys(GLOSSARY.ko).length}개, 표지도식 ${ART.length}개, 사이트 문자열 2개 언어`);
if (warnings.length) {
	console.log('\n경고 ' + warnings.length + '건:');
	for (const w of warnings) console.log('  - ' + w);
} else {
	console.log('\n변환 경고 없음 — 모든 블록이 알려진 형식이었습니다.');
}
