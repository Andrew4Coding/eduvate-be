import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAdminDto, RegisterStudentDto } from './dto/register-user.dto';
import { ResponseUtil } from 'src/common/utils/response.util';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService,
        private readonly responseUtil: ResponseUtil
    ) { }


    async registerStudent(data: RegisterStudentDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        })

        if (!user) {
            throw new Error('User not found');
        }


        const student = await this.prisma.student.create({
            data: {
                userId: user.id,
            },
        });

        return student;
    }

    async registerTeacher(data: RegisterStudentDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        })

        if (!user) {
            return ResponseUtil
        }


        const teacher = await this.prisma.teacher.create({
            data: {
                userId: user.id,
            },
        });

        return teacher;
    }
}