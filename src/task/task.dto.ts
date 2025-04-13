export class CreateTaskDto {
    courseSectionId: string;
    name: string;
    description: string;
    openDate: Date;
    dueDate: Date;
    closeDate: Date;
}