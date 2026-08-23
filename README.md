# Thoys 보험 노트

`www.thoysinc.com/note` 에 서비스되는 보험·은퇴 콘텐츠 사이트. Astro 정적 사이트.

> IT 기술 블로그는 별도 프로젝트입니다 → `../thoyslab-blog` (`blog.thoysinc.com`)

## 빠른 시작

```bash
npm run dev      # http://localhost:4321/note/ — 드래프트도 보임
npm run build    # deploy/ 로 배포 폴더 생성 — 드래프트 제외
npm run preview  # 빌드 결과 확인
npm run check    # 타입/콘텐츠 스키마 검사
```

## 새 글 쓰기

```bash
npm run new -- iul-basics --cat life --ko "IUL, 무엇이 다른가" --en "What makes IUL different"
```

한국어/영어 파일이 **같은 slug** 로 한 쌍 생성됩니다. 이 규칙 때문에 언어 전환 링크와
`hreflang` 이 자동으로 이어집니다. 한 언어만 쓰려면 `--ko` 또는 `--en` 하나만 주면 됩니다.

`draft: true` 상태로 만들어지고, dev 서버에서는 보이지만 프로덕션 빌드에서는 빠집니다.

| frontmatter | 필수 | 설명 |
|---|---|---|
| `title` | O | 글 제목 |
| `excerpt` | O | 목록·OG·메타 설명에 쓰임 |
| `cat` | O | `life` \| `annuity` \| `retirement` \| `business` |
| `date` | O | `'2026-08-10'` |
| `read` | O | `'5분'` / `'5 min'` |
| `lang` | O | `'ko'` \| `'en'` |
| `art` | | 표지 도식 번호 (현재 0~6). 생략하면 표지 없음 |
| `photo` | | 소셜 공유 카드 사진 키. 생략하면 기본 사진 |
| `draft` | | `true` 면 프로덕션 제외 |

본문에서 쓸 수 있는 컴포넌트는 두 개입니다.

```mdx
<Callout tag="여기서 자주 막힙니다">

읽는 분이 걸려 넘어지는 지점.

</Callout>

<Ledger>

| | 텀 라이프 | 홀 라이프 |
|---|---|---|
| 보험료 | 낮음 | 높음 |

</Ledger>
```

## 소셜 공유 카드 (og:image)

카카오톡·페이스북·링크드인에 링크를 붙였을 때 뜨는 사진입니다. 페이지에는 보이지 않습니다.

`src/assets/` 의 세도나 사진 4장을 쓰며, frontmatter 의 `photo` 로 고릅니다.

| 키 | 사진 |
|---|---|
| `sedona-night` | 별 아래 붉은 바위 (기본값) |
| `sedona-road` | 세도나 진입 표지판과 도로 |
| `sedona-chapel` | 홀리 크로스 채플 |
| `sedona-buttes` | 한낮의 붉은 바위 능선 |

원본은 2MB 안팎이지만 빌드할 때 1200×630 / 100~170KB 로 자동 변환됩니다.
사진을 추가하려면 `src/assets/` 에 넣고 `src/data/photos.ts` 와
`src/content.config.ts` 의 `photo` enum 에 키를 등록하세요.

## 용어 자동 표시

`src/data/glossary.ts` 에 등록된 용어는 **본문에 별도 표기 없이** 자동으로 밑줄이 그어지고,
누르면 뜻 카드가 뜹니다 (페이지당 첫 등장 한 번만). 새 용어를 추가하려면 이 파일에
`{ alt, def }` 를 넣기만 하면 됩니다. 용어 사전 페이지도 같은 데이터를 씁니다.

## 구조

```
src/
  data/
    site.ts        언어별 사이트 문자열 (제목, 면책 문구, 카테고리 이름)
    glossary.ts    용어 40개 — 본문 자동 표시 + 용어사전 페이지가 공유
    art.ts         표지 도식 SVG 7개 (글자가 없어 두 언어 공용)
  content/notes/
    ko/<slug>.mdx  한국어 글
    en/<slug>.mdx  영어 글 (같은 slug = 같은 글)
  components/      Callout, Ledger, Art, Masthead, LangToggle, StickyBar, ...
  scripts/         guilloche(마스트헤드 문양), terms(용어), sticky, cats(필터)
  styles/note.css  'ink & seal' 디자인. 원본 index.html 에서 그대로 옮김
swa/               배포 폴더 루트에 그대로 복사되는 파일들
legacy/            마이그레이션 전 원본 (빌드 제외)
```

