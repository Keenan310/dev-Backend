import { Controller, Get, Param, Headers, Query, NotAcceptableException, Post, Body, Patch } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto } from './report.model';

@ApiTags("Report Module")
@Controller()
export class ReportController {
  constructor(
    private readonly reportService: ReportService
  ) {}

  @ApiBearerAuth('access_token')
  @Post('admin/expense')
  addExpsense(
    @Headers() header: Headers,
    @Body() adminExpenseModel: AdminExpenseModel) {
    return this.reportService.addAdminExpsense(header, adminExpenseModel);
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
    @Body() adminledgerDto: UpdateAdminLedgerDto) {
    return this.reportService.editAdminLedger(header, +id, adminledgerDto);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/report/ledger/:startDate/:endDate')
  findAllAdminLedger(
    @Headers() header: string,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
  ) {
    return this.reportService.findAllAdminLedger(header, startDate, endDate);
  }

  @Get('admin/report/single/:agentId')
  findSingleLedgerAdmin(
    @Headers() header: string,
    @Param('agentId') agentId: string
  ) {
    return this.reportService.findSingleAgentLedgerAdmin(header, agentId);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/report/balance/inquery')
  findAllAdminBalance(
    @Headers() header: string
  ) {
    return this.reportService.findAllAdminBalanceInquery(header);
  }


  @ApiBearerAuth('access_token')
  @Get('admin/report/:startDate/:endDate')
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
