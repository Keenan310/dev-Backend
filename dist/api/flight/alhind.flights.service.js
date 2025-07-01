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
exports.AlhindAPI = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("axios");
const dotenv = require("dotenv");
const typeorm_2 = require("typeorm");
const passenger_service_1 = require("../passenger/passenger.service");
const booking_model_1 = require("../booking/booking.model");
const booking_service_1 = require("../booking/booking.service");
const searchhistory_service_1 = require("../searchhistory/searchhistory.service");
const airlines_service_1 = require("../airlines/airlines.service");
const airports_service_1 = require("../airports/airports.service");
const airports_data_1 = require("./data/airports.data");
const airlines_data_1 = require("./data/airlines.data");
dotenv.config();
let AlhindAPI = class AlhindAPI {
    constructor(bookingRepository, passengerService, bookingService, searchHistoryService, airlinesService, airportsService) {
        this.bookingRepository = bookingRepository;
        this.passengerService = passengerService;
        this.bookingService = bookingService;
        this.searchHistoryService = searchHistoryService;
        this.airlinesService = airlinesService;
        this.airportsService = airportsService;
    }
    async flights(agent, flightDto) {
        const totalSegment = flightDto?.segments;
        let data;
        if (totalSegment.length < 2 && totalSegment[0]?.arrto) {
            data = {
                "Origin": totalSegment[0].depfrom,
                "Destination": totalSegment[0].arrto,
                "OnwardDate": totalSegment[0].depdate,
                "ReturnDate": totalSegment[0].depdate,
                "Adult": flightDto.adultcount,
                "Child": flightDto.childcount,
                "Infant": flightDto.infantcount,
                "TripMode": "O",
                "TravelType": "I",
                "AirlineClass": null,
                "UserId": "AEDXB029001500",
                "Password": "APIuser@1234",
                "Error": null,
                "IncludeAirline": null,
                "ExcludeAirline": null,
                "Status": null,
                "DestinationNation": "AE",
                "OriginNation": "AE",
                "Classes": "Economy"
            };
        }
        else if (totalSegment.length > 1 && totalSegment[0]?.arrto === totalSegment[1]?.depfrom) {
            if (totalSegment[0]?.arrto) {
                data = {
                    "Origin": totalSegment[0].depfrom,
                    "Destination": totalSegment[0].arrto,
                    "OnwardDate": totalSegment[0].depdate,
                    "ReturnDate": totalSegment[1].depdate,
                    "Adult": flightDto.adultcount,
                    "Child": flightDto.childcount,
                    "Infant": flightDto.infantcount,
                    "TripMode": "R",
                    "TravelType": "I",
                    "AirlineClass": null,
                    "UserId": "AEDXB029001500",
                    "Password": "APIuser@1234",
                    "Error": null,
                    "IncludeAirline": null,
                    "ExcludeAirline": null,
                    "Status": null,
                    "DestinationNation": "AE",
                    "OriginNation": "AE",
                    "Classes": "Economy"
                };
            }
        }
        else {
            return [];
        }
        const headers = {
            Accept: '/',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        try {
            const response = await axios_1.default.post(process.env.AH_ENDPOINT_SEARCH, data, { headers });
            const result = response?.data;
            return this.flightUtils(result, agent, flightDto);
        }
        catch (err) {
            console.log(err);
            return err.data;
        }
    }
    async flightUtils(result, agentdata, flighDto) {
        if (result?.Journy?.FlightOptions?.length > 0) {
            const DepPlace = flighDto.segments[0].depfrom;
            const ArrPlace = flighDto.segments[0].arrto;
            const DepCounty = await this.airportsService.getCountry(DepPlace);
            const ArrCounty = await this.airportsService.getCountry(ArrPlace);
            let farepolicy;
            let partialoption;
            if (DepCounty === 'AE' && ArrCounty === 'AE') {
                farepolicy = 'domestic';
                partialoption = false;
            }
            else if (DepCounty != 'AE' && ArrCounty != 'AE') {
                farepolicy = 'soto';
                partialoption = false;
            }
            else if (DepCounty != 'AE' && ArrCounty === 'AE') {
                farepolicy = 'soti';
                partialoption = true;
            }
            else if (DepCounty === 'AE' && ArrCounty != 'AE') {
                farepolicy = 'sito';
                partialoption = true;
            }
            const FlightItenary = [];
            const AllFlights = result?.Journy?.FlightOptions;
            let TripType;
            if (flighDto?.segments?.length === 1) {
                TripType = 'Oneway';
            }
            else if (flighDto?.segments?.length > 1) {
                TripType = 'Return';
            }
            for (const flights of AllFlights) {
                const ValidatingCarrier = flights?.TicketingCarrier;
                const airlineData = await this.airlinesService.getAirlines(ValidatingCarrier);
                const FareType = flights?.ProviderCode;
                const AllPassenger = [];
                const CarrierName = airlineData?.marketing_name || 'N/F';
                const Instant_Payment = false;
                const IssuePermit = false;
                const IsBookable = true;
                const equivalentAmount = 0;
                const Taxes = 0;
                let TotalFare = 0;
                const adminMarkUpType = agentdata?.markuptype;
                const adminMarkUp = agentdata?.markup;
                let adminMarkUpAmount = 0;
                if (adminMarkUpType === 'percent') {
                    adminMarkUpAmount = equivalentAmount * (adminMarkUp / 100);
                }
                else if ((adminMarkUpType === 'amount')) {
                    adminMarkUpAmount = adminMarkUp;
                }
                const addAmount = airlineData?.addAmount;
                let ComissionPolicy = 0;
                if (farepolicy === 'soti') {
                    ComissionPolicy = airlineData?.soti;
                }
                else if (farepolicy === 'soto') {
                    ComissionPolicy = airlineData?.soto;
                }
                else if (farepolicy === 'sito') {
                    ComissionPolicy = airlineData?.sito;
                }
                else if (farepolicy === 'domestic') {
                    ComissionPolicy = airlineData?.domestic;
                }
                const airlinesMarkUpAmount = equivalentAmount * (ComissionPolicy / 100);
                const agentMarkUpType = agentdata?.clientmarkuptype;
                const agentMarkUp = agentdata?.clientmarkup;
                let agentMarkUpAmount = 0;
                if (agentMarkUpType === 'percent') {
                    agentMarkUpAmount = equivalentAmount * (agentMarkUp / 100);
                }
                else if ((agentMarkUpType === 'amount')) {
                    agentMarkUpAmount = agentMarkUp;
                }
                const NetFare = equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes;
                if (NetFare > TotalFare) {
                    TotalFare = NetFare;
                }
                const PartialAmount = NetFare * 0.30;
                const Refundable = true;
                let TimeLimit = '';
                let cabinclass = 'Y';
                let Class;
                switch (cabinclass) {
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
                const AllLegsInfo = [];
                const AllLegsData = flights?.FlightLegs;
                let i = 0;
                for (const segment of AllLegsData) {
                    i++;
                    const LegDuration = '';
                    const departureDate = flights[i - 1]?.depdate;
                    const legInfo = {
                        DepDate: '',
                        DepFrom: '',
                        ArrTo: '',
                        Duration: LegDuration
                    };
                    const SingleSegments = {
                        MarketingCarrier: segment?.AirlineCode,
                        MarketingCarrierName: await this.getAirlineName(segment?.AirlineCode),
                        MarketingFlightNumber: segment?.FlightNo,
                        OperatingCarrier: segment?.AirlineCode,
                        OperatingFlightNumber: segment?.FlightNo,
                        OperatingCarrierName: await this.getAirlineName(segment?.AirlineCode),
                        DepFrom: segment?.Origin,
                        DepAirPort: (await this.getAirports(segment?.Origin))?.name,
                        DepLocation: (await this.getAirports(segment?.Origin))?.location,
                        DepDateAdjustment: '',
                        DepTime: segment?.DepartureTime,
                        ArrTo: segment?.Destination,
                        ArrAirPort: (await this.getAirports(segment?.Destination)).name,
                        ArrLocation: (await this.getAirports(segment?.Destination)).location,
                        ArrDateAdjustment: '',
                        ArrTime: segment?.ArrivalTime,
                        OperatedBy: segment?.CodeShare,
                        StopCount: '',
                        Duration: '',
                        AircraftTypeName: 'N/A',
                        DepartureGate: segment?.DepartureTerminal || 'TBA',
                        ArrivalGate: segment?.ArrivalTerminal || 'TBA',
                        HiddenStops: segment?.hiddenStops || [],
                        TotalMilesFlown: segment?.Distance || 0,
                        SegmentCode: ''
                    };
                    AllLegsInfo.push(SingleSegments);
                }
                FlightItenary.push({
                    System: "AlHind",
                    FarePolicy: farepolicy,
                    InstantPayment: Instant_Payment,
                    IssuePermit: IssuePermit,
                    IsBookable: IsBookable,
                    TripType: TripType,
                    FareType: FareType,
                    Carrier: ValidatingCarrier,
                    CarrierName: CarrierName,
                    Cabinclass: Class,
                    BaseFare: equivalentAmount,
                    Taxes: Taxes,
                    NetFare: NetFare,
                    GrossFare: TotalFare,
                    PartialOption: partialoption,
                    PartialFare: PartialAmount,
                    Comission: ComissionPolicy,
                    TimeLimit: TimeLimit,
                    Refundable: Refundable,
                    PriceBreakDown: [],
                    AllLegsInfo: AllLegsInfo
                });
            }
            return FlightItenary;
        }
        else {
            return [];
        }
    }
    async getAirports(code) {
        const foundItem = airports_data_1.airportsData.find(item => item.code === code);
        if (foundItem) {
            return foundItem;
        }
        else {
            return { code: '', name: '', location };
        }
    }
    async getAirlineName(code) {
        const foundItem = airlines_data_1.airlinesData.find(item => item.iata === code);
        if (foundItem) {
            return foundItem.marketing_name;
        }
        else {
            return 'N/F';
        }
    }
};
exports.AlhindAPI = AlhindAPI;
exports.AlhindAPI = AlhindAPI = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        passenger_service_1.PassengerService,
        booking_service_1.BookingService,
        searchhistory_service_1.SearchhistoryService,
        airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], AlhindAPI);
//# sourceMappingURL=alhind.flights.service.js.map