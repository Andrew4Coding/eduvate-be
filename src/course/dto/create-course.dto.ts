export class CreateCourseDto {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    students: string[];
}