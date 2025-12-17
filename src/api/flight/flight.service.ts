import { HttpException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SabreService } from './sabre.flights.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingModel, TicketModel } from '../booking/booking.model';
import { Repository } from 'typeorm';
import axios from 'axios';
import { PassengerModel } from '../passenger/passenger.model';
import { HttpStatusCode } from 'axios';
import { ReissueModel } from '../reissue/reissue.model';
import { RefundModel } from '../refund/refund.model';
import { AgentModel } from '../agent/agent.model';
import { GroupfareService } from '../groupfare/groupfare.service';
import { BookingService } from '../booking/booking.service';
import { AirBookingModel } from './dto/booking-flight.dto';
import { FlightSearchModel } from './dto/search-flight.dto';
import { AuthService } from '../auth/auth.service';
import { AlhindAPI } from './alhind.flights.service';
import { VoidModel } from '../void/void.model';
import { SearchhistoryService } from '../searchhistory/searchhistory.service';
import { GetFare } from './dto/getfare-flight.dto';
import { SaveFlightsData } from './entity/save-flight.entity';

@Injectable()
export class FlightService {
  constructor(
      @InjectRepository(BookingModel)
      private readonly bookingRepository: Repository<BookingModel>,
      @InjectRepository(AgentModel)
      private readonly agentRepository: Repository<AgentModel>,
      @InjectRepository(PassengerModel)
      private readonly passengerRepository: Repository<PassengerModel>,
      @InjectRepository(ReissueModel)
      private readonly reissueRepository: Repository<ReissueModel>,
      @InjectRepository(RefundModel)
      private readonly refundRepository: Repository<RefundModel>,
      @InjectRepository(VoidModel)
      private readonly voidRepository: Repository<VoidModel>,
      @InjectRepository(TicketModel)
      private readonly ticketingRepository: Repository<TicketModel>,
      @InjectRepository(SaveFlightsData)
      private readonly saveFlightsDataRepository: Repository<SaveFlightsData>,
      private readonly searchhistoryService: SearchhistoryService,
      private readonly authService: AuthService,
      private readonly sabreService: SabreService,
      private readonly bookingService: BookingService,
      private readonly groupFareService: GroupfareService,
      private readonly alhindAPI: AlhindAPI,
    ) {}

  async airsearch(header: any, flightDto :FlightSearchModel){
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    await this.searchhistoryService.create(agent, flightDto);

    //const Sabre_FlightData = await this.sabreService.shopping(agent, flightDto);

    // let Groupdata: any[] = [];
    // if (flightDto.segments.length === 1 && flightDto.adultcount === 1) {
    //   Groupdata = await this.groupFareService.findBySearchFlight(flightDto);
    // }

      const AlhindData = await this.alhindAPI.flights(agent, flightDto);

      //const combinedArray = Sabre_FlightData.concat(AlhindData);
      AlhindData.sort((a, b) => a.NetFare - b.NetFare);
      return AlhindData;

  }

  async airrevalidation(header: any, revalidationDto: any){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const System = revalidationDto.System;

    let RevalidationData: any;
    if(System === 'Sabre'){
       RevalidationData = await this.sabreService.revalidation(agent, revalidationDto);
    }else if(System === 'GroupFare'){
       RevalidationData =  await this.groupFareService.findOne(agent, revalidationDto.OfferId);
    }else if(System === 'AlHind'){
       RevalidationData =  await this.alhindAPI.priceCheck(agent, revalidationDto);
    }else{
      RevalidationData ='Other System';
    }
    return RevalidationData;
  }

  async getfare(header: any, getFare: GetFare){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const rawdata = await this.saveFlightsDataRepository.findOne({ where: { token: getFare.token} });
    const key = getFare?.key;

    const flightsArray = Array.isArray(rawdata.data) ? rawdata.data : JSON.parse(rawdata.data);
    const singleFlight = flightsArray.find(item => item.Key === key);

    if (!singleFlight) {
      throw new Error('Flight not found for the given key');
    }

    const { PriceBreakDown, ...rest } = singleFlight;
    const updatedData = {
      ...rest,
      FlightFares: [PriceBreakDown],
      SeatEnabled: false,
      Reprice: false,
      FFNoEnabled: false

    };

    let tripMode = rawdata.triptype;
    if (rawdata.triptype === 'R') {
        tripMode = 'S';
    }

    let data = JSON.stringify({
      "Token": getFare.token,
      "UserId": "AEAUH001035200",
      "Error": null,
      "TripMode": tripMode,
      "Journy": {
        "FlightOptions": [],
        "FlightOption": updatedData,
        "HostTokens": [],
        "Errors": []
      }
    });

    let getfarerequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://b2b.keenantravel.com/getfare.php',
      headers: { 
        'Content-Type': 'application/json',
      },
      data : data
    };
    
