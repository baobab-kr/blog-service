import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateJobsDTO } from './create-jobs.dto';

export class UpdateJobsDTO  extends PartialType(CreateJobsDTO){
    
    @ApiProperty({
        default: 1,
        description : "Jobs의 Index가 되는 id, primary key",
        required : false
    })
    id? : Object

    @ApiProperty({
        default: "string",
        description : "회사명",
        required : false
    })
    companyName? : Object

    @ApiProperty({
        default: "string",
        description : "담당자 이름",
        required : false
    })
    managerName?:Object

    @ApiProperty({
        default: "string",
        description : "담당자 연락처",
        required : false
    })
    managerContact?:Object

    @ApiProperty({
        default: "string",
        description : "라이선스 이미지명 넣는 컬럼",
        required : false
    })
    license? : Object


    @ApiProperty({
        default: "string",
        description : "채용분야",
        required : false
    })
    field? : Object

    @ApiProperty({
        default: "string",
        description : "공고 제목",
        required : false
    })
    title? : Object

    @ApiProperty({
        default: "string",
        description : "로고 이미지명 넣는 컬럼",
        required : false
    })
    logo? : Object

    @ApiProperty({
        default: "string",
        description : "근무 지역",
        required : false
    })
    location? : Object

    @ApiProperty({
        default: "string",
        description : "채용 홍보 한줄 소개",
        required : false
    })
    message? : Object

    @ApiProperty({
        default: "string",
        description : "텔런트 값",
        required : false
    })
    talent? : Object

    @ApiProperty({
        default: "string",
        description : "경력, - 경력무관 - 0        - 인턴 - 1        - 신입 - 2        - 경력 - 3",
        required : false
    })
    careerType? : Object

    @ApiProperty({
        default: "string",
        description : "회사 소개용 url",
        required : false
    })
    url? : Object

    @ApiProperty({
        default: "string",
        description : "연봉 기입란",
        required : false
    })
    salary? : Object

    @ApiProperty({
        default: "YYYYMMDD",
        description : "채용 시작 날짜",
        required : false
    })
    startDate? : Object

    
    @ApiProperty({
        default: "YYYYMMDD",
        description : "채용 종료 날짜",
        required : false
    })
    endDate? : Object

    @ApiProperty({
        default: 1,
        description : "서비스 관리자가 승인을 했는지 승인여부, - 미승인 - 0        - 승인 - 1",
        required : false
    })
    approvalStatus? : Object

    
    @ApiProperty({
        default: 1,
        description : "채용 상태 - 채용 마감 - 0        - 채용 중 - 1",
        required : false
    })
    jobStatus? : Object 


}