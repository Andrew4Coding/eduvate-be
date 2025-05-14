export class CreateQuizDto {
  name: string;
  description: string;
  courseSectionId: string;
  title: string;
  openDate: Date;
  dueDate: Date;
  duration: number;
}

export class SubmitQuizDto {
  quizId: string;
  questionSeq: string[];
  answers: string[];
  quizAttemptId?: string;
}

export class SaveAnswerDto {
  quizId: string;
  quizAttemptId?: string;
  questionId: string;
  answer: string;
}
