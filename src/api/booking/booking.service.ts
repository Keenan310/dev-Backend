import { HttpException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookingModel, BookingModelUpdateAdmin, TicketModel } from './booking.model';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Like, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { PassengerService } from '../passenger/passenger.service';
import { MailService } from 'src/mail/mail.service';
import { GroupFareModel } from '../groupfare/groupfare.model';
import { AgentLedgerModel } from '../report/report.model';
import { AirBookingModel } from '../flight/dto/booking-flight.dto';
import { TravellerService } from '../traveller/traveller.service';
import { BookingUtils } from './booking.utils';

@Injectable()
export class BookingService {

  constructor(
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(GroupFareModel)
    private readonly groupFareRepository: Repository<GroupFareModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    private readonly travellerService: TravellerService,
    private readonly passengerService: PassengerService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly bookingUtils: BookingUtils,
  ) {}

  async createBooking(agentdata: AgentModel, responseData: any,  bookingDto: any, priceCheck: any){
    if(responseData?.ApplicationResults){
      const bookingId='';
      await this.travellerService.createBookingPax(bookingDto?.PassengerInfo, agentdata?.agentId, bookingId);
      return{
        "status": "error",
        "error": responseData.ApplicationResults,
        "message": "Booking Failed",
      };
    }

    const bookingData = await this.bookingUtils.bookingParser(agentdata, responseData,  bookingDto, priceCheck);
    const bookingResult = await this.bookingRepository.save(bookingData);
    await this.passengerService.createBookingPax(bookingDto?.PassengerInfo, agentdata?.agentId, bookingData?.bookingId);
    await this.mailService.bookingConfirmation(bookingResult);
    return bookingResult;

  }


  async group_booking(agentdata: AgentModel, bookingDto: AirBookingModel){

    const agentId : string = agentdata.agentId;
    const email : string = bookingDto.ContactInfo.email || "dev@flyjatt.com";
    const phone : string = bookingDto.ContactInfo.phone || "08801685370455";
    const name : string = bookingDto.PassengerInfo.adult[0].givenname +" " + bookingDto.PassengerInfo.adult[0].surname;

    const adult : number = (bookingDto.PassengerInfo.adult).length;
    const child : number = (bookingDto.PassengerInfo.child).length || 0;
    const infant : number = (bookingDto.PassengerInfo.infant).length || 0;
    const paxCount  : number= adult + child + infant;
 
    const booking = await this.bookingRepository.find({order: { id: 'DESC' }, take : 1});
  
    let bookingId='KTB1000';
    if(booking.length == 1){
      let old_booking_id = (booking[0]?.bookingId).replace("KTB",'');
      bookingId = "KTB" + (parseInt(old_booking_id) + 1);
    }

    const groupData = await this.groupFareRepository.findOneBy({uid: bookingDto?.FlightInfo?.OfferId});

      const details = groupData.Carrier+' ' + groupData.RouteFrom+'-'+groupData.RouteTo+' Ticket Purchase '+ groupData.NetFare + '. PNR : '+ groupData.PNR+' .';

       const generatedUUID: string = uuidv4();
        const AgentLedgerData = {
          agentId: agentdata.agentId,
          trxtype: 'ticket',
          debit: -groupData.NetFare,
          refId: bookingId,
          details: details,
          compnayname: agentdata.company,
          uid: generatedUUID
        }

      await this.agentLedgerRepository.save(AgentLedgerData);

    let Booking_PNR: string = groupData.PNR;
    const bookingData = {
      agentId: agentId,
      bookingId: bookingId,
      system: bookingDto.FlightInfo.System,
      carrier_name: bookingDto.FlightInfo.CarrierName,
      carrier_code: bookingDto.FlightInfo.Carrier,
      depfrom: bookingDto.FlightInfo.AllLegsInfo[0].DepFrom,
      pnr: Booking_PNR,
      refundable: bookingDto.FlightInfo.Refundable,
      arrto: bookingDto.FlightInfo.AllLegsInfo[0].ArrTo,
      triptype: bookingDto.FlightInfo.TripType,
      netfare: groupData.NetFare,
      grossfare: groupData.NetFare,
      status: "Issue In Process",
      name: name,
      email: email,
      phone: phone,
      adultcount: adult,
      childcount: child,
      infantcount: infant,
      totalpax: paxCount,
      flightdata: null,
      itenary: bookingDto,
      totalsegment: groupData.segment,
      timelimit: bookingDto.FlightInfo.TimeLimit || 'N/F',
      flightdate: bookingDto.FlightInfo.AllLegsInfo[0].DepDate,
      companyname:agentdata.company
    }

    const bookingResult = await this.bookingRepository.save(bookingData);
    const passengerData = bookingDto.PassengerInfo;
    await this.passengerService.createBookingPax(passengerData, agentId, bookingId);
    await this.mailService.bookingConfirmation(bookingResult);
    return bookingResult;
    
  }

