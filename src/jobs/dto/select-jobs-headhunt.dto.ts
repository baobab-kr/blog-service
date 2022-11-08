import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsHeadHuntDTO {

    @ApiProperty({
        default: 1,
    })
    @IsNotEmpty({message : "user_id 값이 입력되지 않았습니다."})
    user_id : number

    @ApiProperty({
        default: "string",
    })
    location?
    
    @ApiProperty({
        default: "string",
    })
    title?

    @ApiProperty({
        default: "string",
    })
    field?

    @ApiProperty({
        default: 1,
    })
    careerType?
    
    @ApiProperty({
        default: "YYYYMMDD",
    })
    startDate?

    @ApiProperty({
        default: "YYYYMMDD",
    })
    endDate?

    @ApiProperty({
        default: "string",
    })
    companyName?

    


}
