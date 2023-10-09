import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserFavoriteDocementsService } from './user-favorite-docements.service';
import { CreateUserFavoriteDocementDto } from './dto/create-user-favorite-docement.dto';
import { UpdateUserFavoriteDocementDto } from './dto/update-user-favorite-docement.dto';

@Controller('user-favorite-docements')
export class UserFavoriteDocementsController {
  constructor(private readonly userFavoriteDocementsService: UserFavoriteDocementsService) {}

  @Post()
  create(@Body() createUserFavoriteDocementDto: CreateUserFavoriteDocementDto) {
    return this.userFavoriteDocementsService.create(createUserFavoriteDocementDto);
  }

  @Get()
  findAll() {
    return this.userFavoriteDocementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFavoriteDocementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFavoriteDocementDto: UpdateUserFavoriteDocementDto) {
    return this.userFavoriteDocementsService.update(+id, updateUserFavoriteDocementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFavoriteDocementsService.remove(+id);
  }
}
