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
}