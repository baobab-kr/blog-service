import { EntityRepository, getConnection, Repository } from "typeorm";
import { ReComment } from './entity/recomment.entity';
import { CreateReCommentDTO } from "./dto/create-board.dto";


@EntityRepository(ReComment)
export class ReCommentRepository extends Repository<ReComment>{
    
    async createReComment(createReCommentDTO:CreateReCommentDTO , writer:number){
        
        const {comment_id, content, recomment_status} = createReCommentDTO;
        const date : Date = new Date();
        const recomment = this.create({
            content, comment_id, date,writer, recomment_status
        });
        await this.save(recomment);
        return recomment;
    }//end of createCommnet


    async deleteReCommentById(id : number){
        const status : number = 1 ;
        const idValue: number = typeof id !== typeof "" ? Object.values(id)[0] : id
        
        const comment = await getConnection()
        .createQueryBuilder()
        .update(ReComment)
        .set({
            recomment_status : status
        })
        .where({id : `${idValue}`})
        .execute()

        return comment;
    }

}//end of CommentRepository

