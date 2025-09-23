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
exports.VoidService = void 0;
const common_1 = require("@nestjs/common");
const void_model_1 = require("./void.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_model_1 = require("../agent/agent.model");
const booking_model_1 = require("../booking/booking.model");
const report_model_1 = require("../report/report.model");
const auth_service_1 = require("../auth/auth.service");
const mail_service_1 = require("../../mail/mail.service");
let VoidService = class VoidService {
    constructor(voidRepository, agentRepository, bookingRepository, agentLedgerRepository, authService, mailService) {
        this.voidRepository = voidRepository;
        this.agentRepository = agentRepository;
        this.bookingRepository = bookingRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.authService = authService;
        this.mailService = mailService;
    }
    async createVoidRequest(header, bookingUId, createVoidDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (!['Hold', 'Cancelled', 'Issue In Process'].includes(booking.status)) {
            const RequestVoid = {
                agentId: booking.agentId,
                bookingId: booking.bookingId,
                passengerdata: createVoidDto.passengerdata,
                reason: createVoidDto.reason
            };
            await this.voidRepository.save(RequestVoid);
            booking.status = 'Void Requested';
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                await this.mailService.voidRequestMail(booking);
                return { message: booking.status + ' Successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.NotFoundException(`Ticket Is Already In Another status ${booking.status}`);
        }
    }
    async voidDecision(header, bookingUId, status, servicefee, voidDesicionDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const voidData = await this.voidRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!voidData) {
            throw new common_1.NotFoundException("Void data not found");
        }
        let bookingstatus;
        if (status == 'accept') {
            bookingstatus = 'Voided';
        }
        else if (status == 'reject') {
            bookingstatus = 'Void Rejected';
        }
        booking['status'] = bookingstatus;
        const bookingResponse = await this.bookingRepository.update(booking.id, booking);
        voidData['remarks'] = voidDesicionDto.remarks;
        voidData['status'] = status;
        await this.voidRepository.update(voidData.id, voidData);
        if (bookingResponse.affected === 1) {
            return { message: bookingstatus + ' Successfully.' };
        }
        else {
            return { message: 'Something error' };
        }
    }
};
exports.VoidService = VoidService;
exports.VoidService = VoidService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(void_model_1.VoidModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(3, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        mail_service_1.MailService])
], VoidService);
//# sourceMappingURL=void.service.js.map