import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard, validateRole } from 'src/auth/auth.guard';
import { ResponseUtil } from 'src/common/utils/response.util';
import { CourseService } from './course.service';
import { AddCourseSectionDto, CreateCourseDto, EnrollCourseDto, UpdateCourseSectionDto } from './dto/create-course.dto';

@Controller('course')
@UseGuards(AuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @Get()
  async getAllCourses() {
    const courses = await this.courseService.getAllCourses();
    return this.responseUtil.response({
      code: 200,
      message: 'Courses retrieved successfully',
    }, {
      data: courses,
    });
  }

  @Post('enroll')
  async enrollCourse(@Body() data: EnrollCourseDto, @Request() request) {
    validateRole(request.user, ['student']);

    const { courseCode } = data;
    const email = request.user.email;
    
    return await this.courseService.enrollCourse(courseCode, email);
  }

  @Post('unenroll')
  async unenrollCourse(@Body() data: EnrollCourseDto, @Request() request) {
    validateRole(request.user, ['student']);

    const { courseCode } = data;
    const email = request.user.email;

    return await this.courseService.unenrollCourse(courseCode, email);
  }

  @Get('with-students')
  async getAllCoursesWithStudents() {
    const courses = await this.courseService.getAllCoursesWithStudents();
    return this.responseUtil.response({
      code: 200,
      message: 'Courses with students retrieved successfully',
    }, {
      data: courses,
    });
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    const course = await this.courseService.getCourseById(id);
    if (!course) {
      return this.responseUtil.response({
        code: 404,
        message: 'Course not found',
      });
    }
  }

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto, @Request() request) {
    validateRole(request.user, ['teacher']);

    const email = request.user.email;

    const course = await this.courseService.createCourse(createCourseDto, email);
    return this.responseUtil.response({
      code: 201,
      message: 'Course created successfully',
    }, {
      data: course,
    });
  }

  @Put(':id')
  async editCourse(@Param('id') id: string, @Body() createCourseDto: CreateCourseDto, @Request() request) {
    validateRole(request.user, ['teacher']);

    const course = await this.courseService.editCourse(id, createCourseDto);
    if (!course) {
      return this.responseUtil.response({
        code: 404,
        message: 'Course not found',
      });
    }

    return this.responseUtil.response({
      code: 200,
      message: 'Course updated successfully',
    }, {
      data: course,
    });
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string, @Request() request) {
    validateRole(request.user, ['teacher']);
    await this.courseService.deleteCourse(id);
    return this.responseUtil.response({
      code: 200,
      message: 'Course deleted successfully',
    });
  }

  @Post('section')
  async addCourseSection(@Body() data: AddCourseSectionDto, @Request() request) {
    validateRole(request.user, ['teacher']);

    const section = await this.courseService.addCourseSection(data);
    return this.responseUtil.response({
      code: 201,
      message: 'Course section added successfully',
    }, {
      data: section,
    });
  }

  @Put('section/:id')
  async editCourseSection(@Param('id') id: string, @Body() data: UpdateCourseSectionDto, @Request() request) {
    validateRole(request.user, ['teacher']);
    const section = await this.courseService.editCourseSection(id, data);
    if (!section) {
      return this.responseUtil.response({
        code: 404,
        message: 'Course section not found',
      });
    }
    return this.responseUtil.response({
      code: 200,
      message: 'Course section updated successfully',
    }, {
      data: section,
    });
  }

  @Delete('item/:id')
  async deleteCourseItem(@Param('id') id: string, @Request() request) {
    validateRole(request.user, ['teacher']);

    await this.courseService.deleteCourseItem(id);
    return this.responseUtil.response({
      code: 200,
      message: 'Course item deleted successfully',
    });
  }

  @Delete('section/:id')
  async deleteCourseSection(@Param('id') id: string, @Request() request) {
    validateRole(request.user, ['teacher']);

    await this.courseService.deleteCourseSection(id);
    return this.responseUtil.response({
      code: 200,
      message: 'Course section deleted successfully',
    });
  }
}
