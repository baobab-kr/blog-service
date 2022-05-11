import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => { return request?.cookies?.Refresh; }
      ]),
      ignoreExpiration: true,
      secretOrKey: 'SECRET',
      passReqToCallBack: true,
    })
  }

  async validate(req, payload: Payload, done: VerifiedCallback): Promise<any> {
    const refreshToken = req.cookies?.Refresh;
    console.log(refreshToken);
    await this.usersService.getUserRefreshTokenMatches(refreshToken, payload.username);
    console.log()
    const user = await this.usersService.tokenValidateUser(payload);
    return done(null, user);
  }
}