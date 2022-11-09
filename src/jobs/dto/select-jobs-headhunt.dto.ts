import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsHeadHuntDTO {

    @ApiProperty({
        type: "number",
    })
    @IsNotEmpty({message : "user_id 값이 입력되지 않았습니다."})
    user_id : number

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
        type: "YYYYMMDD",
    })
    startDate?

    @ApiProperty({
        type: "YYYYMMDD",
    })
    endDate?

    @ApiProperty({
        type: "string",
    })
    companyName?

    


}
