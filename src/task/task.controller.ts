import { Body, Controller, Post } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { CreateTaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @Post('create')
  async createTask(@Body() data: CreateTaskDto) {
    return this.responseUtil.response({
      code: 201,
      message: 'Task created successfully',
    }, {
      task: await this.taskService.createNewTask(data),
    });
  }
}
