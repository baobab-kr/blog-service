import { IsString } from 'class-validator';

// Github Authorization Code Dto
export class GithubCodeDto {
  // 문자열 검증
  @IsString()
  readonly code: string;
}