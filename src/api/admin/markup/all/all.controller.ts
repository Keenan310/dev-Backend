import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllService } from './all.service';
import { CreateAllDto } from './dto/create-all.dto';
import { UpdateAllDto } from './dto/update-all.dto';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('Admin Markup All')
@Controller('admin/markup/all')
export class AllController {
  constructor(private readonly allService: AllService) {}

  @Post()
  create(@Body() createAllDto: CreateAllDto) {
    return this.allService.create(createAllDto);
  }

  @Get()
  findAll() {
    return this.allService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllDto: UpdateAllDto) {
    return this.allService.update(+id, updateAllDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allService.remove(+id);
  }
}
