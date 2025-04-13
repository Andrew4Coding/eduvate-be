import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, PrismaService, ResponseUtil],
})
export class MaterialModule {}
