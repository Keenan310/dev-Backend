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
const airlines_service_1 = require("../airlines/airlines.service");
const airports_service_1 = require("../airports/airports.service");
const airports_data_1 = require("./data/airports.data");
const airlines_data_1 = require("./data/airlines.data");
const currency_entity_1 = require("../currency/entities/currency.entity");
dotenv.config();
let AlhindAPI = class AlhindAPI {
    constructor(currencyConverterRepository, airlinesService, airportsService) {
        this.currencyConverterRepository = currencyConverterRepository;
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
                "UserId": "AEAUH001035200",
                "Password": "Keenan@12345",
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
                    "UserId": "AEAUH001035200",
                    "Password": "Keenan@12345",
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
            'Content-Type': 'application/json',
        };
        try {
            const response = await axios_1.default.post(`https://b2b.keenantravel.com/search.php`, data, { headers });
            const result = response?.data;
            return this.flightUtils(result, agent, flightDto);
        }
        catch (err) {
            console.log(err.response.data);
            return [];
        }
    }
    async sflightUtils(result, agentdata, flighDto) {
        if (result?.Journy?.FlightOptions?.length > 0) {
            const DepPlace = flighDto.segments[0].depfrom;
            const ArrPlace = flighDto.segments[0].arrto;
            const DepCounty = await this.airportsService.getCountry(DepPlace);
            const ArrCounty = await this.airportsService.getCountry(ArrPlace);
            let farepolicy;
            if (DepCounty === 'AE' && ArrCounty === 'AE') {
                farepolicy = 'domestic';
            }
            else if (DepCounty != 'AE' && ArrCounty != 'AE') {
                farepolicy = 'soto';
            }
            else if (DepCounty != 'AE' && ArrCounty === 'AE') {
                farepolicy = 'soti';
            }
            else if (DepCounty === 'AE' && ArrCounty !== 'AE') {
                farepolicy = 'sito';
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
            const AllFareWithPrice = [];
            for (const mflights of AllFlights) {
                for (const flight of mflights?.FlightFares ?? []) {
                    const copy = { ...mflights, PriceBreakDown: flight };
                    delete copy.FlightFares;
                    AllFareWithPrice.push(copy);
                }
            }
            const conversionData = await this.currencyConverterRepository.findOne({
                where: { alternate: agentdata.currency }
            });
            const converstionrate = conversionData?.exchange_rate || 1;
            for (const flights of AllFareWithPrice) {
                const ValidatingCarrier = flights?.TicketingCarrier;
                const airlineData = await this.airlinesService.getAirlines(ValidatingCarrier);
                const AllPassenger = flights.PriceBreakDown?.Fares;
                const CarrierName = airlineData?.marketing_name || 'N/F';
                const equivalentAmount = Math.ceil(flights.PriceBreakDown?.AprxTotalBaseFare * converstionrate * 100) / 100;
                const Taxes = Math.ceil(flights.PriceBreakDown?.AprxTotalTax * converstionrate * 100) / 100;
                let TotalFare = Math.ceil(flights.PriceBreakDown?.TotalAmount * converstionrate * 100) / 100;
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
                const currency = agentdata?.currency;
                let agentMarkUpAmount = 0;
                if (agentMarkUpType === 'percent') {
                    agentMarkUpAmount = equivalentAmount * (agentMarkUp / 100);
                }
                else if ((agentMarkUpType === 'amount')) {
                    agentMarkUpAmount = agentMarkUp;
                }
                const NetFare = Math.ceil((equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes) * 100) / 100;
                if (NetFare > TotalFare) {
                    TotalFare = NetFare;
                }
                const Refundable = flights.PriceBreakDown?.RefundableInfo;
                let TimeLimit = '';
                let cabinclass = 'Y';
                let Class = flights?.PriceBreakDown?.FareName;
                const PriceBreakDown = AllPassenger?.map(allPassenger => {
                    const BaggageAllowance = flights?.FlightLegs[0]?.FreeBaggages;
                    const fidToSearch = flights.PriceBreakDown?.FID;
                    const bagAllowance = BaggageAllowance.find(baggage => baggage.FID === fidToSearch);
                    const PaxType = allPassenger?.PTC === 'CHD' ? 'CNN' : allPassenger?.PTC;
                    let paxCount;
                    let Baggage;
                    if (PaxType === 'ADT') {
                        paxCount = flighDto.adultcount;
                        if (flighDto.segments.length === 1) {
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Adt_Baggage || '',
                                }
                            ];
                        }
                        else if (flighDto.segments.length === 2) {
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Adt_Baggage || '',
                                },
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Adt_Baggage || '',
                                }
                            ];
                        }
                    }
                    else if (PaxType === 'CHD' || PaxType === 'CNN') {
                        paxCount = flighDto.childcount;
                        if (flighDto.segments.length === 1) {
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Chd_Baggage || '',
                                }
                            ];
                        }
                        else if (flighDto.segments.length === 2) {
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Chd_Baggage || '',
                                },
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Chd_Baggage || '',
                                }
                            ];
                        }
                    }
                    else if (PaxType === 'INF') {
                        paxCount = flighDto.childcount;
                        if (flighDto.segments.length === 1) {
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Inf_Baggage || '',
                                }
                            ];
                        }
                        else if (flighDto.segments.length === 2) {
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Inf_Baggage || '',
                                },
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Inf_Baggage || '',
                                }
                            ];
                        }
                    }
                    const totalTaxAmount = Math.ceil(allPassenger?.Tax * converstionrate * 100) / 100;
                    const PaxequivalentAmount = Math.ceil(allPassenger?.BaseFare * converstionrate * 100) / 100;
                    const PaxtotalFare = Math.ceil((PaxequivalentAmount + totalTaxAmount) * 100) / 100;
                    return {
                        PaxType: PaxType,
                        BaseFare: PaxequivalentAmount,
                        Taxes: totalTaxAmount,
                        TotalFare: PaxtotalFare,
                        PaxCount: paxCount,
                        Bag: Baggage,
                        FareComponent: {}
                    };
                });
                const AllSegmentInfo = [];
                const AllLegsData = flights?.FlightLegs;
                let i = 0;
                for (const segment of AllLegsData) {
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
                        ArrLocation: (await this.getAirports(segment?.Destination))?.location,
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
                        SegmentCode: {
                            "bookingCode": segment.RBD,
                            "cabinCode": cabinclass,
                            "mealCode": segment.MealKey,
                            "seatsAvailable": 9
                        },
                    };
                    AllSegmentInfo.push(SingleSegments);
                }
                const LegDuration = '';
                const departureDate = flighDto.segments[0].depdate;
                const AllLegsInfo = [
                    {
                        DepDate: departureDate,
                        DepFrom: flighDto.segments[0].depfrom,
                        ArrTo: flighDto.segments[0].arrto,
                        Duration: LegDuration,
                        Segments: AllSegmentInfo
                    }
                ];
                FlightItenary.push({
                    System: "AlHind",
                    TripType: TripType,
                    Carrier: ValidatingCarrier,
                    CarrierName: CarrierName,
                    Cabinclass: Class,
                    Currency: currency,
                    BaseFare: equivalentAmount,
                    Taxes: Taxes,
                    NetFare: NetFare,
                    GrossFare: TotalFare,
                    Comission: ComissionPolicy,
                    TimeLimit: TimeLimit,
                    Refundable: Refundable,
                    PriceBreakDown: PriceBreakDown,
                    AllLegsInfo: AllLegsInfo
                });
            }
            return FlightItenary;
        }
        else {
            return [];
        }
    }
    async flightUtils(result, agentdata, flighDto) {
        if (!(result?.Journy?.FlightOptions?.length > 0)) {
            return [];
        }
        const DepPlace = flighDto.segments[0].depfrom;
        const ArrPlace = flighDto.segments[0].arrto;
        const [DepCounty, ArrCounty] = await Promise.all([
            this.airportsService.getCountry(DepPlace),
            this.airportsService.getCountry(ArrPlace)
        ]);
        const farepolicy = DepCounty === 'AE' && ArrCounty === 'AE' ? 'domestic' :
            DepCounty !== 'AE' && ArrCounty !== 'AE' ? 'soto' :
                DepCounty !== 'AE' && ArrCounty === 'AE' ? 'soti' :
                    'sito';
        const TripType = flighDto?.segments?.length === 1 ? 'Oneway' : 'Return';
        const AllFlights = result?.Journy?.FlightOptions || [];
        const AllFareWithPrice = AllFlights.flatMap(mflights => (mflights?.FlightFares ?? []).map(flight => {
            const copy = { ...mflights, PriceBreakDown: flight };
            delete copy.FlightFares;
            return copy;
        }));
        const conversionData = await this.currencyConverterRepository.findOne({ where: { alternate: agentdata.currency } });
        const conversionRate = conversionData?.exchange_rate || 1;
        const airportCache = new Map();
        const airlineCache = new Map();
        const getAirport = async (code) => {
            if (!airportCache.has(code)) {
                airportCache.set(code, await this.getAirports(code));
            }
            return airportCache.get(code);
        };
        const getAirline = async (code) => {
            if (!airlineCache.has(code)) {
                airlineCache.set(code, await this.airlinesService.getAirlines(code));
            }
            return airlineCache.get(code);
        };
        const FlightItenary = await Promise.all(AllFareWithPrice.map(async (flights) => {
            const availableSeat = flights?.AvailableSeat || 9;
            const airlineData = await getAirline(flights?.TicketingCarrier);
            const CarrierName = airlineData?.marketing_name || 'N/F';
            const { AprxTotalBaseFare, AprxTotalTax, TotalAmount, Fares, RefundableInfo, FareName, FID } = flights.PriceBreakDown;
            const isRefundable = RefundableInfo != null && RefundableInfo === "Refundable";
            const equivalentAmount = Math.ceil(AprxTotalBaseFare * conversionRate * 100) / 100;
            const Taxes = Math.ceil(AprxTotalTax * conversionRate * 100) / 100;
            let TotalFare = Math.ceil(TotalAmount * conversionRate * 100) / 100;
            const adminMarkUpAmount = agentdata?.markuptype === 'percent'
                ? equivalentAmount * (agentdata.markup / 100)
                : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;
            const ComissionPolicy = airlineData?.[farepolicy] ?? 0;
            const airlinesMarkUpAmount = equivalentAmount * (ComissionPolicy / 100);
            const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
                ? equivalentAmount * (agentdata.clientmarkup / 100)
                : agentdata?.clientmarkuptype === 'amount'
                    ? agentdata.clientmarkup
                    : 0;
            const addAmount = airlineData?.addAmount || 0;
            const NetFare = Math.ceil((equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes) * 100) / 100;
            if (NetFare > TotalFare)
                TotalFare = NetFare;
            const BaggageAllowance = flights?.FlightLegs[0]?.FreeBaggages ?? [];
            const bagAllowance = BaggageAllowance.find(baggage => baggage.FID === FID);
            const PriceBreakDown = Fares.map(pax => {
                const PaxType = pax?.PTC === 'CHD' ? 'CNN' : pax?.PTC;
                const paxCount = PaxType === 'ADT' ? flighDto.adultcount :
                    PaxType === 'CHD' || PaxType === 'CNN' ? flighDto.childcount :
                        flighDto.infantcount || 0;
                const bagType = PaxType === 'ADT' ? 'Adt_Baggage' :
                    PaxType === 'CHD' || PaxType === 'CNN' ? 'Chd_Baggage' : 'Inf_Baggage';
                const baggage = Array(flighDto.segments.length).fill({
                    Airline: flights?.TicketingCarrier,
                    Allowance: bagAllowance?.[bagType] || ''
                });
                const totalTaxAmount = Math.ceil(pax?.Tax * conversionRate * 100) / 100;
                const PaxequivalentAmount = Math.ceil(pax?.BaseFare * conversionRate * 100) / 100;
                const PaxtotalFare = Math.ceil((PaxequivalentAmount + totalTaxAmount) * 100) / 100;
                return {
                    PaxType,
                    BaseFare: PaxequivalentAmount,
                    Taxes: totalTaxAmount,
                    TotalFare: PaxtotalFare,
                    PaxCount: paxCount,
                    Bag: baggage,
                    FareComponent: {}
                };
            });
            const onwardSegments = flights?.FlightLegs?.filter(seg => seg.Type === '0') ?? [];
            const returnSegments = flights?.FlightLegs?.filter(seg => seg.Type === '1') ?? [];
            const mapSegments = async (segments) => {
                return Promise.all(segments.map(async (segment) => {
                    const depAirport = await getAirport(segment?.Origin);
                    const arrAirport = await getAirport(segment?.Destination);
                    return {
                        MarketingCarrier: segment?.AirlineCode,
                        MarketingCarrierName: (await getAirline(segment?.AirlineCode))?.marketing_name,
                        MarketingFlightNumber: segment?.FlightNo,
                        OperatingCarrier: segment?.AirlineCode,
                        OperatingFlightNumber: segment?.FlightNo,
                        OperatingCarrierName: (await getAirline(segment?.AirlineCode))?.marketing_name,
                        DepFrom: segment?.Origin,
                        DepAirPort: depAirport?.name,
                        DepLocation: depAirport?.location,
                        DepDateAdjustment: '',
                        DepTime: segment?.DepartureTime,
                        ArrTo: segment?.Destination,
                        ArrAirPort: arrAirport?.name,
                        ArrLocation: arrAirport?.location,
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
                        SegmentCode: {
                            bookingCode: segment.RBD,
                            cabinCode: 'Y',
                            mealCode: segment.MealKey,
                            seatsAvailable: availableSeat
                        }
                    };
                }));
            };
            const AllLegsInfo = [];
            if (onwardSegments.length > 0) {
                AllLegsInfo.push({
                    DepDate: flighDto.segments[0].depdate,
                    DepFrom: onwardSegments[0]?.Origin,
                    ArrTo: onwardSegments[onwardSegments.length - 1]?.Destination,
                    Duration: '',
                    Segments: await mapSegments(onwardSegments)
                });
            }
            if (returnSegments.length > 0) {
                AllLegsInfo.push({
                    DepDate: flighDto.segments[flighDto.segments.length - 1]?.depdate,
                    DepFrom: returnSegments[0]?.Origin,
                    ArrTo: returnSegments[returnSegments.length - 1]?.Destination,
                    Duration: '',
                    Segments: await mapSegments(returnSegments)
                });
            }
            return {
                System: "AlHind",
                TripType,
                Carrier: flights?.TicketingCarrier,
                CarrierName,
                Cabinclass: FareName,
                Currency: agentdata?.currency,
                BaseFare: equivalentAmount,
                Taxes,
                NetFare,
                GrossFare: TotalFare,
                Comission: ComissionPolicy,
                TimeLimit: '',
                Refundable: isRefundable,
                PriceBreakDown,
                AllLegsInfo
            };
        }));
        return FlightItenary;
    }
    async priceCheck(agent, revalidation) {
        return revalidation;
    }
    async getAirports(code) {
        const foundItem = airports_data_1.airportsData.find(item => item.code === code);
        if (foundItem) {
            return foundItem;
        }
        else {
            return { code: '', name: '', location: '' };
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
    __param(0, (0, typeorm_1.InjectRepository)(currency_entity_1.CurrencyConverter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], AlhindAPI);
//# sourceMappingURL=alhind.flights.service.js.map