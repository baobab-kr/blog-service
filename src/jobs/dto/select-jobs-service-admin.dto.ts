import { ApiParam, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsForServiceAdminDTO {


    @ApiProperty({
        type: "number",
        required : true
    })
    page

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
        type: "string",
        required : false
    })
    startDate?

    @ApiProperty({
        type: "string",
        required : false
    })
    endDate?

    @ApiProperty({
        type: "string",
        required : false
    })
    companyName?

    


}
