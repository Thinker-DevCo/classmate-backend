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
} from '@nestjs/common';
import { UserFavoriteDocumentsService } from './user-favorite-documents.service';
import { CreateUserFavoriteDocementDto } from './dto/create-user-favorite-docement.dto';
import { UpdateUserFavoriteDocementDto } from './dto/update-user-favorite-docement.dto';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller({ version: '1', path: 'user-favorite-documents' })
export class UserFavoriteDocumentsController {
  constructor(
    private readonly userFavoriteDocementsService: UserFavoriteDocumentsService,
  ) {}

  @UseGuards(AtGuard)
  @Post('storelesson')
  createLesson(
    @GetCurrentUserId() user_id: string,
    @Query('lesson_id') lesson_id: string,
  ) {
    return this.userFavoriteDocementsService.createLesson(user_id, lesson_id);
  }
  @UseGuards(AtGuard)
  @Post('storeAssessment')
  createAssessment(
    @GetCurrentUserId() user_id: string,
    @Query('assessment_id') assessment_id: string,
  ) {
    return this.userFavoriteDocementsService.createAssessment(
      user_id,
      assessment_id,
    );
  }

  @UseGuards(AtGuard)
  @Get('getall')
  findAll(@GetCurrentUserId() user_id: string) {
    return this.userFavoriteDocementsService.findAll(user_id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userFavoriteDocementsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserFavoriteDocementDto: UpdateUserFavoriteDocementDto) {
  //   return this.userFavoriteDocementsService.update(+id, updateUserFavoriteDocementDto);
  // }
  @UseGuards(AtGuard)
  @Delete('deleteLesson')
  removeLesson(
    @GetCurrentUserId() user_id: string,
    @Query('lesson_id') lesson_id: string,
  ) {
    return this.userFavoriteDocementsService.removeLesson(user_id, lesson_id);
  }
  @UseGuards(AtGuard)
  @Delete('deleteAssessment')
  removeAssessment(
    @GetCurrentUserId() user_id: string,
    @Query('assessment_id') assessment_id: string,
  ) {
    return this.userFavoriteDocementsService.removeLesson(
      user_id,
      assessment_id,
    );
  }
}
