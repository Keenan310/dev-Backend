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
exports.TicketingService = void 0;
const common_1 = require("@nestjs/common");
const booking_model_1 = require("../booking/booking.model");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../agent/agent.model");
const report_model_1 = require("../report/report.model");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const axios_1 = require("axios");
const passenger_model_1 = require("../passenger/passenger.model");
const mail_service_1 = require("../../mail/mail.service");
const partialpayment_service_1 = require("../partialpayment/partialpayment.service");
const activitylog_service_1 = require("../activitylog/activitylog.service");
let TicketingService = class TicketingService {
    constructor(activityLogService, agentRepository, agentLedgerRepository, ticketingRepository, bookingRepository, passengerRepository, partialPaymentService, mailService, authService) {
        this.activityLogService = activityLogService;
        this.agentRepository = agentRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.ticketingRepository = ticketingRepository;
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.partialPaymentService = partialPaymentService;
        this.mailService = mailService;
        this.authService = authService;
    }
    async ticketIssueRequest(header, bookingUId, payment) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.HttpException(`Booking not Found`, axios_1.HttpStatusCode.NotFound);
        }
        if (booking?.status != 'Hold') {
            throw new common_1.HttpException(`Booking already ${booking.status}`, axios_1.HttpStatusCode.AlreadyReported);
        }
        if (payment === 'full') {
            const details = booking.carrier_name + ' ' + booking.depfrom + '-' + booking.arrto + ' Ticket Purchase ' +
                booking.netfare + ' BDT. PNR : ' + booking.pnr + ' .';
            const AgentLedgerData = {
                agentId: booking.agentId,
                trxtype: 'ticket',
                amount: -booking.netfare,
                refId: booking.bookingId,
                details: details,
                companyname: booking.companyname
            };
            await this.agentLedgerRepository.save(AgentLedgerData);
            booking.status = 'Issue In Process';
            const bookingResponse = await this.bookingRepository.update(booking.id, booking);
            if (bookingResponse.affected === 1) {
                await this.mailService.IssueRequestMail(booking);
                return { message: "Issue Request Send" };
            }
            else {
                return { message: 'Something error' };
            }
        }
        else {
            throw new common_1.NotAcceptableException("Invalid paymnet type");
        }
    }
    async createTicket(header, bookingUId, makeTicketModel) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.HttpException(`Booking not Found`, axios_1.HttpStatusCode.NotFound);
        }
        if (booking.status != 'Issue In Process') {
            throw new common_1.HttpException(`Booking already ${booking.status}`, axios_1.HttpStatusCode.AlreadyReported);
        }
        const passengerData = makeTicketModel?.passengerInfo;
        const paxData = [];
        for (const item of passengerData) {
            const ticketedData = {
                agentId: booking.agentId,
                bookingId: booking.bookingId,
                vendor: makeTicketModel.vendor,
                system: makeTicketModel.system,
                airlines: booking.carrier_name,
                bookingpnr: makeTicketModel.bookingpnr,
                airlinespnr: makeTicketModel.airlinespnr,
                givenname: item.givenname,
                surname: item.surname,
                ticketnumber: item.ticketnumber,
                issuetype: makeTicketModel.issuetype,
            };
            paxData.push(ticketedData);
            const passenger = await this.passengerRepository.findOne({
                where: {
                    agentId: booking.agentId,
                    bookingId: booking.bookingId,
                    givenname: item.givenname,
                    surname: item.surname
                }
            });
            passenger.ticketnumber = '' + item.ticketnumber;
            passenger.ticketstatus = 'unused';
            await this.passengerRepository.update(passenger.id, passenger);
        }
        await this.ticketingRepository.save(paxData);
        booking.status = 'Ticketed';
        booking.airlinespnr = makeTicketModel.airlinespnr;
        booking.sellprice = makeTicketModel.sellprice;
        booking.purchaseprice = makeTicketModel.purchaseprice;
        booking.ticketed_at = new Date();
        const bookingResponse = await this.bookingRepository.update(booking.id, booking);
        if (bookingResponse.affected === 1) {
            await this.activityLogService.create({ agentId: booking.agentId, status: booking.status, platform: 'Admin',
                refId: booking.bookingId, module: 'Booking', action_by: verifyAdminId.firstname });
            return { message: "Ticket Issued" };
        }
        else {
            return { message: 'Something error' };
        }
    }
    async rejectTicket(header, bookingUId, remarks) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.HttpException(`Booking not Found`, axios_1.HttpStatusCode.NotFound);
        }
        if (booking.status != 'Issue In Process') {
            throw new common_1.HttpException(`Booking already ${booking.status}`, axios_1.HttpStatusCode.AlreadyReported);
        }
        const agent = await this.agentRepository.findOne({ where: { agentId: booking.agentId } });
        if (!agent) {
            throw new common_1.HttpException(`Agnet not Found`, axios_1.HttpStatusCode.NotFound);
        }
        const details = booking.carrier_name + ' ' + booking.depfrom + '-' + booking.arrto + ' Ticket Issue Rejected ' + booking.netfare + ' BDT (Revesal due to ' + remarks + '). PNR : ' + booking.pnr + ' .';
        const AgentLedgerData = {
            agentId: booking.agentId,
            trxtype: 'reversal',
            amount: booking.netfare,
            refId: booking.bookingId,
            details: details,
            remarks: remarks,
            companyname: booking.companyname
        };
        await this.agentLedgerRepository.save(AgentLedgerData);
        booking.status = 'Issue Request Rejected';
        const bookingResponse = await this.bookingRepository.update(booking.id, booking);
        if (bookingResponse.affected === 1) {
            await this.mailService.IssueRequestRejectMail(booking);
            await this.activityLogService.create({ agentId: booking.agentId, status: booking.status, platform: 'Admin',
                refId: booking.bookingId, module: 'Booking', action_by: verifyAdminId.firstname });
            return { message: "Issue Request Rejected" };
        }
        else {
            return { message: 'Something error' };
        }
    }
};
exports.TicketingService = TicketingService;
exports.TicketingService = TicketingService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_model_1.TicketModel)),
    __param(4, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(5, (0, typeorm_1.InjectRepository)(passenger_model_1.PassengerModel)),
    __metadata("design:paramtypes", [activitylog_service_1.ActivitylogService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        partialpayment_service_1.PartialpaymentService,
        mail_service_1.MailService,
        auth_service_1.AuthService])
], TicketingService);
//# sourceMappingURL=ticketing.service.js.map