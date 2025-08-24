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
exports.GroupfareService = void 0;
const common_1 = require("@nestjs/common");
const groupfare_model_1 = require("./groupfare.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const airlines_service_1 = require("../airlines/airlines.service");
const airports_service_1 = require("../airports/airports.service");
const currency_entity_1 = require("../currency/entities/currency.entity");
let GroupfareService = class GroupfareService {
    constructor(groupFareRepository, currencyConverterRepository, authService, airlinesService, airportsService) {
        this.groupFareRepository = groupFareRepository;
        this.currencyConverterRepository = currencyConverterRepository;
        this.authService = authService;
        this.airlinesService = airlinesService;
        this.airportsService = airportsService;
    }
    async create(header, data) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const groupfare = await this.groupFareRepository.find({ order: { id: 'DESC' }, take: 1 });
        let groupId;
        if (groupfare.length == 1) {
            let old_group_id = (groupfare[0].GroupId).replace("KTG", '');
            groupId = "KTG" + (parseInt(old_group_id) + 1);
        }
        else {
            groupId = 'KTG1000';
        }
        if (data.length === 1) {
            const createGroupfareDto = data?.[0];
            createGroupfareDto['GroupId'] = groupId;
            createGroupfareDto['TripType'] = 'O';
            createGroupfareDto['RouteFrom'] = createGroupfareDto.DepFrom;
            createGroupfareDto['RouteTo'] = createGroupfareDto.ArrTo;
            return this.groupFareRepository.save(createGroupfareDto);
        }
        else if (data?.length === 2) {
            const createGroupfareDto = data?.[0];
            createGroupfareDto['GroupId'] = groupId;
            createGroupfareDto['TripType'] = 'R';
            createGroupfareDto['RouteFrom'] = createGroupfareDto.DepFrom;
            createGroupfareDto['RouteTo'] = createGroupfareDto.ArrTo;
            createGroupfareDto['rSegment'] = data?.[1].segment;
            createGroupfareDto['rDate'] = data?.[1].DepDate;
            createGroupfareDto['rDepFrom'] = data?.[1].DepartureFrom;
            createGroupfareDto['rArrTo'] = data?.[1].ArrivalTo;
            createGroupfareDto['rDepTime'] = data?.[1].DepTime;
            createGroupfareDto['rArrTime'] = data?.[1].ArrTime;
            createGroupfareDto['rFlightNo'] = data?.[1].FlightNumber;
            createGroupfareDto['rDepFrom1'] = data?.[1].DepartureFrom1;
            createGroupfareDto['rArrTo1'] = data?.[1].ArrivalTo;
            createGroupfareDto['rDepTime1'] = data?.[1].DepTime1;
            createGroupfareDto['rArrTime1'] = data?.[1].ArrTime1;
            createGroupfareDto['rFlightNo1'] = data?.[1].FlightNumber1;
            return this.groupFareRepository.save(createGroupfareDto);
        }
        else {
        }
    }
    async findAllAdmin(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const groupdata = await this.groupFareRepository.find();
        let agent;
        if (groupdata.length > 0) {
            const flightParserPromises = groupdata.map(group => this.flightParser(agent, group));
            return await Promise.all(flightParserPromises);
        }
        else {
            return [];
        }
    }
    async findAllAgent(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const groupdata = await this.groupFareRepository.find();
        if (groupdata?.length > 0) {
            const flightParserPromises = groupdata.map(group => this.flightParser(agent, group));
            return await Promise.all(flightParserPromises);
        }
        else {
            return groupdata;
        }
    }
    async findOne(agent, uid) {
        const data = await this.groupFareRepository.findOne({ where: { uid: uid } });
        return this.flightParser(agent, data);
    }
    async findOneAdmin(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.groupFareRepository.findOneBy({ uid: uid });
    }
    async remove(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const groupfaredata = await this.groupFareRepository.findOne({ where: { uid: uid } });
        if (!groupfaredata) {
            throw new common_1.NotFoundException();
        }
        return this.groupFareRepository.delete(groupfaredata.id);
    }
    async flightParser(agent, resultData) {
        let Leg = resultData;
        const conversionData = await this.currencyConverterRepository.findOne({ where: { alternate: agent?.currency } });
        const converstionrate = conversionData?.exchange_rate || 1;
        const NetFareConv = Leg.NetFare * converstionrate;
        const PriceBreakdown = [
            {
                "PaxType": "ADT",
                "BaseFare": Leg.NetFare * converstionrate,
                "Taxes": 0,
                "TotalFare": Leg.NetFare * converstionrate,
                "PaxCount": 1,
                "Bag": [
                    {
                        "Airline": Leg.Carrier,
                        "Allowance": Leg.Baggage
                    }
                ]
            }
        ];
        if (resultData?.TripType === 'O') {
            let Segments = [];
            if (Leg?.segment === 1) {
                Segments = [
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrier": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "OperatingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.DepartureFrom,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.DepartureFrom),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.DepTime,
                        "ArrTo": Leg.ArrivalTo,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.ArrivalTo),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.ArrivalTo),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.ArrTime,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": Leg.Duration,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    }
                ];
            }
            else if ((Leg?.segment === 2)) {
                Segments = [
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrier": Leg.Carrier,
                        "OperatingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.DepartureFrom,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.DepartureFrom),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.DepTime,
                        "ArrTo": Leg.ArrivalTo,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.ArrivalTo),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.ArrivalTo),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.ArrTime,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": Leg.Duration,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    },
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber1,
                        "OperatingCarrier": Leg.Carrier,
                        "OperatingFlightNumber": Leg.FlightNumber1,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.DepartureFrom1,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.DepartureFrom1),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom1),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.DepTime1,
                        "ArrTo": Leg.ArrivalTo1,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.ArrivalTo1),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.ArrivalTo1),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.ArrTime1,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": Leg.Duration1,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    }
                ];
            }
            const AllLegs = [
                {
                    "DepDate": Leg.DepDate,
                    "DepFrom": Leg.DepFrom,
                    "ArrTo": Leg.ArrTo,
                    "Duration": 0,
                    "Segments": Segments
                }
            ];
            const Basic = {
                "OfferId": Leg.uid,
                "System": "GroupFare",
                "TripType": "Oneway",
                "Carrier": Leg.Carrier,
                "CarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                "Cabinclass": 'Economy',
                "BaseFare": NetFareConv,
                "Taxes": 0,
                "NetFare": NetFareConv,
                "GrossFare": NetFareConv,
                "Comission": 0,
                "Currency": agent?.currency || 'INR',
                "TimeLimit": '',
                "Refundable": false,
                "PriceBreakDown": PriceBreakdown,
                "AllLegsInfo": AllLegs
            };
            return Basic;
        }
        else if (resultData?.TripType === 'R') {
            let Segments = [];
            let Segments1 = [];
            if (Leg?.segment === 1) {
                Segments = [
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrier": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "OperatingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.DepartureFrom,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.DepartureFrom),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.DepTime,
                        "ArrTo": Leg.ArrivalTo,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.ArrivalTo),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.ArrivalTo),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.ArrTime,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": 0,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    }
                ];
                Segments1 = [
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber1,
                        "OperatingCarrier": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "OperatingFlightNumber": Leg.FlightNumber1,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.rDepFrom,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.rDepFrom),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.rDepFrom),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.rDepTime,
                        "ArrTo": Leg.rArrTo,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.rArrTo),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.rArrTo),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.rArrTime,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": 0,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    }
                ];
            }
            else if ((Leg?.segment === 2)) {
                Segments = [
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrier": Leg.Carrier,
                        "OperatingFlightNumber": Leg.FlightNumber,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.DepartureFrom,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.DepartureFrom),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.DepTime,
                        "ArrTo": Leg.ArrivalTo,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.ArrivalTo),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.ArrivalTo),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.ArrTime,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": 0,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    },
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.FlightNumber1,
                        "OperatingCarrier": Leg.Carrier,
                        "OperatingFlightNumber": Leg.FlightNumber1,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.DepartureFrom1,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.DepartureFrom1),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom1),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.DepTime1,
                        "ArrTo": Leg.ArrivalTo1,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.ArrivalTo1),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.ArrivalTo1),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.ArrTime1,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": 0,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    }
                ];
                Segments1 = [
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.rFlightNo,
                        "OperatingCarrier": Leg.Carrier,
                        "OperatingFlightNumber": Leg.rFlightNo,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.rDepFrom,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.rDepFrom),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.DepartureFrom),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.rDepTime,
                        "ArrTo": Leg.rArrTo,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.rArrTo),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.rArrTo),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.rArrTime,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": 0,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    },
                    {
                        "MarketingCarrier": Leg.Carrier,
                        "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "MarketingFlightNumber": Leg.rFlightNo1,
                        "OperatingCarrier": Leg.Carrier,
                        "OperatingFlightNumber": Leg.rFlightNo1,
                        "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "DepFrom": Leg.rDepFrom1,
                        "DepAirPort": await this.airportsService.getAirportName(Leg.rDepFrom1),
                        "DepLocation": await this.airportsService.getAirportLocation(Leg.rDepFrom1),
                        "DepDateAdjustment": 0,
                        "DepTime": Leg.rDepTime1,
                        "ArrTo": Leg.rArrTo1,
                        "ArrAirPort": await this.airportsService.getAirportName(Leg.rArrTo1),
                        "ArrLocation": await this.airportsService.getAirportLocation(Leg.rArrTo1),
                        "ArrDateAdjustment": 0,
                        "ArrTime": Leg.rArrTime1,
                        "OperatedBy": await this.airlinesService.getAirlinesName(Leg.Carrier),
                        "StopCount": 0,
                        "Duration": 0,
                        "SegmentCode": {
                            "bookingCode": "X",
                            "cabinCode": Leg.cabinCode,
                            "mealCode": Leg.mealCode,
                            "seatsAvailable": Leg.seatsAvailable
                        }
                    }
                ];
            }
            const AllLegs = [
                {
                    "DepDate": Leg.DepDate,
                    "DepFrom": Leg.RouteFrom,
                    "ArrTo": Leg.RouteTo,
                    "Duration": 0,
                    "Segments": Segments
                },
                {
                    "DepDate": Leg.rDepDate,
                    "DepFrom": Leg.RouteTo,
                    "ArrTo": Leg.RouteFrom,
                    "Duration": 0,
                    "Segments": Segments1
                }
            ];
            const Basic = {
                "OfferId": Leg.uid,
                "System": "GroupFare",
                "TripType": "Oneway",
                "Carrier": Leg.Carrier,
                "CarrierName": await this.airlinesService.getAirlinesName(Leg.Carrier),
                "Cabinclass": 'Economy',
                "BaseFare": NetFareConv,
                "Taxes": 0,
                "NetFare": NetFareConv,
                "GrossFare": NetFareConv,
                "Comission": 0,
                "Currency": agent?.currency || 'AED',
                "TimeLimit": '',
                "Refundable": false,
                "PriceBreakDown": PriceBreakdown,
                "AllLegsInfo": AllLegs
            };
            return Basic;
        }
        else {
            return [];
        }
    }
};
exports.GroupfareService = GroupfareService;
exports.GroupfareService = GroupfareService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(groupfare_model_1.GroupFareModel)),
    __param(1, (0, typeorm_1.InjectRepository)(currency_entity_1.CurrencyConverter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], GroupfareService);
//# sourceMappingURL=groupfare.service.js.map