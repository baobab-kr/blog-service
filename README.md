# API 정의 (User Service)
- 회원가입 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/register|{"userid":"baobab@baobab.blog", "username":"baobab", "password": "baobab123@@##"}|||201|  
  
- 이메일 인증 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/email-verify|{"signupVerifyToken":"문자열"}|||201|      
  
- 로그인 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /users/login|{"email":"baobab@baobab.blog", "password": "baobab123@@##"}|||201|  

- 회원 정보 조회 API  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |GET /users/:id|||id(유저 ID, 임의의 문자열)|200|      