import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuizDto } from './quiz.dto';
import { QuizService } from './quiz.service';
import { ResponseUtil } from 'src/common/utils/response.util';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @Post('create')
  async createQuiz(@Body() data: CreateQuizDto) {
    return this.responseUtil.response({
      code: 201,
      message: 'Quiz created successfully',
    }, {
      data: await this.quizService.createQuiz(data),
    })
  }
}
