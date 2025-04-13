export class CreateQuizDto {
    name: string;
    description: string;
    courseSectionId: string;
    openDate: Date;
    dueDate: Date;
    closeDate: Date;
}