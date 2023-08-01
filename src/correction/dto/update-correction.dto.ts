import { PartialType } from '@nestjs/mapped-types';
import { CreateCorrectionDto } from './create-correction.dto';

export class UpdateCorrectionDto extends PartialType(CreateCorrectionDto) {}
