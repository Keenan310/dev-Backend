import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseInterceptors } from '@nestjs/common';
import { GroupfareService } from './groupfare.service';
import { GroupFareDto, GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('GroupFare Modules')
@Controller('groupfare')
@UseInterceptors(CacheInterceptor)
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
