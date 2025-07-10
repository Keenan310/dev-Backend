import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AgentLedgerModel, AdminExpenseModel } from './report.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { DepositModel } from '../deposit/deposit.model';
import { AuthService } from '../auth/auth.service';
import { SearchHistoryModel } from '../searchhistory/searchhistory.model';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(AgentLedgerModel)
    private readonly ledgerRepository: Repository<AgentLedgerModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(DepositModel)
    private readonly depositRepository: Repository<DepositModel>,
    @InjectRepository(SearchHistoryModel)
    private readonly searchHistoryRepository: Repository<SearchHistoryModel>,
    @InjectRepository(AdminExpenseModel)
    private readonly adminExpenseRepository: Repository<AdminExpenseModel>,
    private readonly authService: AuthService,
    private dataSource: DataSource
  ) {}

  async addAdminExpsense(header : any, adminExpenseModel : AdminExpenseModel){
    return this.adminExpenseRepository.save(adminExpenseModel);
  }
  
  async findAllReportAdmin(header: any, startDate: Date, endDate: Date) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const search = await this.searchHistoryRepository
    .createQueryBuilder('search')
    .select('COUNT(search.id)', 'rowCount')
    .where('search.created_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate
    })
    .getRawOne();

    const agent = await this.agentRepository
    .createQueryBuilder('search')
    .select('COUNT(search.id)', 'rowCount')
    .where('search.created_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate
    })
    .getRawOne();

    const booking = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .andWhere('booking.created_at BETWEEN :startDate AND :endDate', {startDate: startDate, endDate: endDate})
    .getRawOne();

    const bookingTicketed = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .addSelect('SUM(booking.totalPax)', 'totalPax')
    .addSelect('SUM(booking.netfare)', 'totalSell')
    .addSelect('SUM(booking.sellprice) - SUM(booking.purchaseprice)', 'totalProfit')
    .addSelect('SUM(booking.totalsegment)', 'totalSegment')
    .where('booking.status = :status', { status: 'Ticketed' })
    .andWhere('booking.created_at BETWEEN :startDate AND :endDate', { startDate: startDate, endDate: endDate })
    .getRawOne();

    const bookingCancelled = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .where('booking.status = :status', { status: 'Cancelled' })
    .andWhere('booking.created_at BETWEEN :startDate AND :endDate', {startDate: startDate, endDate: endDate})
    .getRawOne();


    const deposit = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount')
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    })
    .getRawOne(); 

    const refund = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'refund' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    })
    .getRawOne();
    
    const reissue = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.debit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'reissue' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    })
    .getRawOne(); 

    const voided = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'void' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    })
    .getRawOne();

    const ledgerData = [
      { 
        "name": "Search Count",
        "value": search.rowCount
      },
      { 
        "name": "Agent Count",
        "value": agent.rowCount
      },
      { 
        "name": "Booking Count",
        "value": booking.rowCount
      },
      { 
        "name": "Booking Cancelled",
        "value": bookingCancelled.rowCount
      },
      { 
        "name": "Issue Count",
        "value": bookingTicketed.rowCount
      },
      { 
        "name": "Ticketed Amount",
        "value": bookingTicketed.totalSell
      },
      { 
        "name": "Loss/Profit",
        "value": bookingTicketed.totalProfit
      },
      { 
        "name": "Total Segments",
        "value": bookingTicketed.totalSegment
      },
      { 
        "name": "Total Flyer",
        "value": bookingTicketed.totalPax
      },
      { 
        "name": "Deposit Count",
        "value": deposit.rowCount
      },
      { 
        "name": "Deposit Amount",
        "value": deposit.totalAmount
      },
      { 
        "name": "Refund Count",
        "value": refund.rowCount
      },
      { 
        "name": "Refund Amount",
        "value": refund.totalAmount
      },
      { 
        "name": "Reissue Count",
        "value": reissue.rowCount
      },
      { 
        "name": "Reissue Amount",
        "value": reissue.totalAmount
      },
      { 
        "name": "Void Count",
        "value": voided.rowCount
      },
      { 
        "name": "Void Amount",
        "value": voided.totalAmount
      }
    ];

    return ledgerData;
  }

  async findAllByAgentId(header: any, filter : string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const deposit = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId: agent.agentId })
    .andWhere('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
    .getRawOne(); 

    const refund = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId: agent.agentId })
    .andWhere('ledger.trxtype = :trxtype', { trxtype: 'refund' })
    .getRawOne();
    
    const reissue = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.debit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId: agent.agentId })
    .andWhere('ledger.trxtype = :trxtype', { trxtype: 'reissue' })
    .getRawOne(); 

    const voided = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId: agent.agentId })
    .andWhere('ledger.trxtype = :trxtype', { trxtype: 'void' })
    .getRawOne();
    
    const ticket = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId: agent.agentId })
    .andWhere('ledger.trxtype = :trxtype', { trxtype: 'ticket' })
    .getRawOne();

    let ledger: any;
    if(filter == 'all'){
      ledger = await this.ledgerRepository.find({where: { agentId: agent.agentId }, order: { id: 'DESC'}});
    }else{
      ledger = await this.ledgerRepository.find({
        where: { agentId: agent.agentId , trxtype: filter},
        order: { id: 'DESC'}
      });
    }

    const ledgerData = {
      depositCount :  deposit.rowCount,
      depositAmount : deposit.totalAmount,
      refundCount : refund.rowCount,
      refundAmount : refund.totalAmount,
      reissueCount : reissue.rowCount,
      reissueAmount : reissue.totalAmount,
      ticketCount : ticket.rowCount,
      ticketAmount : ticket.totalAmount,
      voidCount : voided.rowCount,
      voidAmount : voided.totalAmount,
      data : ledger
    }

    return ledgerData;
  }

  async findDashboardAgent(header: any) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const search = await this.searchHistoryRepository
    .createQueryBuilder('search')
    .where(`DATE(created_at) = CURDATE()`)
    .andWhere('search.agentId = :agentId', { agentId: agent.agentId })
    .getCount();

    const booking = await this.bookingRepository
    .createQueryBuilder('booking')
    .where(`DATE(created_at) = CURDATE()`)
    .andWhere('booking.agentId = :agentId', { agentId: agent.agentId })
    .getCount();

    const ticket = await this.bookingRepository
    .createQueryBuilder('booking')
    .where('booking.status = :status', { status: 'Ticketed' })
    .andWhere(`DATE(created_at) = CURDATE()`)
    .andWhere('booking.agentId = :agentId', { agentId: agent.agentId })
    .getCount();

    const deposit = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId: agent.agentId })
    .andWhere('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
    .andWhere(`DATE(created_at) = CURDATE()`)
    .getRawOne(); 


    const totaldeposit = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
    .andWhere('ledger.agentId = :agentId', { agentId: agent.agentId })
    .getRawOne();

    const todaybooking = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .addSelect('SUM(booking.totalPax)', 'totalPax')
    .addSelect('SUM(booking.netfare)', 'totalSell')
    .where('booking.status = :status', { status: 'Ticketed' })
    .andWhere('booking.agentId = :agentId', { agentId: agent.agentId })
    .andWhere(`DATE(created_at) = CURDATE()`)
    .getRawOne();

    const totalbooking = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .addSelect('SUM(booking.totalPax)', 'totalPax')
    .addSelect('SUM(booking.netfare)', 'totalSell')
    .where('booking.status = :status', { status: 'Ticketed' })
    .andWhere('booking.agentId = :agentId', { agentId: agent.agentId })
    .getRawOne();

    const response = {
      todaybooking: booking,
      todayticketed: ticket,
      todaysearch: search,
      todaysell: todaybooking.totalSell,
      todaydeposit: deposit.totalAmount,
      totalsell: totalbooking.totalSell,
      totaldeposit: totaldeposit.totalAmount,
    }

    return response;
  }

  async findAllByDateRangeAgentId(header: any, startDate: Date, endDate: Date) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const ledger = await this.dataSource.query(
      `SELECT 
        id,
        agentId,
        trxtype,
        debit,
        credit,
        refId,
        details,
        remarks,
        companyname,
        created_at,
        updated_at,
        uid,
        SUM(credit - debit) OVER (
          PARTITION BY agentId
          ORDER BY id
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS remaining_balance
      FROM agent_ledger
      WHERE agentId = ? AND created_at BETWEEN ? AND ?
      ORDER BY id DESC
      `,
      [agent.agentId, startDate, endDate]
    );

    const bookingTicketed = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('SUM(booking.sellprice) - SUM(booking.purchaseprice)', 'totalProfit')
    .where('booking.status = :status', { status: 'Ticketed' })
    .andWhere('booking.created_at BETWEEN :startDate AND :endDate', { startDate: startDate, endDate: endDate })
    .getRawOne();

    const sell = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'purchase' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    }).getRawOne();

    const expense = await this.adminExpenseRepository
    .createQueryBuilder('expense')
    .select('SUM(expense.amount)', 'totalAmount')
    .where('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    }).getRawOne();

    const ledgerData={
      lossProfit: bookingTicketed?.totalProfit || 0,
      ledger: ledger,
      totalExpense: expense.totalAmount,
      totalIncome: sell?.totalAmount || 0,
    }

    return ledgerData;
  }

  async findDashboard(header: any){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const search = await this.searchHistoryRepository.find({
      order: { updated_at: 'DESC' },
      take: 100
    });

    const bookingData = await this.bookingRepository.find({
      order: { updated_at: 'DESC' },
      take: 100
    });

    const agentData = await this.agentRepository.find({
      select: ['company', 'status','phone','created_at','uid'],
      order: { created_at: 'DESC' },
      take: 100
    });

    const depositData = await this.depositRepository.find({
      select: ['depositId', 'status','amount', 'companyname','created_at', 'uid'],
      order: { created_at: 'DESC' },
      take: 100
    });

    const totaldeposit = await this.depositRepository.count();
    const totalagent = await this.agentRepository.count();
    const totalbooking = await this.bookingRepository.count();
    const totalcancelled = await this.bookingRepository.count({where :{status:'Cancelled'}});
    const totalticketed = await this.bookingRepository.count({where :{status:'Ticketed'}});
    const totaldepositamount = await this.depositRepository
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('Status = :status', { status: 'approved' })
      .getRawOne();

    const totaldepositapproved = await this.depositRepository.count({where :{status:'approved'}});
    const totaldepositpending = await this.depositRepository.count({where :{status:'pending'}});
    const totaldepositrejected = await this.depositRepository.count({where :{status:'rejected'}});


    const DataResponse = {
      "AgentData": agentData,
      "SearchData": search,
      "TotalAgent": totalagent || 0,
      "TotalBookingData": bookingData,
      "TotalBooking": totalbooking || 0,
      "Cancelled": totalcancelled,
      "Ticketed": totalticketed,
      "TotalDepositAmount": totaldepositamount || 0,
      "TotalDepositData": depositData,
      "TotalDeposit": totaldeposit,
      "TotalDepositApproved": totaldepositapproved,
      "TotalDepositPending": totaldepositpending,
      "TotalDepositRejected": totaldepositrejected,
    }
    

    return DataResponse;
  }

  async findAllLedger(header: any, page: number, type: string, filter: string, limit: number){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const deposit = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount')
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
    .getRawOne();

    const refund = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'refund' })
    .getRawOne();
    
    const reissue = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.debit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'reissue' })
    .getRawOne(); 

    const voided = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'void' })
    .getRawOne();
    
    const ticket = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('COUNT(ledger.id)', 'rowCount') 
    .addSelect('SUM(ledger.debit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'ticket' })
    .getRawOne();

    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.ledgerRepository.createQueryBuilder("ledger");

    if (type) {
        queryBuilder = queryBuilder.where("ledger.trxtype = :trxtype", { trxtype: type });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(ledger.agentId LIKE :filter OR ledger.companyname LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();

    const ledgerdata = await queryBuilder
        .orderBy("ledger.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();

    
    const ledgerReport = {
      depositCount :  deposit.rowCount,
      depositAmount : deposit.totalAmount,
      refundCount : refund.rowCount,
      refundAmount : refund.totalAmount,
      reissueCount : reissue.rowCount,
      reissueAmount : reissue.totalAmount,
      ticketCount : ticket.rowCount,
      ticketAmount : ticket.totalAmount,
      voidCount : voided.rowCount,
      voidAmount : voided.totalAmount,
    }

    const ledgerData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      report: ledgerReport,
      data: ledgerdata
    }

    return ledgerData;
  }

  async findAdminExpense(header: any, page: number, filter: string, limit: number){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.adminExpenseRepository.createQueryBuilder("expense");

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(expense.details LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();

    const ledgerdata = await queryBuilder
        .orderBy("expense.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();

    const ledgerData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: ledgerdata
    }

    return ledgerData;
  }

  async findAllAdminLedger(header: any, startDate: Date, endDate: Date) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const ledger = await this.dataSource.query(
      `SELECT id, agentId, trxtype, debit, credit,
        refId,
        details,
        remarks,
        companyname,
        created_at,
        updated_at,
        uid, SUM(credit - debit) OVER (
          PARTITION BY agentId
          ORDER BY id
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS remaining_balance
      FROM agent_ledger
      WHERE created_at BETWEEN ? AND ?
      ORDER BY id DESC`,
      [startDate, endDate]
    );

    const bookingTicketed = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('SUM(booking.sellprice) - SUM(booking.purchaseprice)', 'totalProfit')
    .where('booking.status = :status', { status: 'Ticketed' })
    .andWhere('booking.created_at BETWEEN :startDate AND :endDate', { startDate: startDate, endDate: endDate })
    .getRawOne();

    const sell = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.debit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'purchase' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    }).getRawOne();

    const deposit = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.credit)', 'totalAmount')
    .where('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
    .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    }).getRawOne();

    const expense = await this.adminExpenseRepository
    .createQueryBuilder('expense')
    .select('SUM(expense.amount)', 'totalAmount')
    .where('expense.created_at BETWEEN :startDate AND :endDate', {
      startDate: startDate, 
      endDate: endDate
    }).getRawOne();

    const ledgerData={
      lossProfit: bookingTicketed?.totalProfit || 0,
      ledger: ledger,
      totalExpense: expense.totalAmount,
      totalIncome: sell?.totalAmount || 0,
      totalSell: sell?.totalAmount || 0,
      totaldeposit: deposit.totalAmount
    }

    return ledgerData;
  }

}
