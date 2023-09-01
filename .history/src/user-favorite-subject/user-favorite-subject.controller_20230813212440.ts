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
import { UserFavoriteSubjectService } from './user-favorite-subject.service';
import { CreateUserFavoriteSubjectDto } from './dto/create-user-favorite-subject.dto';
import { UpdateUserFavoriteSubjectDto } from './dto/update-user-favorite-subject.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user-favorite-subject')
export class UserFavoriteSubjectController {
  constructor(
    private readonly userFavoriteSubjectService: UserFavoriteSubjectService,
  ) {}

  @Post('/favoritesubject/store/id=:id')
  @UseGuards(AtGuard)
  create(@GetCurrentUserId() userId: string, @Param('id') subjectId: string) {
    return this.userFavoriteSubjectService.create(userId, subjectId);
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
  update(
    @Param('id') id: string,
    @Body() updateUserFavoriteSubjectDto: UpdateUserFavoriteSubjectDto,
  ) {
    return this.userFavoriteSubjectService.update(
      +id,
      updateUserFavoriteSubjectDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFavoriteSubjectService.remove(+id);
  }
}
