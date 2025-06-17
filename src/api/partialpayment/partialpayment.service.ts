import { HttpException, Injectable, NotAcceptableException, NotFoundException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialPaymentModel } from './entities/partialpayment.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from 'axios';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AgentLedgerModel } from '../report/report.model';
import { UpdatePartialpaymentDto } from './dto/update-partialpayment.dto';

@Injectable()
export class PartialpaymentService {
  constructor(
    @InjectRepository(PartialPaymentModel)
    private readonly partialPaymentRepository: Repository<PartialPaymentModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ){}
  async create(partialData: any){
    return this.partialPaymentRepository.save(partialData);
  }

  async findAllAdmin(header: any, page: number, status: string, filter: string, limit: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
  
    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.partialPaymentRepository.createQueryBuilder("partialPayment");

    if (status) {
        queryBuilder = queryBuilder.where("partialPayment.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(partialPayment.bookingId LIKE :filter OR partialPayment.agentId LIKE :filter OR partialPayment.companyname LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();

    const bookings = await queryBuilder
        .orderBy("partialPayment.id", "DESC")
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

  async updateOneAdmin(header : any, uid : string, updatePartialpaymentDto: UpdatePartialpaymentDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const ppaymnet =  await this.partialPaymentRepository.findOneBy({uid: uid});
    if(!ppaymnet){
      throw new NotFoundException();
    }

    return await this.partialPaymentRepository.update(ppaymnet.id, updatePartialpaymentDto);

  }

  async findAllAgent(header: any, page: number, status: string, filter: string, limit: number) {

    const agent = await this.authService.verifyAgentToken(header);

    console.log(agent);

    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.partialPaymentRepository.createQueryBuilder("partialPayment");
    const agentId= agent.agentId

    queryBuilder.where("partialPayment.agentId = :agentId", { agentId });

    if (status) {
        queryBuilder = queryBuilder.andWhere("partialPayment.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(partialPayment.bookingId LIKE :filter OR partialPayment.dueAt LIKE :filter OR partialPayment.comapnyname LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();
    const bookings = await queryBuilder
        .orderBy("partialPayment.id", "DESC")
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

  async paydue(header: string, uid: string){
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){throw new UnauthorizedException()}

    const booking =  await this.bookingRepository.findOne({ where : {uid: uid}});
    if(!booking){
      throw new HttpException(`Booking not Found`, HttpStatusCode.NotFound);
    }
    
    const partial =  await this.partialPaymentRepository.findOne({ where : {bookingId: booking.bookingId}});

    if(!partial){
      throw new NotFoundException("Not Found");
    }


    const payableamount = partial?.dueamount;
    if(booking?.payment_status != 'partial'){
      throw new HttpException(`Booking already ${booking.status}`, HttpStatusCode.AlreadyReported);
    }

    if(booking.payment_status === 'partial'){
      
      const agentLedger = await this.agentLedgerRepository
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('agentId = :agentId', { agentId: agent.agentId })
      .getRawOne();

    const agentLedgerValue =  agentLedger.sum != null ? agentLedger.sum : 0;

      if(agentLedgerValue <= payableamount){
        throw new HttpException("Insufficient Amount. Please Top Up", HttpStatusCode.NotAcceptable);
      }else if(agentLedgerValue >= payableamount){
        const details = partial.bookingId+' paid due amount ' +payableamount+' BDT' + booking.depfrom+'-'+booking.arrto+' Ticket Purchase: '+
                        booking.netfare + ' BDT. PNR : '+ booking.pnr;

          const AgentLedgerData = {
            agentId: booking.agentId,
            trxtype: 'partial',
            amount: -payableamount,
            refId: booking.bookingId,
            details: details,
            companyname: booking.companyname
          }

        await this.agentLedgerRepository.save(AgentLedgerData);
        partial.status = 'paid';
        await this.partialPaymentRepository.update(partial.id, partial);

        booking.payment_status = 'full';
        const bookingres = await this.bookingRepository.update(booking.id, booking);

        if(bookingres.affected === 1){
          await this.mailService.partialPaymentMail(booking, partial);
          return { message: "Complete full paymnet"};
        }else{
          return { message: 'Something error'};
        }
      }
    }
  }
  
}
