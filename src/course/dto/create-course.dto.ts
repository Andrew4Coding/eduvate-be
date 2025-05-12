import { COURSE_CATEGORY } from "@prisma/client";

export class CreateCourseDto {
    name: string;
    code: string;
    description: string;
    category: COURSE_CATEGORY;
    isHidden: boolean;
}

export class UpdateCourseDto {
    name?: string;
    code?: string;
    description?: string;
    category?: COURSE_CATEGORY;
    isHidden?: boolean;
}

export class AddCourseSectionDto { 
    courseId: string;
    name: string;
    description?: string;
}

export class UpdateCourseSectionDto {
    name?: string;
    description?: string;
}

export class EnrollCourseDto {
    courseCode: string;
}