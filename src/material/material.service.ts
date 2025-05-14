import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';

@Injectable()
export class MaterialService {
    constructor(@InjectQueue('material-queue') private materialQueue: Queue, private readonly prisma: PrismaService) { }

    async queueCreateMaterial(data: CreateMaterialDto) {
        await this.materialQueue.add('create-material', data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }

    async updateMaterial(id: string, data: UpdateMaterialDto) { 
        return this.prisma.material.update({
            where: { id },
            data: {
                courseItem: {
                    update: {
                        name: data.name,
                        description: data.description,
                    }
                },
                fileUrl: data.fileUrl,
            },
        });
    }

    async deleteMaterial(id: string) { 
        return this.prisma.material.delete({
            where: { id },
        });
    }
}
