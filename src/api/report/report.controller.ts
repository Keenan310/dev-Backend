import { Controller, Get, Param, Headers, Query, NotAcceptableException } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags("Report Module")
@Controller()
export class ReportController {
  constructor(
    private readonly reportService: ReportService
  ) {}

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
  @Get('admin/report/ledger')
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'filter', required: false })
  findAllLedger(@Headers() header: Headers,
  @Query('page') page?: number,
  @Query('type') type?: string,
  @Query('filter') filter?: string,
  @Query('limit') limit?: number) {
  if(limit > 100 || limit < 10){
    throw new NotAcceptableException("Limit Range must be 10-100");
  }
    return this.reportService.findAllLedger(header, page, type, filter, limit);
  }
}
