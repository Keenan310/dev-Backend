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
const agent_model_1 = require("../agent/agent.model");
const booking_model_1 = require("../booking/booking.model");
const deposit_model_1 = require("../deposit/deposit.model");
const auth_service_1 = require("../auth/auth.service");
const searchhistory_model_1 = require("../searchhistory/searchhistory.model");
let ReportService = class ReportService {
    constructor(ledgerRepository, bookingRepository, agentRepository, depositRepository, agentledgerRepository, searchHistoryRepository, authService) {
        this.ledgerRepository = ledgerRepository;
        this.bookingRepository = bookingRepository;
        this.agentRepository = agentRepository;
        this.depositRepository = depositRepository;
        this.agentledgerRepository = agentledgerRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.authService = authService;
    }
    async findAllReportAdmin(header, startDate, endDate) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
            .andWhere('booking.created_at BETWEEN :startDate AND :endDate', { startDate: startDate, endDate: endDate })
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
            .andWhere('booking.created_at BETWEEN :startDate AND :endDate', { startDate: startDate, endDate: endDate })
            .getRawOne();
        const deposit = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
            .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
            startDate: startDate,
            endDate: endDate
        })
            .getRawOne();
        const refund = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'refund' })
            .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
            startDate: startDate,
            endDate: endDate
        })
            .getRawOne();
        const reissue = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'reissue' })
            .andWhere('ledger.created_at BETWEEN :startDate AND :endDate', {
            startDate: startDate,
            endDate: endDate
        })
            .getRawOne();
        const voided = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
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
    async findAllByAgentId(header, filter) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const deposit = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.agentId = :agentId', { agentId: agent.agentId })
            .andWhere('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
            .getRawOne();
        const refund = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.agentId = :agentId', { agentId: agent.agentId })
            .andWhere('ledger.trxtype = :trxtype', { trxtype: 'refund' })
            .getRawOne();
        const reissue = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.agentId = :agentId', { agentId: agent.agentId })
            .andWhere('ledger.trxtype = :trxtype', { trxtype: 'reissue' })
            .getRawOne();
        const voided = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.agentId = :agentId', { agentId: agent.agentId })
            .andWhere('ledger.trxtype = :trxtype', { trxtype: 'void' })
            .getRawOne();
        const ticket = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
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
            .select('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.agentId = :agentId', { agentId: agent.agentId })
            .andWhere('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
            .andWhere(`DATE(created_at) = CURDATE()`)
            .getRawOne();
        const totaldeposit = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('SUM(ledger.amount)', 'totalAmount')
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
        const ledger = await this.ledgerRepository.find({
            where: {
                agentId: agent.agentId,
                created_at: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { id: 'DESC' },
        });
        if (!ledger) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return ledger;
    }
    async findDashboard(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
            select: ['company', 'status', 'phone', 'created_at', 'uid'],
            order: { created_at: 'DESC' },
            take: 100
        });
        const depositData = await this.depositRepository.find({
            select: ['depositId', 'status', 'amount', 'companyname', 'created_at', 'uid'],
            order: { created_at: 'DESC' },
            take: 100
        });
        const totaldeposit = await this.depositRepository.count();
        const totalagent = await this.agentRepository.count();
        const totalbooking = await this.bookingRepository.count();
        const totalcancelled = await this.bookingRepository.count({ where: { status: 'Cancelled' } });
        const totalticketed = await this.bookingRepository.count({ where: { status: 'Ticketed' } });
        const totaldepositamount = await this.depositRepository
            .createQueryBuilder()
            .select('SUM(amount)', 'sum')
            .where('Status = :status', { status: 'approved' })
            .getRawOne();
        const totaldepositapproved = await this.depositRepository.count({ where: { status: 'approved' } });
        const totaldepositpending = await this.depositRepository.count({ where: { status: 'pending' } });
        const totaldepositrejected = await this.depositRepository.count({ where: { status: 'rejected' } });
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
        };
        return DataResponse;
    }
    async findAllLedger(header, page, type, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const deposit = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'deposit' })
            .getRawOne();
        const refund = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'refund' })
            .getRawOne();
        const reissue = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'reissue' })
            .getRawOne();
        const voided = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
            .where('ledger.trxtype = :trxtype', { trxtype: 'void' })
            .getRawOne();
        const ticket = await this.ledgerRepository
            .createQueryBuilder('ledger')
            .select('COUNT(ledger.id)', 'rowCount')
            .addSelect('SUM(ledger.amount)', 'totalAmount')
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
        };
        const ledgerData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            report: ledgerReport,
            data: ledgerdata
        };
        return ledgerData;
    }
    async findAllLedgerBySales(header, page, type, filter, limit) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.ledgerRepository.createQueryBuilder("ledger");
        queryBuilder.where('ledger.agentId = :agentId', { agentId: agent.agentId });
        queryBuilder.andWhere('ledger.amount < 0');
        if (type) {
            queryBuilder = queryBuilder.andWhere("ledger.amount < :trxtype", { trxtype: type });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(ledger.agentId LIKE :filter OR ledger.companyname LIKE :filter)", { filter: `%${filter}%` });
        }
        const totaldata = await queryBuilder.getCount();
        const deposits = await queryBuilder
            .orderBy("ledger.id", "DESC")
            .skip(skip)
            .take(take)
            .getMany();
        const depositsData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            data: deposits
        };
        return depositsData;
    }
    async findAllLedgerBySalesAgent(header, page, type, filter, limit) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
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
        const deposits = await queryBuilder
            .orderBy("ledger.id", "DESC")
            .skip(skip)
            .take(take)
            .getMany();
        const depositsData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            data: deposits
        };
        return depositsData;
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(3, (0, typeorm_1.InjectRepository)(deposit_model_1.DepositModel)),
    __param(4, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(5, (0, typeorm_1.InjectRepository)(searchhistory_model_1.SearchHistoryModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], ReportService);
//# sourceMappingURL=report.service.js.map