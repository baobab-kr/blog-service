import { Controller, Get, Param, Query, Body, Post, ValidationPipe, UseInterceptors, UploadedFile, Patch, UseGuards, Req, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {  multerMemoryOptions } from '../../configs/multer.option';
import { BoardService } from '../service/board.service';
import { Board } from '../repository/entity/board.entity';
import { Comment } from '../repository/entity/comment.entity';
import { ReComment } from '../repository/entity/recomment.entity';
import { CreateBoardDTO, CreateCommentDTO, CreateReCommentDTO } from '../repository/dto/create-board.dto';
import { UpdateBoardDTO } from '../repository/dto/update-board.dto';
import { CommentService } from '../service/commnet.service';
import { ReCommentService } from '../service/recomment.service';
import { JwtAccessTokenGuard } from 'src/auth/security/jwtAccessToken.guard';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { options } from 'joi';
import { JwtService } from '@nestjs/jwt';

@Controller('board')
export class BoardController {
    constructor(
        private boardService : BoardService,
        private commentService : CommentService,
        private reCommentService : ReCommentService,
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
    @UseInterceptors(FileInterceptor("thumbnail",multerMemoryOptions))
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
    async getBoardMain(
        @Req() req: Request,
        @Body("page") page: number
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
     * getBoardPersonal(개인페이지 호출 API)
     * @param id 
     * @returns Board[]
     */
    @Post("/BoardPersonal")
    @HttpCode(200)
    //@UseGuards(JwtAccessTokenGuard)
    async getBoardPersonal(
        @Req() req: Request,
        @Body("user_id") user_id : number,
        @Body("page") page: number
    ) : Promise<Object>{
        
        let board ;
        let tagCount ;
        let writer;

        //로그인 검증
        if(Object.keys(req.cookies).includes("AccessToken") ){
            
            const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);


            //호출 페이지와 로그인 정보 비교
            if(user_id == undefined){
                //개인 자신 페이지 호출
                board = await this.boardService.getBoardPersonal(page,user_id_inPayload);
                tagCount = await this.boardService.tagCount(user_id_inPayload);
                writer = await this.boardService.getUserById(user_id_inPayload);
            }else{
                if(user_id_inPayload == user_id){
                    //개인 로그인 한 user가 호출 user_id 같아 자신의 페이지를 호출
                    board = await this.boardService.getBoardPersonal(page,user_id_inPayload);
                    tagCount = await this.boardService.tagCount(user_id_inPayload);
                    writer = await this.boardService.getUserById(user_id_inPayload);
                }else{
                    //게스트 로그인한 user와 호출 user가 다름
                    board = await this.boardService.getBoardGuest(page,user_id,user_id_inPayload);
                    tagCount = await this.boardService.tagCount(user_id);
                    writer = await this.boardService.getUserById(user_id)
                }
            }
            

        }
        else if(user_id != undefined){
            //게스트 user_id 입력됐고 로그인 안된 상태
            
            board = await this.boardService.getBoardGuest(page,user_id);
            tagCount = await this.boardService.tagCount(user_id);
            writer = await this.boardService.getUserById(user_id)
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

    @Post("/BoardPersonalTagCount")
    @HttpCode(200)
    async getTagCount(
        @Req() req : Request,
        @Body("user_id") user_id : number
    ){

        let tagCount ;
        if(Object.keys(req.cookies).includes("AccessToken") ){
            
            const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);


            //호출 페이지와 로그인 정보 비교
            if(user_id == undefined){
                //개인 자신 페이지 호출
                tagCount = await this.boardService.tagCount(user_id_inPayload);
                
            }else{
                if(user_id_inPayload == user_id){
                    //개인 로그인 한 user가 호출 user_id 같아 자신의 페이지를 호출
                    tagCount = await this.boardService.tagCount(user_id_inPayload);
                    
                }else{
                    //게스트 로그인한 user와 호출 user가 다름
                    tagCount = await this.boardService.tagCount(user_id);
                }
            }
            

        }
        else if(user_id != undefined){
            //게스트 user_id 입력됐고 로그인 안된 상태
            tagCount = await this.boardService.tagCount(user_id);
        }

        return tagCount 

    }
    @Post("/BoardPersonalWriter")
    @HttpCode(200)
    async getWriter(
        @Req() req : Request,
        @Body("user_id") user_id : number
    ){

        
        let writer;

        //로그인 검증
        if(Object.keys(req.cookies).includes("AccessToken") ){
            
            const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);


            //호출 페이지와 로그인 정보 비교
            if(user_id == undefined){
                //개인 자신 페이지 호출
                writer = await this.boardService.getUserById(user_id_inPayload);
            }else{
                if(user_id_inPayload == user_id){
                    //개인 로그인 한 user가 호출 user_id 같아 자신의 페이지를 호출
                    writer = await this.boardService.getUserById(user_id_inPayload);
                }else{
                    //게스트 로그인한 user와 호출 user가 다름
                    writer = await this.boardService.getUserById(user_id)
                }
            }
            

        }
        else if(user_id != undefined){
            //게스트 user_id 입력됐고 로그인 안된 상태
            
            writer = await this.boardService.getUserById(user_id)
        }

        
        
        
        return writer;
    }
    /**
     * getBoardPersonalTag(개인페이지 태그 검색API)
     * @param req 
     * @param page 
     * @param user_id 
     * @param tag_name 
     * @returns 
     */
    @Post("/BoardPersonalTag")
    @HttpCode(200)
    async getBoardPersonalTag(
        @Req() req : Request,
        @Body("page") page : number,
        @Body("user_id") user_id : number,
        @Body("tag_name") tag_name : string[]
    ):Promise<Object>{
        let board ;

        //로그인 검증
        if(Object.keys(req.cookies).includes("AccessToken") ){
            
            //payload의 user_id 값 반환
            const user_id_inPayload : number = await this.boardService.userIdInCookie(req.cookies.AccessToken);

            //로그인만 했을 경우
            if(user_id == undefined){
                board = await this.boardService.getBoardPersonalTag(page,user_id_inPayload,tag_name);
            }
            else{
                //로그인한 user와 작성자가 같을 때
                if(user_id_inPayload == user_id){
                    board = await this.boardService.getBoardPersonalTag(page,user_id_inPayload,tag_name);
                }else{
                    board = await this.boardService.getBoardGuestTag(page,user_id,tag_name);
                }
            }
            

        }
        else if(user_id != undefined){
            board = await this.boardService.getBoardGuestTag(page,user_id,tag_name);
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
    @UseGuards(JwtAccessTokenGuard)
    async updateBoard(
        @Req() req: Request,
        @Body("board_id") id : number,
        @Body() UpdateBoardDTO : UpdateBoardDTO
    ) : Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;

        await this.boardService.CheckBoardById(id);
        
        await this.boardService.updateBoard(UpdateBoardDTO, id);
    }

    /**
     * deleteBoard(게시물 삭제 API)
     * @param id 
     * @returns void
     */
    @Patch("BoardDelete")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
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


    /**
     * createComment(댓글 생성 API)
     * @param createCommentDTO 
     * @returns void
     */
    @Post("/CreateComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    async createComment(
        @Req() req: Request,
        @Body(ValidationPipe) createCommentDTO : CreateCommentDTO
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined

        await this.commentService.createComment(createCommentDTO,writer);
    }
    
    /**
     * getCommentById(댓글 호출 API)
     * @param board_id 
     * @returns Comment[]
     */
    @Post("Comment")
    @HttpCode(200)
    async getCommentById(
        @Body("board_id") board_id : number
    ): Promise<Comment[]>{
        return await this.commentService.getCommentByBoardId(board_id);
    }
    
    /**
     * deleteCommentById(댓글 삭제 API)
     * @param comment_id
     * @returns void
     */
    @Patch("DeleteComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
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
    async createReComment(
        @Req() req :Request,
        @Body(ValidationPipe) createReCommentDTO : CreateReCommentDTO
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;



        await this.reCommentService.createReComment(createReCommentDTO,writer);
        
    }
    /**
     * getReCommentById(답글 호출 API)
     * @param id 
     * @returns ReComment[]
     */
    @Post("ReComment")
    @HttpCode(200)
    async getReCommentById(
        @Body("comment_id") comment_id : number
    ): Promise<ReComment[]>{
        return this.reCommentService.getReCommentByCommentId(comment_id);
    }

    /**
     * deleteReCommentById(답글 삭제 API)
     * @param id 
     * @returns void
     */
    @Patch("DeleteReComment")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
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
    async LikeBoard(
        @Req() req : Request,
        @Body("board_id") board_id : number
    ){
        const user: any = req.user;
        const writer : number = user.id;
        
        const likes = await this.boardService.LikeBoard(board_id,writer);
        return likes;
    }
    
    
    

}
