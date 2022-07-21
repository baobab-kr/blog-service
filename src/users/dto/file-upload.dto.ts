import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'file', description:'업로드 할 프로필 이미지를 선택합니다.' })
  profile: any;
  @ApiProperty({ type:'string', description: '업로드 할 프로필이 적용될 유저 ID를 의미합니다.' })
  userid: string;
}