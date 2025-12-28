import { Controller, Get, Body, Patch, Param, Headers, Post, Delete, Query } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { ApiBearerAuth, ApiExcludeController, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AirlinesUpdateModel } from './airlines.model';
import { CreateAirlineDiscountDto, CreateAirlineDiscountForAgentDto, UpdateAirlineDiscountDto } from './airlines.dto';

@ApiTags("Admin Module")
@Controller()
@ApiBearerAuth()
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Post('admin/airline/discount')
  createAirlineDiscount(
    @Headers() header: Headers,
    @Body() dto: CreateAirlineDiscountDto) {
    return this.airlinesService.createAirlineDiscountMain(header, dto);
  }


  @Get('admin/airline/discount')
  @ApiQuery({ name: 'currency', required: false })
  viewAirlineDiscount(
    @Headers() header: Headers,
    @Query('currency') currency: string,) {
    return this.airlinesService.viewAirlineDiscountMain(header, currency);
  }

  @Patch('admin/airline/discount/:id')
  updateAirlineDiscount(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() updateAirlineDiscountDto: UpdateAirlineDiscountDto) {
    return this.airlinesService.updateAirlineDiscountMain(header, +id, updateAirlineDiscountDto);
  }

  @Delete('admin/airline/discount/:id')
  deleteAirlineDiscount(
    @Headers() header: Headers,
    @Param('id') id: string) {
    return this.airlinesService.deleteAirlineDiscountMain(header, +id);
  }

  @Post('admin/singleagent/airline/discount')
  createAirlineDiscountForAgent(
    @Headers() header: Headers,
    @Body() createAirlineDiscountForAgentDto: CreateAirlineDiscountForAgentDto) {
    return this.airlinesService.createAirlineDiscountForAgent(header, createAirlineDiscountForAgentDto);
  }


  @Get('admin/singleagent/airline/discount')
  @ApiQuery({ name: 'agentId', required: true })
  viewAirlineDiscountForAgent(
    @Headers() header: Headers,
    @Query('agentId') agentId: string,) {
    return this.airlinesService.viewAirlineDiscountForAgent(header, agentId);
  }

  @Patch('admin/singleagent/airline/discount/:id')
  updateAirlineDiscountForAgent(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() updateAirlineDiscountDto: UpdateAirlineDiscountDto) {
    return this.airlinesService.updateAirlineDiscountForAgent(header, +id, updateAirlineDiscountDto);
  }

  @Delete('admin/singleagent/airline/discount/:id')
  deleteAirlineDiscountForAgent(
    @Headers() header: Headers,
    @Param('id') id: string) {
    return this.airlinesService.deleteAirlineDiscountForAgent(header, +id);
  }

  @Patch('agent/airlines/markup/:id')
  updatemarkup(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() updateAirlineDto: AirlinesUpdateModel) {
    return this.airlinesService.update(header,+id, updateAirlineDto);
  }
}
