import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { BanklistService } from './banklist.service';
import { BankListModel } from './banklist.model';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Bank List')
@Controller()
export class BanklistController {
  constructor(private readonly banklistService: BanklistService) {}

  @Post('admin/banklist')
  admincreate(
    @Headers() header: Headers,
    @Body() createBanklistDto: BankListModel) {
    return this.banklistService.createadmin(header, createBanklistDto);
  }

  @Get('banklist/all')
  findAllBankList(@Headers() header : string) {
    return this.banklistService.findAllBankList(header);
  }

  @Get('admin/banklist/all')
  findAllByAdmin(@Headers() header: Headers) {
    return this.banklistService.findAllByAdmin(header);
  }

  @Patch('admin/banklist/:uid')
  updateadmin(
    @Headers() header: Headers,
    @Param('uid') uid: string,
     @Body() updateBanklistDto: BankListModel) {
    return this.banklistService.updateadmin(header,uid, updateBanklistDto);
  }

  @Delete('admin/banklist/:uid')
  removeadmin(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.banklistService.removeadmin(header, uid);
  }

  // Agent Part - 

  @Post('agent/banklist/:agentUId')
  agentcreate(
    @Param('agentUId') agentUId: string,
    @Body() createBanklistDto: BankListModel) {
    return this.banklistService.createagent(agentUId, createBanklistDto);
  }

  @Get('agent/banklist/:agentUId')
  findAllByAgent(agentUId: string) {
    return this.banklistService.findAllByAgent(agentUId);
  }

  @Patch('agent/banklist/:uid')
  updateagent(
    @Param('uid') uid: string,
    @Body() updateBanklistDto: BankListModel) {
    return this.banklistService.updateagent(uid, updateBanklistDto);
  }

  @Delete('agent/banklist/:uid')
  removeagent(@Param('uid') uid: string) {
    return this.banklistService.removeagent(uid);
  }
}
