import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/site';

export type Note = CollectionEntry<'notes'>;

/** 파일 id("ko/term-vs-whole-life")에서 slug 만 떼어냅니다. */
export const slugOf = (note: Note) => note.id.split('/').slice(1).join('/');

/** 한 언어의 글을 최신순으로. 드래프트는 dev 서버에서만 보입니다. */
export async function getNotes(lang: Lang): Promise<Note[]> {
	const notes = await getCollection(
		'notes',
		({ data }) => data.lang === lang && (import.meta.env.DEV || !data.draft)
	);
	return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 원본과 같은 2026.08.10 형식. 두 언어 공통입니다.
 *  날짜만 있는 값이라 UTC 로 읽습니다. 로컬 시간대로 읽으면 하루씩 밀립니다. */
export function formatDate(date: Date): string {
	const p = (n: number) => String(n).padStart(2, '0');
	return `${date.getUTCFullYear()}.${p(date.getUTCMonth() + 1)}.${p(date.getUTCDate())}`;
}
