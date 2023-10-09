import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserFavoriteDocementsService } from './user-favorite-docements.service';
import { CreateUserFavoriteDocementDto } from './dto/create-user-favorite-docement.dto';
import { UpdateUserFavoriteDocementDto } from './dto/update-user-favorite-docement.dto';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user-favorite-docements')
export class UserFavoriteDocementsController {
  constructor(
    private readonly userFavoriteDocementsService: UserFavoriteDocementsService,
  ) {}

  @UseGuards(AtGuard)
  @Post()
  create(@GetCurrentUserId() user_id: string, lesson_id: string) {
    return this.userFavoriteDocementsService.createLesson(user_id, lesson_id);
  }

  // @Get()
  // findAll() {
  //   return this.userFavoriteDocementsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userFavoriteDocementsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserFavoriteDocementDto: UpdateUserFavoriteDocementDto) {
  //   return this.userFavoriteDocementsService.update(+id, updateUserFavoriteDocementDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userFavoriteDocementsService.remove(+id);
  // }
}
