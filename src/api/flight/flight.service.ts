import { HttpException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SabreService } from './sabre.flights.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingModel, TicketModel } from '../booking/booking.model';
import { Repository } from 'typeorm';
import { SeapMapDto } from './dto/seatmap-flight.dto';
import { PassengerModel } from '../passenger/passenger.model';
import { HttpStatusCode } from 'axios';
import { ReissueModel } from '../reissue/reissue.model';
import { RefundModel } from '../refund/refund.model';
import { AgentModel } from '../agent/agent.model';
import { GroupfareService } from '../groupfare/groupfare.service';
import { BookingService } from '../booking/booking.service';
import { AirBookingModel } from './dto/booking-flight.dto';
import { FlightSearchModel } from './dto/search-flight.dto';
import { FareRulesDto } from './dto/farerules-flight.dto';
import { PartialPaymentModel } from '../partialpayment/entities/partialpayment.entity';
import { AuthService } from '../auth/auth.service';
import { SearchHistoryModel } from '../searchhistory/searchhistory.model';
import { AlhindAPI } from './alhind.flights.service';

@Injectable()
export class FlightService {
  constructor(
      @InjectRepository(BookingModel)
      private readonly bookingRepository: Repository<BookingModel>,
      @InjectRepository(PartialPaymentModel)
      private readonly partialPaymentRepository: Repository<PartialPaymentModel>,
      @InjectRepository(AgentModel)
      private readonly agentRepository: Repository<AgentModel>,
      @InjectRepository(PassengerModel)
      private readonly passengerRepository: Repository<PassengerModel>,
      @InjectRepository(ReissueModel)
      private readonly reissueRepository: Repository<ReissueModel>,
      @InjectRepository(RefundModel)
      private readonly refundRepository: Repository<RefundModel>,
      @InjectRepository(TicketModel)
      private readonly ticketingRepository: Repository<TicketModel>,
      @InjectRepository(SearchHistoryModel)
      private readonly searchHistoryRepository: Repository<SearchHistoryModel>,
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

    // const search = await this.searchHistoryRepository
    // .createQueryBuilder('search')
    // .where(`DATE(created_at) = CURDATE()`)
    // .andWhere('search.agentId = :agentId', { agentId: agent.agentId })
    // .getCount();

    // if(search > agent.searchlimit){
    //   throw new NotFoundException(" Daily Search Limit Exceed");
    // }else{
    //   const Sabre_FlightData = await this.sabreService.shopping(agent, flightDto);

    //   let Groupdata: any[] = [];
    //   if (flightDto.segments.length === 1 && flightDto.adultcount === 1) {
    //     Groupdata = await this.groupFareService.findBySearchFlight(flightDto);
    //   }

    //   const combinedArray = Sabre_FlightData.concat(Groupdata);
    //   combinedArray.sort((a, b) => a.NetFare - b.NetFare);
      
    //   return combinedArray;

    // }

    return await this.alhindAPI.flights(agent, flightDto);
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
       RevalidationData =  await this.groupFareService.findOne(revalidationDto.OfferId);
    }else{
      RevalidationData ='Other System';
    }
    return RevalidationData;
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

  async airseatmapagent(header: any, seatMapDto: SeapMapDto){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    let SeatMapData: any;
    if(seatMapDto?.System === 'Sabre'){
      SeatMapData = await this.sabreService.seat_map(seatMapDto);
    }else if(seatMapDto?.System === 'GroupFare'){
      SeatMapData = await this.sabreService.seat_map(seatMapDto);
    }else if(seatMapDto?.System === 'Portal'){
      SeatMapData = await this.sabreService.seat_map(seatMapDto);
    }
    return SeatMapData;

  }