    try {
      const response = await axios.request(getfarerequest);
      return response.data;
    }catch (error) {
      console.error(error);
      throw error;
    }

  }

  async farerules(header: any, getFare: GetFare){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const rawdata = await this.saveFlightsDataRepository.findOne({ where: { token: getFare.token} });
    const key = getFare?.key;

    const flightsArray = Array.isArray(rawdata.data) ? rawdata.data : JSON.parse(rawdata.data);
    const singleFlight = flightsArray.find(item => item.Key === key);

    if (!singleFlight) {
      throw new Error('Flight not found for the given key');
    }

    let data = JSON.stringify({
      "Token": getFare.token,
      "UserId": "AEAUH001035200",
      "ItineraryId": singleFlight?.Journy?.FlightOption?.FlightFares[0]?.FID
    });

    let getfarerequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://b2b.keenantravel.com/farerules.php',
      headers: { 
        'Content-Type': 'application/json',
      },
      data : data
    };
    
    try {
      const response = await axios.request(getfarerequest);
      return response.data;
    }catch (error) {
      console.error(error);
      throw error;
    }

  }

  async pricecheck(agentUId : string, revalidationDto: any){

    const agentdata = await this.agentRepository.findOne({ where : { uid: agentUId}});

    if(!agentdata){
      throw new NotFoundException("Agent data not found");
    }
    
    const System = revalidationDto.System;

    if(System == 'Sabre'){
       return await this.sabreService.price_check(agentdata, revalidationDto);
    }else{
       return 'Other System';
    }
  }

  async airbooking(header: any, bookingDto : AirBookingModel){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }
    
    const System = bookingDto?.FlightInfo?.System;

    if(System === 'Sabre'){
      return await this.sabreService.booking(agent, bookingDto);
    }else if(System === 'GroupFare'){
      return await this.bookingService.group_booking(agent, bookingDto);
    }else if(System === 'AlHind'){
      return await this.bookingService.alhind_booking(agent, bookingDto);
    }else{
      return "Invalid System";
    }
  }

  async airimportpnr(header: any, system: string, pnr: string){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const bookingdata =  await this.bookingRepository.findOne({ where : {pnr: pnr}});
    if(bookingdata){
      throw new HttpException("Pnr Already Imported", HttpStatusCode.Found);
    }
  
    let BookingResponse: any;
    if(system.toLowerCase() === 'sabre'){
      BookingResponse = await this.sabreService.import_pnr(pnr, agent);
    }else{
      BookingResponse ='Other System';
    }
    return BookingResponse;

  }

  async aircancelagent(header: any, bookingUId: string){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});

    if(booking.status === 'Cancelled'){
      throw new HttpException("Already Cancelled", HttpStatusCode.AlreadyReported);
    }else if(booking.status === 'Hold'){
      if(booking.system === 'Sabre'){
        
        const BookingResponse = await this.sabreService.aircancel(booking.pnr);
    
        if(BookingResponse.request.cancelAll === true){
          booking.status = 'Cancelled';
    
          await this.bookingRepository.update(booking.id, booking);

          return {
            status: 'success',
            message:'Booking already cancelled',
          };
        }else{
          
          booking.status = 'Cancelled';
          await this.bookingRepository.update(booking.id, booking);
          return {
            status: 'success',
            message:'Booking already cancelled',
          };
        }
      }else if(booking.system === 'AlHind'){
          booking.status = 'Cancelled';
          booking.updated_at = new Date();
          const res =  await this.bookingRepository.update(booking.id, booking);
          if(res.affected === 1){
            return {
              status: 'success',
              message:'Booking already cancelled'
            }
          }else{
            return {
              status: 'success',
              message:'Booking already cancelled'
            }
          }
      }else if(booking.system === 'GroupFare'){
        throw new NotAcceptableException('No Permission for cancel')
      }else{
        throw new NotFoundException('Invalid System');
      }
    }else{
      throw new HttpException("Unknow error", HttpStatusCode.BadRequest);
    }
  }

  async aircanceladmin(header: any, bookingUId: string){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});

    if(booking.status === 'Cancelled'){
      throw new HttpException("Already Cancelled", HttpStatusCode.AlreadyReported);
    }else if(booking.status === 'Hold'){
      if(booking.system === 'Sabre'){
        
        const bookingResponse = await this.sabreService.aircancel(booking.pnr);
        if(bookingResponse.request.cancelAll === true){
          booking.status = 'Cancelled';
          booking.updated_at = new Date();
    
          await this.bookingRepository.update(booking.id, booking);

          return {
            status: 'success',
            message:'Booking already cancelled',
          };
        }else{
          
          booking.status = 'Cancelled';
          booking.updated_at = new Date();
          await this.bookingRepository.update(booking.id, booking);
          return {
            status: 'success',
            message:'Booking already cancelled',
          };
        }
      }else if(booking.system === 'AlHind'){
          booking.status = 'Cancelled';
          const res =  await this.bookingRepository.update(booking.id, booking);
          if(res.affected === 1){
            return {
              status: 'success',
              message:'Booking already cancelled'
            }
          }else{
            return {
              status: 'success',
              message:'Booking already cancelled'
            }
          }
      }else if(booking.system === 'GroupFare'){
        throw new NotAcceptableException('No Permission for cancel')
      }else{
        throw new NotFoundException('Invalid System');
      }
    }else{
      throw new HttpException("Unknow error", HttpStatusCode.BadRequest);
    }
  }

  async airretrieveagent(header: any, bookingUId: string){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    if(!booking){
      throw new UnauthorizedException();
    }

    const passengerdata =  await this.passengerRepository.find({ where : {bookingId: booking.bookingId}});

    if(booking.system === 'Sabre'){
      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const voiddata =  await this.voidRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});

      const customResponseData = {
        bookingdata: booking,
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        voiddata: voiddata,
        ticketdetails: ticketdetails,
        partialpaymentdata: ''
      };

      return customResponseData;

    }else if(booking.system === 'Portal'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const voiddata =  await this.voidRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});


      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        voiddata: voiddata,
        ticketdetails: ticketdetails,
        partialpaymentdata: ''

      };

      return customResponseData;

    }else if(booking.system === 'AlHind'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const voiddata =  await this.voidRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});

      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        voiddata: voiddata,
        ticketdetails: ticketdetails,
        partialpaymentdata: ''

      };

      return customResponseData;

    }else if(booking.system === 'GroupFare'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: [],
        reissuedata: [],
        voiddata: [],
        ticketdetails: ticketdetails,
        partialpaymentdata: {}
        
      };

      return customResponseData;

    }
  }

  async airretrieveadmin(header: any, bookingUId: string){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }


     const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    if(!booking){
      throw new UnauthorizedException();
    }

    const passengerdata =  await this.passengerRepository.find({ where : {bookingId: booking.bookingId}});

    if(booking.system === 'Sabre'){
      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const voiddata =  await this.voidRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});


      const customResponseData = {
        bookingdata: booking,
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        voiddata: voiddata,
        ticketdetails: ticketdetails,
        partialpaymentdata: ''
      };

      return customResponseData;

    }else if(booking.system === 'Portal'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const voiddata =  await this.voidRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});


      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        voiddata: voiddata,
        ticketdetails: ticketdetails,
        partialpaymentdata: ''

      };

      return customResponseData;

    }else if(booking.system === 'AlHind'){
      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});
      const voiddata =  await this.voidRepository.find({ where : {bookingId: booking.bookingId}, order: { created_at: "DESC" }});


      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        voiddata: voiddata,
        ticketdetails: ticketdetails,
        partialpaymentdata: ''

      };

      return customResponseData;

    }else if(booking.system === 'GroupFare'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: [],
        reissuedata: [],
        voiddata: [],
        ticketdetails: ticketdetails,
        partialpaymentdata: {}
        
      };

      return customResponseData;

    }
  }

  async aircheckpnr(header: any, system: string, pnr: string){
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    const bookingdata =  await this.bookingRepository.findOne({ where : {pnr: pnr}});
    if(bookingdata){
      throw new HttpException("Pnr Already Imported", HttpStatusCode.Found);
    }

    if(system.toLowerCase() != 'sabre'){
      throw new NotFoundException("Invalid System");
    }

    return await this.sabreService.checkpnr(pnr);;

  }
}

