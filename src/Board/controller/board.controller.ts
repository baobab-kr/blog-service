import { Controller, Get, Param, Query, Body, Post, ValidationPipe, UseInterceptors, UploadedFile, Patch, UseGuards, Req, HttpException, HttpStatus, HttpCode, Header, Res, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BoardService } from '../service/board.service';
import { Board } from '../repository/entity/board.entity';
import { Comment } from '../repository/entity/comment.entity';
import { ReComment } from '../repository/entity/recomment.entity';
import { CreateBoardDTO, CreateCommentDTO, CreateReCommentDTO, CreateFilteringCommentDTO, CreateFilteringReCommentDTO } from '../repository/dto/create-board.dto';
import { UpdateBoardDTO } from '../repository/dto/update-board.dto';
import { CommentService } from '../service/commnet.service';
import { ReCommentService } from '../service/recomment.service';
import { JwtAccessTokenGuard } from 'src/auth/security/jwtAccessToken.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from '../../jobs/service/jobs.service';


@Controller('board')
@ApiTags("Baobab_Board")
export class BoardController {
    constructor(
        private boardService : BoardService,
        private commentService : CommentService,
        private reCommentService : ReCommentService
        //private jwtService : JwtService
        ){}
    
    

    
    /**
     * createBoard(게시물 생성 API)
     * @param req
     * @param createBoardDTO
     * @param file 
     * @returns void
     */
    @Post("/CreateBoard")
    @HttpCode(200)
    @UseInterceptors(FileInterceptor("thumbnail"))
    @ApiOperation({summary : "게시물 생성 API", description : "게시물을 생성한다."})
    @ApiResponse({
        description: '데이터베이스에 게시물 정보가 저장됩니다.'
      })
    @ApiConsumes('multipart/form-data')
    @ApiBody({description : "게시물 생성을 위한 정보를 입력합니다. " ,type:CreateBoardDTO})
    @UseGuards(JwtAccessTokenGuard)
    async createBoard(
        @Req() req: Request,
        @Body(ValidationPipe) createBoardDTO : CreateBoardDTO,
        @UploadedFile() file,
        
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;

        await this.boardService.createBoard(createBoardDTO,writer,file);
    }
    

    /**
     * getBoardMain(메인페이지 호출 API)
     * @param id 
     * @returns Board[]
     */
     @Post("/BoardMain")
     @HttpCode(200)
     @ApiOperation({summary : "메인페이지 호출 API", description : "한 페이지당 15개의 개시물 반환"})
     @ApiCreatedResponse({description : "게시물 반환"})
     @ApiQuery({name : "page", required : true, description : "불러올 페이지"})
     @ApiBody({schema : {example : {page : 0} }})
     async getBoardMain(
         @Req() req: Request,
         @Body("page")
         page: number
     ) : Promise<Object>{
         
         let board ;
 
         if(Object.keys(req.cookies).includes("AccessToken") ){
             const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);
             board = await this.boardService.getBoardMain(page,user_id_inPayload);
         }else{
             board = await this.boardService.getBoardMain(page);
         }
         
