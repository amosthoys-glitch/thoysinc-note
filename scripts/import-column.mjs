// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

#!/usr/bin/env node
// AZ-WEKK 폴더의 신문 칼럼 .docx 를 블로그 글(MDX)로 옮깁니다.
//
//   node scripts/import-column.mjs            # 아직 안 옮긴 것 전부
//   node scripts/import-column.mjs --dry      # 무엇이 옮겨질지만 보기
//   node scripts/import-column.mjs <파일경로>  # 특정 파일 하나만
//
// build-column.ps1 이 만든 문서는 문단 스타일이 일정합니다.
//   Heading1 = 제목 / 그 다음 Normal = 부제(연재명 + 원문자 회차)
//   Heading3 = 소제목 / Normal = 본문 / 마지막 Normal = 문의 전화번호
// 전화번호 줄은 옮기지 않습니다. 블로그에는 상담 CTA 가 따로 붙습니다.

import { readFile, writeFile, readdir, access, mkdir } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'src', 'content', 'notes', 'ko');
const COLUMN_DIR = 'C:\\Users\\AmosJung\\OneDrive - Thoys Inc\\AZ-WEKK';

const SERIES = '은퇴까지 10년, 매주 한 걸음';
const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳';

const dry = process.argv.includes('--dry');
const explicit = process.argv.slice(2).find((a) => !a.startsWith('--'));

/** .docx 안의 word/document.xml 을 꺼냅니다. unzip 은 Git for Windows 에 딸려 옵니다. */
function readDocumentXml(file) {
	return execFileSync('unzip', ['-p', file, 'word/document.xml'], {
		encoding: 'utf8',
		maxBuffer: 32 * 1024 * 1024,
	});
}

function decode(s) {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&');
}

/** 문단을 [{ style, text }] 로 만듭니다. */
function paragraphs(xml) {
	const out = [];
	for (const m of xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
		const block = m[0];
		const style = block.match(/w:pStyle w:val="([^"]+)"/)?.[1] ?? 'Normal';
		const text = decode(
			block
				.replace(/<w:tab[^>]*\/>/g, ' ')
				.replace(/<[^>]+>/g, '')
		)
			.replace(/\s+/g, ' ')
			.trim();
		if (text) out.push({ style, text });
	}
	return out;
}

/** 파일명에서 게재일을 읽습니다.
 *  새 규칙(2026-09-15 게재분부터): AKWEEK + MMDDYYYY, 항상 8자리.
 *    AKWEEK09152026.docx -> 2026-09-15
 *  옛 규칙(그 이전 파일): 월·일에 앞 0 이 없습니다.
 *    AKWEEK8182026.docx -> 2026-08-18
 *  옛 파일 이름은 바꾸지 않으므로 두 형식을 모두 읽습니다. */
function dateFromName(name) {
	const digits = basename(name).match(/AKWEEK[^0-9]*([0-9]{5,8})/i)?.[1];
	if (!digits) return null;

	const year = digits.slice(-4);
	const md = digits.slice(0, -4);
	let month;
	let day;

	if (md.length === 4) [month, day] = [md.slice(0, 2), md.slice(2)];
	else if (md.length === 3) {
		// 812 는 8/12 로, 128 은 12/8 로 읽어야 합니다. 앞 두 자리가 유효한 달이면 그쪽을 씁니다.
		const asTwo = Number(md.slice(0, 2));
		if (asTwo >= 10 && asTwo <= 12) [month, day] = [md.slice(0, 2), md.slice(2)];
		else [month, day] = [md.slice(0, 1), md.slice(1)];
	} else if (md.length === 2) [month, day] = [md.slice(0, 1), md.slice(1)];
	else return null;

	const mm = String(Number(month)).padStart(2, '0');
	const dd = String(Number(day)).padStart(2, '0');
	if (Number(mm) < 1 || Number(mm) > 12 || Number(dd) < 1 || Number(dd) > 31) return null;
	return `${year}-${mm}-${dd}`;
}

/** MDX 에서 의미를 갖는 문자를 막습니다. */
function mdEscape(s) {
	return s.replace(/[{}]/g, (c) => '\\' + c).replace(/<(?=[A-Za-z/])/g, '\\<');
}

const yaml = (s) => (s.includes("'") && !s.includes('"') ? `"${s}"` : `'${s.replace(/'/g, "''")}'`);

