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
exports.ReissueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reissue_model_1 = require("./reissue.model");
const typeorm_2 = require("typeorm");
const booking_model_1 = require("../booking/booking.model");
const auth_service_1 = require("../auth/auth.service");
const axios_1 = require("axios");
const report_model_1 = require("../report/report.model");
let ReissueService = class ReissueService {
    constructor(reissueRepository, agentLedgerRepository, bookingRepository, authService) {
        this.reissueRepository = reissueRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.bookingRepository = bookingRepository;
        this.authService = authService;
    }
    async createAgentRequest(header, bookingUId, createReissueDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (!['Hold', 'Cancelled', 'Issue In Process'].includes(booking.status)) {
            const RequestReissue = {
                agentId: booking.agentId,
                bookingId: booking.bookingId,
                passengerdata: createReissueDto.text,
                reissuedate: createReissueDto.date
            };
            await this.reissueRepository.save(RequestReissue);
            booking.status = 'Reissue Requested';
            booking.updated_at = new Date();
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: booking.status + ' Successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.HttpException(`Ticket Is Already In another status: ${booking.status}`, axios_1.HttpStatusCode.NotAcceptable);
        }
    }
    async sendQuotation(header, bookingUId, quotationReissueDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const reissue = await this.reissueRepository.findOne({ where: { bookingId: booking.bookingId }, order: { created_at: "DESC" } });
        if (!reissue) {
            throw new common_1.NotFoundException("Reissue data not found");
        }
        if (booking.status === 'Reissue Requested') {
            reissue['exchangepenalty'] = quotationReissueDto?.exchangepenalty || 0,
                reissue['faredifference'] = quotationReissueDto?.faredifference || 0,
                reissue['servicefee'] = quotationReissueDto?.servicefee || 0,
                reissue['quotationamount'] = quotationReissueDto?.quotationamount || 0,
                reissue['quotationtext'] = quotationReissueDto.quotationtext || '',
                reissue['remarks'] = quotationReissueDto.remarks || '';
            await this.reissueRepository.update(reissue.id, reissue);
            booking.status = 'Reissue Quotation Send';
            booking.updated_at = new Date();
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: booking.status + ' successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.HttpException(`Ticket Is Already In Another status: ${booking.status}`, axios_1.HttpStatusCode.BadRequest);
        }
    }
    async reissueTicketRequest(header, status, bookingUId) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (booking.status != 'Reissue Quotation Send') {
            throw new common_1.HttpException(`Booking already ${booking.status}`, axios_1.HttpStatusCode.AlreadyReported);
        }
        const reissue = await this.reissueRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!reissue) {
            throw new common_1.NotFoundException("Reissue data not found");
        }
        if (status === 'accept') {
            const bookingstatus = 'Reissue Quotation Accepted';
            const details = booking.carrier_name + ' ' + booking.depfrom + '-' + booking.arrto +
                ' Ticket Reissue Date: ' + reissue.reissuedate + ' Reissue Charge ' + reissue.quotationamount +
                '. PNR : ' + booking.pnr + ' .';
            const AgentLedgerData = {
                agentId: booking.agentId,
                trxtype: 'reissue',
                debit: reissue.quotationamount,
                refId: booking.bookingId,
                details: details,
                companyname: booking.companyname,
            };
            await this.agentLedgerRepository.save(AgentLedgerData);
            booking.status = bookingstatus;
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: booking.status + ' . wait for a while' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else if (status === 'reject') {
            booking.status = 'Reissue Quotation Rejected';
            booking.updated_at = new Date();
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                return { message: booking.status };
            }
            else {
                return { message: 'Something error' };
            }
        }
    }
    async reissueDecisionAdmin(header, status, bookingUId, reissueDecisionDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const reissue = await this.reissueRepository.findOne({ where: { bookingId: booking.bookingId } });
        if (!reissue) {
            throw new common_1.NotFoundException("Reissue data not found");
        }
        let bookingstatus;
        if (status === 'approve') {
            bookingstatus = 'Reissued';
        }
        else if (status === 'reject') {
            bookingstatus = 'Reissue Rejected';
        }
        else {
            throw new common_1.NotFoundException("Booking status invalid");
        }
        if (booking.status === 'Reissue Quotation Accepted' || booking.status === 'Reissue Requested' || booking.status === 'Reissue Quotation Send') {
            booking.status = bookingstatus;
            booking.updated_at = new Date();
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            reissue['remarks'] = reissueDecisionDto.remarks;
            reissue['status'] = status;
            await this.reissueRepository.update(reissue.id, reissue);
            if (bookingResponse.affected === 1) {
                return { message: bookingstatus + ' Successfully' };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.HttpException(`Ticket Is Already In Another status ${booking.status}`, axios_1.HttpStatusCode.BadRequest);
        }
    }
};
exports.ReissueService = ReissueService;
exports.ReissueService = ReissueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reissue_model_1.ReissueModel)),
    __param(1, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], ReissueService);
//# sourceMappingURL=reissue.service.js.map