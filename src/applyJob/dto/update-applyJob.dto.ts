import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { CreateApplyJobDTO } from './create-applyJob.dto';

export class UpdateApplyJobDTO extends PartialType(CreateApplyJobDTO){


    @IsNotEmpty({message : "id 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1,
        description : "apply_job의 Index가 되는 id, primary key",
        required : false
    })
    id? : Object

    @ApiProperty({
        default : 1,
        description : "jobs와 연결된 id, foreign key",
        required : false
    })
    jobs_Id? : Object

    @ApiProperty({
        default : 1,
        description : "users와 연결된 id, foreign key",
        required : false
    })
    user_id? : Object


    @ApiProperty({
        default : "string",
        description : "채용신청 제목 컬럼",
        required : false
    })
    title? : Object

    @ApiProperty({
        default : "string",
        description : "게시자의 이름",
        required : false
    })
    name? : Object

    @ApiProperty({
        default : "string",
        description : "이메일"
    })
    email? : Object

    @ApiProperty({
        default : "string",
        description : "개발자가 갖은 개발 스택",
        required : false
    })
    techStack? : Object

    @ApiProperty({
        default : 1,
        description : "경력",
        required : false
    })
    careerYear? : Object

    @ApiProperty({
        default : "string",
        description : "소개용 url",
        required : false
    })
    resumeUrl? : Object


    @ApiProperty({
        default : "string",
        description : "소개용 url",
        required : false
    })
    socialUrl? : Object


    @ApiProperty({
        default : "string",
        description : "프로필 정보",
        required : false
    })
    profile? : Object


    @ApiProperty({
        default : 1,
        description : "학력- 중학교 - 0     - 고등학교 - 1        - 전문학사 - 2        - 학사 - 3        - 석사 - 4        - 박사 - 5",
        required : false
    })
    education? : Object


    @ApiProperty({
        default : 1,
        description : "졸업 여부 - 졸업예정 - 0        - 졸업 - 1",
        required : false
    })
    educationStatus? : Object

}