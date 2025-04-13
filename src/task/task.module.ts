import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, ResponseUtil],
})
export class TaskModule {}
