import { IsString, Matches, MaxLength, MinLength,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiPropertyOptional({description:'로그인 할 사용자의 아이디를 의미합니다.'})
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

  @ApiPropertyOptional({description:'로그인 할 사용자의 비밀번호를 의미합니다.'})
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message: '암호는 대문자, 소문자, 숫자, 특수문자를 조합할 수 있습니다. 특수문자는 !, @, $, %, *, &만 사용할 수 있습니다.',
    },
  )
  readonly password: string;
}