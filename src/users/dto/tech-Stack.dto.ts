import { IsString, Matches, MaxLength, MinLength,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export class TechStackDto {
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
  @ApiProperty({ type:'string', description: '사용자의 techStack 정보를 의미합니다.' })
  readonly techStack: string;
}