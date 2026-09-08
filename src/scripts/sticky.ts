// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 마스트헤드를 지나면 상단 바가 내려옵니다.
const sticky = document.getElementById('sticky');
const mh = document.querySelector('.masthead') as HTMLElement | null;

if (sticky && mh) {
	addEventListener(
		'scroll',
		() => {
			sticky.classList.toggle('on', scrollY > mh.offsetHeight - 60);
		},
		{ passive: true }
	);
}