function parseColumn(file) {
	const paras = paragraphs(readDocumentXml(file));
	if (!paras.length) return { error: '문단을 찾지 못했습니다' };

	// 연재 표기가 먼저입니다. 연재 시작 전의 옛 칼럼 100편 가까이가 같은 폴더에
	// 있는데, 서식이 달라 여기서 걸러 내야 합니다. 대상이 아닌 것이지 오류가 아닙니다.
	const subtitle = paras.find((p) => p.text.includes(SERIES));
	const mark = subtitle?.text.match(new RegExp(`[${CIRCLED}]`))?.[0];
	const episode = mark ? CIRCLED.indexOf(mark) + 1 : null;
	if (!episode) return { notSeries: true };

	const titlePara = paras.find((p) => p.style === 'Heading1');
	if (!titlePara) return { error: 'Heading1(제목)이 없습니다' };

	const date = dateFromName(file);
	if (!date) return { error: `파일명에서 날짜를 읽지 못했습니다: ${basename(file)}` };

	// 제목·부제 다음부터 본문. 마지막 "문의 ..." 줄은 버립니다.
	const startIdx = Math.max(paras.indexOf(titlePara), paras.indexOf(subtitle)) + 1;
	const body = paras
		.slice(startIdx)
		.filter((p) => !/^문의\s/.test(p.text));

	const lines = [];
	let excerpt = '';
	for (const p of body) {
		if (p.style.startsWith('Heading')) lines.push(`## ${mdEscape(p.text)}`);
		else {
			if (!excerpt) excerpt = p.text;
			lines.push(mdEscape(p.text));
		}
	}
	if (!lines.length) return { error: '본문이 비어 있습니다' };

	// 발췌는 첫 문단을 한 문장 정도로 줄입니다.
	const firstStop = excerpt.search(/(?<=[.?!])\s/);
	if (firstStop > 40) excerpt = excerpt.slice(0, firstStop + 1);
	if (excerpt.length > 110) excerpt = excerpt.slice(0, 108).trimEnd() + '…';

	return {
		episode,
		date,
		title: titlePara.text,
		excerpt,
		slug: `column-${String(episode).padStart(2, '0')}`,
		markdown: lines.join('\n\n') + '\n',
	};
}

/* ---------- 실행 ---------- */

let files;
if (explicit) files = [explicit];
else {
	const all = await readdir(COLUMN_DIR);
	files = all
		.filter((f) => /^AKWEEK.*\.docx$/i.test(f) && !f.startsWith('~$'))
		.map((f) => join(COLUMN_DIR, f));
}

await mkdir(OUT_DIR, { recursive: true });

const made = [];
let notSeries = 0;
const skipped = [];
const failed = [];

for (const file of files) {
	let parsed;
	try {
		parsed = parseColumn(file);
	} catch (err) {
		failed.push(`${basename(file)}: ${err.message}`);
		continue;
	}
	if (parsed.notSeries) {
		notSeries++;
		continue;
	}
	if (parsed.error) {
		failed.push(`${basename(file)}: ${parsed.error}`);
		continue;
	}

	const out = join(OUT_DIR, `${parsed.slug}.mdx`);
	try {
		await access(out);
		skipped.push(`${basename(file)} — 이미 옮김 (${parsed.slug}.mdx)`);
		continue;
	} catch {
		// 없으면 새로 만듭니다
	}

	const front = [
		'---',
		`title: ${yaml(parsed.title)}`,
		`excerpt: ${yaml(parsed.excerpt)}`,
		"cat: 'retirement'",
		`date: '${parsed.date}'`,
		"read: '4분'",
		"lang: 'ko'",
		`series: ${yaml(SERIES)}`,
		`episode: ${parsed.episode}`,
		"photo: 'sedona-sunset'",
		'---',
		'',
		'',
	].join('\n');

	if (!dry) await writeFile(out, front + parsed.markdown, 'utf8');
	made.push(`${parsed.episode}화 ${parsed.date} — ${parsed.title} → ${parsed.slug}.mdx`);
}

made.sort();
if (made.length) {
	console.log(dry ? '옮겨질 칼럼:' : '옮긴 칼럼:');
	for (const m of made) console.log('  ' + m);
} else {
	console.log('새로 옮길 칼럼이 없습니다.');
}
if (skipped.length) {
	console.log(`\n이미 옮긴 것 ${skipped.length}건`);
	for (const s of skipped.slice(0, 6)) console.log('  ' + s);
	if (skipped.length > 6) console.log(`  … 외 ${skipped.length - 6}건`);
}
if (notSeries) {
	console.log(`\n대상 외 ${notSeries}건 — 연재 시작 전의 옛 칼럼(서식이 다릅니다)`);
}
if (failed.length) {
	console.log(`\n실패 ${failed.length}건:`);
	for (const f of failed) console.log('  ' + f);
	process.exitCode = 1;
}
