import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { GroupfareService } from './groupfare.service';
import { GroupFareDto } from './groupfare.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('GroupFare Modules')
@Controller('groupfare')
export class GroupfareController {
  constructor(private readonly groupfareService: GroupfareService) {}

  @ApiBearerAuth('access_token')
  @Post()
  create(
    @Headers() header: Headers,
    @Body() groupFare: GroupFareDto) {
    return this.groupfareService.create(header, groupFare);
  }

  @ApiBearerAuth('access_token')
  @Patch()
  update(
    @Headers() header: Headers,
    @Body() groupFare: GroupFareDto) {
    return this.groupfareService.update(header, groupFare);
  }

  @ApiBearerAuth('access_token')
  @Get('admin')
  findAllAdmin(
    @Headers() header: Headers) {
    return this.groupfareService.findAllAdmin(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/special')
  findAllAdminSpecialFare(
    @Headers() header: Headers) {
    return this.groupfareService.findAllAgentSpecialFare(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/special/fare/:triptype/:origin/:destination')
  findAllAdminSpecialFareAll(
    @Headers() header: Headers,
    @Param('triptype') triptype: string,
    @Param('origin') origin: string,
    @Param('destination') destination: string) {
    return this.groupfareService.findAllAgentSpecialFareAll(header, triptype, origin, destination);
  }

  @ApiBearerAuth('access_token')
  @Get()
  findAllAgent(@Headers() header: string) {
    return this.groupfareService.findAllAgent(header);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/:uid')
  findOneAdmin(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.groupfareService.findOneAdmin(header, uid);
  }

  @ApiBearerAuth('access_token')
  @Delete(':uid')
  remove(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.groupfareService.remove(header, uid);
  }
}
