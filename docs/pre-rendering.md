# summary

원래 react에서는 클라이언트(브라우저)에서만 화면을 작성하게 되어 있어
첫 요청에 받은 html소스를 보면 root div밖에 없다.

이는 구글 검색 엔진에 잘 노출이 되지 않아 광고, ec사이트 등에게는 불리하다.

nextjs에서는 사전 렌더링이라는 기술을 이용하여 SEO에 도움을 줄 수 있다.

> SEO(Search Engine Optimization) :검색 최적화

사전 렌더링은 서버(nodejs)에서 미리 javascript를 이용한 css + html의 내용을 작성하여
첫 요청일 때 해당 html+css를 제공한다

사전렌더링은 2가지 방법으로 작성이 가능하다

정적 렌더링 : getStaticProps를 이용한 사전 렌더링으로 어플리케이션 빌드시에 작성됨
서버 사이드 렌더링(SSR - server side rendering) : 배포 이후에도 서버 쪽에서 렌더링하여 요청에 렌더링 결과를 반환

# ISR(Increament Server Rendering)

getStaticProps의 옵션으로 revalidate를 설정하여 몇초 뒤에 다시 화면을 그리게 한다
그로인해 어플리케이션 빌드시 1번만 생성되는 정적 화면을 새로 그려 새로운 데이터를 반영하게 된다.

# 그 외 npm관련 정보

npm config set prefix "D:\nvm4w\npm"
npm config set cache "D:\nvm4w\npm-cache"

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

