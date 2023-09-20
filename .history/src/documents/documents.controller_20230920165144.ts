import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller({ path: 'documents', version: '1' })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @UseGuards(AtGuard)
  @Get('/findbysimilars')
  findBySimilars(
    @Query('take') take: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.documentsService.filterByCourseSimilars(userId, +take);
  }

  @Get('/findbysubject')
  findbysubject(@Query('subject') subject: string) {
    return this.documentsService.findDocumentByCourseName(subject);
  }
}
