import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class SelectJobsHeadHuntDTO {

    @ApiProperty({
        description : "user의 id값 외래키 ",
        type: "number",
        required : false
    })
    user_id? : number

    @ApiProperty({
        type: "string",
        required : false
    })
    location?
    
    @ApiProperty({
        type: "string",
        required : false
    })
    title?

    @ApiProperty({
        type: "string",
        required : false
    })
    field?

    @ApiProperty({
        type: "number",
        required : false
    })
    careerType?
    
    @ApiProperty({
        type: "YYYYMMDD",
        required : false
    })
    startDate?

    @ApiProperty({
        type: "YYYYMMDD",
        required : false
    })
    endDate?

    @ApiProperty({
        type: "string",
        required : false
    })
    companyName?

    


}
