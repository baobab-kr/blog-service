import { EntityRepository, Repository, getConnection } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDTO } from './dto/create-board.dto';
import { Users } from 'src/users/entity/user.entity';


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
        const comment = await this.create({
             content, board_id, date,comment_status,writer
        });
        await this.save(comment);
    }//end of createCommnet
    
    async getCommentById(board_id : number, comment_status : number[]) : Promise<Comment[]>{
        const board_idValue :number = typeof board_id == typeof {} ?Number(Object.values(board_id)[0]) : Number(board_id);
        
        const comment = await this.createQueryBuilder("comment")
        .leftJoin("comment.writer","users")
        .select(["comment.id","comment.content","comment.date"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image"])
        .where("comment.board_id = :board_id",{board_id : board_idValue})
        .andWhere(`comment.comment_status IN(:comment_status)`,{comment_status})
        .getMany()

        return comment;
    }
    
    async deleteCommentById(id : number){
        const status : number = 1 ;
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
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