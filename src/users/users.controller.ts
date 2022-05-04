import { Body, Controller,HttpCode,Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { userid, email, username, password } = createUserDto;
    await this.usersService.createUser(userid, email, username, password);
  }
  
  @Post('/check-userid')
  @HttpCode(200)
  async checkUserid(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { userid } = createUserDto;
    await this.usersService.checkUserIdExists(userid);
  }

  @Post('/check-username')
  @HttpCode(200)
  async checkUsername(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { username } = createUserDto;
    await this.usersService.checkUserNameExists(username);
  }

  @Post('/check-email')
  @HttpCode(200)
  async checkEmail(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { email } = createUserDto;
    await this.usersService.emailExists(email);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;
  
    return await this.usersService.verifyEmail(signupVerifyToken);
  }
}
