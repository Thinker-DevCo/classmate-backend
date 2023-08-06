import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
enum ClassType {
  EXERCISE = 'EXERCISE',
  APPOINTAMENTS = 'APPOINTAMENTS',
}
export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(ClassType)
  @IsNotEmpty()
  classType: ClassType;
}
