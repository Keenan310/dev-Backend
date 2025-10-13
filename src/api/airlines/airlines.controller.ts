import { Controller, Get, Body, Patch, Param, Headers, Post } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AirlinesUpdateModel } from './airlines.model';
import { CreateAirlineDiscountDto, UpdateAirlineDiscountDto } from './airlines.dto';

@ApiExcludeController()
@ApiTags("Admin Module")
@Controller()
@ApiBearerAuth()
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Post('admin/airline/discount')
  createAirlineDiscount(
    @Headers() header: Headers,
    @Body() dto: CreateAirlineDiscountDto) {
    return this.airlinesService.createAirlineDiscount(header, dto);
  }

  @Get('admin/airline/discount')
  viewAirlineDiscount(@Headers() header: Headers) {
    return this.airlinesService.viewAirlineDiscount(header);
  }

  @Get('admin/airline/discount')
  updateAirlineDiscount(
    @Headers() header: Headers, 
    @Param('id') id: string,
    @Body() updateAirlineDiscountDto: UpdateAirlineDiscountDto) {
    return this.airlinesService.updateAirlineDiscount(header, +id, updateAirlineDiscountDto);
  }

  @Get('admin/airline/discount/id')
  deleteAirlineDiscount(
    @Headers() header: Headers,
    @Param('id') id: string) {
    return this.airlinesService.deleteAirlineDiscount(header, +id);
  }

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
