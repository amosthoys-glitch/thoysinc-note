import type { Lang } from '../data/site';

/** astro.config 의 base('/note') 를 항상 앞뒤 슬래시가 하나인 형태로 정규화합니다. */
const BASE = ('/' + import.meta.env.BASE_URL + '/').replace(/\/+/g, '/');

/** 언어와 경로로 사이트 내부 URL 을 만듭니다. href('en', 'glossary') -> /note/en/glossary/ */
export function href(lang: Lang, path = ''): string {
	const prefix = lang === 'en' ? 'en/' : '';
	const tail = path ? path.replace(/^\/|\/$/g, '') + '/' : '';
	return BASE + prefix + tail;
}

/** 같은 글의 반대 언어 URL. 두 언어가 slug 를 공유하기에 가능합니다. */
export const other = (lang: Lang): Lang => (lang === 'ko' ? 'en' : 'ko');
