import { IsNotEmpty, IsString, IsUrl, isString } from "class-validator";

enum AssessmentType {
    MINI_TEST= "MINI_TEST",
    TEST = "TEST",
    EXAM= "EXAM",
    EXTRA= "EXTRA
}
export class CreateAssessmentDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsUrl()
    @IsNotEmpty()
    url: string

    @
}
