import { Controller, Get,Headers, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TravellerService } from './traveller.service';
import { TravellerModel, TravellerModelUpdate } from './traveller.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Frequent Traveller")
@Controller()
export class TravellerController {
  constructor(private readonly TravellerService: TravellerService) {}


  @ApiBearerAuth('access_token')
  @Post('agent/traveller')
  create(
    @Headers() header: string,
    @Body() createTravellerDto: TravellerModel) {
    return this.TravellerService.create(header, createTravellerDto);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/traveller')
  findAllByAgentId(@Headers() header: string,) {
    return this.TravellerService.findAllByAgentId(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/traveller/:uid')
  findOne(
    @Headers() header: string,
    @Param('uid') uid: string) {
    return this.TravellerService.findOne(header, uid);
  }

  @ApiBearerAuth('access_token')
  @Patch('agent/traveller/:uid')
  update(
    @Headers() header: string,
    @Param('uid') uid: string, @Body() updateTravellerDto: TravellerModelUpdate) {
    return this.TravellerService.update(header, uid, updateTravellerDto);
  }

  @ApiBearerAuth('access_token')
  @Delete('agent/traveller/:uid')
  remove(
    @Headers() header: string,
    @Param('uid') uid: string) {
    return this.TravellerService.remove(header, uid);
  }
}
