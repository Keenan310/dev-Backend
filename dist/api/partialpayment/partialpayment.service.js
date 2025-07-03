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