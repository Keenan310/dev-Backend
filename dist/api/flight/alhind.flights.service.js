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
const save_flight_entity_1 = require("./entity/save-flight.entity");
const airlines_model_1 = require("../airlines/airlines.model");
dotenv.config();
let AlhindAPI = class AlhindAPI {
    constructor(currencyConverterRepository, airlineDiscountRepository, airlineDiscountForAgentRepository, saveFlightsData, airlinesService, airportsService) {
        this.currencyConverterRepository = currencyConverterRepository;
        this.airlineDiscountRepository = airlineDiscountRepository;
        this.airlineDiscountForAgentRepository = airlineDiscountForAgentRepository;
        this.saveFlightsData = saveFlightsData;
        this.airlinesService = airlinesService;
        this.airportsService = airportsService;
    }
    async flights(agent, flightDto) {
        const segments = flightDto?.segments ?? [];
        const firstSegment = segments[0];
        if (!firstSegment?.arrto)
            return [];
        const data = {
            "Origin": firstSegment.depfrom,
            "Destination": firstSegment.arrto,
            "OnwardDate": firstSegment.depdate,
            "ReturnDate": firstSegment.depdate,
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
        if (segments.length > 1) {
            if (firstSegment.arrto !== segments[1]?.depfrom)
                return [];
            data.TripMode = "R";
            data.ReturnDate = segments[1].depdate;
        }
        const headers = {
            Accept: '/',
            'Content-Type': 'application/json',
        };
        try {
            const response = await axios_1.default.post(`https://b2b.keenantravel.com/search.php`, data, { headers });
            const result = response?.data;
            return this.flightsUtilsUpdate(result, agent, flightDto);
        }
        catch (err) {
            console.log(err?.response?.data);
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
        this.saveFlightsData.save({
            token: result?.Token || '',
            triptype: TripType,
            data: AllFareWithPrice || [],
        });
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
            const Token = result?.Token || '';
            const Key = flights?.Key;
            const availableSeat = flights?.AvailableSeat || 9;
            const airlineData = await getAirline(flights?.TicketingCarrier);
            const CarrierName = airlineData?.marketing_name || 'N/F';
            const ProviderCode = flights?.ProviderCode || 'NF';
            const { AprxTotalBaseFare, AprxTotalTax, TotalAmount, Fares, RefundableInfo, FareName, FID } = flights?.PriceBreakDown;
            const isRefundable = RefundableInfo != null && RefundableInfo === "Refundable";
            const equivalentAmount = (AprxTotalBaseFare * conversionRate);
            const Taxes = (AprxTotalTax * conversionRate);
            let TotalFare = (TotalAmount * conversionRate);
            const adminMarkUpAmount = agentdata?.markuptype === 'percent'
                ? equivalentAmount * (agentdata.markup / 100)
                : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;
            const ComissionPolicy = airlineData?.[farepolicy] ?? 0;
            const airlinesMarkUpAmount = equivalentAmount * (ComissionPolicy / 100);
            const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
                ? equivalentAmount * (agentdata.clientmarkup / 100)
                : agentdata?.clientmarkuptype === 'amount' ? agentdata.clientmarkup : 0;
            const addAmount = airlineData?.addAmount || 0;
            const NetFare = equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes;
            if (NetFare > TotalFare)
                TotalFare = NetFare;
            const Fees = agentMarkUpAmount;
            const legs = flights?.FlightLegs ?? [];
            const firstLegBaggage = legs[0]?.FreeBaggages ?? [];
            const firstLegBagAllowance = firstLegBaggage.find(b => b.FID === FID);
            const lastLegBaggage = legs.length > 1 ? legs[legs.length - 1]?.FreeBaggages ?? [] : [];
            const lastLegBagAllowance = lastLegBaggage.find(b => b.FID === FID);
            const PriceBreakDown = Fares.map((pax) => {
                const PaxType = pax?.PTC === 'CHD' ? 'CNN' : pax?.PTC;
                const paxCount = PaxType === 'ADT'
                    ? flighDto.adultcount
                    : PaxType === 'CHD' || PaxType === 'CNN'
                        ? flighDto.childcount
                        : flighDto.infantcount || 0;
                const bagType = PaxType === 'ADT'
                    ? 'Adt_Baggage'
                    : PaxType === 'CHD' || PaxType === 'CNN'
                        ? 'Chd_Baggage'
                        : 'Inf_Baggage';
                const baggageInfo = [
                    {
                        Airline: flights?.TicketingCarrier,
                        Allowance: firstLegBagAllowance?.[bagType] || '',
                    },
                ];
                if (legs.length > 1) {
                    baggageInfo.push({
                        Airline: flights?.TicketingCarrier,
                        Allowance: lastLegBagAllowance?.[bagType] || '',
                    });
                }
                const totalTaxAmount = Math.ceil(pax?.Tax * conversionRate * 100) / 100;
                const PaxequivalentAmount = Math.ceil(pax?.BaseFare * conversionRate * 100) / 100;
                const PaxtotalFare = Math.ceil((PaxequivalentAmount + totalTaxAmount) * 100) / 100;
                return {
                    PaxType,
                    BaseFare: PaxequivalentAmount,
                    Taxes: totalTaxAmount,
                    TotalFare: PaxtotalFare,
                    PaxCount: paxCount,
                    Bag: baggageInfo,
                    FareComponent: {}
                };
            });
            const onwardSegments = legs.filter(seg => seg.Type === '0');
            const returnSegments = legs.filter(seg => seg.Type === '1');
            const mapSegments = async (segments) => {
                return Promise.all(segments.map(async (segment) => {
                    const depAirport = await getAirport(segment?.Origin);
                    const arrAirport = await getAirport(segment?.Destination);
                    const airlineInfo = await getAirline(segment?.AirlineCode);
                    return {
                        MarketingCarrier: segment?.AirlineCode,
                        MarketingCarrierName: airlineInfo?.marketing_name,
                        MarketingFlightNumber: segment?.FlightNo,
                        OperatingCarrier: segment?.AirlineCode,
                        OperatingFlightNumber: segment?.FlightNo,
                        OperatingCarrierName: airlineInfo?.marketing_name,
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
                            bookingCode: segment?.RBD || 'Y',
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
                Token,
                Key,
                System: "AlHind",
                ProviderCode,
                TripType,
                Carrier: flights?.TicketingCarrier,
                CarrierName,
                Cabinclass: FareName,
                Currency: agentdata?.currency,
                BaseFare: equivalentAmount,
                Taxes,
                NetFare,
                GrossFare: TotalFare,
                Fees,
                Comission: ComissionPolicy,
                TimeLimit: '',
                Refundable: isRefundable,
                PriceBreakDown,
                AllLegsInfo
            };
        }));
        return FlightItenary;
    }
    async flightsUtilsUpdate(result, agentdata, flightDto) {
        const today = new Date();
        if (!(result?.Journy?.FlightOptions?.length > 0))
            return [];
        const segments = flightDto?.segments ?? [];
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];
        const TripType = segments.length === 1 ? 'Oneway' : 'Return';
        const AllFlights = result?.Journy?.FlightOptions || [];
        const AllFareWithPrice = AllFlights.flatMap(mflights => (mflights?.FlightFares ?? []).map(flight => {
            const copy = { ...mflights, PriceBreakDown: flight };
            delete copy.FlightFares;
            return copy;
        }));
        await this.saveFlightsData.save({
            token: result?.Token || '',
            triptype: TripType,
            data: AllFareWithPrice || [],
        });
        const airportCache = new Map();
        const airlineCache = new Map();
        const getAirport = async (code) => {
            if (!airportCache.has(code))
                airportCache.set(code, await this.getAirports(code));
            return airportCache.get(code);
        };
        const getAirline = async (code) => {
            if (!airlineCache.has(code))
                airlineCache.set(code, await this.airlinesService.getAirlines(code));
            return airlineCache.get(code);
        };
        const rateMap = new Map();
        if (agentdata.currency === 'PKR') {
            const allRates = await this.currencyConverterRepository.find();
            for (const rate of allRates) {
                const key = `${rate.source}-${rate.alternate}`;
                rateMap.set(key, rate);
            }
        }
        const baseFilter = {
            travel_date: firstSegment?.depdate,
            from_list: firstSegment?.depfrom,
            to_list: firstSegment?.arrto,
        };
        const discountCache = new Map();
        const discountCurrencyCache = new Map();
        const agentDiscountCache = new Map();
        const getAgentDiscounts = async (agentId, airline, providerCode) => {
            if (!agentId)
                return [];
            const cacheKey = `${agentId}-${airline}-${providerCode}`;
            if (!agentDiscountCache.has(cacheKey)) {
                agentDiscountCache.set(cacheKey, await this.airlineDiscountForAgentRepository.find({
                    where: {
                        agentId,
                        airline,
                        source: (0, typeorm_2.Like)(`%${providerCode}%`),
                    },
                }));
            }
            return agentDiscountCache.get(cacheKey) || [];
        };
        const getDiscounts = async (airline, providerCode, currency) => {
            const cache = currency ? discountCurrencyCache : discountCache;
            const cacheKey = currency ? `${airline}-${providerCode}-${currency}` : `${airline}-${providerCode}`;
            if (!cache.has(cacheKey)) {
                const where = {
                    airline,
                    source: (0, typeorm_2.Like)(`%${providerCode}%`),
                };
                if (currency)
                    where.currency = currency;
                cache.set(cacheKey, await this.airlineDiscountRepository.find({ where }));
            }
            return cache.get(cacheKey) || [];
        };
        const isDateMatch = (value, compareValue) => {
            const parsed = value ? new Date(value) : null;
            if (parsed && parsed <= compareValue)
                return true;
            return value === 'ALL' || value === '';
        };
        const normalizeListEntries = (list = []) => {
            if (!list)
                return [];
            const rawEntries = Array.isArray(list) ? list : list.toString().split(',');
            return rawEntries.map(entry => (entry ?? '').trim().toUpperCase());
        };
        const getListMatchPriority = (list = [], value) => {
            const entries = normalizeListEntries(list);
            const normalizedValue = (value ?? '').trim().toUpperCase();
            if (normalizedValue && entries.includes(normalizedValue))
                return 3;
            if (entries.includes('ALL'))
                return 2;
            if (entries.includes('-') || entries.includes('[-]') || entries.includes(''))
                return 1;
            if (!entries.length)
                return 1;
            return 0;
        };
        const pickDiscount = (items, filter) => {
            if (!items?.length)
                return { percent: 0, amount: 0 };
            let bestMatch = null;
            for (const item of items) {
                if (!isDateMatch(item.booking_date, today) ||
                    !isDateMatch(item.travel_date, filter.travel_date)) {
                    continue;
                }
                const fromPriority = getListMatchPriority(item.from_list, filter.from_list);
                const toPriority = getListMatchPriority(item.to_list, filter.to_list);
                const rbdPriority = getListMatchPriority(item.rbd, filter.rbd);
                if (!fromPriority || !toPriority || !rbdPriority) {
                    continue;
                }
                const score = fromPriority * 100 + toPriority * 10 + rbdPriority;
                if (!bestMatch || score > bestMatch.score) {
                    bestMatch = { item, score };
                }
            }
            if (!bestMatch)
                return { percent: 0, amount: 0 };
            const match = bestMatch.item;
            return {
                percent: Number(match?.discount_percent) || 0,
                amount: Number(match?.fix_discount) || 0,
            };
        };
        const resolveDiscountPolicy = async (airline, providerCode, filter) => {
            const agentDiscounts = await getAgentDiscounts(agentdata?.agentId, airline, providerCode);
            const agentDiscountPolicy = pickDiscount(agentDiscounts, filter);
            if (agentDiscountPolicy.percent !== 0 || agentDiscountPolicy.amount !== 0) {
                return agentDiscountPolicy;
            }
            else if (agentDiscountPolicy.percent === 0 || agentDiscountPolicy.amount === 0) {
                const adminDiscounts = await getDiscounts(airline, providerCode, agentdata?.currency);
                const adminDiscountPolicy = pickDiscount(adminDiscounts, filter);
                return adminDiscountPolicy;
            }
            else {
                return { "percent": 0, "amount": 0 };
            }
        };
        const FlightItenary = await Promise.all(AllFareWithPrice.map(async (flights) => {
            const Token = result?.Token || '';
            const Key = flights?.Key;
            const availableSeat = flights?.AvailableSeat || 9;
            const airlineData = await getAirline(flights?.TicketingCarrier);
            const CarrierName = airlineData?.marketing_name || 'N/F';
            const ProviderCode = flights?.ProviderCode || 'NF';
            const { AprxTotalBaseFare, AprxTotalTax, TotalAmount, Fares, RefundableInfo, FareName, FID } = flights?.PriceBreakDown;
            const isRefundable = RefundableInfo === "Refundable";
            let conversionRate = 1;
            if (agentdata.currency === 'PKR') {
                const key = `${ProviderCode}-${agentdata.currency}`;
                const data = rateMap.get(key);
                conversionRate = data?.exchange_rate || rateMap?.get('DF-PKR').exchange_rate;
            }
            const equivalentAmount = AprxTotalBaseFare * conversionRate;
            const Taxes = AprxTotalTax * conversionRate;
            let TotalFare = (TotalAmount * conversionRate);
            const adminMarkUpAmount = agentdata?.markuptype === 'percent'
                ? equivalentAmount * (agentdata.markup / 100)
                : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;
            const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
                ? equivalentAmount * (agentdata.clientmarkup / 100)
                : agentdata?.clientmarkuptype === 'amount' ? agentdata.clientmarkup : 0;
            const TotalFareWithMarkUp = equivalentAmount + adminMarkUpAmount + agentMarkUpAmount + Taxes;
            const legs = flights?.FlightLegs ?? [];
            const filter = {
                ...baseFilter,
                rbd: legs[0]?.RBD,
            };
            const { percent: airlinesDiscountPercent, amount: airlinesDiscountAmount } = await resolveDiscountPolicy(flights?.TicketingCarrier, flights?.ProviderCode, filter);
            const discountPercentValue = (TotalFareWithMarkUp * (airlinesDiscountPercent / 100)) || 0;
            const FareAfterDiscount = TotalFareWithMarkUp - discountPercentValue - airlinesDiscountAmount;
            const DiscountAmount = Number(discountPercentValue + airlinesDiscountAmount);
            const NetFare = Number(FareAfterDiscount.toFixed(2));
            const Fees = agentMarkUpAmount;
            if (NetFare > TotalFare)
                TotalFare = NetFare;
            const firstLegBaggage = legs[0]?.FreeBaggages ?? [];
            const lastLegBaggage = legs.length > 1 ? legs[legs.length - 1]?.FreeBaggages ?? [] : [];
            const firstLegBagAllowance = firstLegBaggage.find(b => b.FID === FID);
            const lastLegBagAllowance = lastLegBaggage.find(b => b.FID === FID);
            const paxCounts = {
                ADT: flightDto.adultcount,
                CHD: flightDto.childcount,
                CNN: flightDto.childcount,
                INF: flightDto.infantcount || 0,
            };
            const addValue = DiscountAmount < 0 ? DiscountAmount : 0;
            const anotherFees = adminMarkUpAmount + agentMarkUpAmount;
            const buildBaggageInfo = (bagType) => {
                const baggageInfo = [
                    { Airline: flights?.TicketingCarrier, Allowance: firstLegBagAllowance?.[bagType] || '' },
                ];
                if (legs.length > 1) {
                    baggageInfo.push({
                        Airline: flights?.TicketingCarrier,
                        Allowance: lastLegBagAllowance?.[bagType] || '',
                    });
                }
                return baggageInfo;
            };
            const PriceBreakDown = Fares.map((pax) => {
                const PaxType = pax?.PTC === 'CHD' ? 'CNN' : pax?.PTC;
                const paxCount = paxCounts[PaxType] ?? 0;
                const bagType = PaxType === 'ADT' ? 'Adt_Baggage'
                    : PaxType === 'CHD' || PaxType === 'CNN' ? 'Chd_Baggage'
                        : 'Inf_Baggage';
                const baggageInfo = buildBaggageInfo(bagType);
                const PaxequivalentAmount = (pax?.BaseFare + addValue + anotherFees) * conversionRate;
                const totalTaxAmount = pax?.Tax * conversionRate;
                const PaxtotalFare = Number((PaxequivalentAmount + totalTaxAmount).toFixed(2));
                return {
                    PaxType,
                    BaseFare: Number(PaxequivalentAmount).toFixed(2),
                    Taxes: totalTaxAmount.toFixed(2),
                    TotalFare: PaxtotalFare,
                    PaxCount: paxCount,
                    Bag: baggageInfo,
                    ASC: adminMarkUpAmount + agentMarkUpAmount,
                    FareComponent: {}
                };
            });
            const onwardSegments = legs.filter(seg => seg.Type === '0') ?? [];
            const returnSegments = legs.filter(seg => seg.Type === '1') ?? [];
            const mapSegments = async (segments) => {
                return Promise.all(segments.map(async (segment) => {
                    const depAirport = await getAirport(segment?.Origin);
                    const arrAirport = await getAirport(segment?.Destination);
                    const airlineInfo = await getAirline(segment?.AirlineCode);
                    return {
                        MarketingCarrier: segment?.AirlineCode,
                        MarketingCarrierName: airlineInfo?.marketing_name,
                        MarketingFlightNumber: segment?.FlightNo,
                        OperatingCarrier: segment?.AirlineCode,
                        OperatingFlightNumber: segment?.FlightNo,
                        OperatingCarrierName: airlineInfo?.marketing_name,
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
                            bookingCode: segment.RBD || 'Y',
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
                    DepDate: firstSegment?.depdate,
                    DepFrom: onwardSegments[0]?.Origin,
                    ArrTo: onwardSegments[onwardSegments.length - 1]?.Destination,
                    Duration: '',
                    Segments: await mapSegments(onwardSegments)
                });
            }
            if (returnSegments.length > 0) {
                AllLegsInfo.push({
                    DepDate: lastSegment?.depdate,
                    DepFrom: returnSegments[0]?.Origin,
                    ArrTo: returnSegments[returnSegments.length - 1]?.Destination,
                    Duration: '',
                    Segments: await mapSegments(returnSegments)
                });
            }
            return {
                Token,
                Key,
                System: "AlHind",
                ProviderCode,
                TripType,
                Carrier: flights?.TicketingCarrier,
                CarrierName,
                Cabinclass: FareName,
                Currency: agentdata?.currency,
                BaseFare: Number(equivalentAmount).toFixed(2),
                Taxes: Number(Taxes).toFixed(2),
                NetFare,
                GrossFare: Number(TotalFare).toFixed(2),
                Fees,
                MarkUp: Number(DiscountAmount).toFixed(2),
                ConversionRate: conversionRate,
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
    __param(1, (0, typeorm_1.InjectRepository)(airlines_model_1.AirlineDiscount)),
    __param(2, (0, typeorm_1.InjectRepository)(airlines_model_1.AirlineDiscountForAgent)),
    __param(3, (0, typeorm_1.InjectRepository)(save_flight_entity_1.SaveFlightsData)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], AlhindAPI);
//# sourceMappingURL=alhind.flights.service.js.map