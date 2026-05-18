import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
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

@Injectable()
export class TicketingService {
  constructor(
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
    private readonly authService: AuthService,
  ) {}

  async ticketIssueRequest(header: any, bookingUId: string, payment: string) {
    const agent = await this.authService.verifyAgentToken(header);

    if (!agent) {
      throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
    if (!booking) {
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

    if (booking?.status != 'Hold') {
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    if(booking.system === 'Sabre'){
      booking.status = 'Issue In Process';
      booking.updated_at = new Date();
    }else if(booking.system === 'AlHind'){
      booking.status = 'Issue In Process';
      booking.updated_at = new Date();
    }else if(booking.system === 'GroupFare' 
      && booking?.itenary?.FlightInfo?.provideCode ==='GP-NCT'){

      booking.status = 'Ticketed';
      booking.updated_at = new Date();

        const paxList: any = []
        for (let i = 0; i < booking?.totalpax; i++) {
          paxList.push({
              "givenname": "Kayes",
              "surname": "Fahim",
              "ticketnumber": booking.pnr
          });    
        }

        const ticketModel = {
          vendor : "NCT",
          system: booking.system,
          bookingpnr: booking.pnr,
          airlinespnr: booking.pnr,
          issuetype: "auto",
          purchaseprice: 0,
          sellprice: booking.netfare,
          passengerInfo: paxList
        }

        this.createTicketGP(booking.uid, ticketModel);

    }else if(booking.system === 'GroupFare' 
      && booking?.itenary?.FlightInfo?.provideCode ==='DB'){
      booking.status = 'Issue In Process';
      booking.updated_at = new Date();
    }

    const bookingResponse = await this.bookingRepository.update(booking.id, booking);

    if (bookingResponse.affected === 1) {
      await this.mailService.ticketedMail(booking);
      return { message: 'Ticket Issued' };
    } else {
      return { message: 'Something error' };
    }
  }

  async createTicket(header: any, bookingUId: string, makeTicketModel: MakeTicketModel) {
    

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if (!verifyAdminId) {
      
      throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
    if (!booking) {
      
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

  

    if (booking.status != 'Issue In Process') {
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    const passengerData = makeTicketModel?.passengerInfo || [];
    const paxData: any[] = [];
    const paxTicketData: any[] = [];

    for (const item of passengerData) {
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
        ticketnumber: item.ticketnumber,
      };

      paxData.push(ticketedData);

      const passenger = await this.passengerRepository.findOne({
        where: {
          agentId: booking.agentId,
          bookingId: booking.bookingId,
          givenname: item.givenname,
          surname: item.surname,
        },
      });

      if (!passenger) {
        console.log('⚠️ Passenger not found for ticket update', {
          bookingId: booking.bookingId,
          agentId: booking.agentId,
          givenname: item.givenname,
          surname: item.surname,
        });
        continue;
      }

      paxTicketData.push({
        airlines: booking.carrier_name,
        prefix: passenger.prefix,
        surname: item.surname,
        givenName: item.givenname,
        ticketNumber: item.ticketnumber,
      });

      passenger.ticketnumber = '' + item.ticketnumber;
      passenger.ticketstatus = 'unused';
      await this.passengerRepository.update(passenger.id, passenger);
    }

    await this.ticketingRepository.save(paxData);

    booking.status = 'Ticketed';
    booking.updated_at = new Date();
    booking.airlinespnr = makeTicketModel.airlinespnr;
    booking.sellprice = makeTicketModel.sellprice;
    booking.purchaseprice = makeTicketModel.purchaseprice;
    booking.ticketed_at = new Date();

    const ticketInfo = paxTicketData.map(p => `${p.prefix} ${p.surname} ${p.givenName}`).join(', ');
    const Route =
      booking.triptype === 'Oneway'
        ? `${booking.depfrom}-${booking.arrto}`
        : `${booking.depfrom}-${booking.arrto}-${booking.depfrom}`;

    const details = `${ticketInfo} - ${Route} - ${booking.airlinespnr}-${booking.flightdate}`;

    const AgentLedgerData = {
      agentId: booking.agentId,
      trxtype: 'ticket',
      debit: booking.netfare,
      refId: booking.bookingId,
      details: details,
      ticketcost: makeTicketModel.purchaseprice,
      netfare: makeTicketModel.sellprice,
      pnr: makeTicketModel.bookingpnr,
      remarks: makeTicketModel.bookingpnr,
      companyname: booking.companyname,
    };

    await this.agentLedgerRepository.save(AgentLedgerData);

    const bookingResponse = await this.bookingRepository.update(booking.id, booking);

    if (bookingResponse.affected === 1) {
      console.log('📧 createTicket() calling ticketedMail()', { bookingId: booking.bookingId, uid: booking.uid });
      await this.mailService.ticketedMail(booking);
      console.log('✅ createTicket() ticketedMail() done', { bookingId: booking.bookingId, uid: booking.uid });

      return { message: 'Ticket Issued' };
    } else {
      return { message: 'Something error' };
    }
  }

  async createTicketGP(bookingUId: string, makeTicketModel: MakeTicketModel) {

    const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
    if (!booking) {
      
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

    const passengerData = makeTicketModel?.passengerInfo || [];
    const paxData: any[] = [];
    const paxTicketData: any[] = [];

    for (const item of passengerData) {
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
        ticketnumber: item.ticketnumber,
      };

      paxData.push(ticketedData);

      const passenger = await this.passengerRepository.findOne({
        where: {
          agentId: booking.agentId,
          bookingId: booking.bookingId,
          givenname: item.givenname,
          surname: item.surname,
        },
      });

      if (!passenger) {
        console.log('⚠️ Passenger not found for ticket update', {
          bookingId: booking.bookingId,
          agentId: booking.agentId,
          givenname: item.givenname,
          surname: item.surname,
        });
        continue;
      }

      paxTicketData.push({
        airlines: booking.carrier_name,
        prefix: passenger.prefix,
        surname: item.surname,
        givenName: item.givenname,
        ticketNumber: item.ticketnumber,
      });

      passenger.ticketnumber = '' + item.ticketnumber;
      passenger.ticketstatus = 'unused';
      await this.passengerRepository.update(passenger.id, passenger);
    }

    await this.ticketingRepository.save(paxData);

    booking.status = 'Ticketed';
    booking.updated_at = new Date();
    booking.airlinespnr = makeTicketModel.airlinespnr;
    booking.sellprice = makeTicketModel.sellprice;
    booking.purchaseprice = makeTicketModel.purchaseprice;
    booking.ticketed_at = new Date();

    const ticketInfo = paxTicketData.map(p => `${p.prefix} ${p.surname} ${p.givenName}`).join(', ');
    const Route =
      booking.triptype === 'Oneway'
        ? `${booking.depfrom}-${booking.arrto}`
        : `${booking.depfrom}-${booking.arrto}-${booking.depfrom}`;

    const details = `${ticketInfo} - ${Route} - ${booking.airlinespnr}-${booking.flightdate}`;

    const AgentLedgerData = {
      agentId: booking.agentId,
      trxtype: 'ticket',
      debit: booking.netfare,
      refId: booking.bookingId,
      details: details,
      ticketcost: makeTicketModel.purchaseprice,
      netfare: makeTicketModel.sellprice,
      pnr: makeTicketModel.bookingpnr,
      remarks: makeTicketModel.bookingpnr,
      companyname: booking.companyname,
    };

    await this.agentLedgerRepository.save(AgentLedgerData);

    const bookingResponse = await this.bookingRepository.update(booking.id, booking);

    if (bookingResponse.affected === 1) {
      console.log('📧 createTicket() calling ticketedMail()', { bookingId: booking.bookingId, uid: booking.uid });
      await this.mailService.ticketedMail(booking);
      console.log('✅ createTicket() ticketedMail() done', { bookingId: booking.bookingId, uid: booking.uid });

      return { message: 'Ticket Issued' };
    } else {
      return { message: 'Something error' };
    }
  }

  async rejectTicket(header: any, bookingUId: string, remarks: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
    if (!booking) {
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }

    if (booking.status != 'Issue In Process') {
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    const agent = await this.agentRepository.findOne({ where: { agentId: booking.agentId } });
    if (!agent) {
      throw new HttpException(`Agnet not Found`, HttpStatusCode.NotFound);
    }

    booking.status = 'Issue Request Rejected';
    booking.updated_at = new Date();

    const bookingResponse = await this.bookingRepository.update(booking.id, booking);

    if (bookingResponse.affected === 1) {
      await this.mailService.IssueRequestRejectMail(booking);
      return { message: 'Issue Request Rejected' };
    } else {
      return { message: 'Something error' };
    }
  }
}