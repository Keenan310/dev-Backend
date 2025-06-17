import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { RefundService } from './refund.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefundDecisionModel, RefundQuotation, RefundRequestModel } from './refund.model';


@ApiTags("Refund Modules")
@Controller()
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @ApiBearerAuth('access_token')
  @Post('agent/refund/request/:bookingUId')
  createAgentReaquest(
    @Headers() header: string,
    @Param('bookingUId') bookingUId: string,
    @Body() createRefundDto: RefundRequestModel) {
    return this.refundService.createAgentRequest(header, bookingUId, createRefundDto);
  }

  @ApiBearerAuth('access_token')
  @Post('admin/refund/quotation/:bookingUId')
  sendQuotation(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Body() quotationRefundDto: RefundQuotation) {
    return this.refundService.sendQuotation(header, bookingUId, quotationRefundDto);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/refund/quotation/:status/:bookingUId')
  quotationDecision(
    @Headers() header: string,
    @Param('bookingUId') bookingUId: string,
    @Param('status') status: string) {
    return this.refundService.quotationDecision(header, status, bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Post('admin/refund/:status/:bookingUId')
  refundDecision(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Param('status') status: string,
    @Body() refundDecisionDto: RefundDecisionModel) {
    return this.refundService.refundDecision(header, status, bookingUId, refundDecisionDto);
  }

}
