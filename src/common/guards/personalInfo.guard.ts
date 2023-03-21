import { AuthGuard } from '@nestjs/passport';

export class PinfoGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
