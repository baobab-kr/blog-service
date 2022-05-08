import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength,  } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyCodeReceiverDto {
  @Transform(params => params.value.trim()) 
  @IsString()
  @IsEmail()
  readonly email: string;

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