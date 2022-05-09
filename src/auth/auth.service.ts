import { BadRequestException, CacheInterceptor, CACHE_MANAGER, Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { SavedUserDto } from 'src/users/dto/saved-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class AuthService {
  constructor(
    private jwtService:JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async checkVerifyCode(username: string, inputVerifyCode: number): Promise<void> {
    const sentVerifyCode:number = await this.cacheManager.get(username);
    const verifyCodeStatus = sentVerifyCode !== inputVerifyCode ? false : true
    if (!verifyCodeStatus) { 
      throw new BadRequestException('회원가입 인증 코드가 올바르지 않습니다.'); 
    }
  }

  async encrpytionPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  }

  async comparePassword(inputPassword: string, savedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, savedPassword);
  }

  async createJwtToken(savedUserInfo: SavedUserDto): Promise<{accessToken: string} | undefined> {
    const payload: Payload = { 
      id: savedUserInfo.id, 
      username: savedUserInfo.username 
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
