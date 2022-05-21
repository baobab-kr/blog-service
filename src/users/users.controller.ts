import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyCodeReceiverDto } from './dto/verify-code-receiver.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtAccessTokenGuard } from 'src/auth/security/jwtAccessToken.guard';
import { JwtRefreshTokenGuard } from 'src/auth/security/jwtRefreshToken.guard';
import { AuthService } from 'src/auth/auth.service';
import { SavedUserDto } from './dto/saved-user.dto';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

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
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough:true}) res: Response): Promise<any> {
    const { userid, password } = loginUserDto;
    const { accessToken, accessOption, refreshToken, refreshOption, user } = await this.usersService.login(userid, password);
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('AccessToken', accessToken, accessOption);
    res.cookie('RefreshToken', refreshToken, refreshOption);
    return user;
  }

  @Get('')
  @UseGuards(JwtAccessTokenGuard)
  isAuthenticated(@Req() req: Request): Promise<SavedUserDto> { 
    const user: any = req.user;
    user.password = undefined
    user.currentRefreshToken = undefined
    return user;
  }

  @Get('/refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Req() req: Request, @Res({passthrough:true}) res: Response): Promise<any> { 
    const user: any = req.user;
    if (user) {
      const payload: Payload = {
        id: user.id,
        username: user.username
      }
      const { accessToken, accessOption } = await this.authService.getCookieWithJwtAccessToken(payload);
      res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('AccessToken', accessToken, accessOption);
      user.password = undefined
      user.currentRefreshToken = undefined
      return user;
    }
  }

  @Get('/logout')
  @UseGuards(JwtRefreshTokenGuard)
  async logOut(@Req() req: Request, @Res({passthrough:true}) res: Response):Promise<void> {
    const user: any = req.user;
    const id = user.id;
    const { accessOption, refreshOption } = this.authService.getCookiesForLogOut();
    await this.usersService.removeRefreshToken(id);
    res.cookie('AccessToken', '', accessOption);
    res.cookie('RefreshToken', '', refreshOption);
  }
}
