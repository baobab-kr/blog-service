import { BadRequestException, CacheInterceptor, CACHE_MANAGER, Inject, Injectable, UnprocessableEntityException, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache 
  ) {}

  async checkVerifyCode(username: string, inputVerifyCode: number): Promise<void> {
    const sentVerifyCode:number = await this.cacheManager.get(username);
    const verifyCodeStatus = sentVerifyCode !== inputVerifyCode ? false : true
    if (!verifyCodeStatus) { 
      throw new BadRequestException('회원가입 인증 코드가 올바르지 않습니다.'); 
    }
  }
}
