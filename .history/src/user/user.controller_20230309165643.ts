import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/getall')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/getuser/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('/getuserbyemail/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('/updateuser/:id')
  updateUser(@Body() dto: UpdateUserDto, @Param('ID') id: string) {
    return this.userService.updateUserById(id, dto);
  }
}
