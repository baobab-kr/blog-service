import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsHeadHuntDTO {

    @ApiProperty({
        type: "number",
        required : false
    })
    user_id? : number

    @ApiProperty({
        type: "string",
        required : false
    })
    location?
    
    @ApiProperty({
        type: "string",
        required : false
    })
    title?

    @ApiProperty({
        type: "string",
        required : false
    })
    field?

    @ApiProperty({
        type: "number",
        required : false
    })
    careerType?
    
    @ApiProperty({
        type: "YYYYMMDD",
        required : false
    })
    startDate?

    @ApiProperty({
        type: "YYYYMMDD",
        required : false
    })
    endDate?

    @ApiProperty({
        type: "string",
        required : false
    })
    companyName?

    


}
