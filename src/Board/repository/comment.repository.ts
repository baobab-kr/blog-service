import { EntityRepository, Repository, getConnection } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDTO } from './dto/create-board.dto';


@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment>{
    /**
     * createComment(댓글생성)
     * @param createCommentDTO 
     * @returns 
     */
    async createComment(createCommentDTO:CreateCommentDTO, writer : number){
        
        const {board_id, content, comment_status} = createCommentDTO;
        const date : Date = new Date();
        const comment = this.create({
             content, board_id, date,comment_status,writer
        });
        await this.save(comment);
        return comment;
    }//end of createCommnet
    
    
    async deleteCommentById(id : number){
        const status : number = 1 ;
        const idValue : number = Number(Object.values(id));

        const comment = await getConnection()
        .createQueryBuilder()
        .update(Comment)
        .set({
            comment_status : status
        })
        .where({id : `${idValue}`})
        .execute()

        return comment;
    }


}//end of CommentRepository