import { Controller, Get, Post, Body,Headers, Patch, Param, Delete } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffModel, StaffModelUpdate, StaffModelUpdateByAgent } from './staff.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags("Staff Model")
@Controller('agent/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiBearerAuth('access_token')
  @Post()
  create(
    @Headers() header: string,
    @Body() createStaffDto: StaffModel) {
    return this.staffService.create(header, createStaffDto);
  }

  @ApiBearerAuth('access_token')
  @Get()
  findAllByAgentUId(
    @Headers() header: string) {
    return this.staffService.findAllByAgentUId(header);
  }

  @ApiBearerAuth('access_token')
  @Get(':uid')
  findOne(
    @Headers() header: string,
    @Param('uid') uid: string) {
    return this.staffService.findOne(header, uid);
  }

  @ApiBearerAuth('access_token')
  @Patch(':uid')
  update(
    @Headers() header: string,
    @Param('uid') staffUId: string,
   @Body() updateStaffDtoagent: StaffModelUpdateByAgent) {
    return this.staffService.update(header, staffUId, updateStaffDtoagent);
  }

  @ApiBearerAuth('access_token')
  @Get('myaccount/:uid')
  myaccount(
    @Headers() header: string,
    @Param('uid') staffUId: string){
    return this.staffService.myaccount(header, staffUId);

  }

  @ApiBearerAuth('access_token')
  @Patch('myaccount/:uid')
  myaccountupdate(
    @Headers() header: string,
    @Param('staffUId') staffUId: string,
    @Body() updateStaffDto: StaffModelUpdate) {
    return this.staffService.myaccountupdate(header, staffUId, updateStaffDto);
  }
  
}
