import { Controller, Get, Body, Patch, Param, Headers } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AirlinesUpdateModel } from './airlines.model';

@ApiExcludeController()
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
