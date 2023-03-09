import { Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { reque } from '@nestjs/platform-fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }
  validate(@Req() req: ,payload: any) {
    return payload;
  }
}
