import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateJobsDTO } from './create-jobs.dto';

export class UpdateJobsDTO  extends PartialType(CreateJobsDTO){
    
    @ApiProperty({
        default: 1,
    })
    id? : Object

    @ApiProperty({
        default: "string",
    })
    companyName? : Object

    @ApiProperty({
        default: "string",
    })
    managerName?:Object

    @ApiProperty({
        default: "string",
    })
    managerContact?:Object

    @ApiProperty({
        default: "string",
    })
    license? : Object


    @ApiProperty({
        default: "string",
    })
    field? : Object

    @ApiProperty({
        default: "string",
    })
    title? : Object

    @ApiProperty({
        default: "string",
    })
    logo? : Object

    @ApiProperty({
        default: "string",
    })
    location? : Object

    @ApiProperty({
        default: "string",
    })
    message? : Object

    @ApiProperty({
        default: "string",
    })
    talent? : Object

    @ApiProperty({
        default: "string",
    })
    careerType? : Object

    @ApiProperty({
        default: "string",
    })
    url? : Object

    @ApiProperty({
        default: "string",
    })
    salary? : Object

    @ApiProperty({
        default: "YYYYMMDD",
    })
    startDate? : Object

    
    @ApiProperty({
        default: "YYYYMMDD",
    })
    endDate? : Object

    @ApiProperty({
        default: 1,
    })
    approvalStatus? : Object
    
    @ApiProperty({
        default: 1,
    })
    jobStatus? : Object 


}