// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 언어별 사이트 문자열. 원본 index.html 의 SITE 를 그대로 이관했습니다.
export const CATS = ["all", "life", "annuity", "retirement", "business"] as const;
export type Cat = (typeof CATS)[number];
export type Lang = "ko" | "en";
export const SITE = {
	"ko": {
		"brand": "Thoys 보험 노트",
		"eyebrow": "은퇴 준비를 처음 시작하는 분들에게",
		"title": "은퇴 얘기, 어디서부터 물어봐야 할지 모르겠다면",
		"lede": "아무것도 몰라도 괜찮습니다. 상품 이름이 아니라 순서부터 알려드립니다. 현직 에이전트가 상담에서 가장 많이 받는 질문들을, 쓰는 단어 그대로 풀어 씁니다.",
		"cred": [
			"JUNG, JONGMIN",
			"라이선스 <b>17621996</b>",
			"영업 주 <b>애리조나</b>"
		],
		"sectionPosts": "기록",
		"sectionGloss": "용어 사전",
		"glossLede": "본문에 나오는 용어는 모두 여기에 정리돼 있습니다. 한국어와 영어를 나란히 두었습니다.",
		"cats": [
			"전체",
			"생명보험",
			"연금",
			"은퇴 플랜",
			"비즈니스"
		],
		"navPosts": "글",
		"navGloss": "용어 사전",
		"tipKicker": "용어",
		"footLic": "JUNG, JONGMIN · 라이선스 번호 17621996 · 영업 가능 주: 애리조나(AZ) · 생명보험 · 고정/인덱스 연금 · 401(k) · IRA · Roth IRA · 사업주 절세 플랜",
		"footDisc": "이 사이트의 글은 일반적인 정보 제공을 목적으로 하며, 특정 상품의 청약 권유나 개인별 보험·세무·법률 조언이 아닙니다. 실제 보장 내용과 지급 여부는 발행된 보험증서와 플랜 문서의 약관에 따릅니다. 취급 상품은 개인 생명보험과 고정·인덱스 연금이며, 단체보험과 변액연금·뮤추얼펀드 등 증권 상품은 취급하지 않고 투자 자문도 제공하지 않습니다. 은퇴 플랜과 절세 구조는 설계와 관리를 지원하는 것이며, 세무 판단은 반드시 담당 회계사·세무사와 확인하시기 바랍니다.",
		"footTech": "Astro · Azure Static Web Apps · 한국어 / English"
	},
	"en": {
		"brand": "Thoys Insurance Notes",
		"eyebrow": "For anyone just starting to think about retirement",
		"title": "If you don't even know what to ask yet",
		"lede": "Knowing nothing about this is fine. We start with the order of operations, not the product names — the questions people actually bring to a first meeting, answered in plain words.",
		"cred": [
			"JUNG, JONGMIN",
			"License <b>17621996</b>",
			"Licensed in <b>Arizona</b>"
		],
		"sectionPosts": "Notes",
		"sectionGloss": "Glossary",
		"glossLede": "Every term used in the articles, collected here with its Korean and English counterpart side by side.",
		"cats": [
			"All",
			"Life",
			"Annuity",
			"Retirement",
			"Business"
		],
		"navPosts": "Notes",
		"navGloss": "Glossary",
		"tipKicker": "Term",
		"footLic": "JUNG, JONGMIN · License 17621996 · Licensed in Arizona · Life insurance · Fixed and indexed annuities · 401(k) · IRA · Roth IRA · Business tax planning",
		"footDisc": "The articles on this site are general information only. They are not an offer to sell, a solicitation, or individualized insurance, tax, or legal advice. Actual coverage and payment are governed by the terms of the issued policy and plan documents. I am licensed for individual life insurance and fixed annuities, including fixed indexed products. I do not offer group insurance, variable annuities, mutual funds, or any other security, and I do not provide investment advice. On retirement plans and tax-advantaged structures I help with design and administration; confirm every tax question with your own CPA or tax attorney.",
		"footTech": "Astro · Azure Static Web Apps · 한국어 / English"
	}
} as const;
