# 프로젝트 관련 설정
npm config set prefix "D:\nvm4w\npm"
npm config set cache "D:\nvm4w\npm-cache"

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