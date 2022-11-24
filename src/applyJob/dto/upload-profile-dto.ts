import { ManyToOne, OneToMany } from "typeorm"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadProfileDTO{

    @ApiProperty({
        default : 1,
        description : "apply_jobs의 id",
        required : false
    })
    id : Object

    @ApiProperty({
        type:"File"
    })
    file : any


    
}