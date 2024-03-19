import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { UserDocumentsService } from './user-documents.service';
import { CreateUserDocumentDto } from './dto/create-user-document.dto';
import { UpdateUserDocumentDto } from './dto/update-user-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';

@UseGuards(AtGuard)
@Controller({ path: 'user-documents', version: '1' })
export class UserDocumentsController {
  constructor(private readonly userDocumentsService: UserDocumentsService) {}

  @Post('storedocument')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUserDocumentDto: CreateUserDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 5000 }),
          // new FileTypeValidator({ fileType: '.(pdf|docx)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ) {
    return this.userDocumentsService.create(
      createUserDocumentDto,
      file.buffer,
      userId,
    );
  }

  @Get('getUserDocuments')
  findAll(@GetCurrentUserId() userId: string) {
    return this.userDocumentsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDocumentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDocumentDto: UpdateUserDocumentDto,
  ) {
    return this.userDocumentsService.update(id, updateUserDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDocumentsService.remove(id);
  }
}
