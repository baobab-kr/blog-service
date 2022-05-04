import { Injectable, Post, Query, UnprocessableEntityException } from '@nestjs/common';
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
    const useridExist = await this.checkUserIdExists(userid);
    if (useridExist) {
      throw new UnprocessableEntityException("해당 유저 ID로는 가입할 수 없습니다.");
    }

    const usernameExist = await this.checkUserNameExists(username);
    if (usernameExist) {
      throw new UnprocessableEntityException("해당 유저 이름으로는 가입할 수 없습니다.");
    }

    const emailExist = await this.emailExists(email);
    if (emailExist) {
      throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(userid, email, username, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, username, signupVerifyToken);
  }

  private async checkUserIdExists(userid: string) {
    const user = await this.usersRepository.findOne({ userid: userid });

    return user !== undefined;
  }

  private async checkUserNameExists(username: string) {
    const user = await this.usersRepository.findOne({ username: username });
    return user !== undefined;
  }

  private async emailExists(email: string) {
    const user = await this.usersRepository.findOne({ email: email });
    return user !== undefined;
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