         if(board == undefined || !(board.length > 0)){
             const noBoard = {"message" : "Board값이 없습니다."}
             return noBoard;
         }
         return board;
     }
     /**
     * getBoardMain(메인페이지 호출 API)
     * @param id 
     * @returns Board[]
     */
     @Post("/BoardMainTag")
     @HttpCode(200)
     @ApiOperation({summary : "메인페이지 태그 검색 API", description : "tag_name이 있는 해당하는 게시물을 반환, tag_name은 배열로 입력"})
     @ApiCreatedResponse({description : "게시물 정보 반환"})
     @ApiBody({schema : {example : {page : 0,   "tag_name": [    "string"  ]}}})
     async getBoardMainTag(
         @Req() req: Request,
         @Body("page") page: number,
         @Body("tag_name") tag: string[]
     ) : Promise<Object>{
         
         let board ;
 
         if(Object.keys(req.cookies).includes("AccessToken") ){
             const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);
             board = await this.boardService.getBoardMainTag(page,tag,user_id_inPayload);
         }else{
             board = await this.boardService.getBoardMainTag(page,tag);
         }
         
         if(board == undefined || !(board.length > 0)){
             const noBoard = {"message" : "Board값이 없습니다."}
             return noBoard;
         }
         return board;
     }
    @Post("/BoardSearchOfTitle")
    @HttpCode(200)
    @ApiOperation({summary : "메인페이지 제목 검색 API", description : "title이 포함된 게시물을 반환"})
    @ApiCreatedResponse({description : "게시물 정보 반환"})
    @ApiBody({schema : {example : {page : 0,   "title":"string"}}})
    async getBoardMainofTitle(
    @Req() req: Request,
    @Body("page") page: number,
    @Body("title") title: string
    ){
        
        const board = await this.boardService.getBoardMainofTitle(page,title);

        if(board.length <= 0){
            return {"message" : "Board값이 없습니다."}
        }

        return board;
    }

    /**
     * getBoardPersonal(개인페이지 호출 API)
     * @param id 
     * @returns Board[]
     */
    @Post("/BoardPersonal")
    @HttpCode(200)
    //@UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "개인페이지 호출 API", description : "개인페이지를 반환한다.<br> 작성자가 아닌 다른사람의 개인페이지에 들어가면 공개 게시물만을 반환한다.<br> user_id는 필수값 아님"})
    @ApiCreatedResponse({description : "게시물 정보 반환"})
    @ApiBody({schema : {example : {user_id : 0, page : 0}}})
    async getBoardPersonal(
        @Req() req: Request,
        @Body("user_id") user_id : number,
        @Body("page") page: number
    ) : Promise<Object>{
        
        let board ;
        let tagCount ;
        let writer;

        
        const checked_login :string = await this.boardService.checked_login(req, user_id);
        

        if(checked_login == "본인계정접속"){
            let user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);

            board = await this.boardService.getBoardPersonal(page,user_id_inPayload);
            tagCount = await this.boardService.tagCount(user_id_inPayload,checked_login);
            writer = await this.boardService.getUserById(user_id_inPayload);
        }else if(checked_login == "게스트"){
            
            board = await this.boardService.getBoardGuest(page,user_id);
            tagCount = await this.boardService.tagCount(user_id,checked_login);
            writer = await this.boardService.getUserById(user_id)
        }else if(checked_login == "로그인안함"){
            throw new HttpException('로그인정보와 user_id가 없습니다.', HttpStatus.CONFLICT)
        }
        

        if(board == undefined || !(board.length > 0)){
            const noBoard = {
                "message" : "Board값이 없습니다.",
                "writer" : writer
            }

            return noBoard;
        }
        
        const boardAndTag = {
            board,
            tagCount,
            writer
        }
        
        return boardAndTag;
    }

    /**
     * getTagCount(개인페이지 테그 개수 반환 API)
     * @param req 
     * @param user_id 
     * @returns 
     */
    @Post("/BoardPersonalTagCount")
    @HttpCode(200)
    @ApiOperation({summary : "개인페이지 테그 개수 반환 API", description : "해당 개인페이지의 게시물이 갖은 태그들의 개수를 반환한다.<br> user_id는 필수값 아님"})
    @ApiCreatedResponse({description : "태그개수 반환", type : "Object"})
    @ApiBody({schema : {example : {user_id : 0}}})
    async getTagCount(
        @Req() req : Request,
        @Body("user_id") user_id : number
    ){

        let tagCount
        let board_status ;
        const checked_login :string = await this.boardService.checked_login(req, user_id);
        

        if(checked_login == "본인계정접속"){
            let user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);
            board_status = [0,2]
            tagCount = await this.boardService.tagCount(user_id_inPayload,checked_login);
        }else if(checked_login == "게스트"){
            board_status = [0]
            tagCount = await this.boardService.tagCount(user_id,checked_login);
 
        }else if(checked_login == "로그인안함"){
            throw new HttpException('로그인정보와 user_id가 없습니다.', HttpStatus.CONFLICT)
        }
        

        return tagCount 

    }
    /**
     * getWriter(개인페이지의 작성자 확인 API)
     * @param req 
     * @param user_id 
     * @returns 
     */
    @Post("/BoardPersonalWriter")
    @HttpCode(200)
    @ApiOperation({summary : "개인페이지의 작성자 확인 API", description : "해당 개인페이지의 작성자를 반환한다. <br> user_id는 필수값 아님<br>로그인 시 로그인한 사용자의 정보가 반환"})
    @ApiCreatedResponse({description : "User정보 반환", type : "User"})
    @ApiBody({schema : {example : {user_id : 0}}})
    async getWriter(
        @Req() req : Request,
        @Body("user_id") user_id : number
    ){

        
        let writer;

        const checked_login :string = await this.boardService.checked_login(req, user_id);
    
        if(checked_login == "본인계정접속"){
            let user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);
            writer = await this.boardService.getUserById(user_id_inPayload);
        }else if(checked_login == "게스트"){
            writer = await this.boardService.getUserById(user_id)
 
        }else if(checked_login == "로그인안함"){
            throw new HttpException('로그인정보와 user_id가 없습니다.', HttpStatus.CONFLICT)
        }
       
        return writer;
    }
    /**
     * getBoardPersonalTag(개인페이지 태그 검색 API)
     * @param req 
     * @param page 
     * @param user_id 
     * @param tag_name 
     * @returns 
     */
    @Post("/BoardPersonalTag")
    @HttpCode(200)
    @ApiOperation({summary : "개인페이지 태그 검색 API", description : "tag_name이 포함된 개인페이지 정보를 반환한다.<br> user_id는 필수값 아님"})
    @ApiCreatedResponse({description : "게시물 반환"})
    @ApiBody({schema : {example : { page : 0, user_id : 0, "tag_name" : [ "string" ]}}})
    async getBoardPersonalTag(
        @Req() req : Request,
        @Body("page") page : number,
        @Body("user_id") user_id : number,
        @Body("tag_name") tag_name : string[]
    ):Promise<Object>{
        let board ;

        const checked_login :string = await this.boardService.checked_login(req, user_id);
    
        if(checked_login == "본인계정접속"){
            let user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);
            board = await this.boardService.getBoardPersonalTag(page,user_id_inPayload,tag_name);
        }else if(checked_login == "게스트"){
            board = await this.boardService.getBoardGuestTag(page,user_id,tag_name);
 
        }else if(checked_login == "로그인안함"){
            throw new HttpException('로그인정보와 user_id가 없습니다.', HttpStatus.CONFLICT)
        }
        

        if(board == undefined || !(board.length > 0)){
            const noBoard = {"message" : "Board값이 없습니다."}
            return noBoard;
        }
        

        
        return board;
    }

    /**
     * getBoardById(상세 페이지 호출 API)
     * @param id 
     * @returns Board
     */
    
    @Post("/BoardView")
    @HttpCode(200)
    @ApiOperation({summary : "상세 페이지 호출 API", description : "입력 board_id와 같은 게시물 정보 반환"})
    @ApiCreatedResponse({description : "게시물 반환"})
    @ApiBody({schema : {example : { board_id : 0}}})
    async getBoardById(
        @Req() req : Request,
        @Body("board_id") id : number
    ) : Promise<Board>{

        let board ;
        
        
        await this.boardService.CheckBoardById(id);
        await this.boardService.viewUp(id);
        
        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);
            board = await this.boardService.getBoardById(id,user_id_inPayload);
        }else{
            board = await this.boardService.getBoardById(id);
        }
        
        return board;
    }
    
    /**
     * updateBoard(게시물 업데이트 API)
     * @param id 
     * @param updateBoardDTO 
     * @returns void
     */

    @Patch("BoardUpdate")
    @HttpCode(200)
    @UseInterceptors(FileInterceptor("thumbnail"))
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "게시물 업데이트 API", description : "게시물을 수정, 삭제 할 수 있음<br>title , description, content, board_status, tag_name 필수 입력값 아님"})
    @ApiCreatedResponse({type : "void"})
    @ApiBody({type:UpdateBoardDTO})
    @ApiConsumes('multipart/form-data')
    async updateBoard(
        @Req() req: Request,
        @Body("board_id") id : number,
        @Body() UpdateBoardDTO : UpdateBoardDTO,
        @UploadedFile() file,
    ) : Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;

        await this.boardService.CheckBoardById(UpdateBoardDTO.board_id);
        await this.boardService.deleteTag(UpdateBoardDTO.board_id);
        
        await this.boardService.updateBoard(UpdateBoardDTO, file);
    }

    /**
     * deleteBoard(게시물 삭제 API)
     * @param id 
     * @returns void
     */
    @Patch("BoardDelete")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "게시물 삭제 API", description : "게시물을 삭제 할 수 있음"})
    @ApiCreatedResponse({type : "void"})
    @ApiBody({schema : {example : { board_id : 0}}})
    async deleteBoard(
        @Req() req: Request,
        @Body("board_id") id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;

        await this.boardService.CheckBoardById(id);
        await this.boardService.CheckingWriter(id, writer);
        
        await this.boardService.deleteBoard(id);
        
        
    }

    @Delete("DeleteAllPosts")
    @HttpCode(200)
    @ApiOperation({summary : "게시물 전체 삭제 API", description : "유저 정보에 해당하는 모든 게시물, 댓글, 대댓글, 태그정보, 좋아요 정보 삭제"})
    @ApiResponse({
        description: '게시물 삭제'
      })
    @ApiBody({schema : {example : { user_id : 0}}})
    async deleteAllPosts(
        @Body("user_id") user_id : number
    ){
        await this.boardService.getUserById(user_id);
        await this.boardService.delete_all_board_in_user(user_id);   
    }

    /**
     * createComment(댓글 생성 API)
     * @param createCommentDTO 
     * @returns comment_id, content
     */
    @Post("/CreateComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "댓글 생성 API", description : "해당 게시물에 대한 댓글을 생성한다.<br> status<br>공개:0,삭제:1 "})
    @ApiCreatedResponse({type : "void"})
    async createComment(
        @Req() req: Request,
        @Body(ValidationPipe) createCommentDTO : CreateCommentDTO
    )  {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined

        const res = await this.commentService.createComment(createCommentDTO, writer);
        return res;
    }

    /**
     * createComment(댓글 생성 필터링 API)
     * @param createFilteringCommentDTO
     * @returns void
     */
     @Post("/CreateFilteringComment")
     @HttpCode(200)
     @UseGuards(JwtAccessTokenGuard)
     @ApiOperation({summary : "댓글 필터링 수정 API", description : "생성된 댓글을 필터링하여 재저장한다."})
     @ApiCreatedResponse({type : "void"})
     async createFilteringComment(
         @Body(ValidationPipe) createFilteringCommentDTO : CreateFilteringCommentDTO
     )  {
         await this.commentService.createFilteringComment(createFilteringCommentDTO);
     }
    
    /**
     * getCommentById(댓글 호출 API)
     * @param board_id 
     * @returns Comment[]
     */
    @Post("Comment")
    @HttpCode(200)
    @ApiOperation({summary : "댓글 호출 API", description : "해당 board_id의 댓글을 불러올 수 있다. page당 10개의 댓글을 불러올 수 있다."})
    @ApiCreatedResponse({type : "Comment[]"})
    @ApiBody({schema : {example : { board_id : 0, page : 0}}})
    async getCommentById(
        @Body("board_id") board_id : number,
        @Body("page") page : number
    ): Promise<Comment[]>{
        return await this.commentService.getCommentByBoardId(board_id, page);
    }
    /**
     * getCommentById(댓글 페이지 개수 API)
     * @param board_id 
     * @returns Comment[]
     */
    @Post("CommentPage")
    @HttpCode(200)
    @ApiOperation({summary : "댓글 페이지 개수 API", description : "댓글 최대 페이지 반환"})
    @ApiCreatedResponse({type : "Number"})
    @ApiBody({schema : {example : { board_id : 0}}})
    async getCommentPage(
        @Body("board_id") board_id : number
    ){
        return await this.commentService.getCommentPageCount(board_id);
    }

    /**
     * getCommentById(댓글 페이지 개수 API)
     * @param board_id 
     * @returns Comment[]
     */
     @Get("CommentCount")
     @HttpCode(200)
     @ApiOperation({summary : "댓글 개수 API", description : "댓글 개수 반환"})
     @ApiCreatedResponse({type : "Number"})
     @ApiQuery({name:"board_id",type : "number"})
     async getCommentCount(
         @Query("board_id") board_id : number
     ){
        if(board_id != undefined){
            if(isNaN(board_id)){
                throw new HttpException('board_id가 없습니다.', HttpStatus.CONFLICT)
            }
        }
        return await this.commentService.getCommentCount(board_id);
     }
    /**
     * deleteCommentById(댓글 삭제 API)
     * @param comment_id
     * @returns void
     */
    @Patch("DeleteComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "댓글 삭제 API", description : "comment_id 해당하는 댓글을 삭제하는 api<br>로그인 시 사용가능함<br>로그인한 사용자가 작성자일 때 삭제 가능"})
    @ApiCreatedResponse({type : "void"})
    @ApiBody({schema : {example : { comment_id : 0}}})
    async deleteCommentById(
        @Req() req : Request,
        @Body("comment_id") comment_id : number
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;

        await this.commentService.getCommentByUserId(comment_id, writer);
        await this.commentService.deleteCommentById(comment_id);
    }

    /**
     * createReComment(답글 생성 API)
     * @param createReCommentDTO 
     * @returns void
     */
    @Post("/CreateReComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "답글 생성 API", description : "답글을 생성한다.<br>recomment_status<br>공개:0, 삭제:1"})
    @ApiCreatedResponse({type : "void"})
    async createReComment(
        @Req() req :Request,
        @Body(ValidationPipe) createReCommentDTO : CreateReCommentDTO
    ) {
        const user: any = req.user;
        const writer : number = user.id;
        const res = await this.reCommentService.createReComment(createReCommentDTO,writer);
        return res;
    }

    /**
     * createComment(답글 생성 필터링 API)
     * @param createFilteringReCommentDTO
     * @returns void
     */
     @Post("/CreateFilteringReComment")
     @HttpCode(200)
     @UseGuards(JwtAccessTokenGuard)
     @ApiOperation({summary : "답글 필터링 수정 API", description : "생성된 답글을 필터링하여 재저장한다."})
     @ApiCreatedResponse({type : "void"})
     async createFilteringReComment(
         @Body(ValidationPipe) createFilteringReCommentDTO : CreateFilteringReCommentDTO
     )  {
         await this.reCommentService.createFilteringReComment(createFilteringReCommentDTO);
     }

    /**
     * getReCommentById(답글 호출 API)
     * @param id 
     * @returns ReComment[]
     */
    @Post("ReComment")
    @HttpCode(200)
    @ApiOperation({summary : "답글 호출 API", description : "comment_id에 해당하는 댓글에 대한 답글을 호출할 수 있다. page당 10개의 댓글을 불러올 수 있다."})
    @ApiCreatedResponse({type : "ReComment"})
    @ApiBody({schema : {example : { comment_id : 0, page : 0}}})
    async getReCommentById(
        @Body("comment_id") comment_id : number,
        @Body("page") page : number
    ): Promise<ReComment[]>{
        return this.reCommentService.getReCommentByCommentId(comment_id, page);
    }

    /**
     * ReCommentPage(답글 페이지 개수 API)
     * @param comment_id 
     * @returns 
     */
    @Post("ReCommentPage")
    @HttpCode(200)
    @ApiOperation({summary : "답글 페이지 개수 API", description : "comment_id에 해당하는 댓글이 갖고 있는 답글 페이지 개수를 확인 할 수 있다."})
    @ApiCreatedResponse({type : "Number"})
    @ApiBody({schema : {example : { comment_id : 0}}})
    async getReCommentPage(
        @Body("comment_id") comment_id : number
    ){
        return await this.reCommentService.getReCommentPageLength(comment_id);
    }
    
    /**
         * ReCommentPage(답글 페이지 개수 API)
         * @param comment_id 
         * @returns 
         */
    @Get("ReCommentCount")
    @HttpCode(200)
    @ApiOperation({summary : "답글 개수 API", description : "comment_id에 해당하는 댓글이 갖고 있는 답글 개수를 확인 할 수 있다."})
    @ApiCreatedResponse({type : "Number"})
    @ApiQuery({name:"comment_id",type : "number"})
    async getReCommentCount(
        @Query("comment_id") comment_id : number
    ){

        if(comment_id != undefined){
            if(isNaN(comment_id)){
                
                throw new HttpException('comment_id가 없습니다.', HttpStatus.CONFLICT)
            }
        }
        
        return await this.reCommentService.getReCommentCount(comment_id);
    }
    /**
     * deleteReCommentById(답글 삭제 API)
     * @param id 
     * @returns void
     */
    @Patch("DeleteReComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "답글 삭제 API", description : "reComment_id 해당하는 답글을 삭제할 수 있다.<br>로그인 시 사용가능함<br>로그인한 사용자가 작성자일 때 삭제 가능"})
    @ApiCreatedResponse({type : "void"})
    @ApiBody({schema : {example : { reComment_id : 0}}})
    async deleteReCommentById(
        @Req() req : Request,
        @Body("reComment_id") reComment_id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;

        await this.reCommentService.getReCommentByUserId(reComment_id, writer);
        await this.reCommentService.deleteReCommentById(reComment_id);

    }
    
    /**
     * LikeBoard (좋아요)
     * @param req 
     * @param board_id 
     */
    @Post("Like")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    @ApiOperation({summary : "답글 삭제 API", description : "해당 게시물의 좋아요 수를 증감할 수 있다. 한번 누르면 좋아요 증가, 두 번 누르면 좋아요 하락"})
    @ApiCreatedResponse({type : "void"})
    @ApiBody({schema : {example : { board_id : 0}}})
    async LikeBoard(
        @Req() req : Request,
        @Body("board_id") board_id : number
    ){
        const user: any = req.user;
        const writer : number = user.id;
        
        const likes = await this.boardService.LikeBoard(board_id,writer);
        return likes;
    }

    /**
     * getThumpnail(썸네일 호출 API)
     * @param res 
     * @param filename 
     * @returns 
     */
    @Post("/getThumpnail")
    @HttpCode(200)
    @Header('Content-Type','image/webp')
    @ApiOperation({summary : "썸네일 호출 API", description : "board가 갖은 thumpnail속성의 string값을 filename에 입력하면 해당 board의 썸네일 이미지 반환"})
    @ApiCreatedResponse({type : "image"})
    @ApiBody({schema : {example : { filename : "string"}}})
    async getThumpnail(@Res() res, @Body('filename') filename){
        const file = await this.boardService.getThumbnail(filename);
        return file.pipe(res);
    }
    
    

}
