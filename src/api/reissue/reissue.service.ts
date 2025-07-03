import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReissueModel, ReissueQuotation, ReissueRequestModel } from './reissue.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from 'axios';
import { AgentLedgerModel } from '../report/report.model';

@Injectable()
export class ReissueService {
  constructor(
    @InjectRepository(ReissueModel)
    private readonly reissueRepository: Repository<ReissueModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    private readonly authService: AuthService

  ){}

  async createAgentRequest(header: any, bookingUId: string, createReissueDto: ReissueRequestModel) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    if(booking.status === 'Ticketed' || booking.status === 'Void Rejected' ||
        booking.status === 'Reissued' || booking.status === 'Refund Rejected' ||
        booking.status === 'Reissue Quotation Rejected' ||
        booking.status === 'Refund Quotation Rejected'){
      const RequestReissue = {
        agentId : booking.agentId,
        bookingId : booking.bookingId,
        passengerdata : createReissueDto.text,
        reissuedate: createReissueDto.date
      }
      await this.reissueRepository.save(RequestReissue);

      booking.status = 'Reissue Requested';
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1){
        return { message: booking.status+' successfully.'};
      }else{
        return { message: 'Something error'};
      }

    }else{
      throw new HttpException(`Ticket Is Already In another status: ${booking.status}`, HttpStatusCode.NotAcceptable);
    }

  }
  async sendQuotation(header: any, bookingUId: string, quotationReissueDto: ReissueQuotation) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    const reissue = await this.reissueRepository.findOne({where: {bookingId: booking.bookingId}});

    if(!reissue){
      throw new NotFoundException("Reissue data not found");
    }

    if(booking.status === 'Reissue Requested'){
        reissue['exchangepenalty'] = quotationReissueDto.exchangepenalty,
        reissue['faredifference'] = quotationReissueDto.faredifference,
        reissue['servicefee'] = quotationReissueDto.servicefee,
        reissue['quotationamount'] = quotationReissueDto.quotationamount,
        reissue['quotationtext'] = quotationReissueDto.quotationtext,
        reissue['remarks'] =  quotationReissueDto.remarks;

      await this.reissueRepository.update(reissue.id, reissue);

      booking.status = 'Reissue Quotation Send';
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1){
        return { message: booking.status+' successfully.'};
      }else{
        return { message: 'Something error'};
      }

    }else{
      throw new HttpException(`Ticket Is Already In Another status: ${booking.status}`, HttpStatusCode.BadRequest);
    }
  }


  async reissueTicketRequest(header: any, status: string, bookingUId: string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const booking =  await this.bookingRepository.findOne({ where : {uid: bookingUId}});
    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    if(booking.status != 'Reissue Quotation Send'){
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    const reissue = await this.reissueRepository.findOne({where: {bookingId: booking.bookingId}});
    if(!reissue){
      throw new NotFoundException("Reissue data not found");
    }

    if(status === 'accept'){
      const bookingstatus='Reissue Quotation Accepted';

      const agentLedger = await this.agentLedgerRepository
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('agentId = :agentId', { agentId: booking.agentId })
      .getRawOne();

      const agentLedgerValue =  agentLedger.sum != null ? agentLedger.sum : 0;
      if(agentLedgerValue < reissue.quotationamount){
          throw new HttpException("Insufficient Amount. Please Top Up", HttpStatusCode.NotAcceptable);
      }else if(agentLedgerValue >= reissue.quotationamount){

        const details = booking.carrier_name+' ' + booking.depfrom+'-'+booking.arrto+
          ' Ticket Reissue Date: '+reissue.reissuedate+' Reissue Charge ' + reissue.quotationamount +
          ' AED. PNR : '+ booking.pnr+' .';

        const AgentLedgerData = {
          agentId: booking.agentId,
          trxtype: 'reissue',
          amount: -reissue.quotationamount,
          refId: booking.bookingId,
          details: details,
          companyname: booking.companyname,
        }
        await this.agentLedgerRepository.save(AgentLedgerData);
        booking.status = bookingstatus;
        const bookingResponse = await this.bookingRepository.update(booking.id, booking);
        if(bookingResponse.affected === 1){
          return { message: booking.status+' . wait for a while'};
        }else{
          return { message: 'Something error'};
        }
      }else{
        return 'Unknown error';
      }
    }else if(status === 'reject'){
      booking.status = 'Reissue Quotation Rejected';
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);
      if(bookingResponse.affected === 1){
        return { message: booking.status};
      }else{
        return { message: 'Something error'};
      }
    }
  }

  async reissueDecisionAdmin(header: any, status: string, bookingUId: string) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    const reissue = await this.reissueRepository.findOne({where: {bookingId: booking.bookingId}});

    if(!reissue){
      throw new NotFoundException("Reissue data not found");
    }

    let bookingstatus: string;
    if(status === 'approve'){
      bookingstatus= 'Reissued';
    }else if(status === 'reject'){
      bookingstatus = 'Reissue Rejected';
    }else{
      throw new NotFoundException("Booking status invalid");
    }

    if(booking.status === 'Reissue Quotation Accepted'){
      booking.status = bookingstatus;

      const bookingResponse =  await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1){
        return { message: bookingstatus+ ' Successfully'};
      }else{
        return { message: 'Something error'};
      }
    }else{
      throw new HttpException(`Ticket Is Already In Another status ${booking.status}`, HttpStatusCode.BadRequest);
    }
  }

}
