import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserDocumentsService } from './user-documents.service';
import { CreateUserDocumentDto } from './dto/create-user-document.dto';
import { UpdateUserDocumentDto } from './dto/update-user-document.dto';

@Controller('user-documents')
export class UserDocumentsController {
  constructor(private readonly userDocumentsService: UserDocumentsService) {}

  @Post()
  create(@Body() createUserDocumentDto: CreateUserDocumentDto) {
    return this.userDocumentsService.create(createUserDocumentDto);
  }

  @Get()
  findAll() {
    return this.userDocumentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDocumentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDocumentDto: UpdateUserDocumentDto) {
    return this.userDocumentsService.update(+id, updateUserDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDocumentsService.remove(+id);
  }
}
