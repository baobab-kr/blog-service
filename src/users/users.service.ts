import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Payload } from 'src/auth/security/payload.interface';
import { EmailService } from 'src/email/email.service';
import { Repository, Connection, getConnection } from 'typeorm';
import { SavedUserDto } from './dto/saved-user.dto';
import { Users } from './entity/user.entity';
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";

@Injectable()
export class UsersService {
  constructor(
    private emailService:EmailService,
    private authService:AuthService,
    @InjectRepository(Users) private usersRepository:Repository<Users>,
    private connection: Connection,
    ) {};

  async createUser(userid: string, email: string, username: string, password: string, inputVerifyCode: number, role: number, techStack: string) {
    await this.checkMemberJoinEmail(username, inputVerifyCode);
    await this.saveUserUsingQueryRunnner(userid, email, username, password, role, techStack);
  }

  async login(userid: string, password: string)  {
    const savedUserInfo: any = await this.getUserInfo(userid);
    const payload: Payload = {
      id: savedUserInfo.id,
      username: savedUserInfo.username
    }
    await this.validateUser(password, savedUserInfo.password);
    const { accessToken, accessOption, accessTokenExpires } = await this.authService.getCookieWithJwtAccessToken(payload);
    const { refreshToken, refreshOption, refreshTokenExpires } = await this.authService.getCookieWithJwtRefreshToken(savedUserInfo);
    await this.updateRefreshTokenInUser(refreshToken, savedUserInfo);

    const resUserDto: any = savedUserInfo
    resUserDto.password = undefined
    resUserDto.currentRefreshToken = undefined
    return {
      accessToken,
      accessOption,
      refreshToken,
      refreshOption,
      user: resUserDto,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async githubLogin(code: string)  {
    // 1. 액세스 토큰이 일치하는지 깃허브 서버에 전달하여 검증
    // 1-1. 일치한다면 2. 로 이동
    // 1-2. 일치하지 않으면 401 오류 반환
    const { access_token } = await this.authService.getGithubAccessToken(code);

    // 2. 깃허브 서버에서 반환한 액세스 토큰으로 사용자 정보 요청
    // 2-1. 일치한다면 3. 로 이동
    // 2-2. 일치하지 않는다면 401 오류 반환
    const githubUserInfo = await this.authService.getGithubUserInfo(access_token);

    // 3. 반환받은 사용자 정보를 데이터베이스에 저장
    // 이때, 업데이트 된 깃허브 정보를 실시간으로 동기화할 수 없으므로 로그인할 때마다 불러와서 새롭게 저장이 필요함
    await this.saveGithubUserUsingQueryRunnner(githubUserInfo.userid, githubUserInfo.email, githubUserInfo.username);
    await this.saveAvatarImgUrlUsingQueryRunnner(githubUserInfo.userid, githubUserInfo.avatar_image);
    await this.saveSocialUrlUsingQueryRunnner(githubUserInfo.userid, githubUserInfo.socialUrl);

    // 4. 바오밥 서비스의 액세스 토큰 및 리프레쉬 토큰 발급
    const savedUserInfo: any = await this.getUserInfo(githubUserInfo.userid);
    const payload: Payload = {
      id: savedUserInfo.id,
      username: savedUserInfo.username
    }
    const { accessToken, accessOption, accessTokenExpires } = await this.authService.getCookieWithJwtAccessToken(payload);
    const { refreshToken, refreshOption, refreshTokenExpires } = await this.authService.getCookieWithJwtRefreshToken(savedUserInfo);
    await this.updateRefreshTokenInUser(refreshToken, savedUserInfo);
    
    // 5. 컨트롤러에 반환
    const resUserDto: any = savedUserInfo
    resUserDto.password = undefined
    resUserDto.currentRefreshToken = undefined
    return {
      accessToken,
      accessOption,
      refreshToken,
      refreshOption,
      user: resUserDto,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async saveAvatarImgUrlUsingQueryRunnner(userid: string, avatar_image_url: string) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
      const user = await this.usersRepository.findOne({userid: userIdValue});
      user.userid = userid
      user.avatar_image = avatar_image_url
      await this.usersRepository.save(user)
      
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkUserIdExists(userid: string) {
    const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
    const user = await this.usersRepository.findOne({userid: userIdValue});
    if(user !== undefined) {
      throw new HttpException('Duplicated UserID', HttpStatus.CONFLICT)
    } else {
      return '사용 가능한 아이디 입니다.'
    }
  }

  async checkUserIdNotExists(userid: string) {
    const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
    const user = await this.usersRepository.findOne({userid: userIdValue});
    if(user === undefined) {
      throw new HttpException('Not Found UserID', HttpStatus.NOT_FOUND)
    } else {
      return '사용 가능한 아이디 입니다.'
    }
  }
  
  async checkEmailExists(email: string) {
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
  
  private async saveGithubUserUsingQueryRunnner(userid: string, email: string, username: string) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
      const user = await this.usersRepository.findOne({userid: userIdValue});
      if (user === undefined) { 
        const newUser = new Users(); 
        newUser.userid = userid
        newUser.email = email
        newUser.username = username
        await this.usersRepository.save(newUser)
      } else {
        user.userid = userid
        user.email = email
        user.username = username
        await this.usersRepository.save(user)
      }
      
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveUserUsingQueryRunnner(userid: string,  email: string, username: string, password: string, role: number, techStack: string) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new Users();
      user.userid = userid
      user.email = email
      user.username = username
      user.password = await this.authService.encrpytionData(password)
      user.role = role
      user.techStack = techStack
      await this.usersRepository.save(user)
      
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveSocialUrlUsingQueryRunnner(userid: string, socialUrl: string) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
      const user = await this.usersRepository.findOne({userid: userIdValue});
      user.userid = userid
      user.socialUrl = socialUrl
      await this.usersRepository.save(user)
      
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveDescriptionUsingQueryRunnner(userid: string, description: string) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
      const user = await this.usersRepository.findOne({userid: userIdValue});
      user.userid = userid
      user.description = description
      await this.usersRepository.save(user)
      
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveTechStackUsingQueryRunnner(userid: string, techStack: string) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
      const user = await this.usersRepository.findOne({userid: userIdValue});
      user.userid = userid
      user.techStack = techStack
      await this.usersRepository.save(user)
      
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  
  private async createVerifyCode(): Promise<number> {
    let verifyCode = Math.floor(Math.random() * 1000000);
    while (verifyCode.toString().length == 6) {verifyCode = verifyCode*10}
    return verifyCode;
  }
  
  async sendMemberJoinEmail(email: string, username: string) {
    const verifyCode: number = await this.createVerifyCode();
    await this.emailService.sendMemberJoinVerification(email, username, verifyCode);
  }
  
  private async checkMemberJoinEmail(username: string, inputVerifyCode: number):Promise<void> {
    await this.authService.checkVerifyCode(username, inputVerifyCode);
  }

  async getUserInfo(userid: string):Promise<SavedUserDto> {
    const user = await this.usersRepository.findOne({userid});
    if(user === undefined) {
      throw new HttpException('Invalid UserID', HttpStatus.UNAUTHORIZED)
    }
    return user;
  }

  async validateUser(inputPassword: string, savedPassword: string) {
    const valid = await this.authService.comparePassword(inputPassword, savedPassword);
    if(!valid) {
      throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED)
    } 
  }

  async tokenValidateUser(payload: Payload) {
    const username = payload.username;
    const userInfo = await this.usersRepository.findOne({username});
    if(!userInfo) {
      throw new HttpException('User Does Not Exist.', HttpStatus.UNAUTHORIZED)
    } 
    return userInfo;
  }

  async updateRefreshTokenInUser(refreshToken: string, savedUserInfo: SavedUserDto): Promise<void> {
    const username = savedUserInfo.username
    await this.usersRepository.update(
      { username },
      { currentRefreshToken: refreshToken },
    );
  }

  async getUserRefreshTokenMatches( refreshToken: string, user): Promise<{result: boolean}> {
    const savedUserInfo = user
    const isRefreshTokenMatch = this.authService.getUserRefreshTokenMatches(refreshToken, savedUserInfo.currentRefreshToken);
    if (isRefreshTokenMatch) return { result: true };
    else throw new UnauthorizedException();
  }

  async removeRefreshToken(id: number) {
    return this.usersRepository.update(id, {currentRefreshToken: null});
  }

  getBlobClient(imageName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTIONS);
    const containerClient = blobClientService.getContainerClient(process.env.AZURE_BLOB_CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }
 
  async uploadProfile(file){
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async getProfile(fileName){
    var blobClient = this.getBlobClient(fileName);
    const isExist:Boolean = await blobClient.exists();
    if (!isExist) {
      blobClient = this.getBlobClient('profile-default');
    }
    var blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  async createSocialUrl(userid: string, socialUrl: string) {
    await this.checkUserIdNotExists(userid);
    await this.saveSocialUrlUsingQueryRunnner(userid, socialUrl);
  }

  async updateTechStack(userid: string, techStack: string) {
    await this.checkUserIdNotExists(userid);
    await this.saveTechStackUsingQueryRunnner(userid, techStack);
  }

  async deleteUser(userid: string) {
    await this.checkUserIdNotExists(userid);
    const userIdValue: string = typeof userid !== typeof "" ? Object.values(userid)[0] : userid
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Users)
    .where(`userid = "${userIdValue}"`)
    .execute();
  }

  async createDescription(userid: string, description: string) {
    await this.checkUserIdNotExists(userid);
    await this.saveDescriptionUsingQueryRunnner(userid, description);
  }
}