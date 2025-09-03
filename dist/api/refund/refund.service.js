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
exports.RefundService = void 0;
const common_1 = require("@nestjs/common");
const refund_model_1 = require("./refund.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_model_1 = require("../booking/booking.model");
const auth_service_1 = require("../auth/auth.service");
const axios_1 = require("axios");
const report_model_1 = require("../report/report.model");
let RefundService = class RefundService {
    constructor(refundRepository, bookingRepository, agentLedgerRepository, authService) {
        this.refundRepository = refundRepository;
        this.bookingRepository = bookingRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.authService = authService;
    }
    async createAgentRequest(header, bookingUId, createRefundDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (booking.status === 'Ticketed' || booking.status === 'Void Rejected' ||
            booking.status === 'Reissued' || booking.status === 'Reissue Rejected' ||
            booking.status === 'Reissue Quotation Rejected' ||
            booking.status === 'Refund Quotation Rejected' ||
            booking.status === 'Refunded' || booking.status === 'Refund Rejected') {
            const RequestRefund = {
                agentId: booking.agentId,
                bookingId: booking.bookingId,
                passengerdata: createRefundDto.text,
            };
            await this.refundRepository.save(RequestRefund);
            booking.status = 'Refund Requested';
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: booking.status + ' successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.NotFoundException(`Ticket Is Already In Another status ${booking.status}`);
        }
    }
    async sendQuotation(header, bookingUId, quotationRefundDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const refund = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!refund) {
            throw new common_1.NotFoundException("Refund data not found");
        }
        if (booking.status === 'Refund Requested') {
            booking['status'] = 'Refund Quotation Send';
            refund['netfare'] = booking.netfare;
            refund['refundpenalty'] = quotationRefundDto.refundpenalty;
            refund['servicefee'] = quotationRefundDto.servicefee;
            refund['quotationamount'] = quotationRefundDto.quotationamount;
            refund['remarks'] = quotationRefundDto.remarks;
            await this.refundRepository.update(refund.id, refund);
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: 'Refund Quotation Send successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.HttpException("Ticket Is Already In Another status", axios_1.HttpStatusCode.BadRequest);
        }
    }
    async quotationDecision(header, status, bookingUId) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const refund = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!refund) {
            throw new common_1.NotFoundException("Refund data not found");
        }
        let bookingstatus;
        if (status === 'accept') {
            bookingstatus = 'Refund Quotation Accepted';
        }
        else if (status === 'reject') {
            bookingstatus = 'Refund Quotation Rejected';
        }
        if (booking.status === 'Refund Quotation Send') {
            booking['status'] = bookingstatus;
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1 && status === 'accept') {
                return { message: 'Refund Quotation Accepted.' };
            }
            if (bookingResponse.affected === 1 && status === 'reject') {
                return { message: 'Refund Quotation Rejected.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.HttpException("Ticket Is Already In Another status", axios_1.HttpStatusCode.BadRequest);
        }
    }
    async refundDecision(header, status, bookingUId, refundDecisionDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const refund = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!refund) {
            throw new common_1.NotFoundException("Refund data not found");
        }
        let bookingstatus;
        if (status === 'accept') {
            bookingstatus = 'Refunded';
        }
        else if (status === 'reject') {
            bookingstatus = 'Refund Rejected';
        }
        if (booking.status === 'Refund Quotation Accepted' && status === 'accept') {
            booking['status'] = bookingstatus;
            const details = refund.quotationamount + ' Refund. ' + refund.passengerdata + ' By ' + verifyAdminId.firstname;
            const AgentLedgerData = {
                agentId: booking.agentId,
                trxtype: 'refund',
                credit: Number(refund.quotationamount),
                refId: booking.bookingId,
                details: details,
                companyname: booking.companyname
            };
            await this.agentLedgerRepository.save(AgentLedgerData);
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: 'Refunded Successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else if ((booking.status === 'Refund Quotation Accepted' || booking.status === 'Refund Requested') && status === 'reject') {
            booking['status'] = bookingstatus;
            refund.remarks = refundDecisionDto.remarks;
            await this.refundRepository.update(refund.id, refund);
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: 'Refunded Rejected Successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.HttpException("Ticket Is Already In Another status", axios_1.HttpStatusCode.BadRequest);
        }
    }
};
exports.RefundService = RefundService;
exports.RefundService = RefundService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refund_model_1.RefundModel)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(2, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], RefundService);
//# sourceMappingURL=refund.service.js.map