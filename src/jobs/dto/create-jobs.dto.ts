import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobsDTO{

    @ApiProperty({
        default: 1,
        description : "users와 연결된 id, foreign key",
    })
    user_id? : Object 

    @IsNotEmpty({message : "companyName 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "companyName",
        description : "회사명",
    })
    companyName : Object

    @IsNotEmpty({message : "managerName 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "managerName",
        description : "담당자 이름",
    })
    managerName:Object

    @IsNotEmpty({message : "managerContact 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "managerContact",
        description : "담당자 연락처",
    })
    managerContact:Object

    @IsNotEmpty({message : "license 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "license",
        description : "라이선스 이미지명 넣는 컬럼",
    })
    license : Object


    @IsNotEmpty({message : "field 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "field",
        description : "채용분야",
    })
    field : Object

    @IsNotEmpty({message : "title 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "title",
        description : "공고 제목",
    })
    title : Object

    @IsNotEmpty({message : "logo 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "logo",
        description : "로고 이미지명 넣는 컬럼",
    })
    logo : Object

    @IsNotEmpty({message : "location 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "location",
        description : "근무 지역",
    })
    location : Object

    @IsNotEmpty({message : "message 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "message",
        description : "채용 홍보 한줄 소개",
    })
    message : Object

    @IsNotEmpty({message : "talent 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "talent",
        description : "텔런트 값",
    })
    talent : Object

    @IsNotEmpty({message : "careerType 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: 0,
        description : "경력, - 경력무관 - 0        - 인턴 - 1        - 신입 - 2        - 경력 - 3",
    })
    careerType : Object

    @IsNotEmpty({message : "url 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "url",
        description : "회사 소개용 url",
    })
    url : Object

    @IsNotEmpty({message : "salary 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: "salary",
        description : "연봉 기입란",
    })
    salary : Object

    @ApiProperty({
        default: "YYYYMMDD",
        description : "채용 시작 날짜",
    })
    startDate : Object

    @ApiProperty({
        default: "YYYYMMDD",
        description : "채용 종료 날짜",
    })
    endDate : Object

    @IsNotEmpty({message : "approvalStatus 값이 입력되지 않았습니다."})
    @ApiProperty({
        default: 0,
        description : "서비스 관리자가 승인을 했는지 승인여부, - 미승인 - 0        - 승인 - 1",
    })
    approvalStatus : Object



    

}
