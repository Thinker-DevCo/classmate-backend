import { Body, Controller, Post } from '@nestjs/common';
import { Tokens } from './@types';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  signin(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(dto);
  }

  @Post('/logout')
  logout() {}

  @Post('/refresh')
  refreshTokens() {}
}
