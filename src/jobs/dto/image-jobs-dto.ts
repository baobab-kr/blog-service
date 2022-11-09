import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CampanyImageDTO{


    
    @ApiProperty({
        type:"number"
    })
    id : number 
    
    
    @ApiProperty({
        type:"File"
    })
    CompanyImage : any 



    

}
