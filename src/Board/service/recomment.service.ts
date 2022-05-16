import { Injectable, NotFoundException } from '@nestjs/common';
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
    async createReComment(createReCommentDTO: CreateReCommentDTO , writer : number ) : Promise<ReComment>{
        return await this.ReCommentRepository.createReComment(createReCommentDTO,writer);
    }
    /**
     * getReCommentByCommentId(답글 호출 함수)
     * @param id 
     * @returns 
     */
    async getReCommentByCommentId(id : number) : Promise<ReComment[]>{
        
        const status : number = 0 ; // 활성화 상태
        const commnet_id : string  =  String(Object.values(id))

        const reComment =  await this.ReCommentRepository.find({
            select : ["id","writer","content","date"],
            where : {
                comment_id : commnet_id, 
                recomment_status : status
            }
        });
        
        
        //console.log(comment);
        
        return reComment;
    }


    async deleteReCommentById(id : number) {
        return await this.ReCommentRepository.deleteReCommentById(id);
        
    }
    
}