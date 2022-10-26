import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobsDTO{

    @IsNotEmpty({message : "user_id 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: 1,
    })
    user_id : Object 

    @IsNotEmpty({message : "companyName 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "companyName",
    })
    companyName : Object

    @IsNotEmpty({message : "managerName 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "managerName",
    })
    managerName:Object

    @IsNotEmpty({message : "managerContact 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "managerContact",
    })
    managerContact:Object

    @IsNotEmpty({message : "license 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "license",
    })
    license : Object


    @IsNotEmpty({message : "field 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "field",
    })
    field : Object

    @IsNotEmpty({message : "title 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "title",
    })
    title : Object

    @IsNotEmpty({message : "logo 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "logo",
    })
    logo : Object

    @IsNotEmpty({message : "location 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "location",
    })
    location : Object

    @IsNotEmpty({message : "message 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "message",
    })
    message : Object

    @IsNotEmpty({message : "talent 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "talent",
    })
    talent : Object

    @IsNotEmpty({message : "careerType 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: 0,
    })
    careerType : Object

    @IsNotEmpty({message : "url 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "url",
    })
    url : Object

    @IsNotEmpty({message : "salary 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "salary",
    })
    salary : Object

    @ApiProperty({
        default: "YYYYMMDD",
    })
    startDate : Object

    @ApiProperty({
        default: "YYYYMMDD",
    })
    endDate : Object

    @IsNotEmpty({message : "approvalStatus 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: 0,
    })
    approvalStatus : Object



    

}
