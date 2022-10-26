import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateJobsDTO } from "./create-jobs.dto";
import { PartialType } from '@nestjs/mapped-types';

export class SelectJobsDTO {

    @ApiProperty()
    location?
    
    @ApiProperty()
    title?

    @ApiProperty()
    field?

    @ApiProperty()
    careerType?
    
    @ApiProperty()
    startDate?

    @ApiProperty()
    endDate?

    @ApiProperty()
    companyName?

    


}
