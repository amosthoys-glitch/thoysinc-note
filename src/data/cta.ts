// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 상담 유도 문구. site.ts 는 migrate.mjs 가 다시 쓰므로 이 파일에 따로 둡니다.
import type { Lang } from './site';

/**
 * Microsoft Bookings 예약 페이지 주소.
 * M365 구독에 포함돼 있어 추가 비용이 없습니다.
 *   1. outlook.office.com/bookings 에서 예약 페이지 생성
 *   2. 서비스 하나 추가: "은퇴 준비 30분 상담", 30분, 온라인/전화
 *   3. 게시된 주소를 여기 붙여 넣기
 * 비워 두면 상담 버튼이 이메일 링크로 대체됩니다.
 */
export const BOOKING_URL =
	'https://outlook.office.com/bookwithme/user/63f386e3205b47609c1a78b50d85e933@thoysinc.com/meetingtype/LnxXzNQf2USG-rt9qi2yvQ2?anonymous';

// 상담 문의는 회사 메일로 받습니다. 개인 지메일과 분리해 둡니다.
export const EMAIL = 'amosjung@thoysinc.com';

type CtaCopy = {
	kicker: string;
	title: string;
	body: string;
	button: string;
	buttonFallback: string;
	note: string;
	navConsult: string;
};

export const CTA: Record<Lang, CtaCopy> = {
	ko: {
		kicker: '다음 단계',
		title: '내 상황에는 어떻게 적용되나요',
		body: '글은 일반적인 순서를 설명합니다. 실제로는 나이, 가족 구성, 이미 들어 있는 계좌에 따라 답이 갈립니다. 30분이면 본인 숫자로 정리해 드릴 수 있습니다.',
		button: '30분 무료 상담 신청',
		buttonFallback: '이메일로 상담 문의',
		note: '상품 권유 없이 순서부터 정리합니다. 준비물도, 사전 지식도 필요 없습니다.',
		navConsult: '상담',
	},
	en: {
		kicker: 'Next step',
		title: 'How does this apply to me?',
		body: 'These articles explain the general order of operations. What actually fits depends on your age, your family, and the accounts you already have. Thirty minutes is enough to work it out with your own numbers.',
		button: 'Book a free 30-minute call',
		buttonFallback: 'Ask by email',
		note: 'No product pitch — we start with the order of operations. Nothing to prepare, no background needed.',
		navConsult: 'Consult',
	},
};
