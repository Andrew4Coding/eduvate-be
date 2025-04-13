import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService, ResponseUtil],
})
export class QuizModule {}
