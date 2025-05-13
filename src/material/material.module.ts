import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { MaterialProcessor } from './material.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'material-queue',
    }),
  ],
  controllers: [MaterialController],
  providers: [MaterialService, PrismaService, ResponseUtil, MaterialProcessor],
})
export class MaterialModule {}
