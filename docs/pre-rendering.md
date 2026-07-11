# 프로젝트 관련 설정

npm config set prefix "D:\nvm4w\npm"
npm config set cache "D:\nvm4w\npm-cache"

firebase base url : https://nextjs-course-99fb2-default-rtdb.firebaseio.com/

npm install swr@1.3.0

<details>
<summary>swr@1.3.0 원인</summary>
원인

- SWR v2는 .mjs(순수 ESM) 형태로 배포되며, webpack 5 이상의 최신 ESM 처리 방식을 전제로 만들어졌습니다.
- Next.js 10이 쓰는 webpack 4는 이런 최신 방식의 .mjs 모듈에서 named export(createContext 등)를 정적으로 분석하지 못해서, "이 모듈은 default export만 있는 것 같다"고 오판하고 에러를 던집니다.
- 즉 코드 문제가 아니라 Next.js 10(webpack4) ↔ swr 2.x(최신 ESM 빌드) 버전 비호환 문제입니다.

</details>

# summary

원래 react에서는 클라이언트(브라우저)에서만 화면을 작성하게 되어 있어
첫 요청에 받은 html소스를 보면 root div밖에 없다.

이는 구글 검색 엔진에 잘 노출이 되지 않아 광고, ec사이트 등에게는 불리하다.

nextjs에서는 사전 렌더링이라는 기술을 이용하여 SEO에 도움을 줄 수 있다.

> SEO(Search Engine Optimization) :검색 최적화

사전 렌더링은 서버(nodejs)에서 미리 javascript를 이용한 css + html의 내용을 작성하여
첫 요청일 때 해당 html+css를 제공한다

사전렌더링은 3가지 방법으로 작성이 가능하다

# SSG(Static Site Generataion)

getStaticProps를 이용한 사전 렌더링으로 어플리케이션 빌드시에 작성됨

# ISR(Incremental Static Regeneration)

getStaticProps의 옵션으로 revalidate를 설정하여 몇초 뒤에 다시 화면을 그리게 한다
그로인해 어플리케이션 빌드시 1번만 생성되는 정적 화면을 새로 그려 새로운 데이터를 반영하게 된다.

# 동적 라우트 페이지에서의 사전 렌더링

동적 라우트 페이지에서는 `getStaticProps`만 정의했을때 에러가 발생한다.
그 이유로는 동적 라우트 페이지에서는 path params 등을 이용하여 페이지를 렌더링하는데 (product id, user id등등)
동적 라우트 페이지에서는 사전에 모든 path params 대한 렌더링을 할수 없기 때문이다.

따라서 `getStaticPaths`라는 기능을 별도로 추가해줘야한다

## `getStaticPaths`에 대해서

`fallback` 기능 설정 :
`fallback`은 빌드시에 미리 만들지 않은 페이지를 처음 요청 받았을 때 어떻게 처리할지에 대한 전략

- false : fallback기능을 사용하지 않음. 따라서 사전 렌더링으로 정해놓은 slug path가 없다면 404 에러가 난다.
- true : fallback기능을 사용. 최초의 요청 시 빈 fallback 페이지 즉시 발행(로딩상태 페이지). 그리고 동시에 백그라운드에서 동적페이지 작성후 교체.
- "blocking" : fallback기능을 사용. 다만 최초요청시에도 동적페이지 작성때까지 기다림

## 동적라우트에서의 `notFound`처리

`getStaticPaths`설정으로 인해 동적라우트를 대응할 수 있지만
path params(slug) 에 해당하는 실제데이터가 없을 경우 에러가 날 수 있다.

다만 에러내용이 null 예외등이 나타나기 때문에 notFound로 제어 하는 방법을 권장

# SSR(Server Side Rendering)

배포 이후에도 서버 쪽에서 렌더링하여 요청에 렌더링 결과를 반환

SSG, ISR의 경우 빌드시의 해당 시점 혹은 재생성되는 주기의 데이터에 의존을 하게 되지만

SSR의 경우 데이터 페칭에대한 사전 렌더링 작업을 직접 서버 사이드에서 함으로써

실시간 데이터를 이용할 수 있다. 요청 마다 새로 렌더링해서 화면을 작성해준다.

## `getServerSideProps` 기능

앞서 설명했던 SSG, ISR의 `getStaticProps`와 비슷하다고 보면된다.

다만 동적라우팅을 실시할때 `getStaticPaths`와 같은 설정이 필요가 없다.

이유로는 실시간으로 데이터에 접근이 가능하기 때문에 굳이 클라이언트에

SSG처럼 사전에 미리 경로를 알려주지 않아도 되기 때문이다.

(claude에게 경로를 리소르로 적었다고 혼남 철학적으로 맞는거면 맞다고 말이라도 해주던가
틀리다고 한 이유는 `getStaticPaths` 자체가 nextjs로써는 사전에 무슨 경로를 알아야하는게 본질이기때문에
경로가 맞다고 한다. 맞는 말인데 기분이 별로 좋지는 않네
)

또한 ISR, SSG랑과 다르게 빌드 타임에 작성되는 것이 아니고 서버사이드에서 요청시 만들어지는 부분이 다르다.

# 사전 렌더링(pre-rendering)이 필요 없는 경우

