import { EntityRepository, Repository, getConnection } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDTO, CreateFilteringCommentDTO } from './dto/create-board.dto';
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
             content, board_id, date, comment_status, writer
        });
        const savedComment = await this.save(comment);
        const res = {
            comment_id: savedComment.id,
            content: savedComment.content
        }
        return res
    }//end of createCommnet

    /**
    * createComment(필터링댓글내용생성)
    * @param createFilteringCommentDTO 
    * @returns 
    */
    async createFilteringComment(comment_id:number, filteringContent: string){
        const savedComment = await this.findOne({id: comment_id});
        savedComment.content = filteringContent
        await this.save(savedComment)
    }//end of createFilteringCommnet
    
    async getCommentById(board_id : number,comment_status : number[], skip :number, take :number) : Promise<Comment[]>{
        const board_idValue :number = typeof board_id == typeof {} ?Number(Object.values(board_id)[0]) : Number(board_id);
        
        
        const comment = await this.createQueryBuilder("comment")
        .leftJoin("comment.writer","users")
        .select(["comment.id","comment.content","comment.date"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image","users.techStack","users.socialUrl"])
        .where("comment.board_id = :board_id",{board_id : board_idValue})
        .andWhere(`comment.comment_status IN(:comment_status)`,{comment_status})
        .skip(skip)
        .take(take)
        .getMany()

        return comment;
    }
    async getCommentCount(board_id : number,comment_status : number[]){
        const board_idValue :number = typeof board_id == typeof {} ?Number(Object.values(board_id)[0]) : Number(board_id);

        const comment = await this.createQueryBuilder("comment")
        .leftJoin("comment.writer","users")
        .select(["COUNT(comment.board_id) AS CommentCount"])
        .where("comment.board_id = :board_id",{board_id : board_idValue})
        .andWhere(`comment.comment_status IN(:comment_status)`,{comment_status})
        .groupBy()
        .getCount()

        //console.log(comment)
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