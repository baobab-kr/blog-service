import { EntityRepository, Repository, getRepository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { CommentRepository } from './comment.repository';


@EntityRepository(Tag)
export class TagRepository extends Repository<Tag>{
    
    async createTag(board_id : number, tag_name : string){
        const tag = this.create({
                board_id,
                tag_name
            })
        await this.save(tag);

        return tag;
        
    }

    async tagCount(board_id : number[]){
        const tag = getRepository(Tag)
        .createQueryBuilder()
        .select("tag_name")
        .addSelect("Count(tag_name) as tag_count")
        .where("board_id IN (:board_id)", { board_id: board_id })
        .groupBy("tag_name")
        .getRawMany();

        return tag;
    }

}