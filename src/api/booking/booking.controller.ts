import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query, NotAcceptableException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingModelUpdateAdmin } from './booking.model';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';


@ApiTags("Booking Modules")
@Controller()
export class BookingController {
  constructor(
    private readonly bookingService: BookingService
  ) {}

  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('admin/booking/all')
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
    return this.bookingService.findAllAdmin(header, page, status, filter, limit);
  }

  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('admin/agent/booking/:agentUId')
  findOneAgentByAdmin(
    @Headers() header: Headers,
    @Param('agentUId') agentUId?: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number,
  ) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Maximum Limit must be 10-100");
    }
    return this.bookingService.findAllAgentByAdmin(header, agentUId, page, status, filter, limit);
  }

  
  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('agent/booking')
  findAllAgent(
    @Headers() header?: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number,
  ) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Maximum Limit must be 10-100");
    }
    return this.bookingService.findAllAgent(header, page, status, filter, limit);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/booking/details/:bookingUId')
  findOneAgent(
    @Headers() header: string,
    @Param('bookingUId') bookingUId: string) {
    return this.bookingService.findOneAgent(header, bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/agent/booking/details/:bookingUId')
  findOneBookingAdmin(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string) {
    return this.bookingService.findOneByAdmin(header, bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/booking/past')
  findPastFlightAgentId(
    @Headers() header: string
  ) {
    return this.bookingService.findPastFlightAgentId(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/booking/upcoming')
  findUpcomingFlightAgentId(
    @Headers() header: string,) {
    return this.bookingService.findUpcomingFlightAgentId(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/booking/calendare/:yearMonth')
  findCalendareByAgentId(
    @Headers() header: string,
    @Param('yearMonth') yearMonth: Date) {
    return this.bookingService.findCalendareAgentId(header, yearMonth);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: "Update All Booking, PNR" , description: "Admin Can Access"})
  @Patch('admin/booking/:bookingUId')
  update(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Body() updateBookingDto: BookingModelUpdateAdmin) {
    return this.bookingService.update(header, bookingUId, updateBookingDto);
  }

  @ApiBearerAuth('access_token')
  @Delete('admin/booking/:bookingUId')
  remove(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string) {
    return this.bookingService.remove(header, bookingUId);
  }

}