- 실시간 변동이 자주 일어나는 경우(사전렌더링 된 페이지는 이미 과거의 데이터이기 때문에)
- 개인적인 데이터나 민감한 데이터를 반영하는 경우(모든 사용자의 데이터를 사전 렌더링하기는 힘들고 검색엔진에 굳이 노출 시킬 필요가 없기 때문에)
- 부분적인 데이터 갱신을 할 경우(여러가지 데이터를 표시하는 페이지라면 로딩 속도가 느려질 뿐만 아니라 변동이 자주 일어날 가능성이 있기 때문에 정적인 경우는 사전렌더링 자주 바뀌는 부분은 클라이언트에서 별도로 fetch(CSR)하는 방법을 권장)

# CSR(Client Side Rendering)

fetch API 와 같이 브라우조 기능 + react의 useEffect를 같이 사용하여
클라이언트 쪽에서도 데이터페칭이 가능하다.

# useSWR (stale-while-revalide)

fetch API와 같은 기능으로 nextjs에서 제공하는 라이브러리
fetch는 "요청을 보내는 방법"이고, useSWR은 "요청 결과를 언제/어떻게 캐싱하고 재사용/갱신할지"까지 관리해주는 상위 레이어입니다.

- 캐싱: 같은 key(url)로 요청한 데이터는 캐시해뒀다가 재사용 (stale-while-revalidate)
- 자동 재검증: 탭 포커스 복귀, 네트워크 재연결, 일정 간격마다 자동 재요청
- 중복 요청 제거: 여러 컴포넌트가 같은 key로 동시 호출해도 실제 요청은 1번만
- `data`, `error`, `isLoading` 상태를 알아서 제공해줌 (직접 useState로 안 만들어도 됨)
- 두번째 인자로 fetcher 함수를 넘겨줘야 실제 요청이 나감 (안 넘기면 요청 자체가 안 나가고 data가 계속 undefined)

```js
const { data, error } = useSWR(url, (url) =>
  fetch(url).then((res) => res.json()),
);
```

# 사전 렌더링(pre-rendering)이 필요한 경우

| 상황                       | 이유                                                | 추천 방식          |
| -------------------------- | --------------------------------------------------- | ------------------ |
| SEO 중요                   | 크롤러가 JS를 완전히 실행 못함                      | SSG/SSR            |
| 초기 로딩 속도 중요        | 완성된 HTML을 바로 내려줌                           | SSG/ISR            |
| 소셜 공유 미리보기(OG태그) | 크롤러가 응답 HTML의 meta태그를 읽음, CSR로는 안 뜸 | SSG/SSR            |
| 데이터가 거의 안 바뀜      | 서버 부하 없이 즉각 응답                            | SSG                |
| 데이터가 가끔 바뀜         | 정적 이점 + 주기적 갱신                             | ISR (`revalidate`) |
| 요청마다 데이터가 다름     | 실시간/개인화 데이터 필요                           | SSR                |

# App Router에서의 데이터 패칭 (Pages Router와 비교)

App Router는 별도 함수(`getStaticProps`, `getServerSideProps`) 대신, **Server Component 안에서 직접 `fetch`를 호출**하고 캐싱 옵션으로 SSG/SSR/ISR을 구분한다.

| Pages Router                          | App Router                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `getStaticProps` (SSG)                | 컴포넌트 안에서 `fetch(url)` (기본값이 `cache: 'force-cache'`라 빌드 타임 캐싱됨) |
| `getStaticProps` + `revalidate` (ISR) | `fetch(url, { next: { revalidate: 10 } })` 또는 `export const revalidate = 10`    |
| `getServerSideProps` (SSR)            | `fetch(url, { cache: 'no-store' })` 또는 `export const dynamic = 'force-dynamic'` |
| `getStaticPaths`                      | `generateStaticParams()`                                                          |
| `useSWR` / `useEffect` + fetch (CSR)  | 동일 — `'use client'` 컴포넌트 안에서 그대로 사용 가능                            |

```js
// App Router 예시
export default async function Page() {
  const res = await fetch(url); // 기본이 SSG처럼 캐싱됨
  const data = await res.json();
  return <div>{/* data 사용 */}</div>;
}
```

## 이렇게 바뀐 이유

- **컴포넌트 단위 데이터 패칭 (prop drilling 제거)**: Pages Router는 페이지 최상단에서만 데이터를 가져올 수 있어 하위 컴포넌트까지 props로 계속 내려줘야 했음. App Router는 레이아웃/중첩 컴포넌트 각자가 필요한 데이터를 직접 fetch 가능.
- **특수 함수 대신 일반 JS 문법**: 정해진 이름/반환 형식을 외울 필요 없이 `async function` + `await fetch()`로 통일. 렌더링 전략도 함수 종류가 아니라 fetch의 캐시 옵션값으로 결정.
- **클라이언트 JS 번들 감소**: Server Component는 기본적으로 클라이언트에 코드가 전송되지 않음. 상호작용이 필요한 부분만 `'use client'`로 명시.
- **스트리밍/Suspense 활용**: 컴포넌트별 개별 fetch가 가능해져서, 느린 데이터는 로딩 상태로 스트리밍하고 빠른 부분은 먼저 보여줄 수 있음. (예전엔 `getServerSideProps` 하나가 끝나야 전체 페이지가 렌더링됨)

이 모든 변화는 Next.js 13에서 도입된 **React Server Components(RSC)** 아키텍처를 기반으로 한다 — React 자체의 새 컴포넌트 모델을 Next.js가 받아들인 결과.
