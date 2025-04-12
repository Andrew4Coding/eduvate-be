import { Module } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService, ResponseUtil],
})
export class CourseModule {}
