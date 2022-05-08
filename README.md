# API 정의 (User & Email Service)
- 회원가입 API  
  - 회원가입 API 요청을 통해 메일 발송 API를 테스트 할 수 있음.  
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/register|{"userid":"iwantbaobab", "email": "baobab@baobab.blog","username":"baobab", "password": "baobab123@@##", "inputVerifyCode":"123456"}|||201|  

- 이메일 중복 확인 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/check-email|{"email":"iwantbaobab@gmail.com"}|||200|

- 유저 ID 중복 확인 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/check-email|{"userid":"iwantbaobab"}|||200|

- 유저이름 중복 확인 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/check-username|{"username":"홍길동"}|||200|
  
- 이메일 인증 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/register-code|{"username":"홍길동", "email":"baobab@baobab.blog"}|||200|      
  
- 로그인 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/login|{"email":"baobab@baobab.blog", "password": "baobab123@@##"}|||200|  

- 회원 정보 조회 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |GET /users/:id|||id(유저 ID, 임의의 문자열)|200|      