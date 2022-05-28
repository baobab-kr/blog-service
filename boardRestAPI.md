# API 정의 (Board Service)
- status 
  - 공개 : 0
  - 삭제 : 1
  - 비공개 : 2

- 게시물 생성 API
  - access토큰 필요
  - thumbnail의 경우 파일의 형태로 입력
  - tag_name은 array값으로 입력
    
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/CreateBoard|{    "title" : "제목123",    "description" : "설명",    "content":"내용",    "board_status" : 0,    "thumbnail" : "file",    "tag_name" : ["board","tags"]}|||200|  

- 메인페이지 호출 API
  - page값 부터 board_status가 0인 것(공개 게시글)을 15개 반환

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardMain|{"page":0}|||200|  
  
- 개인페이지 호출 API
  - user_id가 없이 access토큰만 들어왔을 시 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글), 2인 것(비 공개 게시글)을 15개 반환
  - user_id과 access토큰의 user_id가 일치할 시 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글), 2인 것(비 공개 게시글)을 15개 반환
  - user_id만 들어왔을 시 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글)을 15개 반환

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardPersonal|{"page":0,    "user_id" : 1}|||200|  

- 개인페이지 TagCount호출 API
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/boardPersonalTagCount|{"user_id" : 1}|||200|  

- 개인페이지 Writer호출 API
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardPersonalWriter|{"user_id" : 1}|||200|  



- 개인페이지 태그 검색 API
  - user_id가 없이 access토큰만 들어왔을 시 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글), 2인 것(비 공개 게시글)을 15개 반환
  - user_id과 access토큰의 user_id가 일치할 시 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글), 2인 것(비 공개 게시글)을 15개 반환
  - user_id만 들어왔을 시 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글)을 15개 반환

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardPersonalTag|{    "page":0,    "user_id" : 1,    "tag_name" : ["태그1","태그2"]}|||200|  

- 상세 페이지 호출 API

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardView|{"board_id" : 1}|||200|  

- 게시물 업데이트 API
  - access토큰 필요
  - thumbnail의 경우 파일의 형태로 입력
  - tag_name은 array값으로 입력

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |Patch /board/BoardUpdate|{    "board_id":4,    "title":"제목",    "description":"설명",    "content":"내용",    "tag_name":[]}|||200|  

- 게시물 삭제 API
  - access토큰 필요
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |Patch /board/BoardDelete|{"board_id":14}|||200|  

- 댓글 생성 API
  - access토큰 필요
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/CreateComment|{    "content":"내용",    "board_id":"1",    "comment_status":0}|||200|  

- 댓글 호출 API
  

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/Comment|{"board_id":1}|||200|  

- 댓글 삭제 API
  - access토큰 필요
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |Patch /board/DeleteComment|{"comment_id":1}|||200|  
  
- 답글 생성 API
  - comment_id를 잘못 넣으면 참조 무결성 오류가 발생할 수 있음
  - access토큰 필요

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST  /board/CreateReComment|{    "content":"내용",    "comment_id":"1",    "recomment_status":0}|||200|  

- 답글 호출 API
  

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/ReComment|{"comment_id":1}|||200|  

- 답글 삭제 API
  - access토큰 필요

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |Patch /board/DeleteReComment|{"reComment_id":1}|||200|  

- 좋아요
  - access토큰 필요

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/Like|{"board_id":0}|||200|  