  async alhind_booking(agentdata: AgentModel, bookingDto: AirBookingModel){

    const agentId : string = agentdata.agentId;
    const email : string = bookingDto.ContactInfo.email || "dev@flyjatt.com";
    const phone : string = bookingDto.ContactInfo.phone || "08801685370455";
    const name : string = bookingDto.PassengerInfo.adult[0].givenname +" " + bookingDto.PassengerInfo.adult[0].surname;

    const adult : number = (bookingDto.PassengerInfo.adult).length;
    const child : number = (bookingDto.PassengerInfo.child).length || 0;
    const infant : number = (bookingDto.PassengerInfo.infant).length || 0;
    const paxCount  : number= adult + child + infant;
 
    const booking = await this.bookingRepository.find({order: { id: 'DESC' }, take : 1});
  
    let bookingId='KTB1000';
    if(booking.length == 1){
      let old_booking_id = (booking[0]?.bookingId).replace("KTB",'');
      bookingId = "KTB" + (parseInt(old_booking_id) + 1);
    }

    let Booking_PNR : string = await this.bookingUtils.generatePNR();
    let airlinesPnr : string = await this.bookingUtils.generateAirlinesPNR();
    const bookingData = {
      agentId: agentId,
      bookingId: bookingId,
      system: bookingDto.FlightInfo.System,
      carrier_name: bookingDto.FlightInfo.CarrierName,
      carrier_code: bookingDto.FlightInfo.Carrier,
      depfrom: bookingDto.FlightInfo.AllLegsInfo[0].DepFrom,
      pnr: Booking_PNR,
      refundable: bookingDto.FlightInfo.Refundable,
      arrto: bookingDto.FlightInfo.AllLegsInfo[0].ArrTo,
      triptype: bookingDto.FlightInfo.TripType,
      netfare: bookingDto.FlightInfo.NetFare,
      grossfare: bookingDto.FlightInfo.NetFare,
      status: "Hold",
      name: name,
      email: email,
      phone: phone,
      adultcount: adult,
      childcount: child,
      infantcount: infant,
      totalpax: paxCount,
      flightdata: null,
      itenary: bookingDto,
      totalsegment: 0,
      timelimit: bookingDto.FlightInfo.TimeLimit || 'N/F',
      flightdate: bookingDto.FlightInfo.AllLegsInfo[0].DepDate,
      companyname:agentdata.company
    }

    const bookingResult = await this.bookingRepository.save(bookingData);
    const passengerData = bookingDto.PassengerInfo;
    await this.passengerService.createBookingPax(passengerData, agentId, bookingId);
    await this.mailService.bookingConfirmation(bookingResult);
    return bookingResult;
    
  }

  async findAllAdmin(header: any, page: number, status: string, filter: string, limit: number) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
  
    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.bookingRepository.createQueryBuilder("booking");
    queryBuilder.select([
      'booking.system',
      'booking.bookingId',
      'booking.status',
      'booking.name',
      'booking.totalpax',
      'booking.triptype',
      'booking.netfare',
      'booking.grossfare',
      'booking.flightdate',
      'booking.pnr',
      'booking.airlinespnr',
      'booking.depfrom',
      'booking.companyname',
      'booking.arrto',
      'booking.carrier_name',
      'booking.created_at',
      'booking.uid',
    ]);

    if (status?.includes('Void') || status?.includes('Refund') || status?.includes('Reissue')) {
      queryBuilder = queryBuilder.where("booking.status LIKE :status", { status: `%${status}%` });
    } else if(status?.length > 1 && (!status?.includes('Void') || !status?.includes('Refund') || !status?.includes('Reissue'))){
      queryBuilder = queryBuilder.where("booking.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(booking.bookingId LIKE :filter OR booking.companyname LIKE :filter OR booking.name LIKE :filter OR booking.pnr LIKE :filter OR booking.airlinespnr LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();

    const bookings = await queryBuilder
        .orderBy("booking.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();


    const bookingData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: bookings
    }
    

    return bookingData;
  }

  async findAllAgent(header : string, page: number, status: string, filter: string, limit: number) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const skip = (page - 1) * limit;
    const take = limit;
  
    let queryBuilder = this.bookingRepository.createQueryBuilder("booking");
    queryBuilder.select([
      'booking.bookingId',
      'booking.system',
      'booking.status',
      'booking.name',
      'booking.totalpax',
      'booking.triptype',
      'booking.netfare',
      'booking.grossfare',
      'booking.flightdate',
      'booking.pnr',
      'booking.payment_status',
      'booking.depfrom',
      'booking.arrto',
      'booking.carrier_name',
      'booking.created_at',
      'booking.uid',
    ]);

    if (status?.includes('Void') || status?.includes('Refund') || status?.includes('Reissue')) {
      queryBuilder = queryBuilder.where("booking.status LIKE :status", { status: `%${status}%` });
    } else if(status?.length > 1 && (!status?.includes('Void') || !status?.includes('Refund') || !status?.includes('Reissue'))){
      queryBuilder = queryBuilder.where("booking.status = :status", { status });
    }

    if (filter) {
      queryBuilder = queryBuilder.andWhere("(booking.bookingId LIKE :filter OR booking.pnr LIKE :filter)", { filter: `%${filter}%` });
    }

    const agentId = agent.agentId;
    queryBuilder.andWhere("booking.agentId = :agentId", { agentId });

    const totaldata = await queryBuilder.getCount();

    const bookings = await queryBuilder
      .orderBy("booking.id", "DESC")
      .skip(skip)
      .take(take)
      .getMany();

    const bookingData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: bookings
    }

