export class QuizQuestionDto {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export class CreateQuizDto {
  name: string;
  description: string;
  courseSectionId: string;
  title: string;
  openDate: Date;
  dueDate: Date;
  duration: number;
  courseId: string;
  questions: QuizQuestionDto[];
}

export class UpdateQuizDto {
  title: string;
  description: string;
  openDate: Date;
  dueDate: Date;
  duration: number;
  questions: QuizQuestionDto[];
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
