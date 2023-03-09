import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/getall')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
