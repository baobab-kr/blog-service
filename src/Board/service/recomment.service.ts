import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from '../repository/board.repository';
import { CreateReCommentDTO } from '../repository/dto/create-board.dto';

import { CommentRepository } from '../repository/comment.repository';
import { ReCommentRepository } from '../repository/recomment.repository';
import { ReComment } from '../repository/entity/recomment.entity';


@Injectable()
export class ReCommentService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository,
        @InjectRepository(CommentRepository)
        private CommentRepository : CommentRepository,
        @InjectRepository(ReCommentRepository)
        private ReCommentRepository : ReCommentRepository

    ){}
    /**
     * createReComment(답글 생성 함수)
     * @param createReCommentDTO 
     * @returns 
     */
    async createReComment(createReCommentDTO: CreateReCommentDTO , writer : number ) : Promise<void>{
        await this.ReCommentRepository.createReComment(createReCommentDTO,writer);
    }
    /**
     * getReCommentByCommentId(답글 호출 함수)
     * @param id 
     * @returns 
     */
    async getReCommentByCommentId(comment_id : number , page : number) : Promise<ReComment[]>{
        
        const status : number[] = [0] ; // 활성화 상태
        const limit : number = 10 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number  = pageVale * limit;
        const take : number = skip + limit;

        const reComment = await this.ReCommentRepository.getReCommentById(comment_id,status,skip,take);


        
        
        return reComment;
    }
    async getReCommentPageLength(comment_id : number){
        const status : number[] = [0] ; // 활성화 상태
        const limit = 10;

        const reComment = await this.ReCommentRepository.getReCommentCount(comment_id ,status);

        return Math.floor(reComment/limit);
    }


    async deleteReCommentById(id : number): Promise<void> {
        await this.ReCommentRepository.deleteReCommentById(id);
        
    }
    async getReCommentByUserId(id : number , writer : number){
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        
        const recomment = await this.ReCommentRepository.findOne({
            where : {writer : writer, id : idValue}
        })


        if(!recomment){
            throw new HttpException('권한이 없는 사용자입니다.', HttpStatus.CONFLICT)
        
        }
    }
}