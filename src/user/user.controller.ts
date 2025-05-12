import { Body, Controller, Post } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { RegisterStudentDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly responseUtil: ResponseUtil) { }
  
  @Post('register-student')
  async registerStudent(
    @Body() registerStudentDto: RegisterStudentDto,
  ) {
    return this.responseUtil.response({
      code: 200,
      message: 'Student registered successfully',
    }, {
      data: await this.userService.registerStudent(registerStudentDto),
    })
  }

  @Post('register-teacher')
  async registerTeacher(
    @Body() registerStudentDto: RegisterStudentDto,
  ) {
    return this.responseUtil.response({
      code: 200,
      message: 'Teacher registered successfully',
    }, {
      data: await this.userService.registerTeacher(registerStudentDto),
    })
  }
}
