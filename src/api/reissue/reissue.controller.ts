import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { ReissueService } from './reissue.service';
import { ReissueQuotation, ReissueRequestModel } from './reissue.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Reissue Modules')
@Controller()
export class ReissueController {
  constructor(private readonly reissueService: ReissueService) {}

  @ApiBearerAuth('access_token')
  @Post('agent/reissue/request/:bookingUId')
  createagentreaquest(
    @Headers() header: string,
    @Param('bookingUId') bookingUId: string,
    @Body() createReissueDto: ReissueRequestModel) {
    return this.reissueService.createAgentRequest(header, bookingUId, createReissueDto);
  }

  @Post('admin/reissue/quotation/:bookingUId')
  sendquatation(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Body() quotationReissueDto: ReissueQuotation) {
    return this.reissueService.sendQuotation(header, bookingUId, quotationReissueDto);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/reissue/decision/:status/:bookingUId')
  quatationDecision(
    @Headers() header: string,
    @Param('status') status: string,
    @Param('bookingUId') bookingUId: string) {
    return this.reissueService.reissueTicketRequest(header, status, bookingUId);
  }

  @Get('admin/reissue/ticket/decision/:status/:bookingUId')
  reissueDecision(
    @Headers() header: Headers,
    @Param('status') status: string,
    @Param('bookingUId') bookingUId: string) {
    return this.reissueService.reissueDecisionAdmin(header, status, bookingUId);
  }
}
