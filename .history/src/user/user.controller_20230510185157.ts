import {
  Body,
  CACHE_MANAGER,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Cache } from 'cache-manager';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
  ) {}

  @Get('/getall')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/getuser/:id')
  async getUserById(@Param('id') id: string) {
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
