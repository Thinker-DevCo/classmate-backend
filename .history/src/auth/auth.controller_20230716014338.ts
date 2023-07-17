import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { Tokens } from './@types';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { FastifyRequest, FastifyReply } from 'fastify';
import { OauthDto } from './dto/oauth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('signwithoauth')
  @HttpCode(HttpStatus.OK)
  signWithOAuth(@Body() dto: OauthDto) {
    return this.authService.SignWithOauth(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userid: string) {
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