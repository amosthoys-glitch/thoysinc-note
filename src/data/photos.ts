// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 글머리·소셜 카드에 쓰는 사진.
//
// 전부 직접 찍은 세도나 사진이다(2025-07-03~04). 예전에는 출처를 알 수 없는 사진을
// 쓰고 있었는데, 어디서 받았는지 기억나지 않는 이미지는 상업적으로 운영하는 사이트에
// 두면 안 된다. 앞으로 사진이 더 필요하면 같은 자리(본인 사진첩)에서 가져온다.
//
// 공개 전에 16:9 로 자르고 2400px 로 줄이고 메타데이터를 지운다 —
// 원본 EXIF 에는 촬영 위치(GPS)가 들어 있다.
import type { ImageMetadata } from 'astro';

import sedonaSunset from '../assets/sedona-sunset.jpg';
import sedonaDusk from '../assets/sedona-dusk.jpg';
import sedonaMonsoon from '../assets/sedona-monsoon.jpg';
import sedonaRedrock from '../assets/sedona-redrock.jpg';

export const PHOTOS = {
	'sedona-sunset': sedonaSunset,
	'sedona-dusk': sedonaDusk,
	'sedona-monsoon': sedonaMonsoon,
	'sedona-redrock': sedonaRedrock,
} satisfies Record<string, ImageMetadata>;

export type PhotoKey = keyof typeof PHOTOS;

export const PHOTO_KEYS = Object.keys(PHOTOS) as [PhotoKey, ...PhotoKey[]];

export const DEFAULT_PHOTO: PhotoKey = 'sedona-sunset';
