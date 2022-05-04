import { HttpException, HttpStatus, Injectable, Post, Query, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { Users } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private emailService:EmailService,
    @InjectRepository(Users) private usersRepository:Repository<Users>,
    ) {};

  async createUser(userid: string, username: string, email: string, password: string) {
    const signupVerifyToken = uuid.v1();

    await this.saveUser(userid, email, username, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, username, signupVerifyToken);
  }

  public async checkUserIdExists(userid: string) {
    const user = await this.usersRepository.findOne({ userid: userid });
    if(user !== undefined) {
      throw new HttpException('Duplicated UserID', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 아이디 입니다.'
    }
  }

  public async checkUserNameExists(username: string) {
    const user = await this.usersRepository.findOne({ username: username });
    if(user !== undefined) {
      throw new HttpException('Duplicated UserID', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 유저 이름 입니다.'
    }
  }

  public async emailExists(email: string) {
    const user = await this.usersRepository.findOne({ email: email });
    if(user !== undefined) {
      throw new HttpException('Duplicated UserID', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 메일 주소 입니다.'
    }
  }

  private async saveUser(userid: string, username: string, email: string, password: string, signupVerifyToken: string) {
    const user = new Users();
    user.userid = userid
    user.username = username
    user.email = email
    user.password = password
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user)
  }

  private async sendMemberJoinEmail(username: string, email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, username, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
