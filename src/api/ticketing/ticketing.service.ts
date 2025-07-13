import { Injectable, HttpException, UnauthorizedException, NotAcceptableException, NotImplementedException } from '@nestjs/common';
import { BookingModel, TicketModel } from '../booking/booking.model';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentModel } from '../agent/agent.model';
import { AgentLedgerModel } from '../report/report.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from 'axios';
import { MakeTicketModel } from './ticketing.model';
import { PassengerModel } from '../passenger/passenger.model';
import { MailService } from '../../mail/mail.service';
import { ActivitylogService } from '../activitylog/activitylog.service';

@Injectable()
export class TicketingService {

  constructor(
    private readonly activityLogService: ActivitylogService,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    @InjectRepository(TicketModel)
    private readonly ticketingRepository: Repository<TicketModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(PassengerModel)
    private readonly passengerRepository: Repository<PassengerModel>,
    private readonly mailService: MailService,
    private readonly authService: AuthService
  ){}

  async ticketIssueRequest(header: any, bookingUId: string, payment : string){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }
    
    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    if(!booking){
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

    if(booking?.status != 'Hold'){
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }
      booking.status = 'Issue In Process';
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1){
        await this.mailService.IssueRequestMail(booking);
        return { message: "Issue Request Send"};
      }else{
        return { message: 'Something error'};
      }
  }

  async createTicket(header: any, bookingUId: string, makeTicketModel: MakeTicketModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    if(!booking){
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

    if(booking.status != 'Issue In Process'){
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    const passengerData = makeTicketModel?.passengerInfo;
    const paxData=[];
    const paxTicketData=[]
    for (const item of passengerData){
      const ticketedData = {
        agentId: booking.agentId,
        bookingId: booking.bookingId,
        vendor: makeTicketModel.vendor,
        system: makeTicketModel.system,
        airlines: booking.carrier_name,
        bookingpnr: makeTicketModel.bookingpnr,
        airlinespnr: makeTicketModel.airlinespnr,
        givenname: item.givenname,
        surname: item.surname,
        ticketnumber: item.ticketnumber
      };
      paxData.push(ticketedData);
      paxTicketData.push({
        airlines: booking.carrier_name,
        surname: item.surname,
        givenName: item.givenname,
        ticketNumber: item.ticketnumber
      });

      const passenger = await this.passengerRepository.findOne({
         where: {
          agentId: booking.agentId,
          bookingId: booking.bookingId,
          givenname: item.givenname,
          surname: item.surname
        }
      });

      passenger.ticketnumber = ''+item.ticketnumber;
      passenger.ticketstatus = 'unused';
      await this.passengerRepository.update(passenger.id, passenger);
    }

    await this.ticketingRepository.save(paxData);
    booking.status = 'Ticketed';
    booking.airlinespnr = makeTicketModel.airlinespnr;
    booking.sellprice = makeTicketModel.sellprice;
    booking.purchaseprice = makeTicketModel.purchaseprice;
    booking.ticketed_at = new Date();

    const ticketInfo = paxTicketData.map(p => `${p.surname}/${p.givenName}/${p.ticketNumber}`)
    .join(', ');

    const details = booking.carrier_name+'/' + booking.depfrom+'-'+booking.arrto+'/'+ booking.pnr+'/'+ticketInfo;
    const AgentLedgerData = {
      agentId: booking.agentId,
      trxtype: 'ticket',
      debit: booking.netfare,
      refId: booking.bookingId,
      details: details,
      ticketcost : makeTicketModel.purchaseprice,
      pnr : makeTicketModel.bookingpnr,
      remarks: makeTicketModel.bookingpnr,
      companyname: booking.companyname
    }

    await this.agentLedgerRepository.save(AgentLedgerData);

    const bookingResponse = await this.bookingRepository.update(booking.id, booking);
    if(bookingResponse.affected === 1){
      await this.activityLogService.create({agentId: booking.agentId, status: booking.status, platform: 'Admin',
       refId: booking.bookingId, module: 'Booking', action_by: verifyAdminId.firstname  });
      return { message: "Ticket Issued"};
    }else{
      return { message: 'Something error'};
    }
  }

  async rejectTicket(header: any, bookingUId: string, remarks: string) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    if(!booking){
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

    if(booking.status != 'Issue In Process'){
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    const agent =  await this.agentRepository.findOne({ where : {agentId: booking.agentId}});
    if(!agent){
      throw new HttpException(`Agnet not Found`, HttpStatusCode.NotFound);
    }

    const details = booking.carrier_name+' ' + booking.depfrom+ '-'+booking.arrto+' Ticket Issue Rejected '+ booking.netfare + ' AED (Revesal due to '+ remarks+'). PNR : '+ booking.pnr+' .';

    const AgentLedgerData = {
      agentId: booking.agentId,
      trxtype: 'reversal',
      amount: booking.netfare,
      refId: booking.bookingId,
      details: details,
      remarks: remarks,
      companyname: booking.companyname
    }
    await this.agentLedgerRepository.save(AgentLedgerData);

    booking.status = 'Issue Request Rejected';
    const bookingResponse = await this.bookingRepository.update(booking.id, booking);

    if(bookingResponse.affected === 1){
      await this.mailService.IssueRequestRejectMail(booking);
      await this.activityLogService.create({agentId: booking.agentId, status: booking.status, platform: 'Admin',
       refId: booking.bookingId, module: 'Booking', action_by: verifyAdminId.firstname  });
      return { message: "Issue Request Rejected"};
    }else{
      return { message: 'Something error'};
    }
  }
}
