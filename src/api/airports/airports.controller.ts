import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AirportsModel, AirportsModelUpdate } from './airports.model';

@ApiExcludeController()
@ApiTags("Airports Module")
@Controller('admin/airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Post()
  create(@Body() createAirportDto: AirportsModel) {
    return this.airportsService.create(createAirportDto);
  }

  @Get()
  findAll() {
    return this.airportsService.findAll();
  }

  @Get('formate/all')
  findFormateAll() {
    return this.airportsService.findFormateAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAirportDto: AirportsModelUpdate) {
    return this.airportsService.update(+id, updateAirportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airportsService.remove(+id);
  }
}
