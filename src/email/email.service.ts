import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { CacheInterceptor, CACHE_MANAGER, Inject, Injectable, UseInterceptors } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';
import { Cache } from 'cache-manager';


interface EmailOptions {
  from: string,
  to: string;
  subject: string;
  html: string;
}

@Injectable()
@UseInterceptors(CacheInterceptor)
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port),
      auth: { 
        user: config.auth.user, 
        pass: config.auth.pass 
      },
      tls: { 
        ciphers: config.tls.ciphers 
      },
    });
  }

  async sendMemberJoinVerification(emailAddress: string, username: string, verifyCode: number) {
    await this.cacheManager.set(username, verifyCode);
    const emailOptions: EmailOptions = {
      from: process.env.EMAIL_AUTH_USER,
      to: emailAddress,
      subject: '바오밥 서비스 플랫폼 - 회원가입 인증 메일',
      html: `
        <div
          style="
          text-align: center;
          border: 0.5px solid;
          margin: 2% 30%;
          padding: 10px;"
        >
          <h2>${username}님, 안녕하세요.</h2> <br/> 
          확장형 블로그 플랫폼 '바오밥(Baobab)' 서비스입니다. <br/>
          메일 소유권 입증을 위해 인증 메일 전달 드립니다. <br/>

          <br/>
          확장형 블로그 플랫폼 '바오밥(Baobab)' 서비스 사용을 원하신다면 아래의 회원 가입 인증 코드를 회원 가입 페이지에 입력해 주세요. <br/>
          <strong>${verifyCode}</strong>
        </div>
      `
    }

    return await this.transporter.sendMail(emailOptions);
  }
}
