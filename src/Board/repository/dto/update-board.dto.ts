import { PartialType } from "@nestjs/mapped-types";
import { IsString, Matches, MaxLength } from "class-validator";
import { CreateBoardDTO } from "./create-board.dto";


export class UpdateBoardDTO extends PartialType(CreateBoardDTO) {
    @MaxLength(30,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}|\s]+$/)
    title? : string;

    
    
    @MaxLength(200,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}|\s]+$/)
    description? : string;

    
    @IsString()
    content? : string;

    
    board_status? : number; 

    tag_name? : string[];
}