import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CompanyLicenseDTO{


    
    @ApiProperty({
        type:"number",
        required : false
    })
    id : number 
    
    
    @ApiProperty({
        type:"File"
    })
    CompanyImage : any 



    

}
