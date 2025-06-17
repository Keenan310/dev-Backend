import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, NotFoundException } from '@nestjs/common';
import { NagadService } from './nagad.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PGW Nagad')
@Controller('pgw/nagad')
export class NagadController {
  constructor(private readonly nagadService: NagadService) {}

  @Post(':amount/:agentUId')
  createPayment(
    @Param('agentUId') agentUId: string,
    @Param('amount') amount: number) {
    return this.nagadService.createPayment(agentUId, amount);
  }

  // @Get('callback')
  // getPayment(
  //   @Query('paymentID') paymentID: string,
  //   @Query('status') status: string,
  //   @Res() res: any,
  // ) {
  //   if(paymentID !== ''){
  //      new NotFoundException('Payment ID Not Found');
  //   }
  //   if(status !== ''){
  //     new NotFoundException('Status ID Not Found');
  //   }
  //   if (status === 'failure') {
  //       return res.redirect('https://b2b.etripzone.com/payment/failure');
  //   } else if (status === 'cancel') {
  //     return res.redirect('https://b2b.etripzone.com/payment/cancel');
  //   }
  //   return this.nagadService.executePayment(paymentID, status, res);
  // }

  // @Post('refund/:agentUId')
  // refundPayment(@Param('depositUId') depositUId: string) {

  //   return this.nagadService.refundPayment(depositUId);
  // }

  // @Get('search/:transactionId')
  // searchPayment(
  //   @Param('transactionId') transactionId: string) {

  //   return this.nagadService.searchPayment(transactionId);
  // }

  // @Get('search/:paymentId')
  // queryPayment(
  //   @Param('paymentId') paymentId: string) {
  //   return this.nagadService.searchPayment(paymentId);
  // }
}
