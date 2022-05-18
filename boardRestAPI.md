# API 정의 (Board Service)
- 게시물 생성 API
  - access토큰 필요
  - thumbnail의 경우 파일의 형태로 입력
  - tag_name은 array값으로 입력
    
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/CreateBoard|{  "title" : "제목",    "description" : "설명",    "content":"내용",    "board_status" : 0,    "thumbnail" : "file",    "tag_name" : []}|||200|  

- 메인페이지 호출 API
  - page값 부터 board_status가 0인 것(공개 게시글)을 15개 반환

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/CreateBoard|{"page":0}|||200|  
  
- 개인페이지 호출 API
  - access토큰 필요
  - 해당 유저의 게시글 page값 부터 board_status가 0인 것(공개 게시글), 1인 것(비 공개 게시글)을 15개 반환

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardPersonal|{"page":0}|||200|  

- 상세 페이지 호출 API

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST| /board/BoardView|{"id":0}|||200|  

- 게시물 업데이트 API
  - access토큰 필요
  - thumbnail의 경우 파일의 형태로 입력
  - tag_name은 array값으로 입력

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/BoardUpdate|{  "title" : "제목",    "description" : "설명",    "content":"내용",    "board_status" : 0,    "thumbnail" : "file",    "tag_name" : []}|||200|  

- 게시물 삭제 API
  - access토큰 필요
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST/board/BoardDelete|{"id":0}|||200|  

- 댓글 생성 API
  - access토큰 필요
    
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/CreateComment|{      "board_id" : 1,    "content" : "내용",    "comment_status" : 0}|||200|  

- 댓글 호출 API
  

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/Comment|{id:0}|||200|  

- 댓글 삭제 API
  - access토큰 필요
  
  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST/board/DeleteComment|{"comment_id":0}|||200|  
  
- 답글 생성 API
  - comment_id를 잘못 넣으면 참조 무결성 오류가 발생할 수 있음
  - access토큰 필요

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/CreateReComment|{      "board_id" : 1,    "content" : "내용",    "comment_status" : 0}|||200|  

- 답글 호출 API
  

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST /board/ReComment|{reComment_id:0}|||200|  

- 답글 삭제 API
  - access토큰 필요

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST/board/DeleteReComment|{"reComment_id":0}|||200|  

- 좋아요
  - access토큰 필요

  |EndPoint|JSON|Query Param|Path Param|Response|  
  |---|---|---|---|---|
  |POST/board/Like|{"id":0}|||200|  