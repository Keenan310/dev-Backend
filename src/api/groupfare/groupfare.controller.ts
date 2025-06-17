import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { GroupfareService } from './groupfare.service';
import { GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('GroupFare Modules')
@Controller('groupfare')
export class GroupfareController {
  constructor(private readonly groupfareService: GroupfareService) {}

  
  @ApiBearerAuth('access_token')
  @Post()
  create(
    @Headers() header: Headers,
    @Body() createGroupfareDto: GroupFareModel) {
    
    return this.groupfareService.create(header, createGroupfareDto);
  }

  @ApiBearerAuth('access_token')
  @Get()
  findAllAdmin(
    @Headers() header: Headers) {
    return this.groupfareService.findAllAdmin(header);
  }

  @ApiBearerAuth('access_token')
  @Get()
  findAllAgent(@Headers() header: string) {
    return this.groupfareService.findAllAgent(header);
  }

  @ApiBearerAuth('access_token')
  @Post('search')
  findBySearch(
    @Headers() header: string,
    @Body() searchGF : GroupFareSearch) {
    return this.groupfareService.findBySearch(header, searchGF);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/:uid')
  findOneAdmin(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.groupfareService.findOneAdmin(header, uid);
  }

  @ApiBearerAuth('access_token')
  @Patch(':uid')
  update(
    @Headers() header: Headers, 
    @Param('uid') uid: string,
    @Body() updateGroupfareDto: GroupFareModelUpdate) {
    return this.groupfareService.update(header, uid, updateGroupfareDto);
  }

  @ApiBearerAuth('access_token')
  @Delete(':uid')
  remove(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.groupfareService.remove(header, uid);
  }
}
