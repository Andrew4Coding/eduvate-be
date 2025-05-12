import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCourseSectionDto, CreateCourseDto, UpdateCourseDto, UpdateCourseSectionDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCourses() {
        return await this.prisma.course.findMany({
            select: {
                category: true,
            }
        });
    }

    async enrollCourse(courseCode: string, email: string) { 
        const course = await this.prisma.course.findUnique({
            where: {
                code: courseCode,
            },
        });
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        const student = await this.prisma.student.findFirst({
            where: {
                user: {
                    email: email,
                }
            },
            include: {
                Course: {
                    where: {
                        id: course.id,
                    },
                },
            }
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        if (student.Course.length > 0) {
            throw new BadRequestException('Student already enrolled in this course');
        }

        await this.prisma.student.update({
            where: {
                id: student.id,
            },
            data: {
                Course: {
                    connect: {
                        id: course.id,
                    },
                },
            },
        })

        return student;
    }

    async unenrollCourse(courseCode: string, email: string) {
        const course = await this.prisma.course.findUnique({
            where: {
                code: courseCode,
            },
        });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        const student = await this.prisma.student.findFirst({
            where: {
                user: {
                    email: email,
                }
            },
            include: {
                Course: {
                    where: {
                        id: course.id,
                    },
                },
            }
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        if (student.Course.length === 0) {
            throw new BadRequestException('Student not enrolled in this course');
        }
        await this.prisma.student.update({
            where: {
                id: student.id,
            },
            data: {
                Course: {
                    disconnect: {
                        id: course.id,
                    },
                },
            },
        });
        return student;
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

    async createCourse(data: CreateCourseDto, teacherEmail: string) {
        const teacher = await this.prisma.teacher.findFirst({
            where: {
                user: {
                    email: teacherEmail,
                }
            },
        });
        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        return await this.prisma.course.create({
            data: {
                ...data,
                teachers: {
                    connect: {
                        id: teacher.id,
                    }
                }
            },
        });
    }

    async editCourse(id: string, data: UpdateCourseDto) {
        return await this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async deleteCourse(id: string) {
        return await this.prisma.course.delete({
            where: { id },
        }).catch((error) => {
            if (error.code === 'P2003') {
                throw new Error('Cannot delete course with students enrolled');
            }
            throw new Error('Course not found');
        });
    }

    async addCourseSection(data: AddCourseSectionDto) {
        return await this.prisma.courseSection.create({
            data,
        });
    }

    async editCourseSection(id: string, data: UpdateCourseSectionDto) {
        return await this.prisma.courseSection.update({
            where: { id },
            data,
        });
    }

    async deleteCourseItem(id: string) {
        const data = await this.prisma.courseItem.delete({
            where: { id },
        }).catch((error) => {
            if (error.code === 'P2003') {
                throw new Error('Cannot delete course item with students enrolled');
            }
            throw new Error('Course item not found');
        }
        );

        return data;
    }

    async deleteCourseSection(id: string) {
        const data = await this.prisma.courseSection.delete({
            where: { id },
        }).catch((error) => {
            if (error.code === 'P2003') {
                throw new Error('Cannot delete course section with students enrolled');
            }
            throw new Error('Course section not found');
        }
        );

        return data;
    }
}