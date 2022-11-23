import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplyJobDTO{

    @IsNotEmpty({message : "jobs_Id 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1,
        description : "jobs와 연결된 id, foreign key",
    })
    jobs_Id : Object

    @ApiProperty({
        default : 1,
        description : "users와 연결된 id, foreign key",
        required : false
    })
    user_id? : Object


    @IsNotEmpty({message : "title 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "채용신청 제목 컬럼",
    })
    title : Object

    @IsNotEmpty({message : "name 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "게시자의 이름",
    })
    name : Object

    @IsNotEmpty({message : "email 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "이메일"
    })
    email : Object

    @IsNotEmpty({message : "techStack 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "개발자가 갖은 개발 스택",
    })
    techStack : Object

    @IsNotEmpty({message : "careerYear 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1,
        description : "경력",
    })
    careerYear : Object

    @IsNotEmpty({message : "resumeUrl 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "소개용 url",
    })
    resumeUrl : Object


    @IsNotEmpty({message : "socialUrl 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "소개용 url",
    })
    socialUrl : Object


    @IsNotEmpty({message : "profile 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : "string",
        description : "프로필 정보",
    })
    profile : Object


    @IsNotEmpty({message : "education 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1,
        description : "학력- 중학교 - 0     - 고등학교 - 1        - 전문학사 - 2        - 학사 - 3        - 석사 - 4        - 박사 - 5",
    })
    education : Object


    @IsNotEmpty({message : "educationStatus 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1,
        description : "졸업 여부 - 졸업예정 - 0        - 졸업 - 1",
    })
    educationStatus : Object
    
}