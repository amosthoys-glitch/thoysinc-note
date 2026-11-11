// 언어별 RSS 피드를 만듭니다. 네이버 서치어드바이저·다음 웹마스터도구에 "콘텐츠 피드"로 제출합니다.
import rss from '@astrojs/rss';
import { SITE, type Lang } from '../data/site';
import { getNotes, slugOf } from './notes';
import { href } from './urls';

export async function feed(lang: Lang, site: URL) {
	const s = SITE[lang];
	const notes = await getNotes(lang);
	return rss({
		title: s.brand,
		description: s.lede,
		site: new URL(href(lang), site).toString(),
		items: notes.map((n) => ({
			title: n.data.title,
			description: n.data.excerpt,
			pubDate: n.data.date,
			link: new URL(href(lang, slugOf(n)), site).toString(),
		})),
		customData: `<language>${lang === 'ko' ? 'ko-kr' : 'en-us'}</language>`,
	});
}
