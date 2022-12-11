import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, Matches, MaxLength, MinLength, IsString } from 'class-validator';


export class CreateBoardDTO{
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @MaxLength(30,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s~|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/)
    @ApiProperty()
    title : string;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @MaxLength(200,{message : "입력가능 글자 수를 초과하였습니다."})
    @IsString()
    @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s~|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/)
    @ApiProperty()
    description : string;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    content : string;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty({ type: 'number', description:'0:공개, 1:삭제, 2:나만보기' })
    board_status : number; 

    @ApiProperty({ type: 'array', description:'tag_name을 배열의 형태로 넣습니다. 필수 입력 데이터가 아닙니다.' })
    tag_name? : string[];

    @ApiProperty({ type: 'file', description:'업로드 할 프로필 이미지를 선택합니다. 필수 입력 데이터가 아닙니다.' })
    file? : any;
    
}



export class CreateCommentDTO{

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    board_id : number;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    content : string;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    comment_status : number;
    
}

export class CreateReCommentDTO{
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    comment_id : number;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    content : string;

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    recomment_status : number;
}

export class CreateLikesDTO{
    @Transform((e)=> e.value.trim())
    @IsNotEmpty()
    @ApiProperty()
    user_id : number;

    @Transform((e)=> e.value.trim())
    @IsNotEmpty()
    @ApiProperty()
    board_id : number;

    @Transform((e)=> e.value.trim())
    @IsNotEmpty()
    @ApiProperty()
    likes_status : number;
}

export class CreateFilteringCommentDTO{
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    comment_id : number;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    content : string;
}

export class CreateFilteringReCommentDTO{
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    id : number;

    
    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    content : string;
}