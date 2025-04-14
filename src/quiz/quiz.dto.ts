export class CreateQuizDto {
  name: string;
  description: string;
  courseSectionId: string;
  title: string;
  openDate: Date;
  dueDate: Date;
  duration: number;
}
