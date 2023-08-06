import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('storeassessment')
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentService.create(createAssessmentDto);
  }

  @Get('/getaallassessment')
  findAll() {
    return this.assessmentService.findAll();
  }

  @Get('/getassessment/id=:id')
  findOne(@Param('id') id: string) {
    return this.assessmentService.findOne(id);
  }

  @Patch('/updateassessmet/id=:id')
  update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return this.assessmentService.update(id, updateAssessmentDto);
  }

  @Delete('/deleteassessment/id=:id')
  remove(@Param('id') id: string) {
    return this.assessmentService.remove(id);
  }
}
