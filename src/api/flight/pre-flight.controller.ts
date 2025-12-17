import { Controller, Post, Body, Get, Headers, Param, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlightService } from './flight.service';
import { AirBookingModel } from './dto/booking-flight.dto';
import { Revalidation } from './dto/revalidation-flight.dto';
import { FlightSearchModel } from './dto/search-flight.dto';
import { GetFare } from './dto/getfare-flight.dto';

@ApiBearerAuth('access_token')
@ApiTags('Pre Ticketing Modules')
@Controller()
export class PreFlightController {
  constructor(private readonly flightService: FlightService) {}

  @ApiBearerAuth('access_token')
  @Post("agent/flight/search")
  AirSearch(
    @Headers() header: string,
    @Body() flightDto: FlightSearchModel) {
    return this.flightService.airsearch(header, flightDto);
  }

  @ApiBearerAuth('access_token')
  @Post("agent/flight/revalidation")
  Revalidation(
    @Headers() header: string,
    @Body() revalidationDto: Revalidation) {
    return this.flightService.airrevalidation(header, revalidationDto);
  }

  @ApiBearerAuth('access_token')
  @Post("agent/flight/getfare")
  GetFare(
    @Headers() header: string,
    @Body() getFareDto: GetFare) {
    return this.flightService.getfare(header, getFareDto);
  }

  @ApiBearerAuth('access_token')
  @Post("agent/flight/farerules")
  FareRules(
    @Headers() header: string,
    @Body() getFareDto: GetFare) {
    return this.flightService.farerules(header, getFareDto);
  }

  @ApiBearerAuth('access_token')
  @Post("agent/flight/booking")
  AirBooking(
    @Headers() header: string,
    @Body() bookingDto: AirBookingModel) {
    return this.flightService.airbooking(header, bookingDto);
  }

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