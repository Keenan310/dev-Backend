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
exports.BookingUtils = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("./booking.model");
const typeorm_2 = require("typeorm");
const activitylog_service_1 = require("../activitylog/activitylog.service");
dotenv.config();
let BookingUtils = class BookingUtils {
    constructor(bookingRepository, activityLogService) {
        this.bookingRepository = bookingRepository;
        this.activityLogService = activityLogService;
    }
    async bookingParser(agentdata, responseData, bookingDto, priceCheck) {
        const agentId = agentdata.agentId;
        const email = bookingDto.ContactInfo.email || "dev@flyjatt.com";
        const phone = bookingDto.ContactInfo.phone || "08801685370455";
        const name = bookingDto.PassengerInfo.adult[0].givenname + " " + bookingDto.PassengerInfo.adult[0].surname;
        const adult = (bookingDto.PassengerInfo.adult).length;
        const child = (bookingDto.PassengerInfo.child).length || 0;
        const infant = (bookingDto.PassengerInfo.infant).length || 0;
        const paxCount = adult + child + infant;
        const booking = await this.bookingRepository.find({ order: { id: 'DESC' }, take: 1 });
        let bookingId = 'POB1000';
        if (booking.length == 1) {
            let old_booking_id = (booking[0].bookingId).replace("POB", '');
            bookingId = "POB" + (parseInt(old_booking_id) + 1);
        }
        let PNR = responseData?.CreatePassengerNameRecordRS?.ItineraryRef?.ID || await this.generatePNR();
        let airlinesPnr = await this.generateAirlinesPNR();
        let system = responseData?.CreatePassengerNameRecordRS?.ItineraryRef?.ID
            ? priceCheck?.System : 'Portal';
        let totalsegments = 0;
        for (let sgFlight of priceCheck.AllLegsInfo) {
            for (let flight of sgFlight.Segments) {
                totalsegments++;
            }
        }
        const bookingData = {
            agentId: agentId,
            bookingId: bookingId,
            system: system,
            carrier_name: priceCheck.CarrierName,
            carrier_code: priceCheck.Carrier,
            depfrom: bookingDto.FlightInfo.AllLegsInfo[0].DepFrom,
            pnr: PNR,
            airlinespnr: airlinesPnr,
            refundable: priceCheck.Refundable,
            instant_payment: priceCheck.InstantPayment,
            issue_permit: priceCheck.IssuePermit,
            arrto: bookingDto.FlightInfo.AllLegsInfo[0].ArrTo,
            triptype: bookingDto.FlightInfo.TripType,
            netfare: bookingDto.FlightInfo.NetFare,
            grossfare: bookingDto.FlightInfo.GrossFare,
            comission: bookingDto.FlightInfo.Comission,
            status: "Hold",
            name: name,
            email: email,
            phone: phone,
            adultcount: adult,
            childcount: child,
            infantcount: infant,
            totalpax: paxCount,
            flightdata: null,
            totalsegment: totalsegments,
            itenary: bookingDto.FlightInfo,
            timelimit: priceCheck.TimeLimit || 'N/F',
            flightdate: priceCheck.AllLegsInfo[0].DepDate,
            companyname: agentdata.company
        };
        const activityLog = { agentId: agentId, status: 'Hold', platform: 'B2B',
            refId: bookingId, module: 'Booking', action_by: agentdata.name };
        await this.activityLogService.create(activityLog);
        return bookingData;
    }
    async generatePNR() {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomString = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
        return randomString;
    }
    async generateAirlinesPNR() {
        const charset = 'A0B1C2D3E4F5G6H7I8J9KLMNOPQRSTUVWXYZ';
        let randomString = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
        return randomString;
    }
};
exports.BookingUtils = BookingUtils;
exports.BookingUtils = BookingUtils = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        activitylog_service_1.ActivitylogService])
], BookingUtils);
//# sourceMappingURL=booking.utils.js.map