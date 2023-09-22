import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserFavoriteSubjectService } from './user-favorite-subject.service';
import { CreateUserFavoriteSubjectDto } from './dto/create-user-favorite-subject.dto';
import { UpdateUserFavoriteSubjectDto } from './dto/update-user-favorite-subject.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';
import { Subject } from 'rxjs';

@Controller({ path: 'user-favorite-subject', version: '1' })
export class UserFavoriteSubjectController {
  constructor(
    private readonly userFavoriteSubjectService: UserFavoriteSubjectService,
  ) {}

  @Post('storefavoritesubject/id=:id')
  @UseGuards(AtGuard)
  create(@GetCurrentUserId() userId: string, @Param('id') subjectId: string) {
    return this.userFavoriteSubjectService.create(userId, subjectId);
  }
  @Post('/storemanyfavoritesubject')
  @UseGuards(AtGuard)
  createMany(
    @GetCurrentUserId() userId: string,
    @Body() dto: CreateUserFavoriteSubjectDto,
  ) {
    return this.userFavoriteSubjectService.createMany(userId, dto);
  }

  @UseGuards(AtGuard)
  @Get('getfavoritesubjects')
  findAll(@GetCurrentUserId() userId: string) {
    return this.userFavoriteSubjectService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFavoriteSubjectService.findOne(+id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('/deleteFavorite/')
  remove(
    @GetCurrentUserId() userId: string,
    @Query('subjectId') subjectId: string,
  ) {
    return this.userFavoriteSubjectService.remove(userId, subjectId);
  }
}
