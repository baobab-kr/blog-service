import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ToastUiDTO{

    @ApiProperty({
        type:"File"
    })
    ToastImage : any 



    

}
