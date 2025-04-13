import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ResponseUtil } from 'src/common/utils/response.util';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService,
              private readonly responseUtil: ResponseUtil,
  ) { }
  
  @Post('create')
  async createMaterial(@Body() data: CreateMaterialDto) {
    const result = await this.materialService.createMaterial(data);
    return this.responseUtil.response({
      message: 'Material created successfully',
      code: 200,
    }, {
      data: result,
    });
  }

  @Put('update/:id')
  async updateMaterial(@Param('id') id: string, @Body() data: UpdateMaterialDto) {
    const result = await this.materialService.updateMaterial(id, data);
    return this.responseUtil.response({
      message: 'Material updated successfully',
      code: 200,
    }, {
      data: result,
    });
  }

  @Delete('delete/:id')
  async deleteMaterial(@Param('id') id: string) {
    const result = await this.materialService.deleteMaterial(id);
    return this.responseUtil.response({
      message: 'Material deleted successfully',
      code: 200,
    }, {
      data: result,
    });
  }
}
