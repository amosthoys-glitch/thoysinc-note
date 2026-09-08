// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Thoys Inc.

// 원본 index.html 에서 이관. 본문 용어 자동 표시와 용어사전 페이지가 함께 씁니다.
export type GlossEntry = { alt: string; def: string };
export const GLOSSARY: Record<"ko" | "en", Record<string, GlossEntry>> = {
	"ko": {
		"텀 라이프": {
			"alt": "Term Life",
			"def": "10·20·30년처럼 정해진 기간만 보장하는 생명보험. 적립 기능이 없어 보험료가 낮음."
		},
		"홀 라이프": {
			"alt": "Whole Life",
			"def": "평생 보장되며 해지환급금이 정해진 이율로 쌓이는 종신형 생명보험."
		},
		"유니버설 라이프": {
			"alt": "Universal Life",
			"def": "보험료와 사망보험금을 형편에 따라 조정할 수 있는 종신형 생명보험."
		},
		"인덱스 유니버설 라이프": {
			"alt": "Indexed Universal Life",
			"def": "적립금이 지수에 연동되되 하락 시 원금이 깎이지 않는 유니버설 라이프. 보험 계약이며 주식·펀드 같은 증권 상품이 아닙니다."
		},
		"소멸": {
			"alt": "Lapse",
			"def": "보험료 미납이나 적립금 부족으로 계약이 끝나 보장이 사라지는 것. 유니버설 라이프에서 특히 주의할 부분."
		},
		"해지환급금": {
			"alt": "Cash Value",
			"def": "종신형 상품에 시간이 지나며 적립되는 금액. 인출하거나 담보로 대출받을 수 있음."
		},
		"사망보험금": {
			"alt": "Death Benefit",
			"def": "피보험자 사망 시 수익자에게 지급되는 금액. 대체로 소득세가 붙지 않음."
		},
		"수익자": {
			"alt": "Beneficiary",
			"def": "보험금을 받도록 보험증서에 지정된 사람. 유언장보다 증서의 지정이 우선함."
		},
		"언더라이팅": {
			"alt": "Underwriting",
			"def": "보험사가 건강·직업·가족력을 심사해 보험료와 승인 여부를 정하는 절차."
		},
		"보험료": {
			"alt": "Premium",
			"def": "보장을 유지하기 위해 내는 금액. 납입이 끊기면 보장도 끊깁니다."
		},
		"특약": {
			"alt": "Rider",
			"def": "기본 계약에 붙이는 추가 보장. 장기간병, 중대질병, 보험료 납입면제 등."
		},
		"연금": {
			"alt": "Annuity",
			"def": "보험사와 맺는 계약으로, 목돈을 맡기고 정해진 시점부터 정기적으로 돈을 받는 상품."
		},
		"즉시연금": {
			"alt": "Immediate Annuity",
			"def": "목돈을 넣고 보통 1년 안에 바로 수령을 시작하는 형태. 은퇴 직후 소득 공백을 메울 때 씁니다."
		},
		"거치연금": {
			"alt": "Deferred Annuity",
			"def": "지금 넣어두고 몇 년 뒤부터 받는 형태. 그 기간 동안 세금이 유예된 채 적립됩니다."
		},
		"고정연금": {
			"alt": "Fixed Annuity",
			"def": "보험사가 정한 확정 이율로 적립되는 연금. 원금 손실 위험이 없는 대신 수익도 제한적."
		},
		"인덱스연금": {
			"alt": "Fixed Indexed Annuity",
			"def": "S&P 500 같은 지수 실적에 연동되되 하락 시 원금이 깎이지 않는 형태. 상승분에는 캡과 참여율이 걸립니다."
		},
		"다년확정이율연금": {
			"alt": "MYGA",
			"def": "정해진 기간(보통 3~10년) 동안 확정 이율이 보장되는 고정연금. CD와 자주 비교됩니다."
		},
		"자유인출한도": {
			"alt": "Free Withdrawal",
			"def": "해지수수료 없이 매년 뺄 수 있는 금액. 보통 적립금의 10% 안팎."
		},
		"시장가치조정": {
			"alt": "Market Value Adjustment",
			"def": "약정 기간 안에 해지할 때 금리 변동을 반영해 환급금이 오르내리는 조항. 해지수수료와 별개로 적용됩니다."
		},
		"연금화": {
			"alt": "Annuitization",
			"def": "적립된 금액을 평생 또는 정해진 기간 동안 받는 소득으로 전환하는 절차. 대체로 되돌릴 수 없습니다."
		},
		"해지수수료": {
			"alt": "Surrender Charge",
			"def": "약정 기간(보통 5~10년) 안에 해지하거나 한도 이상 인출할 때 떼는 수수료. 해마다 줄어듭니다."
		},
		"참여율": {
			"alt": "Participation Rate",
			"def": "지수 상승분 중 실제로 적립에 반영되는 비율. 80%라면 지수가 10% 올라도 8%만 반영."
		},
		"캡": {
			"alt": "Cap Rate",
			"def": "한 기간에 인정되는 적립 이율의 상한. 캡이 9%면 지수가 20% 올라도 9%까지만 적립."
		},
		"최저보증이율": {
			"alt": "Guaranteed Minimum Rate",
			"def": "시장이 어떻든 계약상 보장되는 최소 이율. 인덱스연금의 바닥을 정하는 숫자."
		},
		"소득특약": {
			"alt": "Income Rider",
			"def": "연금화하지 않고도 평생 인출 금액을 보장받는 특약. 별도 수수료가 매년 부과됩니다."
		},
		"1035 교환": {
			"alt": "1035 Exchange",
			"def": "기존 보험·연금 계약을 세금 없이 새 계약으로 옮기는 제도. 해지수수료는 별개로 발생할 수 있습니다."
		},
		"401(k)": {
			"alt": "401(k)",
			"def": "회사가 개설하는 은퇴 플랜. 직원이 급여에서 납입하고, 회사가 매칭을 넣을 수 있습니다."
		},
		"IRA": {
			"alt": "IRA",
			"def": "개인이 직접 여는 은퇴 계좌. 조건을 충족하면 납입액을 소득에서 공제받고, 인출할 때 과세됩니다."
		},
		"Roth IRA": {
			"alt": "Roth IRA",
			"def": "세후 소득으로 납입하는 대신 조건을 충족하면 인출이 비과세인 계좌. 소득이 높으면 직접 납입이 제한됩니다."
		},
		"SEP IRA": {
			"alt": "SEP IRA",
			"def": "자영업자와 소규모 사업주를 위한 은퇴 플랜. 사업주가 납입하며 설정이 단순합니다."
		},
		"SIMPLE IRA": {
			"alt": "SIMPLE IRA",
			"def": "직원 100명 이하 사업장을 위한 플랜. 401(k)보다 관리 부담이 가볍고 회사 납입이 의무입니다."
		},
		"매칭": {
			"alt": "Employer Match",
			"def": "직원 납입액에 회사가 얹어주는 금액. 받을 수 있는데 안 받으면 급여를 두고 오는 셈입니다."
		},
		"베스팅": {
			"alt": "Vesting",
			"def": "회사가 넣어준 돈이 온전히 직원 것이 되기까지 필요한 근속 기간."
		},
		"의무 인출": {
			"alt": "RMD",
			"def": "일정 나이가 지나면 세전 계좌에서 해마다 최소 금액을 반드시 인출해야 하는 규정. 어기면 가산세가 붙습니다."
		},
		"이월": {
			"alt": "Rollover",
			"def": "퇴직·이직 시 기존 은퇴 계좌를 다른 계좌로 옮기는 절차. 직접 수령하면 원천징수와 기한 문제가 생깁니다."
		},
		"적격 플랜": {
			"alt": "Qualified Plan",
			"def": "세제 혜택을 받는 대신 연방 규정을 따라야 하는 은퇴 플랜. 401(k)가 대표적입니다."
		},
		"카페테리아 플랜": {
			"alt": "Section 125 Plan",
			"def": "직원이 부담하는 보험료를 세전 급여에서 공제하도록 하는 제도. 직원의 과세 소득과 회사의 급여세가 함께 줄어듭니다."
		},
		"162 보너스": {
			"alt": "Executive Bonus Plan",
			"def": "회사가 임직원의 개인 생명보험료를 보너스로 지급하는 방식. 회사는 비용 처리, 증서는 본인 소유."
		},
		"키맨 보험": {
			"alt": "Key Person Insurance",
			"def": "핵심 인력의 유고로 회사가 입을 손실에 대비해 회사가 가입하고 회사가 수령하는 생명보험."
		},
		"바이셀 계약": {
			"alt": "Buy-Sell Agreement",
			"def": "동업자 중 한 명이 사망하거나 이탈할 때 지분을 누가 어떤 가격에 인수할지 미리 정한 약정. 생명보험으로 자금을 마련하는 경우가 많습니다."
		}
	},
	"en": {
		"term life": {
			"alt": "텀 라이프",
			"def": "Life insurance for a set period — 10, 20, 30 years. No accumulation, so premiums stay low."
		},
		"whole life": {
			"alt": "홀 라이프",
			"def": "Permanent life insurance that lasts your lifetime and builds cash value at a contractual rate."
		},
		"universal life": {
			"alt": "유니버설 라이프",
			"def": "Permanent coverage with premiums and death benefit you can adjust as circumstances change."
		},
		"indexed universal life": {
			"alt": "인덱스 유니버설 라이프",
			"def": "Universal life whose value is credited from an index, with no loss in a down year. It is an insurance contract, not a security."
		},
		"lapse": {
			"alt": "소멸",
			"def": "Coverage ending because premiums stopped or the policy value could no longer carry its costs."
		},
		"cash value": {
			"alt": "해지환급금",
			"def": "The balance that accumulates inside a permanent policy. You can withdraw it or borrow against it."
		},
		"death benefit": {
			"alt": "사망보험금",
			"def": "What the beneficiary receives when the insured dies — generally free of income tax."
		},
		"beneficiary": {
			"alt": "수익자",
			"def": "The person named on the policy to receive the proceeds. The policy overrides your will."
		},
		"underwriting": {
			"alt": "언더라이팅",
			"def": "The insurer's review of health, occupation, and family history to set the rate — or decline."
		},
		"premium": {
			"alt": "보험료",
			"def": "What you pay to keep coverage in force. Stop paying and the coverage stops."
		},
		"rider": {
			"alt": "특약",
			"def": "An add-on to the base contract — long-term care, critical illness, waiver of premium."
		},
		"annuity": {
			"alt": "연금",
			"def": "A contract with an insurer: you hand over principal, and it pays you back on a schedule."
		},
		"immediate annuity": {
			"alt": "즉시연금",
			"def": "Payments start within about a year of the deposit. Used to bridge income right after retirement."
		},
		"deferred annuity": {
			"alt": "거치연금",
			"def": "You fund it now and collect years later, with growth tax-deferred in the meantime."
		},
		"fixed annuity": {
			"alt": "고정연금",
			"def": "Grows at a rate the insurer declares. No market loss, and a correspondingly modest ceiling."
		},
		"indexed annuity": {
			"alt": "인덱스연금",
			"def": "Credits interest tied to an index like the S&P 500 with no loss in a down year — the upside is limited by a cap rate and participation rate."
		},
		"multi-year guaranteed annuity": {
			"alt": "다년확정이율연금",
			"def": "A fixed annuity with a rate guaranteed for a set term, usually three to ten years. Often compared to a CD."
		},
		"free withdrawal": {
			"alt": "자유인출한도",
			"def": "The amount you may take each year without a surrender charge — commonly around 10% of the balance."
		},
		"market value adjustment": {
			"alt": "시장가치조정",
			"def": "A clause that raises or lowers your surrender value based on rate movement. It applies on top of any surrender charge."
		},
		"annuitization": {
			"alt": "연금화",
			"def": "Converting the accumulated balance into an income stream for life or a set term. Usually irreversible."
		},
		"surrender charge": {
			"alt": "해지수수료",
			"def": "A fee for cancelling or over-withdrawing during the surrender period, typically 5–10 years and declining annually."
		},
		"participation rate": {
			"alt": "참여율",
			"def": "How much of the index gain gets credited. At 80%, a 10% index year credits 8%."
		},
		"cap rate": {
			"alt": "캡",
			"def": "The ceiling on credited interest for a period. With a 9% cap, a 20% index year still credits 9%."
		},
		"guaranteed minimum rate": {
			"alt": "최저보증이율",
			"def": "The contractual floor the insurer must credit regardless of the market."
		},
		"income rider": {
			"alt": "소득특약",
			"def": "Guarantees lifetime withdrawals without annuitizing. Carries its own annual fee."
		},
		"1035 exchange": {
			"alt": "1035 교환",
			"def": "Moving an existing policy or annuity into a new one without triggering tax. Surrender charges still apply separately."
		},
		"section 125 plan": {
			"alt": "카페테리아 플랜",
			"def": "Lets employees pay their share of premiums from pre-tax salary, lowering their taxable income and the company's payroll tax."
		},
		"401(k)": {
			"alt": "401(k)",
			"def": "An employer-sponsored retirement plan funded by salary deferrals, with an optional employer match."
		},
		"ira": {
			"alt": "IRA",
			"def": "A retirement account you open yourself. Contributions may be deductible; withdrawals are taxed."
		},
		"roth ira": {
			"alt": "Roth IRA",
			"def": "Funded with after-tax dollars; qualified withdrawals come out tax-free. Direct contributions phase out at higher incomes."
		},
		"sep ira": {
			"alt": "SEP IRA",
			"def": "A retirement plan for self-employed people and small employers, funded by the employer and simple to set up."
		},
		"simple ira": {
			"alt": "SIMPLE IRA",
			"def": "Built for employers under 100 staff — lighter administration than a 401(k), with a required employer contribution."
		},
		"employer match": {
			"alt": "매칭",
			"def": "What the company adds on top of an employee's own contribution. Leaving it unclaimed is leaving pay behind."
		},
		"vesting": {
			"alt": "베스팅",
			"def": "The service time required before employer contributions fully belong to the employee."
		},
		"rmd": {
			"alt": "의무 인출",
			"def": "The minimum amount that must come out of pre-tax accounts each year past a certain age. Missing it triggers a penalty."
		},
		"rollover": {
			"alt": "이월",
			"def": "Moving a retirement account after leaving a job. Taking personal receipt of the funds creates withholding and deadline problems."
		},
		"qualified plan": {
			"alt": "적격 플랜",
			"def": "A retirement plan that earns tax advantages in exchange for following federal rules — a 401(k) being the common example."
		},
		"executive bonus plan": {
			"alt": "162 보너스",
			"def": "The company pays an employee's personal life premium as a bonus. Deductible to the business; the policy belongs to the individual."
		},
		"key person insurance": {
			"alt": "키맨 보험",
			"def": "Coverage the company owns on someone essential to it, with the company as beneficiary."
		},
		"buy-sell agreement": {
			"alt": "바이셀 계약",
			"def": "A contract setting who buys an owner's share, and at what price, if they die or leave. Frequently funded with life insurance."
		}
	}
};
