import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RefundDecisionModel, RefundModel, RefundQuotation, RefundRequestModel } from './refund.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from 'axios';
import { AgentLedgerModel } from '../report/report.model';

@Injectable()
export class RefundService {

  constructor(
    @InjectRepository(RefundModel)
    private readonly refundRepository: Repository<RefundModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    private readonly authService: AuthService

  ){}

  async createAgentRequest(header: any, bookingUId: string, createRefundDto: RefundRequestModel) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    if(booking.status === 'Ticketed' || booking.status === 'Void Rejected' ||
      booking.status === 'Reissued' || booking.status === 'Reissue Rejected' ||
      booking.status === 'Reissue Quotation Rejected' || 
      booking.status === 'Refund Quotation Rejected' ||
      booking.status === 'Refunded' ||  booking.status === 'Refund Rejected'){

      const RequestRefund = {
        agentId : booking.agentId,
        bookingId : booking.bookingId,
        passengerdata : createRefundDto.text,
      }

      await this.refundRepository.save(RequestRefund);
      booking.status = 'Refund Requested';
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1){
        return { message: booking.status+' successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }else{
      throw new NotFoundException(`Ticket Is Already In Another status ${booking.status}`);
    }
  }

  async sendQuotation(header: any, bookingUId: string, quotationRefundDto: RefundQuotation) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    const refund = await this.refundRepository.findOne({where: {bookingId: booking.bookingId}});

    if(!refund){
      throw new NotFoundException("Refund data not found");
    }

    if(booking.status === 'Refund Requested'){

      booking['status'] = 'Refund Quotation Send';
      
      refund['netfare'] = booking.netfare;
      refund['refundpenalty'] = quotationRefundDto.refundpenalty;
      refund['servicefee'] = quotationRefundDto.servicefee;
      refund['quotationamount'] = quotationRefundDto.quotationamount;
      refund['remarks'] =  quotationRefundDto.remarks;

      await this.refundRepository.update(refund.id, refund);
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1 ){
        return { message: 'Refund Quotation Send successfully.'};
      }else{
        return { message: 'Something error'};
      }

    }else{
      throw new HttpException("Ticket Is Already In Another status", HttpStatusCode.BadRequest);
    }

  
  }

  async quotationDecision(header: any, status: string, bookingUId: string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    const refund = await this.refundRepository.findOne({where: {bookingId: booking.bookingId}});

    if(!refund){
      throw new NotFoundException("Refund data not found");
    }

    let bookingstatus: string;
    if(status === 'accept'){
      bookingstatus= 'Refund Quotation Accepted';
    }else if(status === 'reject'){
      bookingstatus='Refund Quotation Rejected'
    }

    if(booking.status === 'Refund Quotation Send'){

      booking['status'] = bookingstatus;

      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1 && status === 'accept'){
        return { message: 'Refund Quotation Accepted.'};
      }if(bookingResponse.affected === 1 && status === 'reject'){
        return { message: 'Refund Quotation Rejected.'};
      }else{
        return { message: 'Something error'};
      }

    }else{
      throw new HttpException("Ticket Is Already In Another status", HttpStatusCode.BadRequest);
    }
  }

  async refundDecision(header : any, status: string, bookingUId: string, refundDecisionDto: RefundDecisionModel){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    const refund = await this.refundRepository.findOne({where: {bookingId: booking.bookingId}});

    if(!refund){
      throw new NotFoundException("Refund data not found");
    }

    let bookingstatus: string;
    if(status === 'accept'){
      bookingstatus='Refunded';
    }else if(status === 'reject'){
      bookingstatus = 'Refund Rejected'
    }

    if(booking.status === 'Refund Quotation Accepted' && status === 'accept'){
      booking['status'] = bookingstatus;

      const details = refund.quotationamount + ' Refund. '+refund.passengerdata+' By '+ verifyAdminId.firstname;

      const AgentLedgerData = {
        agentId: booking.agentId,
        trxtype: 'refund',
        credit: Number(refund.quotationamount),
        refId: booking.bookingId,
        details: details,
        companyname: booking.companyname
      }

      await this.agentLedgerRepository.save(AgentLedgerData);
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);
      if(bookingResponse.affected === 1){
        return { message: 'Refunded Successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }else if(booking.status === 'Refund Quotation Accepted' && status === 'reject'){
      booking['status'] = bookingstatus;
      refund.remarks = refundDecisionDto.remarks;
       await this.refundRepository.update(refund.id, refund);
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);
      if(bookingResponse.affected === 1){
        return { message: 'Refunded Rejected Successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }else{
      throw new HttpException("Ticket Is Already In Another status", HttpStatusCode.BadRequest);
    }
  }

}
