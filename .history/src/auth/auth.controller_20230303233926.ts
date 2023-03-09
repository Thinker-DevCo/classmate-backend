import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  signin() {}

  @Post('/logout')
  logout() {}

  @Post('/refresh')
  refreshTokens() {}
}
