import { Controller, Get, Param, Headers, Query, NotAcceptableException, Post, Body, Patch, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto, UpdateAgentLedgerDto } from './report.model';
import { AgentBalanceUpdate } from '../agent/agent.model';

@ApiTags("Report Module")
@Controller()
export class ReportController {
  constructor(
    private readonly reportService: ReportService
  ) {}

  @ApiBearerAuth('access_token')
  @Get('admin/dashboard/graph')
  addGraph(@Headers() header: Headers) {
    return this.reportService.adminGraph(header);
  }

  @ApiBearerAuth('access_token')
  @Post('admin/expense')
  addExpense(
    @Headers() header: Headers,
    @Body() adminExpenseModel: AdminExpenseModel) {
    return this.reportService.addAdminExpense(header, adminExpenseModel);
  }

  @ApiBearerAuth('access_token')
  @Patch('admin/expense/:id')
  editExpense(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() adminExpenseModel: AdminExpenseModel) {
    return this.reportService.editAdminExpense(header, +id, adminExpenseModel);
  }

  @ApiBearerAuth('access_token')
  @Post('admin/ledger')
  addAdminLedger(
    @Headers() header: Headers,
    @Body() adminledgerModel: AdminLedger) {
    return this.reportService.addAdminLedger(header, adminledgerModel);
  }

  @ApiBearerAuth('access_token')
  @Patch('admin/ledger/:id')
  editAdminLedger(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() adminLedgerDto: UpdateAdminLedgerDto) {
    return this.reportService.editAdminLedger(header, +id, adminLedgerDto);
  }

  @ApiBearerAuth('access_token')
  @Delete('admin/ledger/:id')
  deleteAdminLedger(
    @Headers() header: Headers,
    @Param('id') id: string) {
    return this.reportService.deleteAdminLedger(header, +id);
  }

  @ApiBearerAuth('access_token')
  @Patch('admin/ledger/single/:id')
  editAgentLedgerByAdmin(
    @Headers() header: Headers,
    @Param('id') id: string,
    @Body() updateAgentLedgerDto: AgentBalanceUpdate) {
    return this.reportService.editAgentLedgerByAdmin(header, +id, updateAgentLedgerDto);
  }

  @ApiBearerAuth('access_token')
  @Delete('admin/ledger/single/:id')
  deleteAgentLedgerByAdmin(
    @Headers() header: Headers,
    @Param('id') uid: string) {
    return this.reportService.deleteAgentLedgerByAdmin(header, uid);
  }

  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'adminId', required: false })
  @Get('admin/report/ledger/:startDate/:endDate')
  findAllAdminLedger(
    @Headers() header: string,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
    @Query('adminId') adminId: string

  ){
    return this.reportService.findAllAdminLedger(header, startDate, endDate, adminId);
  }

  @Get('admin/report/single/:agentId')
  findSingleLedgerAdmin(
    @Headers() header: string,
    @Param('agentId') agentId: string
  ) {
    return this.reportService.findSingleAgentLedgerAdmin(header, agentId);
  }

  @Get('admin/ledger/single/:agentId')
  @ApiBearerAuth('access_token')
  findAgentSingelAllLedger(@Headers() header: Headers,
  @Param('agentId') agentId?: string,
  @Query('page') page?: number,
  @Query('limit') limit?: number){
  if(limit > 100 || limit < 10){
    throw new NotAcceptableException("Limit Range must be 10-100");
  }
    return this.reportService.findAllAgentSingelAdmin(header, agentId, page, limit);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/report/:startDate/:endDate')
  @ApiQuery({ name: 'filter', required: false })
  findAllReportAdmin(
    @Headers() header: Headers,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date){
    return this.reportService.findAllReportAdmin(header, startDate, endDate);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/report/ledger')
  findAllByAgentId(
    @Headers() header: string,
    @Query('filter') filter: string) {
    return this.reportService.findAllByAgentId(header, filter);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/report/:startDate/:endDate')
  findAllBydate(
    @Headers() header: string,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
  ) {
    return this.reportService.findAllByDateRangeAgentId(header, startDate, endDate);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/report/dashboard')
  findDashboard(@Headers() header: Headers){
    return this.reportService.findDashboard(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/report/dashboard')
  findDashboardAgent(
    @Headers() header: string,
  ){
    return this.reportService.findDashboardAgent(header);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/report/expense')
  @ApiQuery({ name: 'filter', required: false })
  findAdminExpense(@Headers() header: Headers,
  @Query('page') page?: number,
  @Query('filter') filter?: string,
  @Query('limit') limit?: number){
  if(limit > 100 || limit < 10){
    throw new NotAcceptableException("Limit Range must be 10-100");
  }
    return this.reportService.findAdminExpense(header, page, filter, limit);
  }
}
