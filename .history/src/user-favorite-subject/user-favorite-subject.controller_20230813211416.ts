import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserFavoriteSubjectService } from './user-favorite-subject.service';
import { CreateUserFavoriteSubjectDto } from './dto/create-user-favorite-subject.dto';
import { UpdateUserFavoriteSubjectDto } from './dto/update-user-favorite-subject.dto';

@Controller('user-favorite-subject')
export class UserFavoriteSubjectController {
  constructor(private readonly userFavoriteSubjectService: UserFavoriteSubjectService) {}

  @Post()
  create(@Body() createUserFavoriteSubjectDto: CreateUserFavoriteSubjectDto) {
    return this.userFavoriteSubjectService.create(createUserFavoriteSubjectDto);
  }

  @Get()
  findAll() {
    return this.userFavoriteSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFavoriteSubjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFavoriteSubjectDto: UpdateUserFavoriteSubjectDto) {
    return this.userFavoriteSubjectService.update(+id, updateUserFavoriteSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFavoriteSubjectService.remove(+id);
  }
}
