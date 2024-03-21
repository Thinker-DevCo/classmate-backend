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
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@UseGuards(AtGuard)
@Controller({ path: 'list', version: '1' })
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('createlist')
  create(
    @Body() createListDto: CreateListDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.listService.createList(createListDto, userId);
  }

  @Post('listassessment')
  listAssessment(@Body() dto: { assessment_id: string; list_id: string }) {
    return this.listService.listAssessment(dto.assessment_id, dto.list_id);
  }

  @Post('listlesson')
  listLesson(@Body() dto: { lesson_id: string; list_id: string }) {
    return this.listService.listAssessment(dto.lesson_id, dto.list_id);
  }
  @Post('listuserdocuments')
  listUserDocuments(
    @Body() dto: { userdocuments_id: string; list_id: string },
  ) {
    return this.listService.listAssessment(dto.userdocuments_id, dto.list_id);
  }

  @Get('findalllists')
  findAllUserLists(@GetCurrentUserId() user_id: string) {
    return this.listService.findAllLists(user_id);
  }
  @Get('findOneUserList')
  findOneUserList(
    @GetCurrentUserId() user_id: string,
    @Query('list_id') list_id: string,
  ) {
    return this.listService.findOnelist(list_id);
  }

  @Patch('updatelist')
  updateList(
    @Query('list_id') id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.updateList(id, updateListDto);
  }

  @Delete('removeassessment')
  removeAssessment(
    @Query('list_id') list_id: string,
    @Query('assessment_id') assessment_id: string,
    @GetCurrentUserId() user_id: string,
  ) {
    return this.listService.removeAssessmentOnList(
      list_id,
      assessment_id,
      user_id,
    );
  }
  @Delete('removelesson')
  removeLesson(
    @Query('list_id') list_id: string,
    @Query('lesson_id') lesson_id: string,
    @GetCurrentUserId() user_id: string,
  ) {
    return this.listService.removeLessonOnList(list_id, lesson_id, user_id);
  }
  @Delete('removeuserdocument')
  removeUserDocument(
    @Query('list_id') list_id: string,
    @Query('userdocument_id') userdocument_id: string,
    @GetCurrentUserId() user_id: string,
  ) {
    return this.listService.removeUserDocumentOnList(
      list_id,
      userdocument_id,
      user_id,
    );
  }
}
