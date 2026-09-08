// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 카테고리 필터. 원본은 다시 렌더링했지만 여기서는 항목을 감추기만 합니다.
const buttons = document.querySelectorAll<HTMLButtonElement>('.filters button');
const items = document.querySelectorAll<HTMLLIElement>('.ledger > li');

function apply(cat: string) {
	for (const item of items) {
		item.hidden = cat !== 'all' && item.dataset.cat !== cat;
	}
	for (const button of buttons) {
		button.setAttribute('aria-pressed', String(button.dataset.cat === cat));
	}
	const url = new URL(window.location.href);
	if (cat === 'all') url.searchParams.delete('cat');
	else url.searchParams.set('cat', cat);
	history.replaceState(null, '', url);
}

for (const button of buttons) {
	button.addEventListener('click', () => apply(button.dataset.cat!));
}

const initial = new URL(window.location.href).searchParams.get('cat');
if (initial && [...buttons].some((b) => b.dataset.cat === initial)) apply(initial);
