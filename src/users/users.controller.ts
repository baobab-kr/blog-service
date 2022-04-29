import { Body, Controller,Post, Query } from '@nestjs/common';
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

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;
  
    return await this.usersService.verifyEmail(signupVerifyToken);
  }
}
