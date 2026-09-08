// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 소셜 공유 카드(og:image)에 쓰는 사진. 전부 애리조나에서 직접 찍은 사진입니다.
// 글 frontmatter 의 photo: '<키>' 로 고르고, 없으면 DEFAULT_PHOTO 가 쓰입니다.
import type { ImageMetadata } from 'astro';

import sedonaNight from '../assets/sedona-night.jpg';
import sedonaRoad from '../assets/sedona-road.jpg';
import sedonaChapel from '../assets/sedona-chapel.jpg';
import sedonaButtes from '../assets/sedona-buttes.jpg';

export const PHOTOS = {
	'sedona-night': sedonaNight,
	'sedona-road': sedonaRoad,
	'sedona-chapel': sedonaChapel,
	'sedona-buttes': sedonaButtes,
} satisfies Record<string, ImageMetadata>;

export type PhotoKey = keyof typeof PHOTOS;

export const PHOTO_KEYS = Object.keys(PHOTOS) as [PhotoKey, ...PhotoKey[]];

export const DEFAULT_PHOTO: PhotoKey = 'sedona-night';
