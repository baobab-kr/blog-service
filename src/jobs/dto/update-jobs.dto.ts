import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateJobsDTO } from './create-jobs.dto';

export class UpdateJobsDTO  extends PartialType(CreateJobsDTO){
    
    

    @ApiProperty()
    companyName? : Object

    @ApiProperty()
    managerName?:Object

    @ApiProperty()
    managerContact?:Object

    @ApiProperty()
    license? : Object


    @ApiProperty()
    field? : Object

    @ApiProperty()
    title? : Object

    @ApiProperty()
    logo? : Object

    @ApiProperty()
    location? : Object

    @ApiProperty()
    message? : Object

    @ApiProperty()
    talent? : Object

    @ApiProperty()
    careerType? : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    url? : Object

    @ApiProperty()
    salary? : Object

    @ApiProperty()
    startDate? : Object

    
    @ApiProperty()
    endDate? : Object

    @ApiProperty()
    approvalStatus? : Object
    
    @ApiProperty()
    jobStatus? : Object 


}