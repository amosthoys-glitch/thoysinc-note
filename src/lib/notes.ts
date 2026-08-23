import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/site';

export type Note = CollectionEntry<'notes'>;

/** 파일 id("ko/term-vs-whole-life")에서 slug 만 떼어냅니다. */
export const slugOf = (note: Note) => note.id.split('/').slice(1).join('/');

/** 발행일이 아직 오지 않은 글인지. 신문 게재일 전에 블로그에 먼저 뜨면 안 됩니다. */
const isFuture = (date: Date) => date.getTime() > Date.now();

/** 한 언어의 글을 최신순으로.
 *  드래프트와 미래 날짜 글은 dev 서버에서만 보입니다. 프로덕션은 매일 도는
 *  스케줄 빌드가 날짜가 된 글을 자동으로 공개합니다. */
export async function getNotes(lang: Lang): Promise<Note[]> {
	const notes = await getCollection(
		'notes',
		({ data }) =>
			data.lang === lang && (import.meta.env.DEV || (!data.draft && !isFuture(data.date)))
	);
	return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 원본과 같은 2026.08.10 형식. 두 언어 공통입니다.
 *  날짜만 있는 값이라 UTC 로 읽습니다. 로컬 시간대로 읽으면 하루씩 밀립니다. */
export function formatDate(date: Date): string {
	const p = (n: number) => String(n).padStart(2, '0');
	return `${date.getUTCFullYear()}.${p(date.getUTCMonth() + 1)}.${p(date.getUTCDate())}`;
}
