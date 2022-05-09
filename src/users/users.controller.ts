import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyCodeReceiverDto } from './dto/verify-code-receiver.dto';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { userid, email, username, password, inputVerifyCode } = createUserDto;
    await this.usersService.createUser(userid, email, username, password, inputVerifyCode);
  }
  
  @Post('/check-userid')
  @HttpCode(200)
  async checkUserid(@Body() userid: string): Promise<void> {
    await this.usersService.checkUserIdExists(userid);
  }

  @Post('/check-email')
  @HttpCode(200)
  async checkEmail(@Body() email: string): Promise<void> {
    await this.usersService.checkEmailExists(email);
  }

  @Post('/check-username')
  @HttpCode(200)
  async checkUsername(@Body() username: string): Promise<void> {
    await this.usersService.checkUserNameExists(username);
  }

  @Post('/register-code')
  @HttpCode(200)
  async sendMemberJoinEmail(@Body() verifyCodeReceiverDto: VerifyCodeReceiverDto): Promise<void> {
    const { email, username } = verifyCodeReceiverDto;
    await this.usersService.sendMemberJoinEmail(email, username);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<any> {
    const { userid, password } = loginUserDto;
    const jwt = await this.usersService.login(userid, password);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }
}
