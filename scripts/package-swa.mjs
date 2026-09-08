// astro build 결과를 Azure Static Web Apps 배포 폴더 모양으로 옮깁니다.
//
//   deploy/
//     index.html                 <- 블로그 첫 화면 (예전엔 /note 로 보내는 리다이렉트였습니다)
//     glossary/ series/ consult/ column-01/ ... en/
//     robots.txt  sitemap-*.xml
//     staticwebapp.config.json   <- swa/ 템플릿 + 여기서 만든 리다이렉트
//
// 2026-09-08 이전에는 블로그가 /note 아래에 있었습니다. 주소가 길다는 이유로
// 루트로 옮겼고, 그때 색인돼 있던 /note/... 주소가 죽지 않도록 이 스크립트가
// 페이지마다 301 리다이렉트를 만들어 넣습니다.
import { cp, mkdir, rm, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const DEPLOY = join(ROOT, 'deploy');
const SWA = join(ROOT, 'swa');

await rm(DEPLOY, { recursive: true, force: true });
await mkdir(DEPLOY, { recursive: true });
await cp(DIST, DEPLOY, { recursive: true });

/** index.html 을 가진 디렉터리를 모두 찾습니다 = 사람이 여는 주소 목록. */
async function pagePaths(dir, base = '') {
	const found = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		if (entry.name === '_astro') continue;
		const sub = join(dir, entry.name);
		const rel = base ? `${base}/${entry.name}` : entry.name;
		try {
			await stat(join(sub, 'index.html'));
			found.push(rel);
		} catch {
			// index.html 이 없는 디렉터리는 주소가 아닙니다
		}
		found.push(...(await pagePaths(sub, rel)));
	}
	return found;
}

const paths = await pagePaths(DIST);

// 옛 주소 -> 새 주소. 첫 일치가 이기므로 긴 경로(/note/en/xxx/)를 먼저 둡니다.
const redirects = [...paths]
	.sort((a, b) => b.length - a.length)
	.map((p) => ({ route: `/note/${p}/`, redirect: `/${p}/`, statusCode: 301 }));

// 목록 자체는 마지막에.
redirects.push({ route: '/note/', redirect: '/', statusCode: 301 });
redirects.push({ route: '/note', redirect: '/', statusCode: 301 });

const template = JSON.parse(await readFile(join(SWA, 'staticwebapp.config.json'), 'utf8'));
template.routes = [...redirects, ...(template.routes ?? [])];

await cp(SWA, DEPLOY, { recursive: true });
await writeFile(
	join(DEPLOY, 'staticwebapp.config.json'),
	JSON.stringify(template, null, 2) + '\n',
	'utf8'
);

const top = (await readdir(DEPLOY)).sort();
console.log('deploy/ 준비 완료');
console.log('  루트 항목:', top.length, '개');
console.log('  페이지:', paths.length, '개');
console.log('  /note/* 리다이렉트:', redirects.length, '개');
