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

    /**
     * getBoardMain(메인 페이지 쿼리)
     * @param skip 
     * @param take 
     * @param writer 
     * @param board_status 
     * @returns 
     */
     async getBoardMain(skip : number , take: number, board_status : number[],login_id : number){
        const board = await this.createQueryBuilder("board")
        
        .leftJoin("board.tags","tag")
        .leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${login_id}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image","users.techStack","users.socialUrl"])
        .addSelect(["likes"])
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    }
    /**
     * getBoardMainofTitle(게시물 제목 검색 기능)
     * @param skip 
     * @param take 
     * @param board_status 
     * @param title 
     * @returns Board[]
     */
    async getBoardMainofTitle(page:number , title : string){

        const board_status : number[]  = [0] ;

        //페이지네이션
        const limit : number  = 15 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number  = pageVale * limit;
        const take : number = skip + limit;

        
        let board = await this.createQueryBuilder("board")
        .leftJoin("board.tags","tag")
        .leftJoin("board.writer","users")
        .leftJoin("board.likes","likes")
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image","users.techStack","users.socialUrl"])
        .addSelect(["likes"])
        .where(`board.title LIKE "%${title}%"`)
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()

        return board;
    }

    async getBoardMainTag(skip : number , take: number, board_status : number[], tag_name : string[],login_id : number){
        let board_id = await this.getBoardMainTagid(skip,take,board_status,tag_name,login_id);
        let tag_id = board_id.map(row=>row.id);
        
        const board = await this.createQueryBuilder("board")
        .leftJoin("board.tags","tag")
        .leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${login_id}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image","users.techStack","users.socialUrl"])
        .addSelect(["likes"])
        .where(`board.id IN(:tag_id)`,{tag_id})
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    }
    async getBoardMainTagid(skip : number , take: number, board_status : number[], tag_name : string[],login_id : number){
        
        const board = await this.createQueryBuilder("board")
        .leftJoin("board.tags","tag")
        .select(["board.id"])
        .where(`tag.tag_name IN(:tag_name)`,{tag_name})
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .groupBy("board.id")
        .having(`Count(DISTINCT tag.tag_name) = ${tag_name.length} `)
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    }
    /**
     * getBoardMain(상세 페이지 쿼리)
     * @param id 
     * @returns 
     */
     async getBoardView(id : number){
        const board = await this.createQueryBuilder("board")
        
        .leftJoin("board.tags","tag")
        .leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${id}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        .addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image","users.techStack","users.socialUrl"])
        .addSelect(["likes"])
        .andWhere(`board.id = :id`,{id}) 
        .getOne()
        
        return board ;
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

    


    
    /**
     * getBoardPersonal(개인페이지 쿼리)
     * @param skip 
     * @param take 
     * @param writer 
     * @param board_status 
     * @returns 
     */
    async getBoardPersonal(page :number, writer : number){
       //status 공개, 비공개
       const board_status : number[]  = [0,2] ;
        
       //페이지네이션
       const limit : number = 15 ; 
       const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
       const skip : number  = pageVale * limit;
       const take : number = skip + limit;

        const board = await this.createQueryBuilder("board")
        
        .leftJoin("board.tags","tag")
        //.leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${writer}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        .addSelect(["likes"])
        //.addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image"])
        .where(`board.writer = :writer`,{writer})
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    } 

    /**
     * getBoardGuest(게스트용 페이지 쿼리)
     * @param skip 
     * @param take 
     * @param writer 
     * @param board_status 
     * @returns 
     */
    async getBoardGuest(page :number, writer : number){
        //status 공개
        const board_status : number[] = [0] ;

        //페이지네이션
        const limit : number = 15 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number= pageVale * limit;
        const take : number = skip + limit;

        const board = await this.createQueryBuilder("board")
        
        .leftJoin("board.tags","tag")
        //.leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${writer}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        .addSelect(["likes"])
        //.addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image"])
        .where(`board.writer = :writer`,{writer})
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    }

    /**
     * getBoardPersonalTag(개인페이지 태그 검색 쿼리)
     * @param skip 
     * @param take 
     * @param writer 
     * @param tag_name 
     * @param board_status 
     * @returns 
     */
    async getBoardPersonalTag(page: number, writer : number, tag_name : string[]){
        const board_status : number[]  = [0,2] ;
        
        const limit : number = 15 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number= pageVale * limit;
        const take : number = skip + limit;

        const board = await this.createQueryBuilder("board")
        
        .leftJoin("board.tags","tag")
        //.leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${writer}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        
        //.addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image"])
        .addSelect(["likes"])
        .where(`tag.tag_name IN(:tag_name) `,{tag_name})
        .andWhere(`board.writer = :writer`,{writer})
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        //.andWhere(`likes.user_id = :writer`,{writer})
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    }

    /**
     * getBoardGuestTag(게스트페이지 태그 검색 쿼리)
     * @param skip 
     * @param take 
     * @param writer 
     * @param tag_name 
     * @param board_status 
     * @returns 
     */
    async getBoardGuestTag(page: number, writer : number, tag_name : string[]){
        const board_status : number[]  = [0] ;
        
        //페이지네이션
        const limit : number = 15 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number= pageVale * limit;
        const take : number = skip + limit;

        const board = await this.createQueryBuilder("board")
        .leftJoin("board.tags","tag")
        //.leftJoin("board.writer","users")
        .leftJoin("board.likes","likes",`likes.user_id =  ${writer}`)
        .select(["board.id","board.title","board.description","board.content","board.thumbnail","board.views","board.date","board.board_status","board.likes_count"])
        .addSelect(["tag"])
        //.addSelect(["users.id","users.userid","users.username","users.email","users.role","users.avatar_image"])
        .addSelect(["likes"])
        .where(`tag.tag_name IN(:tag_name) `,{tag_name})
        .andWhere(`board.writer = :writer`,{writer})
        .andWhere(`board.board_status IN(:board_status)`,{board_status}) 
        .orderBy("board.id","DESC")
        .skip(skip)
        .take(take)
        .getMany()
        
        return board ;
    }

    /**
     * 
     * @param id 
     */
    async getUserIdInBoard(id : number ){
        const userid = await this.createQueryBuilder("board")
        .leftJoin("board.writer","users")
        .select(["board.id"])
        .addSelect(["users.id"])
        .where(`board.id = ${id}`)
        .getOne();

        return userid;
    }

}//end of BoardRepository

