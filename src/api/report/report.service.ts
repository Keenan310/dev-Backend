import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AgentLedgerModel, AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto, UpdateAgentLedgerDto, UpdateAdminExpenseDto } from './report.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, Not, In, Like } from 'typeorm';
import dayjs = require('dayjs');
import { AgentBalanceUpdate, AgentModel } from '../agent/agent.model';
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
    @InjectRepository(SearchHistoryModel)
    private readonly searchHistoryRepository: Repository<SearchHistoryModel>,
    @InjectRepository(AdminExpenseModel)
    private readonly adminExpenseRepository: Repository<AdminExpenseModel>,
    @InjectRepository(AdminLedger)
    private readonly adminLedgerRepository: Repository<AdminLedger>,
    private readonly authService: AuthService,
    private dataSource: DataSource
  ) {}


  async addAdminExpense(header : any, adminExpenseModel : AdminExpenseModel){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    return this.adminExpenseRepository.save(adminExpenseModel);
  }

  async editAdminExpense(header : any, id:number, UpdateAdminExpenseDto : UpdateAdminExpenseDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return this.adminExpenseRepository.update(+id, UpdateAdminExpenseDto);
  }

  async addAdminLedger(header : any, adminLedgerModel : AdminLedger){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    adminLedgerModel['profit'] = adminLedgerModel['netfare'] - adminLedgerModel['ticketprice'];
    await this.adminLedgerRepository.save(adminLedgerModel);

  }

  async editAdminLedger(header : any, id:number, updateAdminLedgerDto : UpdateAdminLedgerDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    await this.adminLedgerRepository.update(+id, updateAdminLedgerDto);

  }

  async deleteAdminLedger(header : any, id:number){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.adminLedgerRepository.delete(+id);

  }

  async editAgentLedgerByAdmin(header : any, id:number, updateAgentBalanceUpdate : AgentBalanceUpdate){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    return await this.ledgerRepository.update(+id, updateAgentBalanceUpdate);
  }

  async deleteAgentLedgerByAdmin(header : any, uid:string){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const ledgerEntry = await this.ledgerRepository.findOne({ where: { uid: uid } });
    if(!ledgerEntry){
      throw new NotFoundException();
    }

    return await this.ledgerRepository.delete(ledgerEntry.id);
  }
  
  async findAllReportAdmin(header: any) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const search = await this.searchHistoryRepository
    .createQueryBuilder('search')
    .select('COUNT(search.id)', 'rowCount')
    .getRawOne();

    const agent = await this.agentRepository
    .createQueryBuilder('search')
    .select('COUNT(search.id)', 'rowCount')
    .getRawOne();

    const booking = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount').getRawOne();

    const bookingHold = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .andWhere('booking.status = :status', { status: 'Hold' }).getRawOne();

    const bookingTicketed = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .addSelect('SUM(booking.totalPax)', 'totalPax')
    .addSelect('SUM(booking.netfare)', 'totalSell')
    .addSelect('SUM(booking.sellprice) - SUM(booking.purchaseprice)', 'totalProfit')
    .addSelect('SUM(booking.totalsegment)', 'totalSegment')
    .where('booking.status = :status', { status: 'Ticketed' }).getRawOne();

    const bookingCancelled = await this.bookingRepository
    .createQueryBuilder('booking')
    .select('COUNT(booking.id)', 'rowCount')
    .where('booking.status = :status', { status: 'Cancelled' }).getRawOne();

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
        "value": booking.rowCount - bookingHold.rowCount - bookingCancelled.rowCount
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
    .where('ledger.trxtype = :trxtype', { trxtype: 'ticket' })
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
      totalExpense: expense?.totalAmount || 0,
      totalIncome: sell?.totalAmount || 0,
    }

    return ledgerData;
  }

  async findDashboard(header: any){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const now = dayjs();
    const startOfYear = now.startOf('year').toDate();
    const endOfYear = now.endOf('year').toDate();

    // 1️⃣ Fetch all bookings and agents for current year
    const [bookingData, agentData] = await Promise.all([
      this.bookingRepository.find({
        where: {
          created_at: Between(startOfYear, endOfYear),
          status: Not(In(['Hold', 'Cancelled', 'Issue Request Rejected'])),
         },
        select: ['id', 'created_at'],
        
      }),
      this.agentRepository.find({
        where: { created_at: Between(startOfYear, endOfYear) },
        select: ['id', 'created_at'],
      }),
    ]);


    const currentMonth = now.month(); // 0–11
    const months = Array.from({ length: currentMonth + 1 }).map((_, i) => {
      const date = dayjs().month(i).startOf('month');
      return {
        month: date.format('MMM YYYY'),  // e.g. "Jan 2025"
        bookingCount: 0,
        agentCount: 0,
        cumulativeBooking: 0,
        cumulativeAgent: 0,
      };
    });

    // 3️⃣ Count bookings per month
    bookingData.forEach(b => {
      const month = dayjs(b.created_at).format('MMM YYYY');
      const bucket = months.find(m => m.month === month);
      if (bucket) bucket.bookingCount++;
    });

    // 4️⃣ Count agents per month
    agentData.forEach(a => {
      const month = dayjs(a.created_at).format('MMM YYYY');
      const bucket = months.find(m => m.month === month);
      if (bucket) bucket.agentCount++;
    });

    // 5️⃣ Calculate cumulative totals
    let bookingRunningTotal = 0;
    let agentRunningTotal = 0;

    months.forEach(m => {
      bookingRunningTotal += m.bookingCount;
      agentRunningTotal += m.agentCount;
      m.cumulativeBooking = bookingRunningTotal;
      m.cumulativeAgent = agentRunningTotal;
    });

    const recentbookingData = await this.bookingRepository.find({
      select: [
        'created_at',
        'bookingId',
        'name',
        'pnr',
        'companyname',
        'netfare',
        'depfrom',
        'arrto',
        'carrier_name',
        'status',
        'uid'
      ],
      order: { updated_at: 'DESC' },
      take: 100
    });

    const totalagent = await this.agentRepository.count();
    const totalbooking = await this.bookingRepository.count({where: {status: In(['Ticketed', 'Voided', 'Refunded'])}});
    const totalHold = await this.bookingRepository.count({where :{status:'Hold'}});
    const totalCancelled = await this.bookingRepository.count({where :{status:'Cancelled'}});
    const totalVoid = await this.bookingRepository.count({where :{status: 'Voided'}});
    const totalticketed = await this.bookingRepository.count({where :{status:'Ticketed'}});
    const totalRefund = await this.bookingRepository.count({where :{status: 'Refunded'}});
    const totalReissue = await this.bookingRepository.count({where :{status: 'Reissued'}});

    const DataResponse = {
      "TotalFlightBooking": totalbooking ||0,
      "TotalHold": totalHold || 0,
      "TotalTicketed": totalticketed || 0,
      "TotalCancelled": totalCancelled || 0,
      "TotalVoid": totalVoid || 0,
      "TotalRefund": totalRefund || 0,
      "TotalReissue": totalReissue || 0,
      "TotalAgents": totalagent || 0,
      "TotalBookingData": recentbookingData,
      "GraphData": months
    }
    return DataResponse;
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

  async findAllAgentSingelAdmin(header: any, agentId: string, page: number, limit: number){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const limitation = 2000;

    const skip = (page - 1) * limit;
    const take = limitation;

    let queryBuilder = this.ledgerRepository.createQueryBuilder("ledger");
    queryBuilder = queryBuilder.andWhere("ledger.agentId = :agentId", { agentId });
    const totaldata = await queryBuilder.getCount();

    const ledgerdata = await queryBuilder
        .orderBy("ledger.id", "DESC")
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

  async findAllAdminLedger(header: any, startDate: Date, endDate: Date, adminId: string) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const ledgerQuery = this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select([
      'ledger.id',
      'ledger.created_at',
      'ledger.description',
      'ledger.pnr',
      'ledger.ticketprice',
      'ledger.supplier',
      'ledger.netfare',
      'ledger.status',
      'ledger.liable',
      'ledger.agentId AS agentcode',
      '(ledger.netfare - ledger.ticketprice) AS profit'
    ])
    .where('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    })
    .andWhere('ledger.deposit <= 0')

    if (adminId) {
      ledgerQuery.andWhere('ledger.liable = :adminId', { adminId });
    }

    const ledger = await ledgerQuery.orderBy('ledger.id', 'DESC').getRawMany();

    const depositQuery = this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select([
      'ledger.id',
      'ledger.created_at',
      'ledger.description',
      'ledger.deposit',
      'ledger.agentId as agentcode',
      'ledger.status',
      'ledger.liable'
    ])
    .where('ledger.created_at BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    })
    .andWhere('ledger.deposit > 0')

    if (adminId) {
      depositQuery.andWhere('ledger.liable = :adminId', { adminId });
    }

    const depositLedger = await depositQuery.orderBy('ledger.id', 'DESC').getRawMany();


    const sell = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.netfare)', 'totalAmount').getRawOne();

     const expense = await this.adminExpenseRepository 
    .createQueryBuilder('expense')
    .select('SUM(expense.amount)', 'totalAmount').getRawOne();

    const lossProfit = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.netfare) - SUM(ledger.ticketprice)', 'totalAmount').getRawOne();


    //Admin
    const totalLiableSell = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.ticketprice)', 'totalAmount')
    .where('ledger.liable =:adminId', {adminId})
    .getRawOne();


    const totalLiableDeposit = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.deposit)', 'totalAmount')
    .where('ledger.liable = :adminId', { adminId })
    .getRawOne();

    const lossProfitLiable = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.netfare) - SUM(ledger.ticketprice)', 'totalAmount').getRawOne();


    const totalIncome = lossProfit?.totalAmount - expense?.totalAmount;

    const ledgerData={
      lossProfit: totalIncome || 0,
      ledger: ledger,
      depsoit: depositLedger,
      totalSell: sell?.totalAmount || 0,
      totalExpense: expense.totalAmount || 0,
      totalIncome: totalIncome || 0,
      totalSellLiable: totalLiableSell?.totalAmount || 0,
      totalDepositLiable: totalLiableDeposit?.totalAmount || 0,
      totalLossProfitLiable: lossProfitLiable?.totalAmount || 0,
    }

    return ledgerData;
  }

  async findSingleAgentLedgerAdmin(header: any, agentId: string) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

  const totalSell = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.netfare)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId })
    .getRawOne();

  const totalDeposit = await this.adminLedgerRepository
    .createQueryBuilder('ledger')
    .select('SUM(ledger.deposit)', 'totalAmount')
    .where('ledger.agentId = :agentId', { agentId })
    .getRawOne();

   const totalbalance = totalDeposit?.totalAmount - totalSell?.totalAmount;

    const ledgerData={
      totalSell: totalSell?.totalAmount || 0,
      totalDeposit: totalDeposit.totalAmount || 0,
      lastBalance: totalbalance || 0,
    }

    return ledgerData;
  }

  async findAllAdminBalanceInquery(header: any) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const ledger = await this.dataSource.query(
      `SELECT 
      a.agentId AS agentId,
      a.phone,
      a.company,
      ag.total_deposit,
      ag.total_sell,
      ag.current_balance
      FROM (
      SELECT 
          agentId,
          SUM(CASE WHEN trxtype = 'deposit' THEN credit ELSE 0 END) AS total_deposit,
          SUM(debit) AS total_sell,
          SUM(credit - debit) AS current_balance
      FROM agent_ledger
      GROUP BY agentId
      ) AS ag
      JOIN agents a ON ag.agentId = a.agentId
      WHERE ag.current_balance < 0
      ORDER BY ag.current_balance ASC;`
    );

    return ledger;
  }

}
