// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

#!/usr/bin/env node
// 새 글을 한국어/영어 짝으로 만듭니다. 두 파일이 같은 slug 를 쓰면
// 언어 전환 링크와 hreflang 이 자동으로 이어집니다.
//
//   npm run new -- <slug> --cat life --ko "한국어 제목" --en "English title"
//   npm run new -- <slug> --cat annuity --ko "제목만"      (한국어만 만들기)

import { writeFile, access, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOTES = join(ROOT, 'src', 'content', 'notes');
const CATS = ['life', 'annuity', 'retirement', 'business'];

const argv = process.argv.slice(2);
const flags = { cat: '', ko: '', en: '' };
const positional = [];

for (let i = 0; i < argv.length; i++) {
	const arg = argv[i];
	if (arg === '--cat') flags.cat = argv[++i];
	else if (arg === '--ko') flags.ko = argv[++i];
	else if (arg === '--en') flags.en = argv[++i];
	else if (arg.startsWith('--')) {
		console.error(`알 수 없는 옵션: ${arg}`);
		process.exit(1);
	} else positional.push(arg);
}

const [slug] = positional;

if (!slug) {
	console.error('사용법: npm run new -- <slug> --cat <life|annuity|retirement|business> --ko "제목" [--en "Title"]');
	process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
	console.error(`slug 는 소문자 영숫자와 하이픈만 씁니다 (받은 값: "${slug}")`);
	process.exit(1);
}
if (!CATS.includes(flags.cat)) {
	console.error(`--cat 은 ${CATS.join(' | ')} 중 하나여야 합니다 (받은 값: "${flags.cat}")`);
	process.exit(1);
}
if (!flags.ko && !flags.en) {
	console.error('--ko 또는 --en 중 최소 하나는 제목을 주셔야 합니다.');
	process.exit(1);
}

const now = new Date();
const p = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;

const yaml = (s) => (s.includes("'") && !s.includes('"') ? `"${s}"` : `'${s.replace(/'/g, "''")}'`);

const BODY = {
	ko: `여는 문단. 상담에서 실제로 들은 질문을 그대로 씁니다.

## 첫 번째 항목

<Callout tag="여기서 자주 막힙니다">

읽는 분이 걸려 넘어지는 지점을 짚어 줍니다.

</Callout>
`,
	en: `Opening paragraph. Use the question as people actually ask it.

## First section

<Callout tag="Where people get stuck">

Name the thing readers trip over.

</Callout>
`,
};

const made = [];

for (const [lang, title] of [
	['ko', flags.ko],
	['en', flags.en],
]) {
	if (!title) continue;

	const dir = join(NOTES, lang);
	await mkdir(dir, { recursive: true });
	const file = join(dir, `${slug}.mdx`);

	try {
		await access(file);
		console.error(`이미 존재합니다: ${file}`);
		process.exit(1);
	} catch {
		// 없으면 정상
	}

	const fm = [
		'---',
		`title: ${yaml(title)}`,
		"excerpt: ''",
		`cat: '${flags.cat}'`,
		`date: '${date}'`,
		`read: ${lang === 'ko' ? "'5분'" : "'5 min'"}`,
		`lang: '${lang}'`,
		'draft: true',
		'---',
		"import Callout from '../../../components/Callout.astro';",
		'',
		'',
	].join('\n');

	await writeFile(file, fm + BODY[lang], 'utf8');
	made.push({ lang, file, url: lang === 'ko' ? `/note/${slug}/` : `/note/en/${slug}/` });
}

for (const m of made) console.log(`생성됨 [${m.lang}] ${m.file}\n         URL ${m.url}`);
console.log('\ndraft: true 상태입니다. excerpt 를 채우고 그 줄을 지우면 발행됩니다.');
console.log('표지 도식이 필요하면 frontmatter 에 art: <번호> 를 넣으세요 (현재 0~6).');
