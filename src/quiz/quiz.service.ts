import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from './quiz.dto';

@Injectable()
export class QuizService {
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
                    }
                }
            },
        });
    }
}
