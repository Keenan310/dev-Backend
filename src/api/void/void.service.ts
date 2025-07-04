import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { VoidModel } from './void.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { AgentLedgerModel } from '../report/report.model';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from 'axios';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class VoidService {
  constructor(
    @InjectRepository(VoidModel)
    private readonly voidRepository: Repository<VoidModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ){}
  async createVoidRequest(header: any, bookingUId: string, createVoidDto: VoidModel) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    if(booking.status === 'Ticketed'){
      const RequestVoid = {
        agentId : booking.agentId,
        bookingId : booking.bookingId,
        passengerdata : createVoidDto.passengerdata,
        reason : createVoidDto.reason
      }

      await this.voidRepository.save(RequestVoid);

      booking.status = 'Void Requested';
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);

      if(bookingResponse.affected === 1){
        await this.mailService.voidRequestMail(booking)
        return { message: booking.status+' Successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }else{
      throw new NotFoundException(`Ticket Is Already In Another status ${booking.status}`);
    }
  }

  async voidDecision(header: any, bookingUId: string, status: string, servicefee: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const booking = await this.bookingRepository.findOne({where: {uid: bookingUId}});

    if(!booking){
      throw new NotFoundException("Booking not found");
    }

    const voidData = await this.voidRepository.findOne({where: {bookingId: booking.bookingId}});

    if(!voidData){
      throw new NotFoundException("Void data not found");
    }

    let bookingstatus: string;
    if(status == 'accept'){
      bookingstatus='Voided';
    }else if(status == 'reject'){
      bookingstatus='Void Rejected'
    }

    if(booking.status === 'Void Requested' && status === 'accept'){
      booking['status'] = bookingstatus;
      const feeDetails = servicefee + ' AED Void Charge. '+voidData.passengerdata+' By '+ verifyAdminId?.firstname;

      const agentLedgerData1 = {
        agentId: booking.agentId,
        trxtype: 'fee',
        amount: -(servicefee),
        refId: booking.bookingId,
        details: feeDetails,
        companyname: booking.companyname
      }
      await this.agentLedgerRepository.save(agentLedgerData1);

      const voidedAmount = Number(booking.netfare) - servicefee;
      const details = voidedAmount + ' AED Void. '+voidData.passengerdata+' with Service Fee: '+servicefee+ 'AED'+ ' By '+ verifyAdminId.firstname;
      const agentLedgerData2 = {
        agentId: booking.agentId,
        trxtype: 'void',
        credit: voidedAmount,
        refId: booking.bookingId,
        details: details,
        
      }

      await this.agentLedgerRepository.save(agentLedgerData2);
      voidData.amount = voidedAmount;
      voidData.servicefee = servicefee;
      await this.voidRepository.update(voidData.id, voidData);
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);
      if(bookingResponse.affected === 1){
        await this.mailService.voidResultMail(booking)
        return { message: bookingstatus+' Successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }else if(booking.status === 'Void Requested' && status === 'reject'){
      booking.status = bookingstatus;
      const bookingResponse = await this.bookingRepository.update(booking.id, booking);
      if(bookingResponse.affected === 1){
        return { message: bookingstatus+' Successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }else{
      throw new HttpException("Ticket Is Already In Another status", HttpStatusCode.BadRequest);
    }
  }
  
}
