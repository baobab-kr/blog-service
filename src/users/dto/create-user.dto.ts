import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength,  } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Transform(params => params.value.trim()) 
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Matches(
    /^[A-Za-z0-9+]*$/,
    {
      message: '아이디는 영문자, 숫자를 조합할 수 있습니다.',
    },
  )
  readonly userid: string;

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

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message: '암호는 대문자, 소문자, 숫자, 특수문자를 조합할 수 있습니다. 특수문자는 !, @, $, %, *, &만 사용할 수 있습니다.',
    },
  )
  readonly password: string;

  @IsNumber()
  readonly inputVerifyCode: number;
}