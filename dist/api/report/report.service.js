"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const report_model_1 = require("./report.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dayjs = require("dayjs");
const agent_model_1 = require("../agent/agent.model");
const booking_model_1 = require("../booking/booking.model");
const auth_service_1 = require("../auth/auth.service");
const searchhistory_model_1 = require("../searchhistory/searchhistory.model");
let ReportService = class ReportService {
    constructor(ledgerRepository, bookingRepository, agentRepository, searchHistoryRepository, adminExpenseRepository, agentLedgerRepository, adminLedgerRepository, authService, dataSource) {
        this.ledgerRepository = ledgerRepository;
        this.bookingRepository = bookingRepository;
        this.agentRepository = agentRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.adminExpenseRepository = adminExpenseRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.adminLedgerRepository = adminLedgerRepository;
        this.authService = authService;
        this.dataSource = dataSource;
    }
    async addAdminExpense(header, adminExpenseModel) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return this.adminExpenseRepository.save(adminExpenseModel);
    }
    async editAdminExpense(header, id, UpdateAdminExpenseDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return this.adminExpenseRepository.update(+id, UpdateAdminExpenseDto);
    }
    async addAdminLedger(header, adminLedgerModel) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        adminLedgerModel['profit'] = adminLedgerModel['netfare'] - adminLedgerModel['ticketprice'];
        await this.adminLedgerRepository.save(adminLedgerModel);
    }
    async editAdminLedger(header, id, updateAdminLedgerDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        await this.adminLedgerRepository.update(+id, updateAdminLedgerDto);
    }
    async deleteAdminLedger(header, id) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.adminLedgerRepository.delete(+id);
    }
    async editAgentLedgerByAdmin(header, id, updateAgentBalanceUpdate) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.ledgerRepository.update(+id, updateAgentBalanceUpdate);
    }
    async deleteAgentLedgerByAdmin(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const ledgerEntry = await this.ledgerRepository.findOne({ where: { uid: uid } });
        if (!ledgerEntry) {
            throw new common_1.NotFoundException();
        }
        return await this.ledgerRepository.delete(ledgerEntry.id);
    }
    async findAllReportAdmin(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
    async findAllByAgentId(header, filter) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
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
        let ledger;
        if (filter == 'all') {
            ledger = await this.ledgerRepository.find({ where: { agentId: agent.agentId }, order: { id: 'DESC' } });
        }
        else {
            ledger = await this.ledgerRepository.find({
                where: { agentId: agent.agentId, trxtype: filter },
                order: { id: 'DESC' }
            });
        }
        const ledgerData = {
            depositCount: deposit.rowCount,
            depositAmount: deposit.totalAmount,
            refundCount: refund.rowCount,
            refundAmount: refund.totalAmount,
            reissueCount: reissue.rowCount,
            reissueAmount: reissue.totalAmount,
            ticketCount: ticket.rowCount,
            ticketAmount: ticket.totalAmount,
            voidCount: voided.rowCount,
            voidAmount: voided.totalAmount,
            data: ledger
        };
        return ledgerData;
    }
    async findDashboardAgent(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
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
        };
        return response;
    }
    async findAllByDateRangeAgentId(header, startDate, endDate) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const ledger = await this.dataSource.query(`SELECT 
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
      `, [agent.agentId, startDate, endDate]);
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
        const ledgerData = {
            lossProfit: bookingTicketed?.totalProfit || 0,
            ledger: ledger,
            totalExpense: expense?.totalAmount || 0,
            totalIncome: sell?.totalAmount || 0,
        };
        return ledgerData;
    }
    async findDashboard(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const now = dayjs();
        const startOfYear = now.startOf('year').toDate();
        const endOfYear = now.endOf('year').toDate();
        const [bookingData, agentData] = await Promise.all([
            this.bookingRepository.find({
                where: {
                    created_at: (0, typeorm_2.Between)(startOfYear, endOfYear),
                    status: (0, typeorm_2.Not)((0, typeorm_2.In)(['Hold', 'Cancelled', 'Issue Request Rejected'])),
                },
                select: ['id', 'created_at'],
            }),
            this.agentRepository.find({
                where: { created_at: (0, typeorm_2.Between)(startOfYear, endOfYear) },
                select: ['id', 'created_at'],
            }),
        ]);
        const currentMonth = now.month();
        const months = Array.from({ length: currentMonth + 1 }).map((_, i) => {
            const date = dayjs().month(i).startOf('month');
            return {
                month: date.format('MMM YYYY'),
                bookingCount: 0,
                agentCount: 0,
                cumulativeBooking: 0,
                cumulativeAgent: 0,
            };
        });
        bookingData.forEach(b => {
            const month = dayjs(b.created_at).format('MMM YYYY');
            const bucket = months.find(m => m.month === month);
            if (bucket)
                bucket.bookingCount++;
        });
        agentData.forEach(a => {
            const month = dayjs(a.created_at).format('MMM YYYY');
            const bucket = months.find(m => m.month === month);
            if (bucket)
                bucket.agentCount++;
        });
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
        const totalbooking = await this.bookingRepository.count({ where: { status: (0, typeorm_2.In)(['Ticketed', 'Voided', 'Refunded']) } });
        const totalHold = await this.bookingRepository.count({ where: { status: 'Hold' } });
        const totalCancelled = await this.bookingRepository.count({ where: { status: 'Cancelled' } });
        const totalVoid = await this.bookingRepository.count({ where: { status: 'Voided' } });
        const totalticketed = await this.bookingRepository.count({ where: { status: 'Ticketed' } });
        const totalRefund = await this.bookingRepository.count({ where: { status: 'Refunded' } });
        const totalReissue = await this.bookingRepository.count({ where: { status: 'Reissued' } });
        const DataResponse = {
            "TotalFlightBooking": totalbooking || 0,
            "TotalHold": totalHold || 0,
            "TotalTicketed": totalticketed || 0,
            "TotalCancelled": totalCancelled || 0,
            "TotalVoid": totalVoid || 0,
            "TotalRefund": totalRefund || 0,
            "TotalReissue": totalReissue || 0,
            "TotalAgents": totalagent || 0,
            "TotalBookingData": recentbookingData,
            "GraphData": months
        };
        return DataResponse;
    }
    async findAdminExpense(header, page, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
        };
        return ledgerData;
    }
    async findAllAgentSingelAdmin(header, agentId, page, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
        };
        return ledgerData;
    }
    async findAllAdminLedger(header, startDate, endDate, adminId) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
            .andWhere('ledger.deposit <= 0');
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
            .andWhere('ledger.deposit > 0');
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
        const totalLiableSell = await this.adminLedgerRepository
            .createQueryBuilder('ledger')
            .select('SUM(ledger.ticketprice)', 'totalAmount')
            .where('ledger.liable =:adminId', { adminId })
            .getRawOne();
        const totalLiableDeposit = await this.adminLedgerRepository
            .createQueryBuilder('ledger')
            .select('SUM(ledger.deposit)', 'totalAmount')
            .where('ledger.liable = :adminId', { adminId })
            .getRawOne();
        const balanceLiable = totalLiableSell - totalLiableDeposit;
        const totalIncome = lossProfit?.totalAmount - expense?.totalAmount;
        const ledgerData = {
            lossProfit: totalIncome || 0,
            ledger: ledger,
            depsoit: depositLedger,
            totalSell: sell?.totalAmount || 0,
            totalExpense: expense.totalAmount || 0,
            totalIncome: totalIncome || 0,
            totalSellLiable: totalLiableSell?.totalAmount || 0,
            totalDepositLiable: totalLiableDeposit?.totalAmount || 0,
            totalLossProfitLiable: balanceLiable || 0,
        };
        return ledgerData;
    }
    async findSingleAgentLedgerAdmin(header, agentId) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
        const ledgerData = {
            totalSell: totalSell?.totalAmount || 0,
            totalDeposit: totalDeposit.totalAmount || 0,
            lastBalance: totalbalance || 0,
        };
        return ledgerData;
    }
    async findAllAdminBalanceInquery(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const ledger = await this.dataSource.query(`SELECT 
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
      ORDER BY ag.current_balance ASC;`);
        return ledger;
    }
    async findAdminSalesReport(header, startDate, endDate) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const now = dayjs();
        const normalizeDateFilter = (inputStart, inputEnd) => {
            const token = typeof inputStart === 'string' ? inputStart.trim().toLowerCase() : '';
            if (token) {
                if (['daily', 'day', 'today'].includes(token)) {
                    const date = now.format('YYYY-MM-DD');
                    return {
                        filter: 'daily',
                        whereSql: 'DATE(l.created_at) = CURDATE()',
                        params: [],
                        startDate: date,
                        endDate: date,
                    };
                }
                if (['weekly', 'week'].includes(token)) {
                    const dayOfWeek = now.day();
                    const daysSinceMonday = (dayOfWeek + 6) % 7;
                    const start = now.subtract(daysSinceMonday, 'day').format('YYYY-MM-DD');
                    const end = now.add(6 - daysSinceMonday, 'day').format('YYYY-MM-DD');
                    return {
                        filter: 'weekly',
                        whereSql: 'YEARWEEK(l.created_at, 1) = YEARWEEK(CURDATE(), 1)',
                        params: [],
                        startDate: start,
                        endDate: end,
                    };
                }
                if (['monthly', 'month'].includes(token)) {
                    return {
                        filter: 'monthly',
                        whereSql: 'YEAR(l.created_at) = YEAR(CURDATE()) AND MONTH(l.created_at) = MONTH(CURDATE())',
                        params: [],
                        startDate: now.startOf('month').format('YYYY-MM-DD'),
                        endDate: now.endOf('month').format('YYYY-MM-DD'),
                    };
                }
                if (['yearly', 'year'].includes(token)) {
                    return {
                        filter: 'yearly',
                        whereSql: 'YEAR(l.created_at) = YEAR(CURDATE())',
                        params: [],
                        startDate: now.startOf('year').format('YYYY-MM-DD'),
                        endDate: now.endOf('year').format('YYYY-MM-DD'),
                    };
                }
                if (['all', '*'].includes(token)) {
                    return {
                        filter: 'all',
                        whereSql: '',
                        params: [],
                        startDate: null,
                        endDate: null,
                    };
                }
            }
            const parsedStart = dayjs(inputStart);
            const parsedEnd = dayjs(inputEnd);
            let start = (parsedStart.isValid() ? parsedStart : now).format('YYYY-MM-DD');
            let end = (parsedEnd.isValid() ? parsedEnd : parsedStart.isValid() ? parsedStart : now).format('YYYY-MM-DD');
            if (dayjs(end).isBefore(dayjs(start))) {
                [start, end] = [end, start];
            }
            return {
                filter: 'custom',
                whereSql: 'DATE(l.created_at) BETWEEN ? AND ?',
                params: [start, end],
                startDate: start,
                endDate: end,
            };
        };
        const range = normalizeDateFilter(startDate, endDate);
        const dateFilterSql = range.whereSql ? `AND (${range.whereSql})` : '';
        const dateParams = range.params ?? [];
        const rows = await this.dataSource.query(`
        SELECT
          a.agentId AS agentId,
          a.name AS agentName,
          a.company AS agencyName,
          a.phone AS phone,
          a.address AS address,
          COALESCE(s.total_sell_count, 0) AS totalSellCount,
          COALESCE(s.total_sell_amount, 0) AS totalSellAmount,
          COALESCE(d.total_deposit, 0) AS totalDeposit,
          DATEDIFF(CURDATE(), DATE(a.created_at)) AS agentAgeDays
        FROM agents a
        LEFT JOIN (
          SELECT
            l.agentId AS agentId,
            COUNT(l.id) AS total_sell_count,
            SUM(ABS(l.debit)) AS total_sell_amount
          FROM agent_ledger l
          WHERE l.trxtype = 'ticket'
            ${dateFilterSql}
          GROUP BY l.agentId
        ) s ON s.agentId = a.agentId
        LEFT JOIN (
          SELECT
            l.agentId AS agentId,
            SUM(l.credit) AS total_deposit
          FROM agent_ledger l
          WHERE l.trxtype = 'deposit'
            ${dateFilterSql}
          GROUP BY l.agentId
        ) d ON d.agentId = a.agentId
        ORDER BY totalSellAmount DESC, totalSellCount DESC, a.agentId ASC
      `, [...dateParams, ...dateParams]);
        const data = rows.map((row) => {
            const rawPhone = row?.phone ?? '';
            const phoneDigits = String(rawPhone).replace(/\D/g, '');
            return {
                agentId: row?.agentId ?? null,
                agentName: row?.agentName ?? null,
                agencyName: row?.agencyName ?? null,
                phone: rawPhone,
                phoneDigits: phoneDigits || null,
                whatsappUrl: phoneDigits ? `https://wa.me/${phoneDigits}` : null,
                telUrl: phoneDigits ? `tel:${phoneDigits}` : null,
                address: row?.address ?? null,
                totalSellCount: Number(row?.totalSellCount || 0),
                totalSellAmount: Number(row?.totalSellAmount || 0),
                totalDeposit: Number(row?.totalDeposit || 0),
                agentAgeDays: Number(row?.agentAgeDays || 0),
            };
        });
        return {
            filter: range.filter,
            startDate: range.startDate,
            endDate: range.endDate,
            data,
        };
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(3, (0, typeorm_1.InjectRepository)(searchhistory_model_1.SearchHistoryModel)),
    __param(4, (0, typeorm_1.InjectRepository)(report_model_1.AdminExpenseModel)),
    __param(5, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(6, (0, typeorm_1.InjectRepository)(report_model_1.AdminLedger)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        typeorm_2.DataSource])
], ReportService);
//# sourceMappingURL=report.service.js.map