import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    console.log(config.auth.user, config.auth.pass)
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      }
    });
    console.log(config.auth.user, config.auth.pass)
  }

  async sendMemberJoinVerification(emailAddress: string, username: string, signupVerifyToken: string) {
    const baseUrl = this.config.baseUrl;

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const emailOptions: EmailOptions = {
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
          확장형 블로그 플랫폼 '바오밥(Baobab)' 서비스 사용을 원하신다면 아래의 계정 인증 버튼을 눌러주세요. <br/>
          인증 확인 버튼을 누르시면 가입 인증이 완료됩니다. <br/>

          <form action="${url}" method="POST">
            <button
              style="
              margin: 20px; 
              background-color: #77af9c; 
              color: #d7fff1; 
              border: none; 
              padding: 15px 30px; 
              border-radius: 15px; 
              text-decoration: none; 
              font-weight: 600;
              cursor: pointer;"
            > 
              <strong> 인증 확인 </strong>
            </button> 
          </form>
        </div>
      `
    }

    return await this.transporter.sendMail(emailOptions);
  }
}
