// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 본문 텍스트를 훑어 용어사전에 있는 단어를 표시하고, 누르면 뜻 카드를 띄웁니다.
// 글 쓸 때 별도 표기가 필요 없다는 원본의 성질을 그대로 유지합니다.
import { GLOSSARY } from '../data/glossary';
import { SITE, type Lang } from '../data/site';

const lang = (document.documentElement.lang === 'en' ? 'en' : 'ko') as Lang;
const dict = GLOSSARY[lang];
const tip = document.getElementById('tip');
const prose = document.querySelector('.prose');

function esc(s: string) {
	return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}

function hideTip() {
	if (!tip) return;
	tip.className = '';
	tip.style.display = 'none';
}

function linkTerms(root: Element) {
	const keys = Object.keys(dict)
		.sort((a, b) => b.length - a.length)
		.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	const re = new RegExp('(' + keys.join('|') + ')', lang === 'en' ? 'gi' : 'g');
	const seen = new Set<string>();

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode(n) {
			if (!n.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
			if ((n.parentElement as Element).closest('.term, h1, h2, table, .eyebrow, .dek'))
				return NodeFilter.FILTER_REJECT;
			return NodeFilter.FILTER_ACCEPT;
		},
	});

	const nodes: Node[] = [];
	while (walker.nextNode()) nodes.push(walker.currentNode);

	for (const node of nodes) {
		const value = node.nodeValue!;
		re.lastIndex = 0;
		if (!re.test(value)) continue;
		re.lastIndex = 0;

		const frag = document.createDocumentFragment();
		let last = 0;
		let m: RegExpExecArray | null;
		while ((m = re.exec(value))) {
			const key = m[1].toLowerCase();
			frag.append(value.slice(last, m.index));
			if (seen.has(key)) {
				frag.append(m[1]); // 페이지당 첫 등장에만 표시합니다
			} else {
				seen.add(key);
				const b = document.createElement('button');
				b.className = 'term';
				b.type = 'button';
				b.textContent = m[1];
				b.dataset.key = m[1];
				frag.append(b);
			}
			last = m.index + m[1].length;
		}
		frag.append(value.slice(last));
		node.parentNode?.replaceChild(frag, node);
	}
}

if (prose) linkTerms(prose);

document.addEventListener('click', (e) => {
	if (!tip) return;
	const b = (e.target as Element).closest('.term') as HTMLElement | null;
	if (!b) {
		hideTip();
		return;
	}
	e.stopPropagation();

	const key = Object.keys(dict).find((k) => k.toLowerCase() === b.dataset.key!.toLowerCase());
	if (!key) return;
	const entry = dict[key];

	tip.innerHTML =
		'<div class="kicker">' +
		esc(SITE[lang].tipKicker) +
		'</div><div class="pair">' +
		esc(key) +
		'</div><div class="alt">' +
		esc(entry.alt) +
		'</div><div class="def">' +
		esc(entry.def) +
		'</div>';

	tip.style.display = 'block';
	tip.className = 'show';

	const r = b.getBoundingClientRect();
	let left = window.scrollX + r.left;
	left = Math.min(left, window.scrollX + document.documentElement.clientWidth - tip.offsetWidth - 16);
	tip.style.left = Math.max(window.scrollX + 14, left) + 'px';
	tip.style.top = window.scrollY + r.bottom + 9 + 'px';
});

window.addEventListener('resize', hideTip);
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') hideTip();
});
