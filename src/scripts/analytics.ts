// 방문 통계 — Application Insights 수집 엔드포인트로 직접 보냅니다.
//
// 공식 SDK(@microsoft/applicationinsights-web)는 gzip 73KB 로, 사이트 나머지
// 전체보다 무겁습니다. 여기서 필요한 건 페이지뷰와 상담 버튼 클릭 두 가지뿐이라
// 봉투(envelope) 형식에 맞춰 직접 POST 합니다. 1KB 남짓입니다.
//
// 쿠키를 쓰지 않습니다. 그래서 동의 배너가 필요 없고, 대신 재방문자를 같은
// 사람으로 묶지는 못합니다. 지금 알아야 할 것은 "어떤 글이 읽히는가"와
// "상담 버튼을 누르는가"이므로 이 편이 낫습니다.
import { APPINSIGHTS_CONNECTION_STRING } from '../data/analytics';

/** 연결 문자열에서 키와 수집 주소를 꺼냅니다. */
function parseConnectionString(cs: string) {
	const parts = Object.fromEntries(
		cs
			.split(';')
			.map((kv) => kv.split('='))
			.filter((kv) => kv.length >= 2)
			.map(([k, ...v]) => [k.trim(), v.join('=').trim()])
	);
	const key = parts.InstrumentationKey;
	const endpoint = (parts.IngestionEndpoint ?? '').replace(/\/?$/, '/');
	return key && endpoint ? { key, endpoint } : null;
}

const conn = parseConnectionString(APPINSIGHTS_CONNECTION_STRING);

/** 한 번 방문하는 동안만 유지되는 임시 id. 저장하지 않으므로 추적이 되지 않습니다. */
const sessionId = Math.random().toString(36).slice(2, 12);

function send(baseType: 'PageViewData' | 'EventData', baseData: Record<string, unknown>) {
	if (!conn) return;

	const envelope = {
		name: `Microsoft.ApplicationInsights.${conn.key.replace(/-/g, '')}.${
			baseType === 'PageViewData' ? 'PageView' : 'Event'
		}`,
		time: new Date().toISOString(),
		iKey: conn.key,
		tags: {
			'ai.operation.name': window.location.pathname,
			'ai.session.id': sessionId,
			'ai.device.type': 'Browser',
		},
		data: { baseType, baseData: { ver: 2, ...baseData } },
	};

	const body = JSON.stringify(envelope);
	const url = conn.endpoint + 'v2/track';

	// fetch + keepalive 를 씁니다. 페이지를 떠나는 중에도 전송이 유지됩니다.
	//
	// sendBeacon 에 application/json Blob 을 넘기면 안 됩니다. CORS 안전 목록에
	// 없는 Content-Type 이라 사전 요청(preflight)이 필요한데 sendBeacon 은 그걸
	// 하지 않아서, 브라우저가 아무 오류 없이 조용히 버립니다. 실제로 그렇게 만들었다가
	// 데이터가 한 건도 안 들어와서 찾아냈습니다.
	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body,
		keepalive: true,
	}).catch(() => {
		// 아주 오래된 브라우저 대비. text/plain 은 안전 목록에 있어 사전 요청이 없고,
		// 수집 엔드포인트는 본문만 보므로 그대로 받아들입니다.
		navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
	});
}

/* 페이지뷰 */
send('PageViewData', {
	name: document.title,
	url: window.location.href,
	duration: '00:00:00.000',
	properties: { lang: document.documentElement.lang, referrer: document.referrer || '(direct)' },
});

/* 상담 버튼 클릭 — 이 블로그에서 가장 중요한 숫자입니다. */
document.addEventListener('click', (event) => {
	const target = event.target as Element | null;
	const link = target?.closest?.('.cta a.primary') as HTMLAnchorElement | null;
	if (!link) return;

	send('EventData', {
		name: 'consult_cta_click',
		properties: {
			// 어느 글에서 눌렀는지 — 어떤 칼럼이 상담으로 이어지는지 보려는 것입니다.
			page: window.location.pathname,
			kind: link.href.startsWith('mailto:') ? 'email' : 'booking',
			lang: document.documentElement.lang,
		},
	});
});
