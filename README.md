<div align="center">
  <h3 align="center">Baobab Service API</h3>

  <p align="center">
    바오밥 서비스의 API를 제공합니다. <br/> 
    MSA 아키텍처로 변환하고 있는 과정이며, 현재는 3-Tier Architecture에 해당합니다. <br/>
    실제 프로덕트 제품에서는 API Gateway를 통해서 Blog Service, Users Service, Recurit Service 등으로 구분될 예정입니다. <br/>
    서비스 확장성을 고려했을 때 MSA로 전환할 필요성을 아직 느끼지 못해 유지 중입니다. <br/>
    Demo 페이지는 Swagger 형태로 구현되어 있으며, CORS 오류로 인해 정상적으로 사용이 불가능할 수 있습니다. <br/>
    또한, 한정적인 Azure 리소스 비용으로 인해 비활성화 되어있는 경우 사용이 제한될 수 있습니다. <br/>
    <br />
    <a href="https://github.com/baobab-kr/blog-service"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://api.baobab.blog/api-docs">View Demo</a>
    ·
    <a href="https://github.com/baobab-kr/blog-service/issues">Report Bug</a>
    ·
    <a href="https://github.com/baobab-kr/blog-service/issues">Request Feature</a>
  </p>
</div>



## Installation

해당 섹션에서는 API 서버를 로컬에 설치하는 방법을 안내합니다. <br/>
이미 도커 엔진이 로컬 PC에 설치되어 있음을 가정하에 제작되었습니다. <br/>

- Clone the repo  
   ```sh
   git clone https://github.com/baobab-kr/blog-service.git
   ```
- Docker Container build and Run  
   ```sh
   docker-compose up --build
   ```
<br/>

## How to Test

해당 API 서버는 Swagger가 이미 적용되어 있습니다. <br/>
컨테이너를 동작 시킨 후 웹 브라우저로 https://localhost:3000/api-docs 접속하여 테스트해 보실 수 있습니다. <br/>
<br/>
<br/>

## Environment Table

| Variable           | dev | qa/prod |  Example                 | Explanation                                                                         |
| ------------------ | :-: | :-----: | :-----------------------: | ----------------------------------------------------------------------------------- |
| EMAIL_HOST           | ✅  |   ✅    | smtp.office365.com | 어떤 메일 서버를 통해서 인증 메일이 발송될 것인지 지정합니다.  |
| EMAIL_PORT           | ✅  |   ✅    | 587 | 메일 서버의 발신 포트 번호를 지정합니다.  |
| EMAIL_AUTH_USER           | ✅  |   ✅    | system@baobab.blog | 시스템 발송에 사용될 메일 계정을 지정합니다.  |
| EMAIL_AUTH_PASSWORD           | ✅  |   ✅    | PRIVATE | 시스템 발송에 사용될 메일 계정의 비밀번호를 지정합니다.  |
| EMAIL_TLS_CIPHERS           | ✅  |   ✅    | PRIVATE | 메일 서비스에 사용될 암호화 인증 수준을 지정합니다.  |
| DB_HOST           | ✅  |   ✅    | mysql | 데이터베이스에 접근할 수 있는 호스트 주소를 지정합니다.  |
| DB_USERNAME           | ✅  |   ✅    | PRIVATE | blog 데이터베이스의 접근할 수 있는 유저 이름을 지정합니다.  |
| DB_PASSWORD           | ✅  |   ✅    | PRIVATE | blog 데이터베이스의 접근할 수 있는 패스워드를 지정합니다.  |
| DB_PORT           | ✅  |   ✅    | 3306 | 데이터베이스의 서비스 포트 번호를 지정합니다.  |
| DB_SYNC           | ✅  |   ✅    | true | 데이터베이스 sync 옵션에 대해 지정합니다.  |
| JWT_SECRET           | ✅  |   ✅    | PRIVATE | JWT의 암호를 지정합니다.  |
| JWT_ACCESS_EXPIRES           | ✅  |   ✅    | 3600 | 액세스 토큰의 만료 기간을 지정합니다.  |
| JWT_REFRESH_EXPIRES           | ✅  |   ✅    | 604800 | 리프레쉬 토큰의 만료 기간을 지정합니다.  |
| AZURE_CONNECTIONS           | ✅  |   ✅    | PRIVATE | Azure Blob Container 와의 Connection 정보를 지정합니다.  |
| AZURE_BLOB_CONTAINER_NAME           | ✅  |   ✅    | PRIVATE | Azure Blob Container 의 이름을 지정합니다.  |
