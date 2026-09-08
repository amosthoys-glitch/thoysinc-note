// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 파일 경로가 곧 id 입니다: notes/ko/<slug>.mdx -> "ko/<slug>"
// ko 와 en 이 같은 slug 를 쓰므로 두 언어 글이 자동으로 짝지어집니다.
const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.mdx' }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		cat: z.enum(['life', 'annuity', 'retirement', 'business']),
		date: z.coerce.date(),
		read: z.string(),
		lang: z.enum(['ko', 'en']),
		// 표지 도식 번호. 새 글에서 생략하면 표지 없이 나갑니다.
		art: z.number().int().min(0).optional(),
		draft: z.boolean().default(false),
		// 소셜 공유 카드에 쓸 사진 키. src/data/photos.ts 참고.
		photo: z.enum(['sedona-dusk', 'sedona-sunset', 'sedona-monsoon', 'sedona-redrock']).optional(),
		// 연재물. 신문 칼럼을 옮겨 온 글에 붙습니다.
		series: z.string().optional(),
		episode: z.number().int().min(1).optional(),
	}),
});

export const collections = { notes };
