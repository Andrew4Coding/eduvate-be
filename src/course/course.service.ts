import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCourses() {
        return await this.prisma.course.findMany();
    }

    async getAllCoursesWithStudents() { 
        return await this.prisma.course.findMany({
            include: {
                students: true,
            },
        });
    }

    async getCourseById(id: string) {
        return await this.prisma.course.findUnique({
            where: { 
                id,
            },
        });
    }
}
