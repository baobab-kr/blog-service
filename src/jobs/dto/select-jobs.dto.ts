import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsDTO {

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
