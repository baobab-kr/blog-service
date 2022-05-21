# API 정의 (User & Email Service)
- 회원가입 API  
  - 회원가입 API 요청 전에 이메일 인증 API를 통해 inputVerifyCode를 확보해야 합니다.
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/register|{"userid":"iwantbaobab", "email": "iwantbaobab@gmail.com","username":"홍길동", "password": "Baobab123!!@@", "inputVerifyCode":123456}|||201|  

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
  |POST /users/register-code|{"username":"홍길동", "email":"iwantbaobab@gmail.com"}|||200|      
  
- 로그인 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/login|{"userid":"iwantbaobab", "password": "Baobab123!!@@"}|||200|  

- 리프레쉬 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |GET /users/refresh||||200|  

- 로그아웃 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |GET /users/logout||||200|  

- 회원 정보 조회 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |GET /users||||200|