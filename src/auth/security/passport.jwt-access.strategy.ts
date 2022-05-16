import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { Payload } from "./payload.interface";
import { UsersService } from "src/users/users.service";
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access-token'){
  constructor(
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => 
        {
          return request?.cookies?.AccessToken;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: 'SECRET',
    })
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.usersService.tokenValidateUser(payload);
    return done(null, user);
  }
}
