import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { MaterialModule } from './material/material.module';
import { QuizModule } from './quiz/quiz.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }), CourseModule, UserModule, MaterialModule, QuizModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
