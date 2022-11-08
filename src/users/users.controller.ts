import { Body, Controller, Get, Header, HttpCode, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SocialUrlDto } from './dto/social-url.dto';
import { VerifyCodeReceiverDto } from './dto/verify-code-receiver.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtAccessTokenGuard } from 'src/auth/security/jwtAccessToken.guard';
import { JwtRefreshTokenGuard } from 'src/auth/security/jwtRefreshToken.guard';
import { AuthService } from 'src/auth/auth.service';
import { SavedUserDto } from './dto/saved-user.dto';
import { Payload } from 'src/auth/security/payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { TechStackDto } from './dto/tech-Stack.dto';

@Controller('users')
@ApiTags('Users API')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary:'회원가입 API',
    description:'유저 ID, 메일 주소, 닉네임, 비밀번호, 회원가입 인증코드, 역할, 기술스택을 입력 받아 사용자를 생성한다.',
  })
  @ApiResponse({
    description: '데이터베이스에 유저 정보가 저장됩니다.'
  })
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { userid, email, username, password, inputVerifyCode, role, techStack } = createUserDto;
    await this.usersService.createUser(userid, email, username, password, inputVerifyCode, role, techStack);
  }
  
  @ApiOperation({
    summary:'유저ID 중복 인증 API',
    description:'현재 사용 중인 유저 ID인지 중복성을 체크합니다.',
  })
  @ApiResponse({
    description: '사용 중인 값인지 아닌지 확인하여 결과를 반환합니다.'
  })
  @Post('/check-userid')
  @HttpCode(200)
  async checkUserid(@Body() userid: string): Promise<void> {
    await this.usersService.checkUserIdExists(userid);
  }

  @ApiOperation({
    summary:'이메일 중복 인증 API',
    description:'현재 사용 중인 이메일인지 중복성을 체크합니다.',
  })
  @ApiResponse({
    description: '사용 중인 값인지 아닌지 확인하여 결과를 반환합니다.'
  })
  @Post('/check-email')
  @HttpCode(200)
  async checkEmail(@Body() email: string): Promise<void> {
    await this.usersService.checkEmailExists(email);
  }

  @ApiOperation({
    summary:'닉네임 중복 인증 API',
    description:'현재 사용 중인 닉네임인지 중복성을 체크합니다.',
  })
  @ApiResponse({
    description: '사용 중인 값인지 아닌지 확인하여 결과를 반환합니다.'
  })
  @Post('/check-username')
  @HttpCode(200)
  async checkUsername(@Body() username: string): Promise<void> {
    await this.usersService.checkUserNameExists(username);
  }

  @ApiOperation({
    summary:'회원가입 이메일 유효성 입증을 위한 메일 전송 API',
    description:'사용자의 이메일로 inputVerifyCode(유효성 입증 인증번호)를 전송합니다.',
  })
  @ApiResponse({
    description: '해당 메일로 유효성 입증을 위한 인증번호를 전송합니다.'
  })
  @Post('/register-code')
  @HttpCode(200)
  async sendMemberJoinEmail(@Body() verifyCodeReceiverDto: VerifyCodeReceiverDto): Promise<void> {
    const { email, username } = verifyCodeReceiverDto;
    await this.usersService.sendMemberJoinEmail(email, username);
  }

  @ApiOperation({
    summary:'로그인 API',
    description:'회원가입 API로 생성된 유저의 정보로 로그인합니다.',
  })
  @ApiResponse({
    description: '로그인 성공 시 AT(Access Token) 및 RT(Refresh Token)을 헤더에 반환합니다.'
  })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough:true}) res: Response): Promise<any> {
    const { userid, password } = loginUserDto;
    const { accessToken, accessOption, refreshToken, refreshOption, user, accessTokenExpires, refreshTokenExpires } = await this.usersService.login(userid, password);
    res.setHeader('ATExpires', + accessTokenExpires);
    res.setHeader('RTExpires', + refreshTokenExpires);
    res.cookie('AccessToken', accessToken, accessOption);
    res.cookie('RefreshToken', refreshToken, refreshOption);
    return user;
  }

  @ApiOperation({
    summary:'액세스 토큰 유효성 확인 API',
    description:'현재 사용자의 액세스 토큰이 유효한지 확인합니다.',
  })
  @ApiResponse({
    description: '유효한 값인 경우 사용자의 정보를 반환합니다.'
  })
  @Get('')
  @UseGuards(JwtAccessTokenGuard)
  isAuthenticated(@Req() req: Request): Promise<SavedUserDto> { 
    const user: any = req.user;
    user.password = undefined
    user.currentRefreshToken = undefined
    return user;
  }

  @ApiOperation({
    summary:'액세스 토큰 재발급 API',
    description:'현재 사용자의 액세스 토큰을 재발급 합니다.',
  })
  @ApiResponse({
    description: '유효한 리프레쉬 토큰 값인 경우 사용자의 액세스 토큰을 재발급합니다.'
  })
  @Get('/refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Req() req: Request, @Res({passthrough:true}) res: Response): Promise<any> { 
    const user: any = req.user;
    if (user) {
      const payload: Payload = {
        id: user.id,
        username: user.username
      }
      const { accessToken, accessOption, accessTokenExpires, } = await this.authService.getCookieWithJwtAccessToken(payload);
      res.setHeader('ATExpires', + accessTokenExpires);
      res.cookie('AccessToken', accessToken, accessOption);
      user.password = undefined
      user.currentRefreshToken = undefined
      return user;
    }
  }

  @ApiOperation({
    summary:'로그아웃 API',
    description:'로그아웃을 수행합니다.',
  })
  @ApiResponse({
    description: '현재 사용자의 액세스 토큰 및 리프레쉬 토큰을 만료 시킵니다.'
  })
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

  @ApiOperation({
    summary:'프로필 업로드 API',
    description:'유저 프로필을 업로드합니다. 파일과 유저ID를 전달해야 합니다.',
  })
  @ApiResponse({
    description: '현재 사용자의 프로필을 Azure Storage에 업로드합니다.'
  })
  // @ApiConsumes('multipart/form-data', 'application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 이미지와 프로필 이미지를 사용할 유저의 아이디를 입력합니다.',
    type: FileUploadDto,
  })
  @Post('/upload-profile')
  @UseInterceptors(FileInterceptor('profile'))
  async uploadProfile(@UploadedFile() file, @Body() userid: string) {
    file.originalname = userid['userid'].replace(/\"/gi, "");
    await this.usersService.uploadProfile(file);
  }

  @ApiOperation({
    summary:'프로필 읽기 API',
    description:'업로드된 유저 프로필 이미지를 확인할 수 있습니다.',
  })
  @ApiResponse({
    description: 'Azure Storage에 저장된 사용자의 프로필 이미지를 반환합니다.'
  })
  @Get('/read-profile')
  @Header('Content-Type','image/webp')
  async getProfile(@Res() res, @Query('userid') userid) {
    userid = userid.replace(/\"/gi, "");
    const file = await this.usersService.getProfile(userid);
    return file.pipe(res);
  }

  @ApiOperation({
    summary:'socialUrl 생성 API',
    description:'유저 ID, socialUrl를 입력 받아 사용자의 socialUrl 정보를 생성하거나 업데이트한다.',
  })
  @ApiResponse({
    description: '데이터베이스에 유저의 socialUrl 정보가 저장됩니다.'
  })
  @Post('/create-socialUrl')
  async createSocialUrl(@Body() socialUrlDto: SocialUrlDto ): Promise<void> {
    const { userid, socialUrl } = socialUrlDto;
    await this.usersService.createSocialUrl(userid, socialUrl);
  }

  @ApiOperation({
    summary:'techStack 수정 API',
    description:'유저 ID, techStack를 입력 받아 사용자의 techStack 정보를 업데이트한다.',
  })
  @ApiResponse({
    description: '데이터베이스에 유저의 techStack를 정보가 저장(업데이트)됩니다.'
  })
  @Post('/update-techStack')
  async updateTechStack(@Body() techStackDto: TechStackDto ): Promise<void> {
    const { userid, techStack } = techStackDto;
    await this.usersService.updateTechStack(userid, techStack);
  }
}
