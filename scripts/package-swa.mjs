// astro build 결과를 Azure Static Web Apps 배포 폴더 모양으로 옮깁니다.
//
//   deploy/
//     index.html                 <- / 를 /note/ 로 보내는 리다이렉트
//     robots.txt
//     sitemap-index.xml, sitemap-0.xml
//     staticwebapp.config.json
//     note/**                    <- astro build 산출물 전체
//
// astro 의 base:'/note' 는 링크만 바꾸고 폴더는 중첩하지 않기 때문에 이 단계가 필요합니다.
import { cp, mkdir, rm, readdir, rename } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const DEPLOY = join(ROOT, 'deploy');
const NOTE = join(DEPLOY, 'note');

// 사이트맵은 절대 URL 을 담고 있고 robots.txt 가 루트에서 가리키므로 루트에 둡니다.
const ROOT_LEVEL = ['sitemap-index.xml', 'sitemap-0.xml'];

await rm(DEPLOY, { recursive: true, force: true });
await mkdir(NOTE, { recursive: true });

await cp(DIST, NOTE, { recursive: true });

for (const name of ROOT_LEVEL) {
	const from = join(NOTE, name);
	try {
		await rename(from, join(DEPLOY, name));
	} catch {
		// 사이트맵이 없으면 조용히 넘어갑니다
	}
}

await cp(join(ROOT, 'swa'), DEPLOY, { recursive: true });

const top = (await readdir(DEPLOY)).sort();
const noteTop = (await readdir(NOTE)).length;
console.log('deploy/ 준비 완료');
console.log('  루트:', top.join(', '));
console.log('  note/ 항목 수:', noteTop);
