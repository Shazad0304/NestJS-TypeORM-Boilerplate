import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { LoginPayload } from './login.payload';
import { JwtPayload } from './jwt.payload';
import { UsersService } from 'modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService : UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      // passReqToCallback: true,
    });
  }

  // async validate({ iat, exp }: JwtPayload) {
  //   const isExpired = exp - iat <= 0;
  //   if (isExpired) {
  //     throw new UnauthorizedException();
  //   }
  //   return {};
  // }
  async validate(payload: any) {
    console.log("Current User",payload)
    const user : any = await this.userService.get(payload.id);
    if (!user) {
      throw new NotFoundException();
    }
    else{
      delete user.password;
    }
    return user;
  }

  // version from https://github.com/abouroubi/nestjs-auth-jwt/blob/master/src/auth/strategies/jwt-strategy.ts
  // async validate(req, payload: JwtPayload) {
  //   // Little hack but ¯\_(ツ)_/¯
  //   const self: any = this;
  //   const token = self._jwtFromRequest(req);
  //   // We can now use this token to check it against black list
  //   // @todo: check against black list :D
  //   const result = await this.authService.validatePayload(payload);
  //   if (!result) {
  //     throw new UnauthorizedException();
  //   }
  //   return result;
  // }
}
