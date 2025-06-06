import { Body, Controller, Logger, Post, UseGuards, Req, Get, Param, Patch } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { CreateQuizDto, SaveAnswerDto, SubmitQuizDto, UpdateQuizDto } from './quiz.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(private readonly quizService: QuizService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async createQuiz(@CurrentUser() user: { id: string }, @Body() data: CreateQuizDto) {
    return this.responseUtil.response({
      code: 201,
      message: 'Quiz created successfully',
    }, {
      data: await this.quizService.createQuiz(data),
    })
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateQuiz(@Param('id') id: string, @Body() data: UpdateQuizDto) {
    return this.responseUtil.response({
      code: 200,
      message: 'Quiz updated successfully',
    }, {
      data: await this.quizService.updateQuiz(id, data),
    });
  }

  @UseGuards(AuthGuard)
  @Post('submit')
  async submitQuiz(@Body() submitQuizDto: SubmitQuizDto, @Req() req) {
    return this.quizService.submitQuiz(req.user.id, submitQuizDto);
  }

  @UseGuards(AuthGuard)
  @Post('answer')
  async saveAnswer(@Body() saveAnswerDto: SaveAnswerDto, @Req() req) {
    return this.quizService.saveAnswer(saveAnswerDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getQuiz(@Param('id') id: string, @Req() req) {
    return this.quizService.getQuiz(id, req.user.id);
  }
}
