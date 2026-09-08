// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/site';

export type Note = CollectionEntry<'notes'>;

/** 파일 id("ko/term-vs-whole-life")에서 slug 만 떼어냅니다. */
export const slugOf = (note: Note) => note.id.split('/').slice(1).join('/');

/** frontmatter 의 date 는 UTC 자정으로 파싱됩니다. 그대로 비교하면 애리조나
 *  기준 전날 오후 5시에 이미 "그날"이 되어 버립니다. 애리조나 자정까지 미룹니다.
 *  (UTC-7, 애리조나는 서머타임이 없습니다.) */
const ARIZONA_OFFSET_MS = 7 * 60 * 60 * 1000;

/** 연재 칼럼은 **신문 게재 다음 날** 공개합니다.
 *
 *  date 는 지면 게재일(화요일)이고 글에도 그 날짜가 표시됩니다. 다만 웹에는
 *  하루 늦게 올립니다. 지면이 먼저 나가는 것을 확실히 하고, 사용자가 원고를
 *  검토할 시간을 하루 더 벌기 위한 것입니다. 연재가 아닌 글에는 적용하지
 *  않습니다. */
const COLUMN_DELAY_MS = 24 * 60 * 60 * 1000;

/** 아직 공개할 때가 아닌 글인지. */
function isFuture(data: Note['data']): boolean {
	const delay = data.series ? COLUMN_DELAY_MS : 0;
	return data.date.getTime() + ARIZONA_OFFSET_MS + delay > Date.now();
}

/** 한 언어의 글을 최신순으로.
 *  드래프트와 아직 때가 안 된 글은 dev 서버에서만 보입니다. 프로덕션은 매일
 *  도는 스케줄 빌드가 때가 된 글을 자동으로 공개합니다. */
export async function getNotes(lang: Lang): Promise<Note[]> {
	const notes = await getCollection(
		'notes',
		({ data }) => data.lang === lang && (import.meta.env.DEV || (!data.draft && !isFuture(data)))
	);
	return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 원본과 같은 2026.08.10 형식. 두 언어 공통입니다.
 *  날짜만 있는 값이라 UTC 로 읽습니다. 로컬 시간대로 읽으면 하루씩 밀립니다. */
export function formatDate(date: Date): string {
	const p = (n: number) => String(n).padStart(2, '0');
	return `${date.getUTCFullYear()}.${p(date.getUTCMonth() + 1)}.${p(date.getUTCDate())}`;
}
