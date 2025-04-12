import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { CourseService } from './course.service';
import { AddCourseSectionDto, CreateCourseDto, UpdateCourseSectionDto } from './dto/create-course.dto';

@Controller('course')
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
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    const course = await this.courseService.createCourse(createCourseDto);
    return this.responseUtil.response({
      code: 201,
      message: 'Course created successfully',
    }, {
      data: course,
    });
  }

  @Put(':id')
  async editCourse(@Param('id') id: string, @Body() createCourseDto: CreateCourseDto) {
    const course = await this.courseService.editCourse(id, createCourseDto);
    if (!course) {
      return this.responseUtil.response({
        code: 404,
        message: 'Course not found',
      });
    }
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    await this.courseService.deleteCourse(id);
    return this.responseUtil.response({
      code: 200,
      message: 'Course deleted successfully',
    });
  }

  @Post('section')
  async addCourseSection(@Body() data: AddCourseSectionDto) {
    const section = await this.courseService.addCourseSection(data);
    return this.responseUtil.response({
      code: 201,
      message: 'Course section added successfully',
    }, {
      data: section,
    });
  }

  @Put('section/:id')
  async editCourseSection(@Param('id') id: string, @Body() data: UpdateCourseSectionDto) {
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
}
