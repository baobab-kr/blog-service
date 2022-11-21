import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// Github Authorization Code Dto
export class GithubCodeDto {
  // 문자열 검증
  @ApiPropertyOptional({description:'프런트엔드에서 리다이렉트한 github 사이트에서 로그인한 후 반환받은 코드 값을 전달해야 합니다.'})
  @IsString()
  readonly code: string;
}