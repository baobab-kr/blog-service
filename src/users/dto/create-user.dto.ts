import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
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

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(9)
  @Matches(
    /^[A-Za-z0-9+]*$/,
    {
      message: '유저 이름은 한글, 영문자, 숫자만 조합할 수 있습니다.',
    },
  )
  readonly username: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message: '암호는 영문자, 숫자, 특수문자를 조합하여 비밀번호를 만들 수 있습니다.',
    },
  )
  readonly password: string;
}