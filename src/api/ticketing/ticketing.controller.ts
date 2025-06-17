import { Controller, Post, Body, Param, Headers, Query } from '@nestjs/common';
import { TicketingService } from './ticketing.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MakeTicketModel } from './ticketing.model';

@ApiTags('Ticketing Modules')
@Controller()
export class TicketingController {
  constructor(private readonly ticketingService: TicketingService) {}

  @ApiBearerAuth('access_token')
  @Post('agent/ticketing/issue/request/:bookingUId')
  ticketIssueRequest(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Query('payment') payment: string) {
    return this.ticketingService.ticketIssueRequest(header, bookingUId, payment);
  }

  @ApiBearerAuth('access_token')
  @Post('admin/ticketing/make/:bookingUId')
  createTicket(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Body() makeTicketingDto: MakeTicketModel) {
    return this.ticketingService.createTicket(header,bookingUId, makeTicketingDto);
  }

  @ApiBearerAuth('access_token')
  @Post('admin/ticketing/reject/:bookingUId/:remarks')
  rejectTicket(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Param('remarks') remarks: string) {
    return this.ticketingService.rejectTicket(header, bookingUId, remarks);
  }
}
