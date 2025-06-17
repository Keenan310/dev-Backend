import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query, NotAcceptableException, Put } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentBalanceUpdate, AgentCreditModel, AgentMarkUpUpdate, AgentModelUpdateAdmin, AgentModelUpdateAgent } from './agent.model';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags("Agent Modules")
@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Get all agent data', description: 'Get all list of agent data' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('/admin/agent')
  findAllAdmin(
    @Headers() header: Headers,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number,
  ) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Maximum Limit must be 10-100");
    }

    return this.agentService.findAllAdmin(header, page, status, filter, limit);
  }

  @ApiOperation({ summary: 'Update agent data', description: 'Update all kind of agent data' })
  @Patch('admin/agent/:uid')
  update(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updateAgentDto: AgentModelUpdateAdmin) {
    return this.agentService.update(header, uid, updateAgentDto);
  }

  @ApiOperation({ summary: 'Add Balance by admin', description: 'Update all kind of agent data' })
  @Post('admin/agent/balance/:uid')
  addBalance(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updateAgentBalanceDto: AgentBalanceUpdate) {
    return this.agentService.addBalance(header, uid, updateAgentBalanceDto);
  }


  @ApiOperation({ summary: 'Update Only Status', description: 'Update Only Status' })
  @Patch('admin/agent/:status/:uid')
  updateagentstatus(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Param('status') status: string) {
    return this.agentService.updateAgentStatus(header, uid, status);
  }

  @ApiOperation({ summary: 'Remove agent data admin', description: 'Remove a single agent data from the list' })
  @Delete('admin/agent/:uid')
  remove(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.agentService.remove(header, uid);
  }


  @ApiOperation({ summary: 'Add Credit by admin', description: 'Add Credit for the agent' })
  @Post('admin/agent/:uid/credit')
  addcredit(
    @Headers() header: Headers,
    @Param('uid') uid: string, @Body() creditModel: AgentCreditModel) {
    return this.agentService.addcredit(header, uid, creditModel);
  }


  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Get only agent my account', description: 'Get a single agent all data' })
  @Get('agent/myaccount')
  myaccount(
    @Headers() header: string) {
    return this.agentService.myaccount(header);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Get only agent my account', description: 'Get a single agent all data' })
  @Get('admin/agent/myaccount/:agentUId')
  myaccountAdmin(
    @Headers() header: Headers,
    @Param('agentUId') uid: string
  ) {
    return this.agentService.myaccountadmin(header, uid);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Update agent account By Admin', description: 'Get a single agent all data' })
  @Put('admin/agent/myaccount/:agentUId')
  agentmyaccountAdmin(
    @Headers() header: Headers,
    @Param('agentUId') agentUId: string,
    @Body() updateMyAgentDto: AgentModelUpdateAdmin
  ) {
    return this.agentService.agentmyaccountadmin(header,agentUId, updateMyAgentDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Update agent My Account', description: 'Update all kind of agent data' })
  @Patch('agent/myaccount')
  updateagentmyaccount(
    @Headers() header: string,
    @Body() updateMyAgentDto: AgentModelUpdateAgent) {
    return this.agentService.updateagentmyaccount(header, updateMyAgentDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Update agent mark up', description: 'Update Only Mark UP' })
  @Patch('agent/markup')
  updateagentmarkup(
    @Headers() header: string,
    @Body() updateMyAgenMarkUptDto: AgentMarkUpUpdate) {
    return this.agentService.updateagentmarkup(header, updateMyAgenMarkUptDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Admin Reset password', description: 'Reset Password' })
  @Post('admin/agent/reset/password/:uid')
  resetPasswordAdmin(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.agentService.resetpasswordadmin(header, uid);
  }

}
