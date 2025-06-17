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
exports.PartialpaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const partialpayment_entity_1 = require("./entities/partialpayment.entity");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const axios_1 = require("axios");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const report_model_1 = require("../report/report.model");
let PartialpaymentService = class PartialpaymentService {
    constructor(partialPaymentRepository, agentLedgerRepository, bookingRepository, authService, mailService) {
        this.partialPaymentRepository = partialPaymentRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.bookingRepository = bookingRepository;
        this.authService = authService;
        this.mailService = mailService;
    }
    async create(partialData) {
        return this.partialPaymentRepository.save(partialData);
    }
    async findAllAdmin(header, page, status, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
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
        };
        return bookingData;
    }
    async updateOneAdmin(header, uid, updatePartialpaymentDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const ppaymnet = await this.partialPaymentRepository.findOneBy({ uid: uid });
        if (!ppaymnet) {
            throw new common_1.NotFoundException();
        }
        return await this.partialPaymentRepository.update(ppaymnet.id, updatePartialpaymentDto);
    }
    async findAllAgent(header, page, status, filter, limit) {
        const agent = await this.authService.verifyAgentToken(header);
        console.log(agent);
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.partialPaymentRepository.createQueryBuilder("partialPayment");
        const agentId = agent.agentId;
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
        };
        return bookingData;
    }
    async paydue(header, uid) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: uid } });
        if (!booking) {
            throw new common_1.HttpException(`Booking not Found`, axios_1.HttpStatusCode.NotFound);
        }
        const partial = await this.partialPaymentRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!partial) {
            throw new common_1.NotFoundException("Not Found");
        }
        const payableamount = partial?.dueamount;
        if (booking?.payment_status != 'partial') {
            throw new common_1.HttpException(`Booking already ${booking.status}`, axios_1.HttpStatusCode.AlreadyReported);
        }
        if (booking.payment_status === 'partial') {
            const agentLedger = await this.agentLedgerRepository
                .createQueryBuilder()
                .select('SUM(amount)', 'sum')
                .where('agentId = :agentId', { agentId: agent.agentId })
                .getRawOne();
            const agentLedgerValue = agentLedger.sum != null ? agentLedger.sum : 0;
            if (agentLedgerValue <= payableamount) {
                throw new common_1.HttpException("Insufficient Amount. Please Top Up", axios_1.HttpStatusCode.NotAcceptable);
            }
            else if (agentLedgerValue >= payableamount) {
                const details = partial.bookingId + ' paid due amount ' + payableamount + ' BDT' + booking.depfrom + '-' + booking.arrto + ' Ticket Purchase: ' +
                    booking.netfare + ' BDT. PNR : ' + booking.pnr;
                const AgentLedgerData = {
                    agentId: booking.agentId,
                    trxtype: 'partial',
                    amount: -payableamount,
                    refId: booking.bookingId,
                    details: details,
                    companyname: booking.companyname
                };
                await this.agentLedgerRepository.save(AgentLedgerData);
                partial.status = 'paid';
                await this.partialPaymentRepository.update(partial.id, partial);
                booking.payment_status = 'full';
                const bookingres = await this.bookingRepository.update(booking.id, booking);
                if (bookingres.affected === 1) {
                    await this.mailService.partialPaymentMail(booking, partial);
                    return { message: "Complete full paymnet" };
                }
                else {
                    return { message: 'Something error' };
                }
            }
        }
    }
};
exports.PartialpaymentService = PartialpaymentService;
exports.PartialpaymentService = PartialpaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(partialpayment_entity_1.PartialPaymentModel)),
    __param(1, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        mail_service_1.MailService])
], PartialpaymentService);
//# sourceMappingURL=partialpayment.service.js.map