import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './task.dto';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async createNewTask(data: CreateTaskDto) { 
        const task = await this.prisma.task.create({
            data: {
                courseItem: {
                    create: {
                        name: data.name,
                        description: data.description,
                        type: 'TASK',
                        courseSectionId: data.courseSectionId,
                    }
                },
                openDate: new Date(data.openDate),
                dueDate: new Date(data.dueDate),
                closeDate: new Date(data.closeDate),
            },
        });
        return task;
    }
}
