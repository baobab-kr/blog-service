import { BadRequestException, CacheInterceptor, CACHE_MANAGER, Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcryptjs';
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

  async encrpytionData(data: string): Promise<string> {
    const encryptedData = await bcrypt.hash(data, 10);
    return encryptedData;
  }

  async comparePassword(inputPassword: string, savedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, savedPassword);
  }

  async createJwtAccessToken(savedUserInfo: SavedUserDto): Promise<{accessToken: string} | undefined> {
    const payload: Payload = { 
      id: savedUserInfo.id, 
      username: savedUserInfo.username 
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async getCookieWithJwtAccessToken(payload: Payload) {
    const token = this.jwtService.sign(
      payload,
      { 
        secret: process.env.JWT_SECRET,
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES)*1000,
      }
    )

    return {
      accessToken: token,
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: Number(process.env.JWT_ACCESS_EXPIRES)*1000
      },
    };
  }

  async getCookieWithJwtRefreshToken(savedUserInfo: SavedUserDto) {
    const payload: Payload = { 
      id: savedUserInfo.id, 
      username: savedUserInfo.username 
    };
    const token = this.jwtService.sign(
      payload,
      { 
        secret: process.env.JWT_SECRET,
        expiresIn: Number(process.env.JWT_REFRESH_EXPIRES)*1000, // 7 day
      }
    )

    return {
      refreshToken: token,
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES)*1000,
      },
    };
  }
  
  async getUserRefreshTokenMatches( refreshToken: string, currentRefreshToken: string): Promise<Boolean> {
    return await bcrypt.compare(refreshToken, currentRefreshToken);
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}