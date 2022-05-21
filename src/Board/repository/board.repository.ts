import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { Board } from './entity/board.entity';
import { CreateBoardDTO} from "./dto/create-board.dto";
import { UpdateBoardDTO } from "./dto/update-board.dto";
import { Users } from '../../users/entity/user.entity';
import { Tag } from 'src/Board/repository/entity/tag.entity';


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
    async getBoardMain(skip:number){
        const status = 0 ;
        const limit : number = 15;
        const take : number = skip + limit;

        const board = await getRepository(Board)
        .createQueryBuilder()
        .leftJoinAndSelect("Board.id", "id")
        .leftJoinAndSelect("Board.title", "title")
        .leftJoinAndSelect("Board.description", "description")
        .leftJoinAndSelect("Board.thumbnail", "thumbnail")
        .leftJoinAndSelect("Board.views", "views")
        .leftJoinAndSelect("Board.board_status", "board_status")
        .leftJoinAndSelect("Board.date", "date")
        .leftJoinAndSelect("Board.likes_count", "likes_count")
        
        .where(`board_status = ${status}`)
        
        .skip(skip)
        .take(take)
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
        let {title, description,content} = await getConnection()
        .createQueryBuilder()
        .select(["title","description","content"])
        .where(`id = ${id}`)
        .getOne();

        title = UpdateBoardDTO.title;
        description = UpdateBoardDTO.description;
        content = UpdateBoardDTO.content;
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        
        const board = await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({
            title, description,content
        })
        .where(`id = ${idValue}`)
        .execute();
        

        return board;
        
    }
    async deleteBoardById(id : number){
        const status : number = 1;
        
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        const board = await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({
            board_status : status
        })
        .where(`id = ${idValue}`)
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

