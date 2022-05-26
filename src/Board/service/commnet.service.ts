import { Injectable, NotFoundException } from '@nestjs/common';
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
    async getCommentByBoardId(board_id : number) : Promise<Comment[]>{
        console.log(board_id)
        const status : number[] = [0] ; // 활성화 상태
        
        const comment = await this.CommentRepository.getCommentById(board_id,status);

        /*
        const comment =  await this.CommentRepository.find({
            select : ["id", "writer", "content", "date"],
            relations : ["reComments"],
            where : {board_id : Number(Object.values(board_id)), comment_status : 0},
            
            
        });*/

        console.log(comment);
        
        
        return comment;
    }

    async deleteCommentById(id : number, writer : number) {
        return await this.CommentRepository.deleteCommentById(id,writer);
        
    }



}