## URL

| 경로 | 내용 |
|---|---|
| `/` | `/note/` 로 302 리다이렉트 |
| `/note/` | 한국어 글 목록 |
| `/note/<slug>/` | 한국어 글 |
| `/note/glossary/` | 한국어 용어사전 |
| `/note/en/` `/note/en/<slug>/` `/note/en/glossary/` | 영어판 |

마이그레이션 전에는 `/note` 하나에 SPA 가 올라가 있었습니다. 이제 글마다 실제 URL 이
생겨서 검색엔진이 개별 글을 색인하고, 링크를 공유하면 그 글이 열립니다.

## 배포 (Azure Static Web Apps)

`npm run build` 는 `dist/` 를 만든 뒤 `deploy/` 로 재배치합니다.

```
deploy/
  index.html                 / -> /note/ 리다이렉트
  robots.txt
  sitemap-index.xml
  staticwebapp.config.json
  note/**                    사이트 본체
```

Astro 의 `base: '/note'` 는 링크만 바꾸고 폴더는 중첩하지 않기 때문에 이 단계가 필요합니다.

Azure SWA 빌드 설정:

- App location: `/`
- Api location: (비움)
- **Output location: `deploy`**

## 콘텐츠 원칙

- 상품 이름이 아니라 순서부터 설명한다
- 상담에서 실제로 받은 질문의 표현을 그대로 쓴다
- 모든 글은 일반 정보 제공이며 개인별 조언이 아니다 (푸터 면책 문구 참조)

## 방문 통계 보기

Azure Portal → 리소스 그룹 `thoysinc-web` → **`appi-thoysinc-note`** → 왼쪽 메뉴 **Logs** → 아래 쿼리를 붙여넣고 실행.

> 워크스페이스 기반이라 `Logs` 에서 `AppPageViews` / `AppEvents` 테이블을 씁니다.
> 예전 이름(`pageViews`, `customEvents`)으로는 조회되지 않습니다.

**어떤 글이 읽히나 (최근 30일)**

```kusto
AppPageViews
| where TimeGenerated > ago(30d)
| extend path = tostring(parse_url(Url).Path)
| summarize 조회수 = count() by path
| order by 조회수 desc
```

**상담 버튼을 누른 사람 — 가장 중요한 숫자**

```kusto
AppEvents
| where Name == "consult_cta_click"
| extend page = tostring(Properties.page), kind = tostring(Properties.kind)
| summarize 클릭 = count() by page, kind
| order by 클릭 desc
```

**글별 전환율 — 읽은 사람 중 몇 %가 상담 버튼을 눌렀나**

```kusto
let views = AppPageViews
  | where TimeGenerated > ago(30d)
  | extend path = tostring(parse_url(Url).Path)
  | summarize 조회 = count() by path;
let clicks = AppEvents
  | where TimeGenerated > ago(30d) and Name == "consult_cta_click"
  | extend path = tostring(Properties.page)
  | summarize 클릭 = count() by path;
views
| join kind=leftouter clicks on path
| extend 전환율 = round(100.0 * coalesce(클릭, 0) / 조회, 1)
| project path, 조회, 클릭 = coalesce(클릭, 0), 전환율
| order by 조회 desc
```

**어디서 들어오나**

```kusto
AppPageViews
| where TimeGenerated > ago(30d)
| extend 유입 = tostring(Properties.referrer)
| summarize 방문 = count() by 유입
| order by 방문 desc
```

자주 보는 쿼리는 실행 후 **Pin to dashboard** 로 고정해 두면 매번 붙여넣지 않아도 됩니다.

### 수집 방식

쿠키를 쓰지 않습니다. 동의 배너가 필요 없고, 대신 재방문자를 같은 사람으로 묶지 못합니다.
공식 SDK 는 gzip 73KB 로 사이트 나머지 전체보다 무거워서, 수집 엔드포인트로 직접 보내는
비콘(`src/scripts/analytics.ts`, 1KB 남짓)을 씁니다.

`src/data/analytics.ts` 의 연결 문자열은 **비밀이 아닙니다.** 브라우저에서 도는 수집 전용
키이고 데이터를 읽을 권한이 없습니다.
