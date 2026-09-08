// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// 배포 대상마다 주소가 다릅니다.
//   운영(Azure SWA)      : https://www.thoysinc.com/
//   미리보기(GitHub Pages): https://amosthoys-glitch.github.io/thoysinc-note/
// 워크플로가 SITE_URL / SITE_BASE 를 넣어 주고, 없으면 운영 기본값을 씁니다.
const site = process.env.SITE_URL ?? 'https://www.thoysinc.com';
const base = process.env.SITE_BASE ?? '/';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
});
