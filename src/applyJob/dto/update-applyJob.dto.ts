import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { CreateApplyJobDTO } from './create-applyJob.dto';

export class UpdateApplyJobDTO extends PartialType(CreateApplyJobDTO){


    @IsNotEmpty({message : "id 값이 입력되지 않았습니다."})
    @ApiProperty({
        default : 1
    })
    id? : Object

    @ApiProperty({
        default : 1
    })
    jobs_Id? : Object

    @ApiProperty({
        default : 1
    })
    user_id? : Object


    @ApiProperty({
        default : "string"
    })
    title? : Object

    @ApiProperty({
        default : "string"
    })
    name? : Object

    @ApiProperty({
        default : "string"
    })
    email? : Object

    @ApiProperty({
        default : "string"
    })
    techStack? : Object

    @ApiProperty({
        default : 1
    })
    careerYear? : Object

    @ApiProperty({
        default : "string"
    })
    resumeUrl? : Object


    @ApiProperty({
        default : "string"
    })
    socialUrl? : Object


    @ApiProperty({
        default : "string"
    })
    profile? : Object


    @ApiProperty({
        default : 1
    })
    education? : Object


    @ApiProperty({
        default : 1
    })
    educationStatus? : Object

}