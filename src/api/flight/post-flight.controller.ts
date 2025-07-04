import { Controller, Post, Body, Get, Headers, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SeapMapDto } from './dto/seatmap-flight.dto';
import { FlightService } from './flight.service';
import { AirBookingModel } from './dto/booking-flight.dto';
import { Revalidation } from './dto/revalidation-flight.dto';
import { FlightSearchModel } from './dto/search-flight.dto';
import { FareRulesDto } from './dto/farerules-flight.dto';

@ApiBearerAuth('access_token')
@ApiTags('Post Ticketing Modules')
@Controller()
export class PostFlightController {
  constructor(private readonly flightService: FlightService) {}

  @ApiBearerAuth('access_token')
  @Get("agent/flight/booking/details/:bookingUId")
  AirRetrieveAgent(
    @Headers() header: string,
    @Param('bookingUId') bookingUId: string){
    return this.flightService.airretrieveagent(header, bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Get("admin/flight/booking/details/:bookingUId")
  AirRetrieveAdmin(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string){
    return this.flightService.airretrieveadmin(header, bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Get("agent/flight/booking/check/:system/:pnr")
  AirCheckPNR(
    @Headers() header: string,
    @Param('system') system: string,
    @Param('pnr') pnr: string) {
    return this.flightService.aircheckpnr(header, system, pnr);
  }

  @ApiBearerAuth('access_token')
  @Get("agent/flight/booking/cancel/:bookingUId")
  AirCancelAgent(
    @Headers() header: string,
    @Param('bookingUId') bookingUId: string) {
    return this.flightService.aircancelagent(header , bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Get("admin/flight/booking/cancel/:bookingUId")
  AirCancelAdmin(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string) {
    return this.flightService.aircanceladmin(header , bookingUId);
  }

  @ApiBearerAuth('access_token')
  @Get("agent/flight/booking/import/:system/:pnr")
  AirImportPnr(
    @Headers() header: string,
    @Param('system') system: string,
    @Param('pnr') pnr: string) {
    return this.flightService.airimportpnr(header, system, pnr);
  }
}