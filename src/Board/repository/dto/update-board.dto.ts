import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength } from "class-validator";
import { CreateBoardDTO } from "./create-board.dto";


export class UpdateBoardDTO extends PartialType(CreateBoardDTO) {
    @MaxLength(30,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s~|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/)
    @ApiProperty()
    title? : string;

    
    
    @MaxLength(200,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s~|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/)
    @ApiProperty()
    description? : string;

    
    @IsString()
    @ApiProperty()
    content? : string;

    @ApiProperty()
    board_status? : number; 

    @ApiProperty()
    tag_name? : string[];
}