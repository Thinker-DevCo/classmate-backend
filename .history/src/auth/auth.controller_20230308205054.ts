import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Tokens } from './@types';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() userId: string) {
    return this.authService.logout(userId);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens() {}
}
