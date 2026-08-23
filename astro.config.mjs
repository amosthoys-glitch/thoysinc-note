// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.thoysinc.com',
	// 회사 사이트 아래 /note 경로로 서비스합니다. 기존 URL 을 그대로 유지합니다.
	base: '/note',
	trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
});
