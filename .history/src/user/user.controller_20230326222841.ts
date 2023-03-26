import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
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
  updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, dto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('/deleteuser/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AtGuard)
  @Get('/getcurrentuser')
  getCurrentUser(@GetCurrentUserId() userID: string) {
    return this.userService.getUserById(userID);
  }
}
