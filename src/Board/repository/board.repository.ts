import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { Board } from './entity/board.entity';
import { CreateBoardDTO} from "./dto/create-board.dto";
import { UpdateBoardDTO } from "./dto/update-board.dto";
import { Tag } from "./entity/tag.entity";


@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
    /**
     * createBoard(게시물 생성 쿼리)
     * @param createBoardDTO 
     * @param thumbnail 
     * @returns 
     */
    async createBoard(createBoardDTO : CreateBoardDTO,writer:number, thumbnail : string){
        
        const {title, description,content,
            board_status} = createBoardDTO;
        const views : number = 0;
        const likes_count : number = 0;
        const date : Date = new Date()
        

        const board = this.create({
            title,
            description,
            content,
            thumbnail,
            writer,
            views,
            date,
            board_status,
            likes_count

        });

        await this.save(board);
        return board;
    }
    async getBoardMain(id:number){
        const status = 0 ;
        const limit : number = 5;
        const start_id : number = Number(Object.values(id));
        const end_id : number = start_id + limit;
        console.log(end_id);

        const board = await getRepository(Board)
        .createQueryBuilder("Board")
        .leftJoinAndSelect("Board.id", "id")
        .where(`board_status = ${status}`)
        //.limit(limit) 조인 사용하면 작동안함
        .getRawMany();
        
        /**
         * 
         * 


        .skip(start_id)
        .take(end_id)
        .select([
            "id",
            "title",
            "description",
            "thumbnail",
            "views",
            "board_status",
            "date",
            "likes_count"
        ])
        .leftJoin(
            (qb) =>
                qb
                    .from(Tag, 'Tag')
                    .select('COUNT(Tag.board_id)', 'TagCount')
                    .addSelect('like.policy_id', 'policy_id'),
            'L',
            'Board.id = L.board_id'
        )
        .addSelect('TagCount')

        .leftJoinAndSelect("Board.id", "id")
        .leftJoinAndSelect("Board.title", "title")
        .leftJoinAndSelect("Board.description", "description")
        .leftJoinAndSelect("Board.thumbnail", "thumbnail")
        .leftJoinAndSelect("Board.views", "views")
        .leftJoinAndSelect("Board.board_status", "board_status")
        .leftJoinAndSelect("Board.date", "date")
        .leftJoinAndSelect("Board.likes_count", "likes_count")
        .loadRelationCountAndMap("Board.tagCount","tag_name")
        .select([
            "id",
            "board_id",
            "tag_name",
            "Count(tag_name)"
        ])
         */
        return board;
    }
    
    async updateBoardById(id : number , UpdateBoardDTO : UpdateBoardDTO){
        
        const {title, description,content} = UpdateBoardDTO;
        const board = await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({
            title, description,content
        })
        .where(`id = ${id}`)
        .execute();
        

        return board;
        
    }
    async deleteBoardById(id : number){
        const status : number = 1;
        
        const board = await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({
            board_status : status
        })
        .where(`id = ${id}`)
        .execute();
        

        return board;
        
    }
    /*
    async getBoardById(id : number){
        
        const board = await getRepository(Board)
        .createQueryBuilder()
        .where("id = :id ", {id})
        .getOne();
        return board;
    }
    */
}//end of BoardRepository

