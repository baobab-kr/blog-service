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

    async tagCount(board_id : number[],board_status:number[]){


        const tag = await this.createQueryBuilder("tag")
        .leftJoin("tag.board_id","board")
        .select("tag.tag_name as tag_name")
        .addSelect("Count(tag.tag_name) as tag_count")
        .where("tag.board_id IN(:board_id)", { board_id: board_id })
        .andWhere(`board.board_status IN(${board_status})`)
        .groupBy("tag.tag_name")
        .getRawMany();

        return tag;
    }

}