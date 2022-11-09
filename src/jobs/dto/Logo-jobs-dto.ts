import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CampanyLogoDTO{


    
    @ApiProperty({
        type:"number"
    })
    id : number 
    
    
    @ApiProperty({
        type:"File"
    })
    CompanyLogo : any 



    

}
