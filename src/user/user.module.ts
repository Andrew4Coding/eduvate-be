import { Module } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ResponseUtil],
})
export class UserModule {}
