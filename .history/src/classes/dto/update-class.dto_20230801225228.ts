import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-lesson.dto';

export class UpdateClassDto extends PartialType(CreateClassDto) {}
