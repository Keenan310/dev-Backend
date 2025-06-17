import { Controller, Get, Post, Body, Patch, Param, Delete, Header, Headers, Query, NotAcceptableException } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositBonuseModel, DepositModel, DepositModelUpdate, DepositModelUpdateStatus } from './deposit.model';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags("Deposit Modules")
@Controller()
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: "Only Admin Can Access" , description: "All Deposit Only Admin Can Access"})
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('admin/deposit/all')
  findAll(
    @Headers() header: Headers,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Limit Range must be 10-100");
    }
    return this.depositService.findAllAdmin(header, page, status, filter, limit);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/deposit/')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  findAllAgent(
    @Headers() header: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Limit Range must be 10-100");
    }
    return this.depositService.findAllAgent(header, page, status, filter, limit);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: "Only Admin Can Access" , description: "Update Deposit Only Admin Can Access"})
  @Patch('admin/deposit/:uid')
  update(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updateDepositDto: DepositModelUpdate) {
    return this.depositService.update(header, uid, updateDepositDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: "Only Admin Can Access" , description: "Update Deposit Only Admin Can Access"})
  @Patch('admin/deposit/status/:uid')
  updatestatus(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updateDepositDto: DepositModelUpdateStatus) {
    return this.depositService.updatestatus(header, uid, updateDepositDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: "Deposit Bonus - admin" , description: "Update Deposit Only Admin Can Access"})
  @Post('admin/deposit/bonus/:agentUId')
  depositBonus(
    @Headers() header: Headers,
    @Param('agentUId') agentUId: string,
    @Body() depositBonuseModel : DepositBonuseModel) {
    return this.depositService.addDepositBonus(header, agentUId, depositBonuseModel);
  }

  //Single Agent
  @ApiBearerAuth('access_token')
  @Get('admin/agent/deposit/:agentUId')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  findAllAgentByAdmin(
    @Headers() header: Headers,
    @Param('agentUId') agentUId: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Limit Range must be 10-100");
    }
    return this.depositService.findAllAgentByAdmin(header, agentUId, page, status, filter, limit);
  }

}
