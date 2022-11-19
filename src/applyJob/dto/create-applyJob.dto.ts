import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplyJobDTO{

    @IsNotEmpty({message : "jobs_Id 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1
    })
    jobs_Id : Object

    @ApiProperty({
        default : 1,
        required : false
    })
    user_id? : Object


    @IsNotEmpty({message : "title 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    title : Object

    @IsNotEmpty({message : "name 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    name : Object

    @IsNotEmpty({message : "email 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    email : Object

    @IsNotEmpty({message : "techStack 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    techStack : Object

    @IsNotEmpty({message : "careerYear 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1
    })
    careerYear : Object

    @IsNotEmpty({message : "resumeUrl 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    resumeUrl : Object


    @IsNotEmpty({message : "socialUrl 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    socialUrl : Object


    @IsNotEmpty({message : "profile 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string"
    })
    profile : Object


    @IsNotEmpty({message : "education 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1
    })
    education : Object


    @IsNotEmpty({message : "educationStatus 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1
    })
    educationStatus : Object
    
}