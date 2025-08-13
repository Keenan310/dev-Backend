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
exports.FlightService = void 0;
const common_1 = require("@nestjs/common");
const sabre_flights_service_1 = require("./sabre.flights.service");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("../booking/booking.model");
const typeorm_2 = require("typeorm");
const passenger_model_1 = require("../passenger/passenger.model");
const axios_1 = require("axios");
const reissue_model_1 = require("../reissue/reissue.model");
const refund_model_1 = require("../refund/refund.model");
const agent_model_1 = require("../agent/agent.model");
const groupfare_service_1 = require("../groupfare/groupfare.service");
const booking_service_1 = require("../booking/booking.service");
const auth_service_1 = require("../auth/auth.service");
const alhind_flights_service_1 = require("./alhind.flights.service");
let FlightService = class FlightService {
    constructor(bookingRepository, agentRepository, passengerRepository, reissueRepository, refundRepository, ticketingRepository, authService, sabreService, bookingService, groupFareService, alhindAPI) {
        this.bookingRepository = bookingRepository;
        this.agentRepository = agentRepository;
        this.passengerRepository = passengerRepository;
        this.reissueRepository = reissueRepository;
        this.refundRepository = refundRepository;
        this.ticketingRepository = ticketingRepository;
        this.authService = authService;
        this.sabreService = sabreService;
        this.bookingService = bookingService;
        this.groupFareService = groupFareService;
        this.alhindAPI = alhindAPI;
    }
    async airsearch(header, flightDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const AlhindData = await this.alhindAPI.flights(agent, flightDto);
        AlhindData.sort((a, b) => a.NetFare - b.NetFare);
        return AlhindData;
    }
    async airrevalidation(header, revalidationDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const System = revalidationDto.System;
        let RevalidationData;
        if (System === 'Sabre') {
            RevalidationData = await this.sabreService.revalidation(agent, revalidationDto);
        }
        else if (System === 'GroupFare') {
            RevalidationData = await this.groupFareService.findOne(agent, revalidationDto.OfferId);
        }
        else if (System === 'AlHind') {
            RevalidationData = await this.alhindAPI.priceCheck(agent, revalidationDto);
        }
        else {
            RevalidationData = 'Other System';
        }
        return RevalidationData;
    }
    async pricecheck(agentUId, revalidationDto) {
        const agentdata = await this.agentRepository.findOne({ where: { uid: agentUId } });
        if (!agentdata) {
            throw new common_1.NotFoundException("Agent data not found");
        }
        const System = revalidationDto.System;
        if (System == 'Sabre') {
            return await this.sabreService.price_check(agentdata, revalidationDto);
        }
        else {
            return 'Other System';
        }
    }
    async airbooking(header, bookingDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const System = bookingDto?.FlightInfo?.System;
        if (System === 'Sabre') {
            return await this.sabreService.booking(agent, bookingDto);
        }
        else if (System === 'GroupFare') {
            return await this.bookingService.group_booking(agent, bookingDto);
        }
        else if (System === 'AlHind') {
            return await this.bookingService.alhind_booking(agent, bookingDto);
        }
        else {
            return "Invalid System";
        }
    }
    async airimportpnr(header, system, pnr) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const bookingdata = await this.bookingRepository.findOne({ where: { pnr: pnr } });
        if (bookingdata) {
            throw new common_1.HttpException("Pnr Already Imported", axios_1.HttpStatusCode.Found);
        }
        let BookingResponse;
        if (system.toLowerCase() === 'sabre') {
            BookingResponse = await this.sabreService.import_pnr(pnr, agent);
        }
        else {
            BookingResponse = 'Other System';
        }
        return BookingResponse;
    }
    async aircancelagent(header, bookingUId) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (booking.status === 'Cancelled') {
            throw new common_1.HttpException("Already Cancelled", axios_1.HttpStatusCode.AlreadyReported);
        }
        else if (booking.status === 'Hold') {
            if (booking.system === 'Sabre') {
                const BookingResponse = await this.sabreService.aircancel(booking.pnr);
                if (BookingResponse.request.cancelAll === true) {
                    booking.status = 'Cancelled';
                    await this.bookingRepository.update(booking.id, booking);
                    return {
                        status: 'success',
                        message: 'Booking already cancelled',
                    };
                }
                else {
                    booking.status = 'Cancelled';
                    await this.bookingRepository.update(booking.id, booking);
                    return {
                        status: 'success',
                        message: 'Booking already cancelled',
                    };
                }
            }
            else if (booking.system === 'AlHind') {
                booking.status = 'Cancelled';
                const res = await this.bookingRepository.update(booking.id, booking);
                if (res.affected === 1) {
                    return {
                        status: 'success',
                        message: 'Booking already cancelled'
                    };
                }
                else {
                    return {
                        status: 'success',
                        message: 'Booking already cancelled'
                    };
                }
            }
            else if (booking.system === 'GroupFare') {
                throw new common_1.NotAcceptableException('No Permission for cancel');
            }
            else {
                throw new common_1.NotFoundException('Invalid System');
            }
        }
        else {
            throw new common_1.HttpException("Unknow error", axios_1.HttpStatusCode.BadRequest);
        }
    }
    async aircanceladmin(header, bookingUId) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (booking.status === 'Cancelled') {
            throw new common_1.HttpException("Already Cancelled", axios_1.HttpStatusCode.AlreadyReported);
        }
        else if (booking.status === 'Hold') {
            if (booking.system === 'Sabre') {
                const bookingResponse = await this.sabreService.aircancel(booking.pnr);
                if (bookingResponse.request.cancelAll === true) {
                    booking.status = 'Cancelled';
                    await this.bookingRepository.update(booking.id, booking);
                    return {
                        status: 'success',
                        message: 'Booking already cancelled',
                    };
                }
                else {
                    booking.status = 'Cancelled';
                    await this.bookingRepository.update(booking.id, booking);
                    return {
                        status: 'success',
                        message: 'Booking already cancelled',
                    };
                }
            }
            else if (booking.system === 'AlHind') {
                booking.status = 'Cancelled';
                const res = await this.bookingRepository.update(booking.id, booking);
                if (res.affected === 1) {
                    return {
                        status: 'success',
                        message: 'Booking already cancelled'
                    };
                }
                else {
                    return {
                        status: 'success',
                        message: 'Booking already cancelled'
                    };
                }
            }
            else if (booking.system === 'GroupFare') {
                throw new common_1.NotAcceptableException('No Permission for cancel');
            }
            else {
                throw new common_1.NotFoundException('Invalid System');
            }
        }
        else {
            throw new common_1.HttpException("Unknow error", axios_1.HttpStatusCode.BadRequest);
        }
    }
    async airretrieveagent(header, bookingUId) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.UnauthorizedException();
        }
        const passengerdata = await this.passengerRepository.find({ where: { bookingId: booking.bookingId } });
        if (booking.system === 'Sabre') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: ''
            };
            return customResponseData;
        }
        else if (booking.system === 'Portal') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: ''
            };
            return customResponseData;
        }
        else if (booking.system === 'AlHind') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: ''
            };
            return customResponseData;
        }
        else if (booking.system === 'GroupFare') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: [],
                reissuedata: [],
                ticketdetails: ticketdetails,
                partialpaymentdata: {}
            };
            return customResponseData;
        }
    }
    async airretrieveadmin(header, bookingUId) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.UnauthorizedException();
        }
        const passengerdata = await this.passengerRepository.find({ where: { bookingId: booking.bookingId } });
        if (booking.system === 'Sabre') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: ''
            };
            return customResponseData;
        }
        else if (booking.system === 'Portal') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: ''
            };
            return customResponseData;
        }
        else if (booking.system === 'AlHind') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: ''
            };
            return customResponseData;
        }
        else if (booking.system === 'GroupFare') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: [],
                reissuedata: [],
                ticketdetails: ticketdetails,
                partialpaymentdata: {}
            };
            return customResponseData;
        }
    }
    async aircheckpnr(header, system, pnr) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const bookingdata = await this.bookingRepository.findOne({ where: { pnr: pnr } });
        if (bookingdata) {
            throw new common_1.HttpException("Pnr Already Imported", axios_1.HttpStatusCode.Found);
        }
        if (system.toLowerCase() != 'sabre') {
            throw new common_1.NotFoundException("Invalid System");
        }
        return await this.sabreService.checkpnr(pnr);
        ;
    }
};
exports.FlightService = FlightService;
exports.FlightService = FlightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(passenger_model_1.PassengerModel)),
    __param(3, (0, typeorm_1.InjectRepository)(reissue_model_1.ReissueModel)),
    __param(4, (0, typeorm_1.InjectRepository)(refund_model_1.RefundModel)),
    __param(5, (0, typeorm_1.InjectRepository)(booking_model_1.TicketModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        sabre_flights_service_1.SabreService,
        booking_service_1.BookingService,
        groupfare_service_1.GroupfareService,
        alhind_flights_service_1.AlhindAPI])
], FlightService);
//# sourceMappingURL=flight.service.js.map