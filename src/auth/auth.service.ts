import { BadRequestException, CacheInterceptor, CACHE_MANAGER, ConsoleLogger, HttpException, HttpStatus, Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcryptjs';
import { Payload } from './security/payload.interface';
import { SavedUserDto } from 'src/users/dto/saved-user.dto';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';

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

    const now = new Date(); // 현재 시간
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 utc로 변환한 밀리세컨드값
    const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간은 UTC보다 9시간 빠름(9시간의 밀리세컨드 표현)
    const koreaExpires = new Date(utcNow + koreaTimeDiff + (+process.env.JWT_ACCESS_EXPIRES*1000)); // utc로 변환된 값을 한국 시간으로 변환시키기 위해 9시간(밀리세컨드)를 더함

    return {
      accessToken: token,
      accessOption: {
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: Number(process.env.JWT_ACCESS_EXPIRES)*1000
      },
      accessTokenExpires: koreaExpires,
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

    const now = new Date(); // 현재 시간
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 utc로 변환한 밀리세컨드값
    const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간은 UTC보다 9시간 빠름(9시간의 밀리세컨드 표현)
    const koreaExpires = new Date(utcNow + koreaTimeDiff + (+process.env.JWT_REFRESH_EXPIRES*1000)); // utc로 변환된 값을 한국 시간으로 변환시키기 위해 9시간(밀리세컨드)를 더함

    return {
      refreshToken: token,
      refreshOption: {
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES)*1000,
      },
      refreshTokenExpires: koreaExpires,
    };
  }
  
  async getUserRefreshTokenMatches( refreshToken: string, currentRefreshToken: string): Promise<Boolean> {
    return await bcrypt.compare(refreshToken, currentRefreshToken);
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  async getGithubAccessToken(code: string) {
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';
    const request = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    };
  
    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json', // json으로 반환을 요청합니다.
      },
    });

    if (response.data.error) throw new HttpException('깃허브 인증을 실패했습니다.', HttpStatus.UNAUTHORIZED);
    return response.data;
  }

  async getGithubUserInfo(githubAccessToken: string) {
    const getUserUrl: string = 'https://api.github.com/user';
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${ githubAccessToken }`,
      },
    });
    const { login, avatar_url, name, email, html_url } = data;
    
    const githubUserInfo = {
      "userid": login,
      "username": name === null ? login : name, 
      "email": email,
      "avatar_image": avatar_url,
      "socialUrl": html_url
    };

    return githubUserInfo;
  }
}