// Azure Application Insights 연결 문자열.
//
// 이 값은 **비밀이 아닙니다.** 브라우저에서 실행되는 코드라 페이지 소스에
// 그대로 노출됩니다. 수집(ingestion) 전용 키이며 데이터를 읽을 권한은 없습니다.
// 그래서 저장소에 그대로 둡니다.
//
// 리소스: Azure > thoysinc-web > appi-thoysinc-note
export const APPINSIGHTS_CONNECTION_STRING =
	'InstrumentationKey=e981b35b-c66a-4737-b998-7be12a1a9ffd;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/;ApplicationId=6353a8ac-f9d5-44dc-9b24-bd61542c3278';
