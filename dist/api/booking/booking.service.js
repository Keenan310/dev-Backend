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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const booking_model_1 = require("./booking.model");
const typeorm_1 = require("@nestjs/typeorm");
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const date_fns_2 = require("date-fns");
const passenger_service_1 = require("../passenger/passenger.service");
const mail_service_1 = require("../../mail/mail.service");
const groupfare_model_1 = require("../groupfare/groupfare.model");
const report_model_1 = require("../report/report.model");
const traveller_service_1 = require("../traveller/traveller.service");
const booking_utils_1 = require("./booking.utils");
let BookingService = class BookingService {
    constructor(bookingRepository, agentRepository, groupFareRepository, agentLedgerRepository, travellerService, passengerService, authService, mailService, bookingUtils) {
        this.bookingRepository = bookingRepository;
        this.agentRepository = agentRepository;
        this.groupFareRepository = groupFareRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.travellerService = travellerService;
        this.passengerService = passengerService;
        this.authService = authService;
        this.mailService = mailService;
        this.bookingUtils = bookingUtils;
    }
    async createBooking(agentdata, responseData, bookingDto, priceCheck) {
        if (responseData?.ApplicationResults) {
            const bookingId = '';
            await this.travellerService.createBookingPax(bookingDto?.PassengerInfo, agentdata?.agentId, bookingId);
            return {
                "status": "error",
                "error": responseData.ApplicationResults,
                "message": "Booking Failed",
            };
        }
        const bookingData = await this.bookingUtils.bookingParser(agentdata, responseData, bookingDto, priceCheck);
        const bookingResult = await this.bookingRepository.save(bookingData);
        await this.passengerService.createBookingPax(bookingDto?.PassengerInfo, agentdata?.agentId, bookingData?.bookingId);
        await this.mailService.bookingConfirmation(bookingResult);
        return bookingResult;
    }
    async group_booking(agentdata, bookingDto) {
        const agentId = agentdata.agentId;
        const email = bookingDto.ContactInfo.email || "dev@flyjatt.com";
        const phone = bookingDto.ContactInfo.phone || "08801685370455";
        const name = bookingDto.PassengerInfo.adult[0].givenname + " " + bookingDto.PassengerInfo.adult[0].surname;
        const adult = (bookingDto.PassengerInfo.adult).length;
        const child = (bookingDto.PassengerInfo.child).length || 0;
        const infant = (bookingDto.PassengerInfo.infant).length || 0;
        const paxCount = adult + child + infant;
        const booking = await this.bookingRepository.find({ order: { id: 'DESC' }, take: 1 });
        let bookingId = 'KTB1000';
        if (booking.length == 1) {
            let old_booking_id = (booking[0]?.bookingId).replace("KTB", '');
            bookingId = "KTB" + (parseInt(old_booking_id) + 1);
        }
        const groupData = await this.groupFareRepository.findOneBy({ uid: bookingDto?.FlightInfo?.OfferId });
        const agentLedger = await this.agentLedgerRepository
            .createQueryBuilder()
            .select('SUM(amount)', 'sum')
            .where('agentId = :agentId', { agentId: agentdata.agentId })
            .getRawOne();
        const agentLedgerValue = agentLedger.sum != null ? agentLedger.sum : 0;
        if (agentLedgerValue <= groupData.NetFare) {
            throw new common_1.NotAcceptableException("Insufficient Amount. Please Top Up");
        }
        else if (agentLedgerValue >= groupData.NetFare) {
            const details = groupData.Carrier + ' ' + groupData.DepFrom + '-' + groupData.ArrTo + ' Ticket Purchase ' + groupData.NetFare + '. PNR : ' + groupData.PNR + ' .';
            const generatedUUID = (0, uuid_1.v4)();
            const AgentLedgerData = {
                agentId: agentdata.agentId,
                trxtype: 'ticket',
                debit: -groupData.NetFare,
                refId: bookingId,
                details: details,
                compnayname: agentdata.company,
                uid: generatedUUID
            };
            await this.agentLedgerRepository.save(AgentLedgerData);
        }
        let Booking_PNR = groupData.PNR;
        const bookingData = {
            agentId: agentId,
            bookingId: bookingId,
            system: bookingDto.FlightInfo.System,
            carrier_name: bookingDto.FlightInfo.CarrierName,
            carrier_code: bookingDto.FlightInfo.Carrier,
            depfrom: bookingDto.FlightInfo.AllLegsInfo[0].DepFrom,
            pnr: Booking_PNR,
            refundable: bookingDto.FlightInfo.Refundable,
            arrto: bookingDto.FlightInfo.AllLegsInfo[0].ArrTo,
            triptype: bookingDto.FlightInfo.TripType,
            netfare: groupData.NetFare,
            grossfare: groupData.NetFare,
            status: "Issue In Process",
            name: name,
            email: email,
            phone: phone,
            adultcount: adult,
            childcount: child,
            infantcount: infant,
            totalpax: paxCount,
            flightdata: null,
            itenary: bookingDto,
            totalsegment: groupData.segment,
            timelimit: bookingDto.FlightInfo.TimeLimit || 'N/F',
            flightdate: bookingDto.FlightInfo.AllLegsInfo[0].DepDate,
            companyname: agentdata.company
        };
        const bookingResult = await this.bookingRepository.save(bookingData);
        const passengerData = bookingDto.PassengerInfo;
        await this.passengerService.createBookingPax(passengerData, agentId, bookingId);
        await this.mailService.bookingConfirmation(bookingResult);
        return bookingResult;
    }
    async alhind_booking(agentdata, bookingDto) {
        const agentId = agentdata.agentId;
        const email = bookingDto.ContactInfo.email || "dev@flyjatt.com";
        const phone = bookingDto.ContactInfo.phone || "08801685370455";
        const name = bookingDto.PassengerInfo.adult[0].givenname + " " + bookingDto.PassengerInfo.adult[0].surname;
        const adult = (bookingDto.PassengerInfo.adult).length;
        const child = (bookingDto.PassengerInfo.child).length || 0;
        const infant = (bookingDto.PassengerInfo.infant).length || 0;
        const paxCount = adult + child + infant;
        const booking = await this.bookingRepository.find({ order: { id: 'DESC' }, take: 1 });
        let bookingId = 'KTB1000';
        if (booking.length == 1) {
            let old_booking_id = (booking[0]?.bookingId).replace("KTB", '');
            bookingId = "KTB" + (parseInt(old_booking_id) + 1);
        }
        let Booking_PNR = await this.bookingUtils.generatePNR();
        let airlinesPnr = await this.bookingUtils.generateAirlinesPNR();
        const bookingData = {
            agentId: agentId,
            bookingId: bookingId,
            system: bookingDto.FlightInfo.System,
            carrier_name: bookingDto.FlightInfo.CarrierName,
            carrier_code: bookingDto.FlightInfo.Carrier,
            depfrom: bookingDto.FlightInfo.AllLegsInfo[0].DepFrom,
            pnr: Booking_PNR,
            refundable: bookingDto.FlightInfo.Refundable,
            arrto: bookingDto.FlightInfo.AllLegsInfo[0].ArrTo,
            triptype: bookingDto.FlightInfo.TripType,
            netfare: bookingDto.FlightInfo.NetFare,
            grossfare: bookingDto.FlightInfo.NetFare,
            status: "Hold",
            name: name,
            email: email,
            phone: phone,
            adultcount: adult,
            childcount: child,
            infantcount: infant,
            totalpax: paxCount,
            flightdata: null,
            itenary: bookingDto,
            totalsegment: 0,
            timelimit: bookingDto.FlightInfo.TimeLimit || 'N/F',
            flightdate: bookingDto.FlightInfo.AllLegsInfo[0].DepDate,
            companyname: agentdata.company
        };
        const bookingResult = await this.bookingRepository.save(bookingData);
        const passengerData = bookingDto.PassengerInfo;
        await this.passengerService.createBookingPax(passengerData, agentId, bookingId);
        await this.mailService.bookingConfirmation(bookingResult);
        return bookingResult;
    }
    async findAllAdmin(header, page, status, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.bookingRepository.createQueryBuilder("booking");
        queryBuilder.select([
            'booking.system',
            'booking.bookingId',
            'booking.status',
            'booking.name',
            'booking.totalpax',
            'booking.triptype',
            'booking.netfare',
            'booking.grossfare',
            'booking.flightdate',
            'booking.pnr',
            'booking.depfrom',
            'booking.companyname',
            'booking.arrto',
            'booking.carrier_name',
            'booking.created_at',
            'booking.uid',
        ]);
        if (status?.includes('Void') || status?.includes('Refund') || status?.includes('Reissue')) {
            queryBuilder = queryBuilder.where("booking.status LIKE :status", { status: `%${status}%` });
        }
        else if (status?.length > 1 && (!status?.includes('Void') || !status?.includes('Refund') || !status?.includes('Reissue'))) {
            queryBuilder = queryBuilder.where("booking.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(booking.bookingId LIKE :filter OR booking.companyname LIKE :filter OR booking.name LIKE :filter OR booking.pnr LIKE :filter)", { filter: `%${filter}%` });
        }
        const totaldata = await queryBuilder.getCount();
        const bookings = await queryBuilder
            .orderBy("booking.id", "DESC")
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
    async findAllAgent(header, page, status, filter, limit) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.bookingRepository.createQueryBuilder("booking");
        queryBuilder.select([
            'booking.bookingId',
            'booking.system',
            'booking.status',
            'booking.name',
            'booking.totalpax',
            'booking.triptype',
            'booking.netfare',
            'booking.grossfare',
            'booking.flightdate',
            'booking.pnr',
            'booking.payment_status',
            'booking.depfrom',
            'booking.arrto',
            'booking.carrier_name',
            'booking.created_at',
            'booking.uid',
        ]);
        if (status?.includes('Void') || status?.includes('Refund') || status?.includes('Reissue')) {
            queryBuilder = queryBuilder.where("booking.status LIKE :status", { status: `%${status}%` });
        }
        else if (status?.length > 1 && (!status?.includes('Void') || !status?.includes('Refund') || !status?.includes('Reissue'))) {
            queryBuilder = queryBuilder.where("booking.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(booking.bookingId LIKE :filter OR booking.pnr LIKE :filter)", { filter: `%${filter}%` });
        }
        const agentId = agent.agentId;
        queryBuilder.andWhere("booking.agentId = :agentId", { agentId });
        const totaldata = await queryBuilder.getCount();
        const bookings = await queryBuilder
            .orderBy("booking.id", "DESC")
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
    async findAllAgentByAdmin(header, agentUId, page, status, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOneBy({ uid: agentUId });
        if (!agent) {
            throw new common_1.NotFoundException('Agent Not Found');
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.bookingRepository.createQueryBuilder("booking");
        queryBuilder.select([
            'booking.bookingId',
            'booking.system',
            'booking.status',
            'booking.name',
            'booking.totalpax',
            'booking.triptype',
            'booking.netfare',
            'booking.grossfare',
            'booking.flightdate',
            'booking.payment_status',
            'booking.pnr',
            'booking.depfrom',
            'booking.arrto',
            'booking.carrier_name',
            'booking.created_at',
            'booking.uid',
        ]);
        if (status?.includes('Void') || status?.includes('Refund') || status?.includes('Reissue')) {
            queryBuilder = queryBuilder.where("booking.status LIKE :status", { status: `%${status}%` });
        }
        else if (status?.length > 1 && (!status?.includes('Void') || !status?.includes('Refund') || !status?.includes('Reissue'))) {
            queryBuilder = queryBuilder.where("booking.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(booking.bookingId LIKE :filter OR booking.pnr LIKE :filter)", { filter: `%${filter}%` });
        }
        const agentId = agent.agentId;
        queryBuilder.andWhere("booking.agentId = :agentId", { agentId });
        const totaldata = await queryBuilder.getCount();
        const bookings = await queryBuilder
            .orderBy("booking.id", "DESC")
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
    async findPastFlightAgentId(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const currentDate = new Date();
        const formattedDate = (0, date_fns_1.format)(currentDate, 'yyyy-MM-dd');
        const rawQuery = `SELECT * FROM bookings WHERE agentId='${agent.agentId}' AND status='Ticketed' AND flightdate <= '${formattedDate}'`;
        const bookings = await this.bookingRepository.query(rawQuery);
        return bookings;
    }
    async findUpcomingFlightAgentId(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const currentDate = new Date();
        const bookings = await this.bookingRepository.createQueryBuilder("booking")
            .where("booking.agentId = :agentId", { agentId: agent.agentId })
            .andWhere("booking.status = :status", { status: 'Ticketed' })
            .andWhere("booking.flightdate > :currentDate", { currentDate: currentDate })
            .getMany();
        return bookings;
    }
    async findCalendareAgentId(header, yearMonth) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const currentDate = new Date(yearMonth);
        const startDate = (0, date_fns_2.startOfMonth)(currentDate);
        const endDate = (0, date_fns_2.endOfMonth)(currentDate);
        const allDates = (0, date_fns_2.eachDayOfInterval)({ start: startDate, end: endDate });
        const currentPeriod = [];
        allDates.forEach((date) => {
            currentPeriod.push((0, date_fns_1.format)(date, 'yyyy-MM-dd'));
        });
        const currentMonthData = [];
        for (const date of currentPeriod) {
            const bookingData = await this.bookingRepository.query("SELECT * FROM `bookings` WHERE agentId = ? AND status = 'Ticketed' AND flightdate LIKE ?", [agent.agentId, `%${date}%`]);
            const singleData = {
                date,
                count: bookingData.length,
                data: bookingData
            };
            currentMonthData.push(singleData);
        }
        return currentMonthData;
    }
    async findOneByAdmin(header, bookingUId) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException('Id not found');
        }
        return booking;
    }
    async findOneAgent(header, bookingUId) {
        const verifyAgentId = await this.authService.verifyAgentToken(header);
        if (!verifyAgentId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException('Id not found');
        }
        return booking;
    }
    async update(header, bookingUId, updateBookingDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        if (!booking) {
            throw new common_1.NotFoundException('UId not found');
        }
        return await this.bookingRepository.update(booking.id, updateBookingDto);
    }
    async remove(header, bookingUId) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const booking = await this.bookingRepository.findOne({
            where: { uid: bookingUId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('UId not found');
        }
        return await this.bookingRepository.delete(booking.id);
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(groupfare_model_1.GroupFareModel)),
    __param(3, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        traveller_service_1.TravellerService,
        passenger_service_1.PassengerService,
        auth_service_1.AuthService,
        mail_service_1.MailService,
        booking_utils_1.BookingUtils])
], BookingService);
//# sourceMappingURL=booking.service.js.map