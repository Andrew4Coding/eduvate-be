import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';
import { MaterialModule } from './material/material.module';

@Module({
  imports: [CourseModule, UserModule, MaterialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
