import { EntityRepository, getConnection, Repository } from "typeorm";
import { ReComment } from './entity/recomment.entity';
import { CreateReCommentDTO } from "./dto/create-board.dto";


@EntityRepository(ReComment)
export class ReCommentRepository extends Repository<ReComment>{
    
    async createReComment(createReCommentDTO:CreateReCommentDTO , writer:number):Promise<void>{
        
        const {comment_id, content, recomment_status} = createReCommentDTO;
        const date : Date = new Date();
        const recomment = this.create({
            content, comment_id, date,writer, recomment_status
        });
        await this.save(recomment);
        
    }//end of createCommnet
    async getReCommentById(comment_id : number, recomment_status : number[],skip : number ,take:number) : Promise<ReComment[]>{
        const comment_idValue :number = typeof comment_id == typeof {} ?Number(Object.values(comment_id)[0]) : Number(comment_id);
        


        const comment = await this.createQueryBuilder("re_comment")
        .leftJoin("re_comment.writer","users")
        .select(["re_comment.id","re_comment.content","re_comment.date"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image"])
        .where("re_comment.comment_id = :comment_id",{comment_id : comment_idValue})
        .andWhere(`re_comment.recomment_status IN(:recomment_status)`,{recomment_status})
        .skip(skip)
        .take(take)
        .getMany()

        return comment;
    }
    async getReCommentCount(comment_id : number, recomment_status : number[]) {
        const comment_idValue :number = typeof comment_id == typeof {} ?Number(Object.values(comment_id)[0]) : Number(comment_id);
        


        const comment = await this.createQueryBuilder("re_comment")
        .leftJoin("re_comment.writer","users")
        .select(["COUNT(*)"])
        .where("re_comment.comment_id = :comment_id",{comment_id : comment_idValue})
        .andWhere(`re_comment.recomment_status IN(:recomment_status)`,{recomment_status})
        .groupBy()
        .getCount();

        return comment;
    }

    async deleteReCommentById(id : number) :Promise<void> {
        const status : number = 1 ;
        
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        const comment = await getConnection()
        .createQueryBuilder()
        .update(ReComment)
        .set({
            recomment_status : status
        })
        .where({id : `${idValue}`})
        .execute()

    }

}//end of CommentRepository

