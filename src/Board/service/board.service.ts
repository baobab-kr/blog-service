import { ConsoleLogger, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '../repository/entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { BoardRepository } from '../repository/board.repository';
import { CreateBoardDTO } from '../repository/dto/create-board.dto';
import { UpdateBoardDTO } from '../repository/dto/update-board.dto';
import { Tag } from '../repository/entity/tag.entity';
import { TagRepository } from '../repository/tag.repository';
import { isEmpty, IsNotEmpty } from 'class-validator';
import { Likes } from '../repository/entity/like.entity';
import { Repository, Like, In } from 'typeorm';
import { Users } from 'src/users/entity/user.entity';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import * as dayjs from 'dayjs'
import { CommentRepository } from '../repository/comment.repository';
import { ReCommentRepository } from '../repository/recomment.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository,
        @InjectRepository(TagRepository)
        private tagRepository : TagRepository,
        @InjectRepository(Likes) 
        private likesRepository : Repository<Likes>,
        @InjectRepository(Users)
        private usersRepository : Repository<Users>,
        private commentRepository : CommentRepository,
        private reCommentRepository : ReCommentRepository,
        
    ){}
    
    
    /**
     * createBoard(게시글 생성 함수)
     * @param createBoardDTO 
     * @param file 
     * @returns void
     */
    async createBoard(createBoardDTO : CreateBoardDTO, writer:number, file?) : Promise <void>{
        //file upload
        const thumnailName = file == undefined? "" : await this.uploadThumbnail(file);    
        
        //board 생성
        const board = await this.boardRepository.createBoard(createBoardDTO,writer,thumnailName);
        
        if(board === undefined){
            throw new HttpException('게시판 생성 실패', HttpStatus.CONFLICT)
        }
        
        
        //tag 생성
        if(!(createBoardDTO.tag_name === undefined)){
            if(createBoardDTO.tag_name.length > 0){
                await this.createTag(board.id, createBoardDTO.tag_name);
            }
        }
        

    }


    getBlobClient(imageName:string):BlockBlobClient{
        const blobClientService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTIONS);
        const containerClient = blobClientService.getContainerClient(process.env.AZURE_BLOB_CONTAINER_NAME);
        const blobClient = containerClient.getBlockBlobClient(imageName);
        return blobClient;
    }

    /**
     * uploadThumbnail(썸네일 업로드)
     * @param file 
     * @returns 
     */
    async uploadThumbnail(file){
        let fileoriginalname = file.originalname.trim().replace(/(.png|.jpg|.jpeg|.gif|\s)$/gi,'');
        const encryptedFileName = bcrypt.hashSync(fileoriginalname, 10); 
        let fileName = encryptedFileName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '');

        const fileuploadtime = dayjs().format("YYMMDDHHmmss");
        const uploadFileName = "D" + fileuploadtime + fileName;
        const blobClient = this.getBlobClient(uploadFileName);
        await blobClient.uploadData(file.buffer);
        
        return uploadFileName;
    }


    /**
     * getThumbnail(썸네일 다운로드)
     * @param fileName 
     * @returns 
     */
    async getThumbnail(fileName){
        var blobClient = this.getBlobClient(fileName);
        const isExist:Boolean = await blobClient.exists();
        if (!isExist) {
          blobClient = this.getBlobClient('profile-default');
        }
        var blobDownloaded = await blobClient.download();
        return blobDownloaded.readableStreamBody;
      }

    /**
     * getBoardMain(메인페이지 호출 함수)
     * @param id 
     * @returns Board[]
     */
    async getBoardMain(page:number, login_id? : number) : Promise<Board[]> {

        //status공개 
        const status : number[]  = [0] ;

        //페이지네이션
        const limit : number  = 15 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number  = pageVale * limit;
        const take : number = skip + limit;

       
        const board = await this.boardRepository.getBoardMain(skip,take,status,login_id == undefined? -1 : login_id);
        

        //페이지 호출
        

        return board;
    }
    /**
     * getBoardMainTag(메인페이지 태그검색 함수)
     * @param id 
     * @returns Board[]
     */
     async getBoardMainTag(page:number, tag : string[] , login_id? : number) : Promise<Board[]> { 
        //status공개 
        const status : number[]  = [0] ;

        await this.CheckTag(tag[0]);
        

        //페이지네이션
        const limit : number  = 15 ; 
        const pageVale : number = typeof page == typeof {} ?Number(Object.values(page)[0]) : Number(page);
        const skip : number  = pageVale * limit;
        const take : number = skip + limit;

        //페이지 호출
        const board = await this.boardRepository.getBoardMainTag(skip,take,status,tag,login_id == undefined? -1 : login_id);
        
        
        

        return board;
    }
    async getBoardMainofTitle(page:number, title : string){

        

        const board = await this.boardRepository.getBoardMainofTitle(page, title)

        return board;
    }
    /**
     * getBoardPersonal(개인페이지 호출 함수)
     * @param page 
     * @param writer 
     * @returns 
     */
     async getBoardPersonal(page:number, user_id : number) : Promise<Board[]> {

        const board = await this.boardRepository.getBoardPersonal(page, user_id)


        return board;
    }
    /**
     * getBoardGuest(게스트용 개인페이지 호출 함수)
     * @param page 
     * @param writer 
     * @returns 
     */
    async getBoardGuest(page:number, user_id : number) : Promise<Board[]> {

        const board = await this.boardRepository.getBoardGuest(page, user_id)
        
        return board;
    }

    
    /**
     * getBoardPersonalTag(개인페이지 태그 검색API)
     * @param page 
     * @param writer 
     * @param tag_name
     * @returns 
     */
    async getBoardPersonalTag(page:number, writer : number, tag_name : string[]):Promise<Board[]>{
 

        const board = await this.boardRepository.getBoardPersonalTag(page, writer, tag_name);

        return board;
    }

    /**
     * getBoardGuestTag(게스트 페이지 태그 검색API)
     * @param page 
     * @param writer 
     * @param tag_name
     * @returns 
     */
     async getBoardGuestTag(page:number, writer : number, tag_name : string[]):Promise<Board[]>{

        
        const board = await this.boardRepository.getBoardGuestTag(page, writer, tag_name);


        return board;
    }


    /**
     * getBoardById(상세페이지 호출 함수)
     * @param id 
     * @returns 
     */
    async getBoardById(id : number , login_id? : number) : Promise<Board>{

        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        const status : number = 0;

        const board = await this.boardRepository.getBoardView(id);
        

        if(board === undefined){
            throw new HttpException('게시물 호출 실패', HttpStatus.CONFLICT);
        }
        

        return board;
    }
    
    /**
     * updateBoard(게시물 업데이트 함수)
     * @param id 
     * @param UpdateBoardDTO 
     * @returns void
     */
    async updateBoard(UpdateBoardDTO:UpdateBoardDTO,  file? : File) : Promise<void>{
        const id : number = UpdateBoardDTO.board_id;
        
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        let board = await this.boardRepository.findOne({
            where : {id : idValue}
        });
        if(UpdateBoardDTO.title!=undefined){
            board.title = UpdateBoardDTO.title;
        }if(UpdateBoardDTO.description!=undefined){
            board.description = UpdateBoardDTO.description;
        }if(UpdateBoardDTO.content!=undefined){
            board.content = UpdateBoardDTO.content;
        }if(UpdateBoardDTO.board_status != undefined){
            board.board_status = UpdateBoardDTO.board_status;
        }if(file != undefined){
            const thumnailName = file == undefined? "" : await this.uploadThumbnail(file);
            board.thumbnail = thumnailName;

        }

        //태그 수정
        if(UpdateBoardDTO.tag_name!=undefined){
            if(UpdateBoardDTO.tag_name.length > 0){
                    const tags_id = await this.tagRepository.find({board_id : Number(idValue)})
                
                    await this.tagRepository.delete({board_id : Number(idValue)});
                    
                    const tag = this.createTag(id,UpdateBoardDTO.tag_name);
                }
            }
        await this.boardRepository.save(board);
        
        
        
        
        
        
    }
    /**
     * deleteBoard(게시물 삭제 함수)
     * @param id 
     */
    async deleteBoard(id : number) : Promise<void> {
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        await this.tagRepository.delete({board_id : Number(idValue)});
                
        const board = await this.boardRepository.deleteBoardById(id);

    }

    /**
     * delete_all_board_in_user(게시물 전체삭제 API)
     * 
     * @param user_id 
     */
    async delete_all_board_in_user(user_id : number){
        const board  = await this.boardRepository.createQueryBuilder("board")
        .select(["board.id"])
        .where(`board.writer = ${user_id}`)
        .getMany();

        let board_id = [];
        let cnt = 0 ;
        if(board){
            board.map((e=>{
                board_id.push(e.id)
            }))
        }
        
        if(board_id.length > 0){
            await this.deleteLikes(board_id);

            await this.delteTag(board_id);
    
            const comment = await this.get_comment_in_board_id(board_id);
    
    
            let comment_id = [];
            cnt = 0 ;
            
            if(comment){
                comment.map((e)=>{
                    comment_id.push(e.id);
                })
            }
            if(comment_id.length > 0 ){
                await this.delete_re_comment(comment_id);
            }
    
            await this.delete_comment(board_id);
    
            await this.delete_board(board_id);
        }
        
        

    }
    async deleteLikes(board_id : number[]){
        await this.likesRepository.createQueryBuilder("likes")
        .delete()
        .where(`likes.board_id in(${board_id})`)
        .execute();
    }
    async delteTag(board_id : number[]){
        await this.tagRepository.createQueryBuilder("tag")
        .delete()
        .where(`tag.board_id in(${board_id})`)
        .execute();
    }
    async get_comment_in_board_id(board_id : number[] ){
        const comment = await this.commentRepository.createQueryBuilder("comment")
        .select(["comment.id"])
        .where(`comment.board_id in(${board_id})`)
        .getMany();

        return comment;
    }
    async delete_re_comment(comment_id:number[]){
        await this.reCommentRepository.createQueryBuilder("re_comment")
            .delete()
            .where(`re_comment.comment_id in(${comment_id})`)
            .execute();
    }
    async delete_comment(board_id : number[]){
        await this.commentRepository.createQueryBuilder("comment")
        .delete()
        .where(`comment.board_id in(${board_id})`)
        .execute();
    }
    async delete_board(board_id : number[]){
        await this.boardRepository.createQueryBuilder("board")
        .delete()
        .where(`board.id in(${board_id})`)
        .execute();
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
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        const board_id : number = idValue;
        let tag ;
        if(tags_name != undefined){
            if(tags_name.length > 0 ){
                const tags : string[] = tags_name;
                
                for(const tag_name of tags_name){
                    tag = await this.tagRepository.createTag(board_id, tag_name);
                }
            }
        }
        
    }
    
    public async tagCount(writer : number, type : string){
        const board_id = await this.getBoardByUserId(writer);
        let board_status : number[] = [0] ; 

        if(type == "본인계정접속"){
            board_status = [0,2]
        }else if(type == "게스트"){
            board_status = [0]
        }


        if(board_id.length > 0){
            return await this.tagRepository.tagCount(board_id,board_status);
        }
        return ;
       
    }

    

    /**
     * getBoardByUserId()
     * @param writer 
     * @returns 
     */
    async getBoardByUserId(writer : number) : Promise<number[]>{
        const board =await this.boardRepository.find({
            select : ["id"],
            where : {writer}
        })
        let board_id = [];
        if(board.length > 0){
            board.forEach((e)=>{
                board_id.push(e.id);
            });
        }
        
        return board_id;
    }

    /**
     * CheckingWriter(게시판에 관한 유저 권한 확인 함수)
     * @param id 
     * @param writer 
     * @returns 
     */
    async CheckingWriter(id: number, writer : number){
        const board_id : number[]= await this.getBoardByUserId(writer);
        const idValue :number = typeof id == typeof {} ?Number(Object.values(id)[0]) : Number(id);
        
        if(!(board_id.indexOf(idValue)>-1)){
            throw new HttpException('권한이 없는 사용자입니다.', HttpStatus.CONFLICT)
        }
        
        return id;
    }
    
    /**
     * 좋아오 생성 함수
     * @param board_id 
     * @param user_id 
     */
    async LikeBoard(board_id : number, user_id : number){
        const idValue :number = typeof board_id == typeof {} ?Number(Object.values(board_id)[0]) : Number(board_id);
        const user_idValue :number = typeof user_id == typeof {} ?Number(Object.values(user_id)[0]) : Number(user_id);
        
        const liked = await this.likesRepository.findOne({
            where : {board_id : idValue, user_id : user_id}
        })
        const board = await this.boardRepository.findOne({
            where : { id : idValue}
        })
        const likes_status = 1;
        if(!(liked)){
            const like = await this.likesRepository.create({
                likes_status,
                board_id,
                user_id
            })
            board.likes_count++;
            await this.likesRepository.save(like);
            await this.boardRepository.save(board);
        }else if(liked.likes_status == 0){
            liked.likes_status = 1;
            board.likes_count++;
            await this.likesRepository.save(liked);
            await this.boardRepository.save(board);
        }else if (liked.likes_status == 1){
            liked.likes_status = 0;
            board.likes_count--;
            await this.likesRepository.save(liked);
            await this.boardRepository.save(board);
        }
        return await this.likesRepository.find({
            select : ["id","likes_status"],
            where : {board_id : idValue, user_id : user_idValue}
        })

    }

    /**
     * CheckBoardById(아이디 유무 확인 함수)
     * @param id 
     * @returns 
     */
    async CheckBoardById(id : number) : Promise<void>{

        if(id == undefined){
            throw new HttpException('ID 입력을 잘못 하였습니다.', HttpStatus.CONFLICT)
        }
        const cehckedboard = await this.boardRepository.findOne(id);
        
        if(!cehckedboard){
            throw new HttpException('존재하지 않는 게시물 입니다.', HttpStatus.CONFLICT)
        }
    }
    async getUserIdinBoard(id : number){
        if(id == undefined){
            throw new HttpException('ID 입력을 잘못 하였습니다.', HttpStatus.CONFLICT)
        }
        const cehckedboard = await this.boardRepository.findOne(id);
        
        if(!cehckedboard){
            throw new HttpException('존재하지 않는 게시물 입니다.', HttpStatus.CONFLICT)
        }
        const user_id = await this.boardRepository.getUserIdInBoard(id);

        
        return Number(Object.values(user_id.writer));
    }

    /**
     * userIdInCookie(쿠키 Access 토큰의 user_id 반환)
     * @param accessToken 
     * @returns 
     */
    async userIdInCookie(accessToken : string) : Promise<number>{
        const accessTokken = accessToken;
        const base64Payload = accessTokken.split('.')[1]; 
        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
        const user_id_inPayload : number = payload.id;

        return user_id_inPayload ;
    }

    async getUserById(id : number) : Promise<Users>{
        

        const user = await this.usersRepository.findOne({
            select : ["id","userid","username","email","role","avatar_image","description","techStack","socialUrl"],
            where : {
                id : id
            }
        })

        if(!user ){
            throw new HttpException('해당 유저가 존재하지 않습니다.', HttpStatus.CONFLICT)
        }
 

        return user;

    }
    async CheckTag(tag_name : string){
        const tag = this.tagRepository.find({tag_name});
        if(!tag){
            throw new HttpException('해당 태그가 존재하지 않습니다.', HttpStatus.CONFLICT)
        }
        return tag;
    }



    async checked_login(req, user_id):Promise<string>{
        const token = Object.keys(req.cookies).includes("AccessToken");

        let result = "";
        

        if(token){
            const user_id_inPayload : number = await this.userIdInCookie(req.cookies.AccessToken);
            if(user_id == undefined){
                result = "본인계정접속"
            }else{
                if(user_id_inPayload == user_id){
                    result = "본인계정접속"
                }else{
                    result = "게스트"
                }
            }
        
        }
        else if(user_id != undefined){
            result = "게스트"
        }else{
            result = "로그인안함"
        }
        return result ;
    }
    
}
