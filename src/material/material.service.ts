import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';

@Injectable()
export class MaterialService {
    constructor(private readonly prisma: PrismaService) { }

    async createMaterial(data: CreateMaterialDto) { 
        return this.prisma.material.create({
            data: {
                courseItem: {
                    create: {
                        name: data.name,
                        description: data.description,
                        courseSectionId: data.courseSectionId,
                        type: 'MATERIAL',
                    }
                },
                fileUrl: data.fileUrl,
                fileType: data.fileType,
            },
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
                fileType: data.fileType,
            },
        });
    }

    async deleteMaterial(id: string) { 
        return this.prisma.material.delete({
            where: { id },
        });
    }
}