  async airseatmapadmin(header: any, seatMapDto: SeapMapDto){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    
    if(seatMapDto.System == 'Sabre'){
      return await this.sabreService.seat_map(seatMapDto);
    }else if(seatMapDto.System == 'Portal'){
      return await this.sabreService.seat_map(seatMapDto);
    }else if(seatMapDto.System == 'GroupFare'){
      return await this.sabreService.seat_map(seatMapDto);
    }else{
      return []
    }

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
      }else if(booking.system === 'Portal'){
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
      }else if(booking.system === 'Portal'){
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

    const partialpaymentdata =  await this.partialPaymentRepository.findOne({ where : {uid: bookingUId}});

    let booking: any;
    if(partialpaymentdata){
      booking =  await this.bookingRepository.findOne({ where : {bookingId: partialpaymentdata.bookingId}});
    }else if(!partialpaymentdata){
      booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    }else if(!booking){
      throw new HttpException("BookingUId not found", HttpStatusCode.NotFound);
    }

    const passengerdata =  await this.passengerRepository.find({ where : {bookingId: booking.bookingId}});

    if(booking.system === 'Sabre'){
      let bookingresponse = await this.sabreService.airretrieve(booking.pnr);

      if(booking.flightdata === null && booking.status === 'Hold'){
        booking['flightdata'] = bookingresponse.flights;
        booking['airlinespnr'] = bookingresponse?.flights[0]?.confirmationId;

        await this.bookingRepository.update(booking.id, booking);
      }else if(bookingresponse?.isTicketed === true && booking.status === 'Hold'){
        booking['status'] = 'Ticketed';
        booking['airlinespnr'] = bookingresponse?.flights[0]?.confirmationId;
        booking['ticketed_at'] =  new Date();
        await this.bookingRepository.update(booking.id, booking);
      }

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.findOne({ where : {bookingId: booking.bookingId}});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}});
      const pp = await this.partialPaymentRepository.findOne({ where : {bookingId: booking.bookingId}});

      const customResponseData = {
        bookingdata: booking,
        sabredata: bookingresponse,
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        ticketdetails: ticketdetails,
        partialpaymentdata: partialpaymentdata || pp
      };

      return customResponseData;

    }else if(booking.system === 'Portal'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: booking.bookingId}});
      const refunddata = await this.refundRepository.findOne({ where : {bookingId: booking.bookingId}});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: booking.bookingId}});
      const pp = await this.partialPaymentRepository.findOne({ where : {bookingId: booking.bookingId}});

      const customResponseData = {
        bookingdata: booking,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        ticketdetails: ticketdetails,
        partialpaymentdata: partialpaymentdata || pp

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

    const partialpaymentdata =  await this.partialPaymentRepository.findOne({ where : {uid: bookingUId}});

    let bookingdata: any;
    if(partialpaymentdata){
      bookingdata =  await this.bookingRepository.findOne({ where : {bookingId: partialpaymentdata.bookingId}});
    }else if(!partialpaymentdata){
      bookingdata =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    }else if(!bookingdata){
      throw new HttpException("BookingUId not found", HttpStatusCode.NotFound);
    }

    const pp =  await this.partialPaymentRepository.findOne({ where : {bookingId: bookingdata.bookingId}});
    const passengerdata =  await this.passengerRepository.find({ where : {bookingId: bookingdata.bookingId}});

    if(bookingdata.system === 'Sabre'){
      let bookingresponse = await this.sabreService.airretrieve(bookingdata.pnr);

      if(bookingdata.flightdata === null && bookingdata.status === 'Hold'){
        bookingdata['flightdata'] = bookingresponse.flights;

        await this.bookingRepository.update(bookingdata.id, bookingdata);
      }else if(bookingresponse?.isTicketed === true && bookingdata.status === 'Hold'){
        bookingdata['status'] = 'Ticketed';
        await this.bookingRepository.update(bookingdata.id, bookingdata);
      }

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: bookingdata.bookingId}});
      const refunddata = await this.refundRepository.findOne({ where : {bookingId: bookingdata.bookingId}});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: bookingdata.bookingId}});

      const customResponseData = {
        bookingdata: bookingdata,
        sabredata: bookingresponse,
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        ticketdetails: ticketdetails,
        partialpaymentdata: partialpaymentdata || pp
      };

      return customResponseData;

    }else if(bookingdata.system === 'Portal'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: bookingdata.bookingId}});
      const refunddata = await this.refundRepository.findOne({ where : {bookingId: bookingdata.bookingId}});
      const reissuedata =  await this.reissueRepository.find({ where : {bookingId: bookingdata.bookingId}});

      const customResponseData = {
        bookingdata: bookingdata,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: refunddata,
        reissuedata: reissuedata,
        ticketdetails: ticketdetails,
        partialpaymentdata: partialpaymentdata || pp

      };

      return customResponseData;

    }else if(bookingdata.system === 'GroupFare'){

      const  ticketdetails=  await this.ticketingRepository.find({ where : {bookingId: bookingdata.bookingId}});
      const customResponseData = {
        bookingdata: bookingdata,
        sabredata: [],
        passengerdata: passengerdata,
        refunddata: [],
        reissuedata: [],
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

  async airfarerulesagent(header: any, farerulesDto : FareRulesDto){
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
      throw new UnauthorizedException();
    }

    if(farerulesDto.System === 'Sabre'){
      return await this.sabreService.airfarerules(farerulesDto);
    }else if(farerulesDto.System === 'Portal'){
      return await this.sabreService.airfarerules(farerulesDto);
    }else{
      throw new HttpException("System not found", HttpStatusCode.NotFound);
    }
  }

  async airfarerulesadmin(header: any, farerulesDto : FareRulesDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    if(farerulesDto.System === 'Sabre'){
      return await this.sabreService.airfarerules(farerulesDto);
    }else if(farerulesDto.System === 'Portal'){
      return await this.sabreService.airfarerules(farerulesDto);
    }else{
      throw new HttpException("System not found", HttpStatusCode.NotFound);
    }
  }

}

