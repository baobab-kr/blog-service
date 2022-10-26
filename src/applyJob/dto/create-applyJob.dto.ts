import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplyJobDTO{


    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsNumber()
    @ApiProperty()
    notice_id : number

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsNumber()
    @ApiProperty()
    user_id : number

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    url : string

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    name : string

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsNumber()
    @ApiProperty()
    age : number

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @IsString()
    @ApiProperty()
    sex : string
}