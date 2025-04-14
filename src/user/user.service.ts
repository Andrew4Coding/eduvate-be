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
        const { schoolCode } = data;

        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        })

        if (!user) {
            throw new Error('User not found');
        }

        const school = await this.prisma.school.findFirst({
            where: {
                code: schoolCode,
            },
        })
        if (!school) {
            return this.responseUtil.response({
                code: 400,
                message: 'School not found',
            });
        }

        const student = await this.prisma.student.create({
            data: {
                userId: user.id,
                schoolId: school.id,
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

        const school = await this.prisma.school.findFirst({
            where: {
                code: data.schoolCode,
            },
        })
        if (!school) {
            return this.responseUtil.response({
                code: 400,
                message: 'School not found',
            });
        }

        const teacher = await this.prisma.teacher.create({
            data: {
                userId: user.id,
                schoolId: school.id,
            },
        });

        return teacher;
    }

    async registerAdmin(data: RegisterAdminDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        })

        if (!user) {
            throw new Error('User not found');
        }

        const school = await this.prisma.school.create({
            data: {
                name: data.schoolName,
                code: data.code,
                address: data.address,
            }
        })

        const admin = await this.prisma.admin.create({
            data: {
                userId: user.id,
                schoolId: school.id,
            },
        });

        return admin;
    }
}