import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '../repository/entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { BoardRepository } from '../repository/board.repository';
import { CreateBoardDTO } from '../repository/dto/create-board.dto';
import { UpdateBoardDTO } from '../repository/dto/update-board.dto';
import { Tag } from '../repository/entity/tag.entity';
import { TagRepository } from '../repository/tag.repository';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository,
        @InjectRepository(TagRepository)
        private tagRepository : TagRepository

    ){}
    
    
    /**
     * createBoard(게시글 생성 함수)
     * @param createBoardDTO 
     * @param file 
     * @returns void
     */
    async createBoard(createBoardDTO : CreateBoardDTO,writer:number, file) : Promise <void>{
        //file upload
        let uploadPath = "";
        if(!(file === undefined)){
            const fileName = Date.now() + file.originalname;
            uploadPath = `C:/File/baobabnamu/upload/${fileName}`;
            fs.writeFileSync(uploadPath, file.buffer);
        }        
        //board 생성
        const board = await this.boardRepository.createBoard(createBoardDTO,writer,uploadPath);
        
        if(board === undefined){
            throw new HttpException('게시판 생성 실패', HttpStatus.CONFLICT)
        }
        
        
        //tag 생성
        if(!(createBoardDTO.tag_name === undefined)){
            await this.createTag(board.id, createBoardDTO.tag_name);
        }
        

    }
    /**
     * getBoardMain(메인페이지 호출 함수)
     * @param id 
     * @returns Board[]
     */
    async getBoardMain(id:number) : Promise<Board[]> {

        const status = 0 ;
        const limit = 15 ;
        const skip : number = Number(Object.values(id));
        const take : number = skip + limit;

        //페이지 호출
        const board = await this.boardRepository.find({
        
            select : ["id","title","description","content","thumbnail","views","date","board_status","likes_count"],
            where : {board_status : status},
            relations : ["tags"],
            skip : skip,
            take : take

        })


        
        

        return board;
    }
    /**
     * getBoardPersonal(개인페이지 호출 함수)
     * @param skip 
     * @param writer 
     * @returns 
     */
    async getBoardPersonal(page:number, writer : number) : Promise<Board[]> {

        const status = [0,1] ;
        const limit = 15 ;
        const skip : number = Number(Object.values(page));
        const take : number = skip + limit;
        //this.getBoardById(id);
        //const board = await this.boardRepository.getBoardMain(id);
        const board = await this.boardRepository.find({
        
            select : ["id","title","description","content","thumbnail","views","date","board_status","likes_count"],
            where : [{board_status : 0, writer : writer},{board_status : 1}],
            relations : ["tags"],
            skip : skip,
            take : take

        })
         
        return board;
    }


    /**
     * getBoardById(상세페이지 호출 함수)
     * @param id 
     * @returns 
     */
    async getBoardById(id : number) : Promise<Board>{
        
        const status : number = 0;
        const board = await this.boardRepository.findOne(
            {
                select : ["id","title","description","content","thumbnail","views","date","board_status","likes_count"],
                where : {board_status : status, id:`${id}`},
                relations : ["tags"]
            }
        );
        

        if(board === undefined){
            throw new HttpException('게시물 호출 실패', HttpStatus.CONFLICT);
        }
        /*
            상세페이지 이전글 이후글
            const beforeBoard = await this.boardRepository.findOne(id-1);
            const afterBoard = await this.boardRepository.findOne(id+1);
            
            let board ;
            if(isEmpty(beforeBoard)){
                board = {"beforBoardTitle" : `definedBoard`}
                Object.assign(found,board)
            }else{
                board = {"beforBoardTitle" : `${beforeBoard.title}`};
                Object.assign(found,board)
            }
            if(isEmpty(afterBoard)){
                board = {"afterBoardTitle" : `definedBoard`}
                Object.assign(found,board)
            }else{
                board = {"afterBoardTitle" : `${afterBoard.title}`};
                Object.assign(found,board)
            }
        */
        

        return board;
    }
    
    /**
     * updateBoard(게시물 수정 함수)
     * @param id 
     * @param UpdateBoardDTO 
     * @returns void
     */
    async updateBoard(UpdateBoardDTO:UpdateBoardDTO, id :number) : Promise<void>{
        //const update = await this.boardRepository.save({id : id,UpdateBoardDTO})
        /*
        const board = await this.boardRepository.findOne(id);
        console.log(Object.values(UpdateBoardDTO.title));
        board.title = String(Object.values(UpdateBoardDTO.title));
        board.description = String(UpdateBoardDTO.description);
        board.content = String(UpdateBoardDTO.content);
        board.board_status = Number(UpdateBoardDTO.board_status);
        */
        const board = await this.boardRepository.updateBoardById(id,UpdateBoardDTO);
        
        //태그 수정
        const tags_id = await this.tagRepository.find({board_id : Number(id)})
        await this.tagRepository.delete({board_id : Number(id)});
        if(UpdateBoardDTO.tag_name.length > 0){
            const tag = this.createTag(id,UpdateBoardDTO.tag_name);
        }
        
        
    }
    async deleteBoard(id : number) : Promise<void> {
        const board = await this.boardRepository.deleteBoardById(id);

    }

    //내부 사용 함수

    /**
     * viewUp(조회수 증가 함수)
     * @param id 
     * @returns void
     */
    public async viewUp(id : number) : Promise<void>{
        const board = await this.boardRepository.findOne(id);
        board.views += 1;
        await this.boardRepository.save(board);
        
    }

    /**
     * createTag(태그 생성 함수)
     * @param id 
     * @param tags_name 
     * @return void
     */
    private async createTag(id : number, tags_name) : Promise<void>{
        const board_id : number = id;
        let tag ;

        if(tags_name[0].length > 0 ){
            const tags : string[] = tags_name;
            
            for(const tag_name of tags_name){
                tag = await this.tagRepository.createTag(board_id, tag_name);
            }
            
            
        }
    }
    
    public async tagCount(writer : number){
        const board_id = await this.getBoardByUserId(writer);
        
        return await this.tagRepository.tagCount(board_id);
    }
    async getBoardByUserId(writer : number) : Promise<number[]>{
        const board =await this.boardRepository.find({
            select : ["id"],
            where : {writer}
        })
        let board_id = [];
        board.forEach((e)=>{
            board_id.push(e.id);
        });
        return board_id;
    }

    async CheckingWriter(id: number, writer : number){
        const board_id = await this.getBoardByUserId(writer);
        
        if(!(board_id.indexOf(Number(id)) > -1)){
            throw new HttpException('권한이 없는 사용자입니다.', HttpStatus.CONFLICT)
        }
        return id;
    }
    
}
