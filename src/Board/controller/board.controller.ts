import { Controller, Get, Param, Query, Body, Post, ValidationPipe, UseInterceptors, UploadedFile, Patch, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
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


@Controller('board')
export class BoardController {
    constructor(
        private boardService : BoardService,
        private commentService : CommentService,
        private reCommentService : ReCommentService
        ){}
    

    /**
     * createBoard(게시물 생성 API)
     * @param req
     * @param createBoardDTO
     * @param file 
     * @returns void
     */
    @Post("/CreateBoard")
    @UseInterceptors(FileInterceptor("thumbnail",multerMemoryOptions))
    @UseGuards(JwtAccessTokenGuard)
    async createBoard(
        @Req() req: Request,
        @Body(ValidationPipe) createBoardDTO : CreateBoardDTO,
        @UploadedFile() file,
        
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined
        const board = await this.boardService.createBoard(createBoardDTO,writer,file);
    }
    

    /**
     * getBoardMain(메인페이지 호출 API)
     * @param id 
     * @returns Board[]
     */
    @Post("/BoardMain")
    async getBoardMain(
        @Body("id") id: number
    ) : Promise<Board[]>{
        const status : number = 0;
        
        return await this.boardService.getBoardMain(id);
    }
    /**
     * getBoardPersonal(개인페이지 호출API)
     * @param id 
     * @returns Board[]
     */
    @Post("/BoardPersonal")
    @UseGuards(JwtAccessTokenGuard)
    async getBoardPersonal(
        @Req() req: Request,
        @Body() page: number
    ){
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined
        
        const board = await this.boardService.getBoardPersonal(page,writer);
        const tagCount = await this.boardService.tagCount(writer);
        
        const boardAndTag = {
            board,
            tagCount
        }
        console.log(board);
        

        return boardAndTag;
    }

    /**
     * getBoardById(상세 페이지 호출 API)
     * @param id 
     * @returns Board
     */
    @Get("/BoardView")
    async getBoardById(
        @Query('board_id') id : number
    ) : Promise<Board>{
        this.boardService.viewUp(id);
        return await this.boardService.getBoardById(id);
    }
    
    /**
     * updateBoard(게시물 업데이트 API)
     * @param id 
     * @param updateBoardDTO 
     * @returns void
     */

    @Patch("BoardUpdate")
    @UseGuards(JwtAccessTokenGuard)
    async updateBoard(
        @Req() req: Request,
        @Body("id") id : number,
        @Body() UpdateBoardDTO : UpdateBoardDTO
    ) : Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined

        const board = await this.boardService.updateBoard(UpdateBoardDTO, id);
    }

    /**
     * deleteBoard(게시물 삭제 API)
     * @param id 
     * @returns void
     */
    @Patch("BoardDelete")
    @UseGuards(JwtAccessTokenGuard)
    async deleteBoard(
        @Req() req: Request,
        @Body("id") id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;

        id = await this.boardService.CheckingWriter(id, writer);
        
        const board = await this.boardService.deleteBoard(id);
        
        
    }


    /**
     * createComment(댓글 생성 API)
     * @param createCommentDTO 
     * @returns void
     */
    @Post("/CreateComment")
    @UseGuards(JwtAccessTokenGuard)
    async createComment(
        @Req() req: Request,
        @Body(ValidationPipe) createCommentDTO : CreateCommentDTO
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined

        const comment = await this.commentService.createComment(createCommentDTO,writer);
    }
    
    /**
     * getCommentById(댓글 호출 API)
     * @param id 
     * @returns Comment[]
     */
    @Post("Comment")
    async getCommentById(
        @Body("board_id") id : number
    ): Promise<Comment[]>{
        return await this.commentService.getCommentByBoardId(id);
    }
    
    /**
     * deleteCommentById(댓글 삭제 API)
     * @param comment_id
     * @returns void
     */
    @Patch("DeleteComment")
    @UseGuards(JwtAccessTokenGuard)
    async deleteCommentById(
        @Req() req : Request,
        @Body("comment_id") id : number
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;

        id = await this.boardService.CheckingWriter(id, writer);

        const comment = await this.commentService.deleteCommentById(id);
    }

    /**
     * createReComment(답글 생성 API)
     * @param createReCommentDTO 
     * @returns void
     */
    @Post("/CreateReComment")
    @UseGuards(JwtAccessTokenGuard)
    async createReComment(
        @Req() req :Request,
        @Body(ValidationPipe) createReCommentDTO : CreateReCommentDTO
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined
        user.currentRefreshToken = undefined

        const reComment = this.reCommentService.createReComment(createReCommentDTO,writer);
        
    }
    /**
     * getReCommentById(답글 호출 API)
     * @param id 
     * @returns ReComment[]
     */
    @Post("ReComment")
    async getReCommentById(
        @Body("comment_id") id : number
    ): Promise<ReComment[]>{
        return this.reCommentService.getReCommentByCommentId(id);
    }

    /**
     * deleteReCommentById(답글 삭제 API)
     * @param id 
     * @returns void
     */
    @Patch("DeleteReComment")
    @UseGuards(JwtAccessTokenGuard)
    async deleteReCommentById(
        @Req() req : Request,
        @Body("recomment_id") id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;

        id = await this.boardService.CheckingWriter(id, writer);

        const recomment = await this.reCommentService.deleteReCommentById(id);

    }
    
    
    

}
