import { ApiParam, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsDTO {

    @ApiProperty({
        type: "string",
    })
    location?
    
    @ApiProperty({
        type: "string",
    })
    title?

    @ApiProperty({
        type: "string",
    })
    field?

    @ApiProperty({
        type: "number",
    })
    careerType?
    
    @ApiProperty({
        type: "string",
    })
    startDate?

    @ApiProperty({
        type: "string",
    })
    endDate?

    @ApiProperty({
        type: "string",
    })
    companyName?

    


}
