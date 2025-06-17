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
const partialpayment_entity_1 = require("../partialpayment/entities/partialpayment.entity");
const auth_service_1 = require("../auth/auth.service");
const searchhistory_model_1 = require("../searchhistory/searchhistory.model");
let FlightService = class FlightService {
    constructor(bookingRepository, partialPaymentRepository, agentRepository, passengerRepository, reissueRepository, refundRepository, ticketingRepository, searchHistoryRepository, authService, sabreService, bookingService, groupFareService) {
        this.bookingRepository = bookingRepository;
        this.partialPaymentRepository = partialPaymentRepository;
        this.agentRepository = agentRepository;
        this.passengerRepository = passengerRepository;
        this.reissueRepository = reissueRepository;
        this.refundRepository = refundRepository;
        this.ticketingRepository = ticketingRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.authService = authService;
        this.sabreService = sabreService;
        this.bookingService = bookingService;
        this.groupFareService = groupFareService;
    }
    async airsearch(header, flightDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const search = await this.searchHistoryRepository
            .createQueryBuilder('search')
            .where(`DATE(created_at) = CURDATE()`)
            .andWhere('search.agentId = :agentId', { agentId: agent.agentId })
            .getCount();
        if (search > agent.searchlimit) {
            throw new common_1.NotFoundException(" Daily Search Limit Exceed");
        }
        else {
            const Sabre_FlightData = await this.sabreService.shopping(agent, flightDto);
            let Groupdata = [];
            if (flightDto.segments.length === 1 && flightDto.adultcount === 1) {
                Groupdata = await this.groupFareService.findBySearchFlight(flightDto);
            }
            const combinedArray = Sabre_FlightData.concat(Groupdata);
            combinedArray.sort((a, b) => a.NetFare - b.NetFare);
            return combinedArray;
        }
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
            RevalidationData = await this.groupFareService.findOne(revalidationDto.OfferId);
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
    async airseatmapagent(header, seatMapDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        let SeatMapData;
        if (seatMapDto?.System === 'Sabre') {
            SeatMapData = await this.sabreService.seat_map(seatMapDto);
        }
        else if (seatMapDto?.System === 'GroupFare') {
            SeatMapData = await this.sabreService.seat_map(seatMapDto);
        }
        else if (seatMapDto?.System === 'Portal') {
            SeatMapData = await this.sabreService.seat_map(seatMapDto);
        }
        return SeatMapData;
    }
    async airseatmapadmin(header, seatMapDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        if (seatMapDto.System == 'Sabre') {
            return await this.sabreService.seat_map(seatMapDto);
        }
        else if (seatMapDto.System == 'Portal') {
            return await this.sabreService.seat_map(seatMapDto);
        }
        else if (seatMapDto.System == 'GroupFare') {
            return await this.sabreService.seat_map(seatMapDto);
        }
        else {
            return [];
        }
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
            else if (booking.system === 'Portal') {
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
            else if (booking.system === 'Portal') {
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
        const partialpaymentdata = await this.partialPaymentRepository.findOne({ where: { uid: bookingUId } });
        let booking;
        if (partialpaymentdata) {
            booking = await this.bookingRepository.findOne({ where: { bookingId: partialpaymentdata.bookingId } });
        }
        else if (!partialpaymentdata) {
            booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        }
        else if (!booking) {
            throw new common_1.HttpException("BookingUId not found", axios_1.HttpStatusCode.NotFound);
        }
        const passengerdata = await this.passengerRepository.find({ where: { bookingId: booking.bookingId } });
        if (booking.system === 'Sabre') {
            let bookingresponse = await this.sabreService.airretrieve(booking.pnr);
            if (booking.flightdata === null && booking.status === 'Hold') {
                booking['flightdata'] = bookingresponse.flights;
                booking['airlinespnr'] = bookingresponse?.flights[0]?.confirmationId;
                await this.bookingRepository.update(booking.id, booking);
            }
            else if (bookingresponse?.isTicketed === true && booking.status === 'Hold') {
                booking['status'] = 'Ticketed';
                booking['airlinespnr'] = bookingresponse?.flights[0]?.confirmationId;
                booking['ticketed_at'] = new Date();
                await this.bookingRepository.update(booking.id, booking);
            }
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const pp = await this.partialPaymentRepository.findOne({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: bookingresponse,
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: partialpaymentdata || pp
            };
            return customResponseData;
        }
        else if (booking.system === 'Portal') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: booking.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: booking.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: booking.bookingId } });
            const pp = await this.partialPaymentRepository.findOne({ where: { bookingId: booking.bookingId } });
            const customResponseData = {
                bookingdata: booking,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: partialpaymentdata || pp
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
        const partialpaymentdata = await this.partialPaymentRepository.findOne({ where: { uid: bookingUId } });
        let bookingdata;
        if (partialpaymentdata) {
            bookingdata = await this.bookingRepository.findOne({ where: { bookingId: partialpaymentdata.bookingId } });
        }
        else if (!partialpaymentdata) {
            bookingdata = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        }
        else if (!bookingdata) {
            throw new common_1.HttpException("BookingUId not found", axios_1.HttpStatusCode.NotFound);
        }
        const pp = await this.partialPaymentRepository.findOne({ where: { bookingId: bookingdata.bookingId } });
        const passengerdata = await this.passengerRepository.find({ where: { bookingId: bookingdata.bookingId } });
        if (bookingdata.system === 'Sabre') {
            let bookingresponse = await this.sabreService.airretrieve(bookingdata.pnr);
            if (bookingdata.flightdata === null && bookingdata.status === 'Hold') {
                bookingdata['flightdata'] = bookingresponse.flights;
                await this.bookingRepository.update(bookingdata.id, bookingdata);
            }
            else if (bookingresponse?.isTicketed === true && bookingdata.status === 'Hold') {
                bookingdata['status'] = 'Ticketed';
                await this.bookingRepository.update(bookingdata.id, bookingdata);
            }
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: bookingdata.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: bookingdata.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: bookingdata.bookingId } });
            const customResponseData = {
                bookingdata: bookingdata,
                sabredata: bookingresponse,
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: partialpaymentdata || pp
            };
            return customResponseData;
        }
        else if (bookingdata.system === 'Portal') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: bookingdata.bookingId } });
            const refunddata = await this.refundRepository.findOne({ where: { bookingId: bookingdata.bookingId } });
            const reissuedata = await this.reissueRepository.find({ where: { bookingId: bookingdata.bookingId } });
            const customResponseData = {
                bookingdata: bookingdata,
                sabredata: [],
                passengerdata: passengerdata,
                refunddata: refunddata,
                reissuedata: reissuedata,
                ticketdetails: ticketdetails,
                partialpaymentdata: partialpaymentdata || pp
            };
            return customResponseData;
        }
        else if (bookingdata.system === 'GroupFare') {
            const ticketdetails = await this.ticketingRepository.find({ where: { bookingId: bookingdata.bookingId } });
            const customResponseData = {
                bookingdata: bookingdata,
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
    async airfarerulesagent(header, farerulesDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        if (farerulesDto.System === 'Sabre') {
            return await this.sabreService.airfarerules(farerulesDto);
        }
        else if (farerulesDto.System === 'Portal') {
            return await this.sabreService.airfarerules(farerulesDto);
        }
        else {
            throw new common_1.HttpException("System not found", axios_1.HttpStatusCode.NotFound);
        }
    }
    async airfarerulesadmin(header, farerulesDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        if (farerulesDto.System === 'Sabre') {
            return await this.sabreService.airfarerules(farerulesDto);
        }
        else if (farerulesDto.System === 'Portal') {
            return await this.sabreService.airfarerules(farerulesDto);
        }
        else {
            throw new common_1.HttpException("System not found", axios_1.HttpStatusCode.NotFound);
        }
    }
};
exports.FlightService = FlightService;
exports.FlightService = FlightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(1, (0, typeorm_1.InjectRepository)(partialpayment_entity_1.PartialPaymentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(3, (0, typeorm_1.InjectRepository)(passenger_model_1.PassengerModel)),
    __param(4, (0, typeorm_1.InjectRepository)(reissue_model_1.ReissueModel)),
    __param(5, (0, typeorm_1.InjectRepository)(refund_model_1.RefundModel)),
    __param(6, (0, typeorm_1.InjectRepository)(booking_model_1.TicketModel)),
    __param(7, (0, typeorm_1.InjectRepository)(searchhistory_model_1.SearchHistoryModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        sabre_flights_service_1.SabreService,
        booking_service_1.BookingService,
        groupfare_service_1.GroupfareService])
], FlightService);
//# sourceMappingURL=flight.service.js.map