    return bookingData;

  }

  async findAllAgentByAdmin(header : any, agentUId: string, page: number, status: string, filter: string, limit: number) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const agent  = await this.agentRepository.findOneBy({uid: agentUId});
    if(!agent){
      throw new NotFoundException('Agent Not Found');
    }

    const skip = (page - 1) * limit;
    const take = limit;
  
    let queryBuilder = this.bookingRepository.createQueryBuilder("booking");
    queryBuilder.select([
      'booking.bookingId',
      'booking.system',
      'booking.status',
      'booking.name',
      'booking.totalpax',
      'booking.triptype',
      'booking.netfare',
      'booking.grossfare',
      'booking.flightdate',
      'booking.payment_status',
      'booking.pnr',
      'booking.depfrom',
      'booking.arrto',
      'booking.carrier_name',
      'booking.created_at',
      'booking.uid',
    ]);

    if (status?.includes('Void') || status?.includes('Refund') || status?.includes('Reissue')) {
      queryBuilder = queryBuilder.where("booking.status LIKE :status", { status: `%${status}%` });
    } else if(status?.length > 1 && (!status?.includes('Void') || !status?.includes('Refund') || !status?.includes('Reissue'))){
      queryBuilder = queryBuilder.where("booking.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(booking.bookingId LIKE :filter OR booking.pnr LIKE :filter)", { filter: `%${filter}%` });
    }

    const agentId = agent.agentId;
    queryBuilder.andWhere("booking.agentId = :agentId", { agentId });

    const totaldata = await queryBuilder.getCount();

    const bookings = await queryBuilder
      .orderBy("booking.id", "DESC")
      .skip(skip)
      .take(take)
      .getMany();

    const bookingData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: bookings
    }

    return bookingData;

  }

  async findPastFlightAgentId(header: any){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd')
    const rawQuery = `SELECT * FROM bookings WHERE agentId='${agent.agentId}' AND status='Ticketed' AND flightdate <= '${formattedDate}'`;

    const bookings = await this.bookingRepository.query(rawQuery);
    
    return bookings;
  }

  async findUpcomingFlightAgentId(header: any){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }
    
    const currentDate = new Date();
    
    const bookings = await this.bookingRepository.createQueryBuilder("booking")
      .where("booking.agentId = :agentId", { agentId: agent.agentId })
      .andWhere("booking.status = :status", { status: 'Ticketed' })
      .andWhere("booking.flightdate > :currentDate", { currentDate: currentDate })
      .getMany();
    
    return bookings;
  }

  async findCalendareAgentId(header: any, yearMonth: Date){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const currentDate = new Date(yearMonth);
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    const currentPeriod = [];
    allDates.forEach((date) => {
      currentPeriod.push(format(date, 'yyyy-MM-dd'));
    });

    const currentMonthData = [];
    for (const date of currentPeriod) {
      const bookingData = await this.bookingRepository.query("SELECT * FROM `bookings` WHERE agentId = ? AND status = 'Ticketed' AND flightdate LIKE ?", [agent.agentId, `%${date}%`]);
      
      const singleData = {
        date,
        count: bookingData.length,
        data: bookingData
      };

      currentMonthData.push(singleData);
    }

    return currentMonthData;

  }

  async findOneByAdmin(header: any, bookingUId: string) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: { uid: bookingUId }});
    if (!booking) {
      throw new NotFoundException('Id not found');
    }
    return booking;
  }

  async findOneAgent(header: any, bookingUId: string){
    const verifyAgentId = await this.authService.verifyAgentToken(header);

    if(!verifyAgentId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: { uid: bookingUId }});
    if (!booking) {
      throw new NotFoundException('Id not found');
    }
    return booking;

  }

  async update(header: any, bookingUId: string, updateBookingDto: BookingModelUpdateAdmin) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: { uid: bookingUId }});

    if (!booking) {
      throw new NotFoundException('UId not found');
    }

    return await this.bookingRepository.update(booking.id, updateBookingDto);

  }

  async remove(header: any, bookingUId: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({
      where: { uid: bookingUId },
    });

    if (!booking) {
      throw new NotFoundException('UId not found');
    }

    return await this.bookingRepository.delete(booking.id);
  }

}
