import { PartialType } from "@nestjs/mapped-types";
import { ApiBody, ApiOkResponse, ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength } from "class-validator";
import { CreateBoardDTO } from "./create-board.dto";


export class UpdateBoardDTO extends PartialType(CreateBoardDTO) {

    @ApiProperty({
        default : 1,
        required : false
    })
    board_id? : number;

    @MaxLength(30,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s~|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/)
    @ApiProperty({
        default : "string",
        required : false
    })
    title? : string;

    
    
    @MaxLength(200,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s~|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/)
    @ApiProperty({
        default : "string",
        required : false
    })
    description? : string;

    
    @IsString()
    @ApiProperty({
        default : "string",
        required : false
    })
    content? : string;

    @ApiProperty({
        default : 1,
        required : false
    })
    board_status? : number; 

    

    @ApiProperty({
        default : [],
        required : false
    })
    tag_name? : string[];

    @ApiProperty({
        required : false,
        type : "file"
    })

        thumbnail? : any
}