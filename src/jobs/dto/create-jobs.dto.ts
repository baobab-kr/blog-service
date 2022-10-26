import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobsDTO{


    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    user_id : Object 

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    companyName : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    managerName:Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    managerContact:Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    license : Object


    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    field : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    title : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    logo : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    location : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    message : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    talent : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    careerType : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    url : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    salary : Object

    @ApiProperty()
    startDate : Object

    @ApiProperty()
    endDate : Object

    @IsNotEmpty({message : "값이 입력되지 않았습니다."})
    @ApiProperty()
    approvalStatus : Object



    

}
