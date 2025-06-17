import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AirlinesUpdateModel } from './airlines.model';

@ApiTags("Admin Module")
@Controller()
@ApiBearerAuth()
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Get('admin/airlines/all')
  findAll(
    @Headers() header: Headers,
  ) {
    return this.airlinesService.findAll(header);
  }

  @Patch('admin/airlines/markup/:id')
  updatemarkup(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() updateAirlineDto: AirlinesUpdateModel) {
    return this.airlinesService.update(header,+id, updateAirlineDto);
  }
}
