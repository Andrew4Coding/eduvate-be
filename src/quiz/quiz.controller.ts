import { Body, Controller, Logger, Post, UseGuards, Req } from '@nestjs/common';
import { CreateQuizDto, SubmitQuizDto } from './quiz.dto';
import { QuizService } from './quiz.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Request } from 'express';

@Controller('quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

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

  @UseGuards(AuthGuard)
  @Post('submit')
  async submitQuiz(@CurrentUser() user: { id: string }, @Body() data: SubmitQuizDto, @Req() req: Request) {
    this.logger.log(`SubmitQuiz called by user: ${user?.id}`);
    this.logger.log(`Request Content-Type header: ${req.headers['content-type']}`);
    this.logger.log(`Received data via @Body(): ${JSON.stringify(data)}`);
    this.logger.log(`Raw req.body from Express: ${JSON.stringify(req.body)}`);

    if (!user || !user.id) {
      this.logger.error('User not authenticated or user ID not found in submitQuiz');
      throw new Error('User not authenticated or user ID not found');
    }
    if (data === undefined) {
        this.logger.error('Data from @Body() is undefined in submitQuiz');
    }

    return this.responseUtil.response({
        code: 200,
        message: 'Quiz submitted successfully',
    }, {
        data: await this.quizService.submitQuiz(user.id, data),
    })
  }
}
