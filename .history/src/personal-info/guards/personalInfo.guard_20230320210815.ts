import { AuthGuard } from '@nestjs/passport';

export class PinfoGuard extends AuthGuard('pInfo') {
  constructor() {
    super();
  }
}
