import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class VerifyCodeReceiverDto {
  @ApiPropertyOptional({description:'유효성 입증 관련된 인증번호를 전송할 메일 주소를 입력합니다.'})
  @Transform(params => params.value.trim()) 
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional({description:'회원가입 시에 사용되고 있는 사용자의 이름을 입력합니다.'})
  @Transform(params => params.value.trim()) 
  @IsString()
  @MinLength(2)
  @MaxLength(9)
  @Matches(
    /^[ㄱ-ㅎ가-힣A-Za-z0-9+]*$/,
    {
      message: '유저 이름은 한글, 영문자, 숫자만 조합할 수 있습니다.',
    },
  )
  readonly username: string;
}