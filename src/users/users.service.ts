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

  async createUser(userid: string, email: string, username: string, password: string) {
    const signupVerifyToken = uuid.v1();
    await this.checkUserIdExists(userid)
    await this.checkUserNameExists(username)
    await this.checkEmailExists(email)

    await this.saveUser(userid, email, username, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, username, signupVerifyToken);
  }

  public async checkUserIdExists(userid: string) {
    const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
    const user = await this.usersRepository.findOne({userid: userIdValue});
    if(user !== undefined) {
      throw new HttpException('Duplicated UserID', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 아이디 입니다.'
    }
  }
  
  public async checkEmailExists(email: string) {
    const emailValue: string = typeof email !== typeof "" ? Object.values(email)[0] : email
    const user = await this.usersRepository.findOne({email: emailValue});
    if(user !== undefined) {
      throw new HttpException('Duplicated E-Mail Address', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 메일 주소 입니다.'
    }
  }
  
  public async checkUserNameExists(username: string) {
    const userNameValue: string = typeof username !== typeof "" ? Object.values(username)[0] : username
    const user = await this.usersRepository.findOne({username: userNameValue});
    if(user !== undefined) {
      throw new HttpException('Duplicated Username', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 유저 이름 입니다.'
    }
  }


  private async saveUser(userid: string,  email: string, username: string, password: string, signupVerifyToken: string) {
    const user = new Users();
    user.userid = userid
    user.email = email
    user.username = username
    user.password = password
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user)
  }

  private async sendMemberJoinEmail(email: string, username: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, username, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
