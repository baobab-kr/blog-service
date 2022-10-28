import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({description:'로그인할 때 입력하는 아이디를 의미합니다.'})
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

  @ApiPropertyOptional({description:'사용자의 이메일 주소를 의미합니다. 회원가입 유효성 입증 API 테스트를 위해 유효한 이메일 주소를 넣어야 합니다.'})
  @Transform(params => params.value.trim()) 
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional({description:'유저의 닉네임을 의미합니다.'})
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

  @ApiPropertyOptional({description:'사용자의 비밀번호를 의미합니다.'})
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message: '암호는 대문자, 소문자, 숫자, 특수문자를 조합할 수 있습니다. 특수문자는 !, @, $, %, *, &만 사용할 수 있습니다.',
    },
  )
  readonly password: string;

  @ApiPropertyOptional({description:'이메일 유효성 입증에 대한 인증 코드를 의미합니다.'})
  @IsNumber()
  readonly inputVerifyCode: number;

  @ApiPropertyOptional({description:'해당 사용자 계정의 역할을 의미합니다. 0은 개발자를 뜻하며, 1은 헤드헌터를 뜻합니다.'})
  @IsNumber()
  readonly role: number;
}