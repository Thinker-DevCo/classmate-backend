import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { Tokens } from './@types';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { FastifyRequest, FastifyReply } from 'fastify';
import { OauthDto } from './dto/oauth.dto';
import { Response } from 'express';
import { log } from 'console';
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let signup: any;
    if (dto.provider && dto.providerUserId) {
      signup = await this.authService.findOrCreateOauthUser(dto);
    } else {
      signup = await this.authService.signUp(dto);
    }
    this.authService.setTokensCookies(res, signup.tokens);
    delete signup.tokens;
    return signup;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const login = await this.authService.signIn(dto);
    res.cookie('access_token', login.tokens.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.cookie('refresh_token', login.tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 20 * 24 * 7),
    });
    delete login.tokens;
    return login;
  }

  @Post('signwithoauth')
  @HttpCode(HttpStatus.OK)
  signWithOAuth(@Body() dto: OauthDto) {
    return this.authService.findOrCreateOauthUser(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token');
    return this.authService.logout(userid);
  }
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') rt: string,
  ) {
    return this.authService.refreshTokens(userId, rt);
  }
}
