import { Controller, Get, Post, Body, Param, NotFoundException, Query, Res } from '@nestjs/common';
import { BkashService } from './bkash.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PGW Bkash')
@Controller('pgw/bkash')
export class BkashController {
  constructor(private readonly bkashService: BkashService) {}

  @Post(':amount/:agentUId')
  createPayment(
    @Param('agentUId') agentUId: string,
    @Param('amount') amount: number,
    ) {
    return this.bkashService.createPayment(agentUId, amount);
  }

  @Get('callback')
  getPayment(
    @Query('paymentID') paymentID: string,
    @Query('status') status: string,
    @Res() res: any,
  ) {
    if(paymentID !== ''){
       new NotFoundException('Payment ID Not Found');
    }
    if(status !== ''){
      new NotFoundException('Status ID Not Found');
    }
    if (status === 'failure') {
        return res.redirect('https://b2b.etripzone.com/payment/failure');
    } else if (status === 'cancel') {
      return res.redirect('https://b2b.etripzone.com/payment/cancel');
    }
    return this.bkashService.executePayment(paymentID, status, res);
  }

  @Post('refund/:agentUId')
  refundPayment(
    @Param('depositUId') depositUId: string) {
    return this.bkashService.refundPayment(depositUId);
  }

  @Get('search/:transactionId')
  searchPayment(
    @Param('transactionId') transactionId: string) {

    return this.bkashService.searchPayment(transactionId);
  }

  @Get('search/:paymentId')
  queryPayment(
    @Param('paymentId') paymentId: string) {
    return this.bkashService.searchPayment(paymentId);
  }
}
