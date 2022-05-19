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
    @HttpCode(200)
    async getBoardMain(
        @Body() page: number
    ) : Promise<Board[]>{
        
        return await this.boardService.getBoardMain(page);
    }
    /**
     * getBoardPersonal(개인페이지 호출 API)
     * @param id 
     * @returns Board[]
     */
    @Post("/BoardPersonal")
    @HttpCode(200)
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
    @Post("/BoardView")
    @HttpCode(200)
    async getBoardById(
        @Body() id : number
    ) : Promise<Board>{
        await this.boardService.CheckBoardById(id);
        await this.boardService.viewUp(id);
        return await this.boardService.getBoardById(id);
    }
    
    /**
     * updateBoard(게시물 업데이트 API)
     * @param id 
     * @param updateBoardDTO 
     * @returns void
     */

    @Post("BoardUpdate")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    async updateBoard(
        @Req() req: Request,
        @Body() id : number,
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
    @Post("BoardDelete")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    async deleteBoard(
        @Req() req: Request,
        @Body() id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;

        await this.boardService.CheckingWriter(id, writer);
        
        const board = await this.boardService.deleteBoard(id);
        
        
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

        const comment = await this.commentService.createComment(createCommentDTO,writer);
    }
    
    /**
     * getCommentById(댓글 호출 API)
     * @param id 
     * @returns Comment[]
     */
    @Post("Comment")
    @HttpCode(200)
    async getCommentById(
        @Body() board_id : number
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
        @Body() comment_id : number
    ) : Promise<void> {
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;


        const comment = await this.commentService.deleteCommentById(comment_id,writer);
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
    @HttpCode(200)
    async getReCommentById(
        @Body() comment_id : number
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
        @Body() reComment_id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;

        const recomment = await this.reCommentService.deleteReCommentById(reComment_id);

    }
    
    /**
     * LikeBoard (좋아요)
     * @param req 
     * @param id 
     */
    @Post("Like")
    @HttpCode(200)
    @UseGuards(JwtAccessTokenGuard)
    async LikeBoard(
        @Req() req : Request,
        @Body() id : number
    ):Promise<void>{
        const user: any = req.user;
        const writer : number = user.id;
        user.password = undefined;
        user.currentRefreshToken = undefined;

        await this.boardService.CheckingWriter(id, writer);

        const like = await this.boardService.LikeBoard(id,writer);

    }
    
    
    

}
