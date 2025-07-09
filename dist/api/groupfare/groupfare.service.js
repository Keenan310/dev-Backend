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
const agent_model_1 = require("../agent/agent.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const airlines_service_1 = require("../airlines/airlines.service");
const airports_service_1 = require("../airports/airports.service");
let GroupfareService = class GroupfareService {
    constructor(groupFareRepository, agentRepository, authService, airlinesService, airportsService) {
        this.groupFareRepository = groupFareRepository;
        this.agentRepository = agentRepository;
        this.authService = authService;
        this.airlinesService = airlinesService;
        this.airportsService = airportsService;
    }
    async create(header, createGroupfareDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const groupfare = await this.groupFareRepository.find({
            order: { id: 'DESC' }, take: 1,
        });
        let groupId;
        if (groupfare.length == 1) {
            let old_group_id = (groupfare[0].GroupId).replace("KTG", '');
            groupId = "KTG" + (parseInt(old_group_id) + 1);
        }
        else {
            groupId = 'POG1000';
        }
        createGroupfareDto['GroupId'] = groupId;
        return this.groupFareRepository.save(createGroupfareDto);
    }
    async findAllAdmin(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const groupdata = await this.groupFareRepository.find();
        if (groupdata.length > 0) {
            const flightParserPromises = groupdata.map(group => this.flightParser(group));
            return await Promise.all(flightParserPromises);
        }
        else {
            return groupdata;
        }
    }
    async findAllAgent(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const groupdata = await this.groupFareRepository.find();
        if (groupdata.length > 0) {
            const flightParserPromises = groupdata.map(group => this.flightParser(group));
            return await Promise.all(flightParserPromises);
        }
        else {
            return groupdata;
        }
    }
    async findBySearchFlight(flightDto) {
        const groupdata = await this.groupFareRepository.find({ where: {
                DepFrom: flightDto.segments[0].depfrom,
                ArrTo: flightDto.segments[0].arrto,
                DepDate: flightDto.segments[0].depdate + '',
            } });
        const flightParserPromises = groupdata.map(group => this.flightParser(group));
        const AllGrouFare = await Promise.all(flightParserPromises);
        return AllGrouFare;
    }
    async findBySearch(header, searchGF) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const groupdata = await this.groupFareRepository.find({ where: {
                DepFrom: searchGF.depfrom,
                ArrTo: searchGF.arrto,
                DepDate: searchGF.depdate
            }
        });
        const flightParserPromises = groupdata.map(group => this.flightParser(group));
        const AllGrouFare = await Promise.all(flightParserPromises);
        return AllGrouFare;
    }
    async findOne(uid) {
        const data = await this.groupFareRepository.findOne({ where: { uid: uid } });
        return this.flightParser(data);
    }
    async findOneAdmin(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.groupFareRepository.findOneBy({ uid: uid });
    }
    async update(header, uid, updateGroupfareDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const groupfaredata = await this.groupFareRepository.findOneBy({ uid: uid });
        if (!groupfaredata) {
            throw new common_1.NotFoundException();
        }
        return this.groupFareRepository.update(groupfaredata.id, updateGroupfareDto);
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
    async flightParser(resultData) {
        let Segments = [];
        let Duration = 0;
        if (resultData.segment === 1) {
            Segments = [
                {
                    "MarketingCarrier": resultData.Carrier,
                    "MarketingCarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "MarketingFlightNumber": resultData.FlightNumber,
                    "OperatingCarrier": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "OperatingFlightNumber": resultData.FlightNumber,
                    "OperatingCarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "DepFrom": resultData.DepartureFrom,
                    "DepAirPort": await this.airportsService.getAirportName(resultData.DepartureFrom),
                    "DepLocation": await this.airportsService.getAirportLocation(resultData.DepartureFrom),
                    "DepDateAdjustment": 0,
                    "DepTime": resultData.DepTime,
                    "ArrTo": resultData.ArrivalTo,
                    "ArrAirPort": await this.airportsService.getAirportName(resultData.ArrivalTo),
                    "ArrLocation": await this.airportsService.getAirportLocation(resultData.ArrivalTo),
                    "ArrDateAdjustment": 0,
                    "ArrTime": resultData.ArrTime,
                    "OperatedBy": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "StopCount": 0,
                    "Duration": resultData.Duration,
                    "SegmentCode": {
                        "bookingCode": "X",
                        "cabinCode": resultData.cabinCode,
                        "mealCode": resultData.mealCode,
                        "seatsAvailable": resultData.seatsAvailable
                    }
                }
            ];
            Duration = resultData.Duration;
        }
        else if ((resultData.segment === 2)) {
            Segments = [
                {
                    "MarketingCarrier": resultData.Carrier,
                    "MarketingCarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "MarketingFlightNumber": resultData.FlightNumber,
                    "OperatingCarrier": resultData.Carrier,
                    "OperatingFlightNumber": resultData.FlightNumber,
                    "OperatingCarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "DepFrom": resultData.DepartureFrom,
                    "DepAirPort": await this.airportsService.getAirportName(resultData.DepartureFrom),
                    "DepLocation": await this.airportsService.getAirportLocation(resultData.DepartureFrom),
                    "DepDateAdjustment": 0,
                    "DepTime": resultData.DepTime,
                    "ArrTo": resultData.ArrivalTo,
                    "ArrAirPort": await this.airportsService.getAirportName(resultData.ArrivalTo),
                    "ArrLocation": await this.airportsService.getAirportLocation(resultData.ArrivalTo),
                    "ArrDateAdjustment": 0,
                    "ArrTime": resultData.ArrTime,
                    "OperatedBy": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "StopCount": 0,
                    "Duration": resultData.Duration,
                    "SegmentCode": {
                        "bookingCode": "X",
                        "cabinCode": resultData.cabinCode,
                        "mealCode": resultData.mealCode,
                        "seatsAvailable": resultData.seatsAvailable
                    }
                },
                {
                    "MarketingCarrier": resultData.Carrier,
                    "MarketingCarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "MarketingFlightNumber": resultData.FlightNumber1,
                    "OperatingCarrier": resultData.Carrier,
                    "OperatingFlightNumber": resultData.FlightNumber1,
                    "OperatingCarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "DepFrom": resultData.DepartureFrom1,
                    "DepAirPort": await this.airportsService.getAirportName(resultData.DepartureFrom1),
                    "DepLocation": await this.airportsService.getAirportLocation(resultData.DepartureFrom1),
                    "DepDateAdjustment": 0,
                    "DepTime": resultData.DepTime1,
                    "ArrTo": resultData.ArrivalTo1,
                    "ArrAirPort": await this.airportsService.getAirportName(resultData.ArrivalTo1),
                    "ArrLocation": await this.airportsService.getAirportLocation(resultData.ArrivalTo1),
                    "ArrDateAdjustment": 0,
                    "ArrTime": resultData.ArrTime1,
                    "OperatedBy": await this.airlinesService.getAirlinesName(resultData.Carrier),
                    "StopCount": 0,
                    "Duration": resultData.Duration1,
                    "SegmentCode": {
                        "bookingCode": "X",
                        "cabinCode": resultData.cabinCode,
                        "mealCode": resultData.mealCode,
                        "seatsAvailable": resultData.seatsAvailable
                    }
                }
            ];
            Duration = resultData.Duration + resultData.Duration1;
        }
        const AllLegs = [
            {
                "DepDate": resultData.DepDate,
                "DepFrom": resultData.DepFrom,
                "ArrTo": resultData.ArrTo,
                "Duration": Duration,
                "Transit": resultData.Transit,
                "Segments": Segments
            }
        ];
        const PriceBreakdown = [
            {
                "PaxType": "ADT",
                "BaseFare": resultData.BaseFare,
                "Taxes": resultData.Taxes,
                "TotalFare": resultData.NetFare,
                "PaxCount": 1,
                "Bag": [
                    {
                        "Airline": resultData.Carrier,
                        "Allowance": resultData.Baggage
                    }
                ]
            }
        ];
        let Class;
        switch (resultData.Cabinclass) {
            case 'P':
                Class = "First";
                break;
            case 'J':
                Class = "Premium Business";
                break;
            case 'C':
                Class = "Business";
                break;
            case 'S':
                Class = "Premium Economy";
                break;
            case 'Y':
                Class = "Economy";
                break;
        }
        const Basic = {
            "OfferId": resultData.uid,
            "System": "GroupFare",
            "FarePolicy": "sito",
            "InstantPayment": true,
            "IssuePermit": "manual",
            "TripType": "Oneway",
            "FareType": "Special",
            "Carrier": resultData.Carrier,
            "CarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
            "Cabinclass": Class,
            "BaseFare": resultData.BaseFare,
            "Taxes": resultData.Taxes,
            "NetFare": resultData.NetFare,
            "GrossFare": resultData.NetFare,
            "Comission": 0,
            "TimeLimit": '',
            "Refundable": false,
            "PriceBreakDown": PriceBreakdown,
            "AllLegsInfo": AllLegs
        };
        return Basic;
    }
};
exports.GroupfareService = GroupfareService;
exports.GroupfareService = GroupfareService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(groupfare_model_1.GroupFareModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], GroupfareService);
//# sourceMappingURL=groupfare.service.js.map