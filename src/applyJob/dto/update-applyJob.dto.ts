import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { CreateApplyJobDTO } from './create-applyJob.dto';

export class UpdateApplyJobDTO extends PartialType(CreateApplyJobDTO){

    @IsString()
    @ApiProperty()
    url? : string


    @IsString()
    @ApiProperty()
    name? : string


    @IsNumber()
    @ApiProperty()
    age? : number

    @IsString()
    @ApiProperty()
    sex? : string

}