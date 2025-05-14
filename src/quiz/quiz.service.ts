import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto, SubmitQuizDto, SaveAnswerDto } from './quiz.dto';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(private readonly prisma: PrismaService) { }

  async createQuiz(data: CreateQuizDto) {
    return await this.prisma.quiz.create({
      data: {
        courseItem: {
          create: {
            courseSectionId: data.courseSectionId,
            type: 'QUIZ',
            name: data.name,
            description: data.description,
          },
        },
        title: data.title,
        openDate: data.openDate,
        dueDate: data.dueDate,
        duration: data.duration,
      },
    });
  }

  async submitQuiz(userId: string, data: SubmitQuizDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const quizWithQuestions = await this.prisma.quiz.findUnique({
      where: { id: data.quizId },
      include: {
        QuizQuestion: {
          select: {
            id: true,
            correctAnswer: true,
          },
        },
      },
    });
    
    if (!quizWithQuestions) {
      this.logger.error('Quiz not found');
      throw new NotFoundException('Quiz not found');
    }

    // Ensure questionSeq from DTO matches the actual question IDs in the quiz
    const actualQuestionIds = quizWithQuestions.QuizQuestion.map(q => q.id);
    if (data.questionSeq.length !== actualQuestionIds.length || !data.questionSeq.every(id => actualQuestionIds.includes(id))) {
      this.logger.warn('Mismatch between submitted question sequence and actual quiz questions.');
      console.warn('Mismatch between submitted question sequence and actual quiz questions.');
    }

    let score = 0;
    const submissionAnswersToCreate: { quizQuestionId: string; answer: string }[] = [];

    data.answers.forEach((userAnswer, index) => {
      const questionId = data.questionSeq[index];
      const question = quizWithQuestions.QuizQuestion.find(q => q.id === questionId);

      if (question && userAnswer !== null) {
        submissionAnswersToCreate.push({
          quizQuestionId: question.id,
          answer: userAnswer,
        });
        if (userAnswer === question.correctAnswer) {
          score++;
        }
      }
    });

    // The frontend loader already creates a QuizSubmission.
    // We need to find it and update it.
    const existingSubmission = await this.prisma.quizSubmission.findFirst({
      where: {
        quizId: quizWithQuestions.id,
        studentId: student.id,
      },
      // Order by createdAt descending to get the latest one if multiple somehow exist (should not happen with current FE logic)
      orderBy: {
        createdAt: 'desc',
      }
    });

    if (!existingSubmission) {
      // This case should ideally not be reached if the FE QuizProgressModule/loader.ts always creates a submission.
      // However, to be robust, we could create one here or throw an error.
      // For now, let's throw an error, assuming the loader always runs.
      throw new NotFoundException('Quiz submission record not found. Please ensure the quiz was started correctly.');
    }

    const updatedSubmission = await this.prisma.$transaction(async (tx) => {
      // 1. Delete existing answers for this submission to avoid duplicates if re-submitting
      await tx.quizSubmissionAnswer.deleteMany({
        where: {
          quizSubmissionId: existingSubmission.id,
        },
      });

      // 2. Update the QuizSubmission record
      const submission = await tx.quizSubmission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          answers: data.answers.filter(a => a !== null) as string[], // Store non-null answers
          score: score,
          isGraded: true, // Mark as graded upon submission
          QuizSubmissionAnswer: {
            createMany: {
              data: submissionAnswersToCreate,
            },
          },
        },
        include: {
          QuizSubmissionAnswer: true, // Include the newly created answers in the response
        }
      });
      return submission;
    });

    return updatedSubmission;
  }

  async saveAnswer(saveAnswerDto: SaveAnswerDto, userId: string) {
    const { quizId, quizAttemptId, questionId, answer } = saveAnswerDto;

    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    let submissionId = quizAttemptId;

    if (!submissionId) {
      const existingSubmission = await this.prisma.quizSubmission.findFirst({
        where: {
          quizId: quizId,
          studentId: student.id,
          isGraded: false, // Only consider active, non-graded attempts
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (existingSubmission) {
        submissionId = existingSubmission.id;
      } else {
        const newSubmission = await this.prisma.quizSubmission.create({
          data: {
            quizId: quizId,
            studentId: student.id,
            score: 0, // Initialize score
            isGraded: false,
            answers: [], // Initialize answers array
          },
        });
        submissionId = newSubmission.id;
      }
    }

    if (!submissionId) {
      this.logger.error('Could not find or create a quiz submission attempt.');
      throw new NotFoundException('Quiz submission attempt not found.');
    }

    // Check for an existing answer for this question in this submission
    const existingAnswer = await this.prisma.quizSubmissionAnswer.findFirst({
      where: {
        quizSubmissionId: submissionId,
        quizQuestionId: questionId,
      },
    });

    if (existingAnswer) {
      return this.prisma.quizSubmissionAnswer.update({
        where: {
          id: existingAnswer.id,
        },
        data: {
          answer: answer,
        },
      });
    } else {
      return this.prisma.quizSubmissionAnswer.create({
        data: {
          quizSubmissionId: submissionId,
          quizQuestionId: questionId,
          answer: answer,
        },
      });
    }
  }

  async getQuiz(quizId: string, userId: string) { // Added userId to potentially filter submissions
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) {
      throw new NotFoundException('Student not found to retrieve quiz progress.');
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        QuizQuestion: {
          include: {
            QuizQuestionChoice: true, // Corrected from QuizQuestionOption
          },
        },
        QuizSubmission: { // Optionally include student's submission
          where: { studentId: student.id },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            QuizSubmissionAnswer: true,
          }
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found`);
    }
    return quiz;
  }
}

