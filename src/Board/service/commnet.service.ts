import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from '../repository/board.repository';
import { CreateCommentDTO } from '../repository/dto/create-board.dto';
import { CommentRepository } from '../repository/comment.repository';
import { ReCommentRepository } from '../repository/recomment.repository';
import { Comment } from '../repository/entity/comment.entity';


@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository,
        @InjectRepository(CommentRepository)
        private CommentRepository : CommentRepository,
        @InjectRepository(ReCommentRepository)
        private ReCommentRepository : ReCommentRepository

    ){}
    /**
     * CreateCommnet(댓글 생성 함수)
     * @param createCommentDTO 
     * @returns CommentData
     */
    async createComment(createCommentDTO: CreateCommentDTO, writer : number){
        await this.CommentRepository.createComment(createCommentDTO,writer);
    }

    /**
     * getCommentByBoardId(댓글 확인 함수)
     * @param id 
     * @returns id, writer, content, date
     */
     async getCommentByBoardId(board_id : number , page : number) : Promise<Comment[]>{

        const status : number[] = [0] ; // 활성화 상태
        
        const limit : number = 10 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number  = pageVale * limit;
        const take : number = skip + limit;

        const comment = await this.CommentRepository.getCommentById(board_id,status,skip,take);
        
        

        
        
        return comment;
    }
    
    async getCommentPageCount(board_id : number) {

        const status : number[] = [0] ; // 활성화 상태
        const limit = 10;
        
        const comment = await this.CommentRepository.getCommentCount(board_id,status);
        

        
        
        return Math.floor(comment/limit);
    }
    async getCommentCount(board_id : number) {

        const status : number[] = [0] ; // 활성화 상태
        const limit = 10;
        
        const comment = await this.CommentRepository.getCommentCount(board_id,status);
        

        
        
        return comment;
    }



    async deleteCommentById(id : number) {
        await this.CommentRepository.deleteCommentById(id);
        
    }
    async getCommentByUserId(id : number , writer : number){
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        
        const comment = await this.CommentRepository.findOne({
            where : {writer : writer, id : idValue}
        })

        if(!comment){
            throw new HttpException('권한이 없는 사용자입니다.', HttpStatus.CONFLICT)
        
        }
    }



}