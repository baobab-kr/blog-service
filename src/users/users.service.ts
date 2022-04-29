import { Injectable, Post, Query } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(private emailService:EmailService) {};

  async createUser(userid: string, email: string, username: string, password: string) {
    await this.checkUserIdExists(userid);
    await this.checkUserNameExists(username);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(userid, email, username, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, username, signupVerifyToken);
  }

  private checkUserIdExists(userid: string) {
    console.log(userid);
  }

  private checkUserNameExists(username: string) {
    console.log(username);
  }

  private saveUser(userid: string, email: string, username: string, password: string, signupVerifyToken: string) {
    console.log(userid, email, username, password, signupVerifyToken);
  }

  private async sendMemberJoinEmail(email: string, username: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, username, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
  
    throw new Error('Method not implemented.');
  }
}
