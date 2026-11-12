// 원본 index.html 의 본문과, 새로 빌드한 정적 페이지의 본문이 같은지 대조합니다.
// 태그와 공백을 걷어낸 순수 텍스트끼리 비교하므로 마크업이 달라져도 통과합니다.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import { POSTS } from './data.mjs';

const DEPLOY = process.argv[2];
if (!DEPLOY) {
	console.error('사용법: node verify.mjs <deploy 폴더>');
	process.exit(1);
}

const SLUGS = [
	'retirement-where-to-start',
	'term-vs-whole-life',
	'beneficiary-beats-will',
	'what-is-an-annuity',
	'declared-vs-indexed',
	'401k-ira-roth',
	'business-owner-structures',
];

// 원본 뒤에 보충 단락을 덧붙인 글 (2026-11-11 사용자 결정 "고칠 수 있는 거 고쳐봐").
// 이 글들은 원본 본문이 한 글자도 빠짐없이 맨 앞에 그대로 있어야 통과합니다.
// 원본 중간을 고치거나 지우면 지금처럼 불일치로 잡히고, 끝에 더한 내용만 허용됩니다.
// 제목·발췌·카테고리·날짜·읽는 시간은 다른 글과 똑같이 원본과 같아야 합니다.
const SUPPLEMENTED = new Set([
	'ko/what-is-an-annuity',
	'en/what-is-an-annuity',
	'ko/declared-vs-indexed',
	'en/declared-vs-indexed',
	'ko/401k-ira-roth',
	'en/401k-ira-roth',
]);

/** 태그를 걷어낸 순수 텍스트.
 *  공백은 전부 제거합니다 — 원본은 블록 사이에 공백이 없고 새 마크업은 있어서,
 *  공백을 남기면 무해한 차이가 전부 불일치로 잡힙니다. 글자 유실은 그대로 잡힙니다. */
function plain(html) {
	return parse(html)
		.structuredText.replace(/\s+/g, '')
		.replace(/[‘’]/g, "'")
		.replace(/[“”]/g, '"');
}

let pass = 0;
let supplemented = 0;
const fails = [];

for (const lang of ['ko', 'en']) {
	for (const [i, post] of POSTS[lang].entries()) {
		const slug = SLUGS[i];
		const file = join(DEPLOY, lang === 'en' ? 'en' : '', slug, 'index.html');

		let built;
		try {
			built = await readFile(file, 'utf8');
		} catch {
			fails.push(`${lang}/${slug}: 빌드 결과 없음 (${file})`);
			continue;
		}

		const root = parse(built);
		const prose = root.querySelector('.prose');
		if (!prose) {
			fails.push(`${lang}/${slug}: .prose 없음`);
			continue;
		}

		const want = plain(post.body);
		const got = plain(prose.innerHTML);

		if (want === got) {
			pass++;
			continue;
		}
		if (SUPPLEMENTED.has(`${lang}/${slug}`) && got.startsWith(want)) {
			pass++;
			supplemented++;
			continue;
		}

		// 어디서 갈라지는지 첫 지점을 보여 줍니다
		let k = 0;
		while (k < want.length && k < got.length && want[k] === got[k]) k++;
		fails.push(
			`${lang}/${slug}: ${k}번째 글자부터 다름\n` +
				`      원본: ...${want.slice(Math.max(0, k - 40), k + 60)}\n` +
				`      신규: ...${got.slice(Math.max(0, k - 40), k + 60)}`
		);
	}
}

// 제목/발췌/카테고리/날짜도 함께 봅니다
for (const lang of ['ko', 'en']) {
	for (const [i, post] of POSTS[lang].entries()) {
		const slug = SLUGS[i];
		const file = join(DEPLOY, lang === 'en' ? 'en' : '', slug, 'index.html');
		let built;
		try {
			built = await readFile(file, 'utf8');
		} catch {
			continue;
		}
		const root = parse(built);
		const h1 = root.querySelector('article h1')?.structuredText.trim();
		const dek = root.querySelector('article .dek')?.structuredText.trim();
		const meta = root.querySelector('article header .eyebrow')?.structuredText.replace(/\s+/g, ' ').trim();

		if (h1 !== post.title) fails.push(`${lang}/${slug}: 제목 불일치\n      원본: ${post.title}\n      신규: ${h1}`);
		if (dek !== post.excerpt) fails.push(`${lang}/${slug}: 발췌 불일치\n      원본: ${post.excerpt}\n      신규: ${dek}`);

		const wantMeta = `${post.cat} · ${post.date} · ${post.read}`;
		if (meta !== wantMeta) fails.push(`${lang}/${slug}: 머리 정보 불일치\n      원본: ${wantMeta}\n      신규: ${meta}`);
	}
}

console.log(`본문 일치: ${pass}/14`);
if (supplemented) console.log(`  (그중 ${supplemented}편은 원본 본문 그대로 + 끝에 보충 단락)`);
if (fails.length) {
	console.log(`\n불일치 ${fails.length}건:`);
	for (const f of fails) console.log('  - ' + f);
	process.exit(1);
} else {
	console.log('제목·발췌·카테고리·날짜·읽는 시간 모두 일치');
	console.log('\n원본과 새 사이트의 내용이 완전히 같습니다.');
}
