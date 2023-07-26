import { PartialType } from '@nestjs/mapped-types';
import { IsJSON, IsOptional, IsString } from 'class-validator';
import { SchoolDto } from './school.dto';

export class UpdateSchoolDto extends PartialType(SchoolDto) {}
