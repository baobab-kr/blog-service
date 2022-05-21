import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { VerifyCallback } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => 
        {
          return request?.cookies?.RefreshToken;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    })
  }
  
  async validate(request: Request, payload: Payload, done: VerifyCallback) {
    const refreshToken = request.cookies?.RefreshToken;
    const user = await this.usersService.tokenValidateUser(payload);
    await this.usersService.getUserRefreshTokenMatches(refreshToken, user);
    return done(null, user);
  }
}