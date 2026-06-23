import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
import { AirlinesService } from '../airlines/airlines.service';
import { AgentModel } from '../agent/agent.model';
import { airportsData } from './data/airports.data';
import { airlinesData } from './data/airlines.data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AirlineDiscount, AirlineDiscountForAgent } from '../airlines/airlines.model';
import { CurrencyConverter } from '../currency/entities/currency.entity';
import { FlightSearchModel } from './dto/search-flight.dto';
dotenv.config()

@Injectable()
export class SabreUtils {
    constructor(
        @InjectRepository(CurrencyConverter)
        private readonly currencyConverterRepository: Repository<CurrencyConverter>,
        @InjectRepository(AirlineDiscount)
        private readonly airlineDiscountRepository: Repository<AirlineDiscount>,
        @InjectRepository(AirlineDiscountForAgent)
        private readonly airlineDiscountForAgentRepository: Repository<AirlineDiscountForAgent>,     
        private readonly airlinesService: AirlinesService,

        
    ){}


    async restBFMParser(agentdata : AgentModel, flightDto : FlightSearchModel, SearchResponse: any) {

        if(SearchResponse?.groupedItineraryResponse?.statistics?.itineraryCount > 0){
   
            const today = new Date();
            const segments = flightDto?.segments ?? [];
            const firstSegment = segments[0];

            const FlightItenary = [];
            if (SearchResponse?.groupedItineraryResponse?.itineraryGroups?.[0]?.itineraries) {
                const AllFlights : any[] = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]?.itineraries;
                const AllBaggage  : any[] = SearchResponse?.groupedItineraryResponse?.baggageAllowanceDescs;
                const AllLegDescs : any[] = SearchResponse?.groupedItineraryResponse?.legDescs;
                const AllscheduleDescs : any[] = SearchResponse?.groupedItineraryResponse?.scheduleDescs;
                const AllFareCompoDescs : any[] = SearchResponse?.groupedItineraryResponse?.fareComponentDescs;
                const GroupLegDescs : any[] = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]?.groupDescription?.legDescriptions;

                const GroupAllFlights = [];
                for(const group of AllFlights){
                    const leg = group.legs;
                    for(const singleBrand of group?.pricingInformation || []){
                        if(singleBrand?.brandsOnAnyMarket === true){
                            const  singleBrandFare = singleBrand?.fare;
                            singleBrandFare.legs = leg;
                            GroupAllFlights.push(singleBrandFare);
                        }
                    }
                }

                let TripType: string;
                if(GroupLegDescs.length === 1){
                    TripType = 'Oneway';
                }else if(GroupLegDescs.length > 1 && (GroupLegDescs[0]?.departureLocation === GroupLegDescs[1]?.arrivalLocation)){
                    TripType = 'Return';
                }else if(GroupLegDescs.length > 1 && (GroupLegDescs[0]?.departureLocation !== GroupLegDescs[1]?.arrivalLocation)){
                    TripType = 'Multicity';
                }

                            // ---- Caching helpers ----
                const airportCache = new Map<string, any>();
                const airlineCache = new Map<string, any>();

                const getAirport = async (code: string) => {
                    if (!airportCache.has(code)) airportCache.set(code, await this.getAirports(code));
                    return airportCache.get(code);
                };

                const getAirline = async (code: string) => {
                    if (!airlineCache.has(code)) airlineCache.set(code, await this.airlinesService.getAirlines(code));
                    return airlineCache.get(code);
                };

                // Currency converter
                    const rateMap = new Map<string, any>();
                    if(agentdata.currency === "AED"){
                        const allRates = await this.currencyConverterRepository.find();
                        for (const rate of allRates) {
                            const key = `${rate.airline}-${rate.source}-${rate.alternate}`;
                            rateMap.set(key, rate);
                        }
                    }
                
                    const baseFilter = {
                        travel_date: firstSegment?.depdate,
                        from_list: firstSegment?.depfrom,
                        to_list: firstSegment?.arrto,
                    };
                
                    const discountCache = new Map<string, any[]>();
                    const discountCurrencyCache = new Map<string, any[]>();
                    const agentDiscountCache = new Map<string, any[]>();
                
                    const getAgentDiscounts = async (agentId: string, airline: string, providerCode: string) => {
                        if (!agentId) return [];
                        const cacheKey = `${agentId}-${airline}-${providerCode}`;
                        if (!agentDiscountCache.has(cacheKey)) {
                            agentDiscountCache.set(cacheKey, await this.airlineDiscountForAgentRepository.find({
                                where: {
                                    agentId,
                                    airline,
                                    source: Like(`%${providerCode}%`),
                                },
                            }));
                        }
                        return agentDiscountCache.get(cacheKey) || [];
                    };
                
                    const getDiscounts = async (airline: string, providerCode: string, currency?: string) => {
                        const cache = currency ? discountCurrencyCache : discountCache;
                        const cacheKey = currency ? `${airline}-${providerCode}-${currency}` : `${airline}-${providerCode}`;
                        if (!cache.has(cacheKey)) {
                            const where: any = {
                                airline,
                                source: Like(`%${providerCode}%`),
                            };
                            if (currency) where.currency = currency;
                            cache.set(cacheKey, await this.airlineDiscountRepository.find({ where }));
                        }
                        return cache.get(cacheKey) || [];
                    };
                
                
                    const isDateMatch = (value: string, compareValue: any) => {
                        const parsed = value ? new Date(value) : null;
                        if (parsed && parsed <= compareValue) return true;
                        return value === 'ALL' || value === '';
                    };
                
                    const normalizeListEntries = (list: string | string[] = []) => {
                        if (!list) return [];
                            const rawEntries = Array.isArray(list) ? list : list.toString().split(',');
                            return rawEntries.map(entry => (entry ?? '').trim().toUpperCase());
                        };
                
                        const getListMatchPriority = (list: string | string[] = [], value: string) => {
                        const entries = normalizeListEntries(list);
                        const normalizedValue = (value ?? '').trim().toUpperCase();
                
                        if (!entries.length) return 1;
                
                        if (normalizedValue && entries.includes(normalizedValue)) return 3;
                        if (entries.includes('ALL')) return 2;
                        if (entries.includes('-') || entries.includes('[-]')) return 1;
                
                        return 0;
                    };
                
                    const pickDiscount = (items: any[], filter: any) => {
                        if (!items?.length) return { percent: 0, amount: 0 };
                        let bestMatch: { item: any; score: number } | null = null;
                
                        for (const item of items) {
                            if (
                                !isDateMatch(item.booking_date, today) ||
                                !isDateMatch(item.travel_date, filter.travel_date)
                            ) {
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
                
                        if (!bestMatch) return { percent: 0, amount: 0 };
                        const match = bestMatch.item;
                        return {
                            percent: Number(match?.discount_percent) || 0,
                            amount: Number(match?.fix_discount) || 0,
                        };
                    };
                
                    const resolveDiscountPolicy = async (airline: string, providerCode: string, filter: any) => {
                        const agentDiscounts = await getAgentDiscounts(agentdata?.agentId, airline, providerCode);
                        const agentDiscountPolicy = pickDiscount(agentDiscounts, filter);
                
                        if (agentDiscountPolicy.percent !== 0 || agentDiscountPolicy.amount !== 0){
                            return agentDiscountPolicy;
                        }else if(agentDiscountPolicy.percent === 0 || agentDiscountPolicy.amount === 0){
                            const adminDiscounts = await getDiscounts(airline, providerCode, agentdata?.currency);
                            const adminDiscountPolicy = pickDiscount(adminDiscounts, filter);     
                            return adminDiscountPolicy;
                        }else{
                            return {"percent": 0, "amount": 0};
                        }
                    };


                for (const flights of GroupAllFlights) {
                    const ValidatingCarrier : string = flights?.validatingCarrierCode;
                    const airlineData : any = await this.airlinesService.getAirlines(ValidatingCarrier);
                    const AllPassenger : any[] = flights?.passengerInfoList;
                    const CarrierName: string = airlineData?.marketing_name || 'N/F';
                    const AprxTotalBaseFare : number = Number(flights?.totalFare?.equivalentAmount) || 0;
                    const AprxTotalTax : number = Number(flights?.totalFare?.totalTaxAmount) || 0;
                    const TotalAmount: number = Number(flights?.totalFare?.totalPrice) || 0;

                    let conversionRate: any = 1;
                    if(agentdata?.currency === "AED"){
                        const key = `${ValidatingCarrier}-2S-${agentdata.currency}`;
                        const data = rateMap.get(key);
                        conversionRate = Number(data?.exchange_rate || rateMap?.get('DF-DF-AED')?.exchange_rate) || 1;
                    }

                    // ---- Base fare & taxes ----
                    const equivalentAmount = AprxTotalBaseFare / conversionRate;
                    const Taxes = AprxTotalTax / conversionRate;
                    let TotalFare = (TotalAmount / conversionRate);

                    // Admin markup
                    const adminMarkUpAmount = agentdata?.markuptype === 'percent'
                        ? equivalentAmount * (agentdata.markup / 100)
                        : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;

                    // Agent markup
                    const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
                        ? equivalentAmount * (agentdata.clientmarkup / 100)
                        : agentdata?.clientmarkuptype === 'amount' ? agentdata.clientmarkup : 0;

                    const TotalFareWithMarkUp = equivalentAmount + adminMarkUpAmount + agentMarkUpAmount + Taxes;

                    const RBD : string = AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]?.segment?.bookingCode || 'Y';
                    const filter = {
                        ...baseFilter,
                        rbd: RBD,
                    };

                    const { percent: airlinesDiscountPercent, amount: airlinesDiscountAmount } = await resolveDiscountPolicy(
                        ValidatingCarrier,
                        "2S",
                        filter
                    );

                    const discountPercentValue = (TotalFareWithMarkUp * (airlinesDiscountPercent / 100)) || 0;
                    const FareAfterDiscount = TotalFareWithMarkUp - discountPercentValue - airlinesDiscountAmount;
                    const DiscountAmount = Number(discountPercentValue + airlinesDiscountAmount);
                    const NetFare = Number(FareAfterDiscount.toFixed(2));
                    const Fees = agentMarkUpAmount;

                    if (NetFare > TotalFare) TotalFare = NetFare;

                    const Refundable : boolean = !flights?.passengerInfoList?.[0].passengerInfo.nonRefundable;
                    let TimeLimit : string;
                    if (flights?.lastTicketDate) {
                        const lastTicketDate : string = flights.lastTicketDate;
                        const lastTicketTime : string = flights.lastTicketTime;
                        TimeLimit = `${lastTicketDate}T${lastTicketTime}:00`;
                    }

                    let Class : string = AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]?.segment?.cabinCode || 'Y';
                    switch (Class) {
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

                    const CabinClass = AllFareCompoDescs[AllPassenger[0]?.passengerInfo?.fareComponents[0]?.ref-1].brand.brandName;

                    const PriceBreakDown : any[] = AllPassenger?.map(allPassenger => {
                        const addValue = DiscountAmount < 0 ? DiscountAmount : 0;
                        const anotherFees = adminMarkUpAmount + agentMarkUpAmount;

                        const PaxType = allPassenger?.passengerInfo?.passengerType;
                        const paxCount = allPassenger?.passengerInfo?.passengerNumber;
                        let PaxtotalFare = Number(allPassenger?.passengerInfo?.passengerTotalFare?.totalFare) || 0;
                        let totalTaxAmount = Number(allPassenger?.passengerInfo?.passengerTotalFare?.totalTaxAmount) || 0;
                        let PaxequivalentAmount = Number(allPassenger?.passengerInfo?.passengerTotalFare?.equivalentAmount) || 0;

                        PaxequivalentAmount = (PaxequivalentAmount + (-addValue) + anotherFees) / conversionRate;
                        totalTaxAmount = totalTaxAmount / conversionRate;
                        PaxtotalFare = Number((PaxequivalentAmount + totalTaxAmount).toFixed(2));

                
                        const BaggageAllowance = allPassenger?.passengerInfo?.baggageInformation;
                        const Baggage = BaggageAllowance?.map(baggageAllowance => {
                            const BagAirlineCode = baggageAllowance?.airlineCode;
                            const AllowanceRef = AllBaggage[baggageAllowance?.allowance?.ref - 1];

                            let Allowance : string;
                            if(AllowanceRef?.pieceCount){
                                Allowance = AllowanceRef?.pieceCount+ ' Piece';
                            }else{
                                Allowance = AllowanceRef?.weight+ ' KG';
                            }
                            
                            return {
                                Airline: BagAirlineCode,
                                Allowance: Allowance,
                            };
                        });


                        return {
                            PaxType: PaxType,
                            BaseFare: Number(PaxequivalentAmount).toFixed(2),
                            Taxes: Number(totalTaxAmount).toFixed(2),
                            TotalFare: Number(PaxtotalFare).toFixed(2),
                            PaxCount: paxCount,
                            Bag: Baggage,
                            ASC: Number(adminMarkUpAmount + agentMarkUpAmount).toFixed(2),
                            FareComponent: {}
                        };
                    });

                    const AllLegsInfo = [];
                    const AllLegsData = flights?.passengerInfoList[0]?.passengerInfo?.fareComponents;
                    const LegDescRef = flights?.legs;


                    for (let i = 0; i < LegDescRef.length; i++) {
                        const SingleLegs : number = LegDescRef[i].ref - 1;
                        const legDesc : any = AllLegDescs[SingleLegs];
                        const LegDuration : string = legDesc?.elapsedTime;
                    
                        const AllLegs : any[] = GroupLegDescs || [];
                        const departureDate : string = AllLegs[i].departureDate;
                    
                        const legInfo = {
                            DepDate: AllLegs[i]?.departureDate,
                            DepFrom: AllLegs[i]?.departureLocation,
                            ArrTo: AllLegs[i]?.arrivalLocation,
                            Duration: LegDuration
                        };
                    
                        const segments = [];
                        const legDescRefList = legDesc?.schedules;
                        let allSegments = [];
                        for(const singleLegs of AllLegsData){
                            for(const leg of singleLegs?.segments){
                                allSegments.push(leg.segment);
                            }
                        }
                    
                        for (let index = 0; index < legDescRefList.length; index++) {
                            try {
                                const singleLegDesc = legDescRefList[index].ref - 1;
                                const Schedules = AllscheduleDescs[singleLegDesc];
                                const DateAdjustment = legDescRefList[index];

                                let AdjustDepDate = 0;
                                let AdjustedDepDate = departureDate;
                                if (DateAdjustment?.departureDateAdjustment) {
                                    AdjustDepDate = DateAdjustment?.departureDateAdjustment;
                                    const departureDateTime = new Date(departureDate);
                                    departureDateTime.setDate(departureDateTime.getDate() + AdjustDepDate);
                                    AdjustedDepDate = new Date(departureDateTime).toISOString().split('T')[0];
                                }

                                let AdjustedArrDate = AdjustedDepDate;
                                let AdjustArrDate = 0;
                                if (Schedules?.arrival?.dateAdjustment) {
                                    AdjustArrDate = Schedules?.arrival?.dateAdjustment;
                                    const arrivalDateTime = new Date(AdjustedDepDate);
                                    arrivalDateTime.setDate(arrivalDateTime.getDate() + AdjustArrDate);
                                    AdjustedArrDate = new Date(AdjustedDepDate).toISOString().split('T')[0];
                                }
                        
                                const OperatedBy = Schedules?.arrival?.disclosure || Schedules?.carrier?.operating;
                        
                                const SingleSegments = {
                                    MarketingCarrier: Schedules?.carrier?.marketing,
                                    MarketingCarrierName: await this.getAirlineName(Schedules.carrier.marketing),
                                    MarketingFlightNumber: Schedules?.carrier?.marketingFlightNumber,
                                    OperatingCarrier: Schedules?.carrier?.operating,
                                    OperatingFlightNumber: Schedules?.carrier?.operatingFlightNumber,
                                    OperatingCarrierName: await this.getAirlineName(Schedules.carrier.operating),
                                    DepFrom: Schedules?.departure?.airport,
                                    DepAirPort: (await this.getAirports(Schedules.departure.airport))?.name,
                                    DepLocation:(await this.getAirports(Schedules.departure.airport))?.location,
                                    DepDateAdjustment: AdjustDepDate,
                                    DepTime: `${AdjustedDepDate}T${Schedules.departure.time}`,
                                    ArrTo: Schedules?.arrival?.airport,
                                    ArrAirPort: (await this.getAirports(Schedules.arrival.airport)).name,
                                    ArrLocation: (await this.getAirports(Schedules.arrival.airport)).location,
                                    ArrDateAdjustment: AdjustArrDate,
                                    ArrTime: `${AdjustedArrDate}T${Schedules.arrival.time}`,
                                    OperatedBy: await this.airlinesService.getAirlinesName(OperatedBy),
                                    StopCount: Schedules?.stopCount,
                                    Duration: Schedules?.elapsedTime,
                                    AircraftTypeName: Schedules?.carrier?.equipment?.code || 'N/A',
                                    DepartureGate: Schedules?.departure?.terminal || 'TBA',
                                    ArrivalGate: Schedules?.arrival?.terminal || 'TBA',
                                    HiddenStops: Schedules?.hiddenStops || [],
                                    TotalMilesFlown: Schedules?.totalMilesFlown || 0,
                                    SegmentCode: allSegments[index],
                                };

                                segments.push(SingleSegments);
                            } catch (error) {
                                console.error(error instanceof Error ? error.message : String(error));
                            }
                        }

                        legInfo['Segments'] = segments;
                        AllLegsInfo.push(legInfo);
                    }

                        FlightItenary.push({
                        Token: '',
                        Key : '',
                        System: "Sabre",
                        TripType: TripType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        ProviderCode: "2S",
                        Cabinclass: CabinClass,
                        Currency: agentdata?.currency,
                        BaseFare: Number(equivalentAmount).toFixed(2),
                        Taxes : Number(Taxes).toFixed(2),
                            NetFare: Number(NetFare).toFixed(2),
                        GrossFare: Number(TotalFare).toFixed(2),
                            Fees: Number(Fees).toFixed(2),
                        MarkUp: Number(-DiscountAmount).toFixed(2),
                        ConversionRate : conversionRate,
                        TimeLimit: TimeLimit,
                        Refundable: Refundable,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo : AllLegsInfo
                        });
                }
            }

            return FlightItenary;
        }else{
            return [];
        }
    }

    async restRevalidationParser(agentdata : AgentModel, revalidationDto : any, SearchResponse: any) {

        if(SearchResponse?.groupedItineraryResponse?.statistics?.itineraryCount > 0){
   
            const today = new Date();
            const segments = revalidationDto?.AllLegsInfo ?? [];
            const firstSegment = segments[0];

            const FlightItenary = [];
            if (SearchResponse?.groupedItineraryResponse?.itineraryGroups?.[0]?.itineraries) {
                const AllFlights : any[] = SearchResponse?.groupedItineraryResponse?.itineraryGroups;
                const AllBaggage  : any[] = SearchResponse?.groupedItineraryResponse?.baggageAllowanceDescs;
                const AllLegDescs : any[] = SearchResponse?.groupedItineraryResponse?.legDescs;
                const AllscheduleDescs : any[] = SearchResponse?.groupedItineraryResponse?.scheduleDescs;
                const AllFareCompoDescs : any[] = SearchResponse?.groupedItineraryResponse?.fareComponentDescs;
                const GroupLegDescs : any[] = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]?.groupDescription?.legDescriptions;

                const GroupAllFlights = [];
                for(const group of AllFlights){
                    GroupAllFlights.push(group.itineraries);
                }

                let TripType: string;
                if(GroupLegDescs.length === 1){
                    TripType = 'Oneway';
                }else if(GroupLegDescs.length > 1 && (GroupLegDescs[0]?.departureLocation === GroupLegDescs[1]?.arrivalLocation)){
                    TripType = 'Return';
                }else if(GroupLegDescs.length > 1 && (GroupLegDescs[0]?.departureLocation !== GroupLegDescs[1]?.arrivalLocation)){
                    TripType = 'Multicity';
                }

                            // ---- Caching helpers ----
                const airportCache = new Map<string, any>();
                const airlineCache = new Map<string, any>();

                const getAirport = async (code: string) => {
                    if (!airportCache.has(code)) airportCache.set(code, await this.getAirports(code));
                    return airportCache.get(code);
                };

                const getAirline = async (code: string) => {
                    if (!airlineCache.has(code)) airlineCache.set(code, await this.airlinesService.getAirlines(code));
                    return airlineCache.get(code);
                };

                // Currency converter
                    const rateMap = new Map<string, any>();
                    if(agentdata.currency === "AED"){
                        const allRates = await this.currencyConverterRepository.find();
                        for (const rate of allRates) {
                            const key = `${rate.airline}-${rate.source}-${rate.alternate}`;
                            rateMap.set(key, rate);
                        }
                    }
                
                    const baseFilter = {
                        travel_date: firstSegment?.depdate,
                        from_list: firstSegment?.depfrom,
                        to_list: firstSegment?.arrto,
                    };
                
                    const discountCache = new Map<string, any[]>();
                    const discountCurrencyCache = new Map<string, any[]>();
                    const agentDiscountCache = new Map<string, any[]>();
                
                    const getAgentDiscounts = async (agentId: string, airline: string, providerCode: string) => {
                        if (!agentId) return [];
                        const cacheKey = `${agentId}-${airline}-${providerCode}`;
                        if (!agentDiscountCache.has(cacheKey)) {
                            agentDiscountCache.set(cacheKey, await this.airlineDiscountForAgentRepository.find({
                                where: {
                                    agentId,
                                    airline,
                                    source: Like(`%${providerCode}%`),
                                },
                            }));
                        }
                        return agentDiscountCache.get(cacheKey) || [];
                    };
                
                    const getDiscounts = async (airline: string, providerCode: string, currency?: string) => {
                        const cache = currency ? discountCurrencyCache : discountCache;
                        const cacheKey = currency ? `${airline}-${providerCode}-${currency}` : `${airline}-${providerCode}`;
                        if (!cache.has(cacheKey)) {
                            const where: any = {
                                airline,
                                source: Like(`%${providerCode}%`),
                            };
                            if (currency) where.currency = currency;
                            cache.set(cacheKey, await this.airlineDiscountRepository.find({ where }));
                        }
                        return cache.get(cacheKey) || [];
                    };
                
                
                    const isDateMatch = (value: string, compareValue: any) => {
                        const parsed = value ? new Date(value) : null;
                        if (parsed && parsed <= compareValue) return true;
                        return value === 'ALL' || value === '';
                    };
                
                    const normalizeListEntries = (list: string | string[] = []) => {
                        if (!list) return [];
                            const rawEntries = Array.isArray(list) ? list : list.toString().split(',');
                            return rawEntries.map(entry => (entry ?? '').trim().toUpperCase());
                        };
                
                        const getListMatchPriority = (list: string | string[] = [], value: string) => {
                        const entries = normalizeListEntries(list);
                        const normalizedValue = (value ?? '').trim().toUpperCase();
                
                        if (!entries.length) return 1;
                
                        if (normalizedValue && entries.includes(normalizedValue)) return 3;
                        if (entries.includes('ALL')) return 2;
                        if (entries.includes('-') || entries.includes('[-]')) return 1;
                
                        return 0;
                    };
                
                    const pickDiscount = (items: any[], filter: any) => {
                        if (!items?.length) return { percent: 0, amount: 0 };
                        let bestMatch: { item: any; score: number } | null = null;
                
                        for (const item of items) {
                            if (
                                !isDateMatch(item.booking_date, today) ||
                                !isDateMatch(item.travel_date, filter.travel_date)
                            ) {
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
                
                        if (!bestMatch) return { percent: 0, amount: 0 };
                        const match = bestMatch.item;
                        return {
                            percent: Number(match?.discount_percent) || 0,
                            amount: Number(match?.fix_discount) || 0,
                        };
                    };
                
                    const resolveDiscountPolicy = async (airline: string, providerCode: string, filter: any) => {
                        const agentDiscounts = await getAgentDiscounts(agentdata?.agentId, airline, providerCode);
                        const agentDiscountPolicy = pickDiscount(agentDiscounts, filter);
                
                        if (agentDiscountPolicy.percent !== 0 || agentDiscountPolicy.amount !== 0){
                            return agentDiscountPolicy;
                        }else if(agentDiscountPolicy.percent === 0 || agentDiscountPolicy.amount === 0){
                            const adminDiscounts = await getDiscounts(airline, providerCode, agentdata?.currency);
                            const adminDiscountPolicy = pickDiscount(adminDiscounts, filter);     
                            return adminDiscountPolicy;
                        }else{
                            return {"percent": 0, "amount": 0};
                        }
                    };



                for (const flights of GroupAllFlights.flat()) {
                    const ValidatingCarrier : string = flights?.fare.validatingCarrierCode;
                    const airlineData : any = await this.airlinesService.getAirlines(ValidatingCarrier);
                    const AllPassenger : any[] = flights?.fare.passengerInfoList;
                    const CarrierName: string = airlineData?.marketing_name || 'N/F';
                    const AprxTotalBaseFare : number = Number(flights?.pricingInformation[0]?.fare?.totalFare?.equivalentAmount) || 0;
                    const AprxTotalTax : number = Number(flights?.pricingInformation[0]?.fare?.totalFare?.totalTaxAmount) || 0;
                    const TotalAmount: number = Number(flights?.pricingInformation[0]?.fare?.totalFare?.totalPrice) || 0;

                    let conversionRate: any = 1;
                    if(agentdata?.currency === "AED"){
                        const key = `${ValidatingCarrier}-2S-${agentdata.currency}`;
                        const data = rateMap.get(key);
                        conversionRate = Number(data?.exchange_rate || rateMap?.get('DF-DF-AED')?.exchange_rate) || 1;
                    }

                    // ---- Base fare & taxes ----
                    const equivalentAmount = AprxTotalBaseFare / conversionRate;
                    const Taxes = AprxTotalTax / conversionRate;
                    let TotalFare = (TotalAmount / conversionRate);

                    // Admin markup
                    const adminMarkUpAmount = agentdata?.markuptype === 'percent'
                        ? equivalentAmount * (agentdata.markup / 100)
                        : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;

                    // Agent markup
                    const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
                        ? equivalentAmount * (agentdata.clientmarkup / 100)
                        : agentdata?.clientmarkuptype === 'amount' ? agentdata.clientmarkup : 0;

                    const TotalFareWithMarkUp = equivalentAmount + adminMarkUpAmount + agentMarkUpAmount + Taxes;

                    const RBD : string = AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]?.segment?.bookingCode || 'Y';
                    const filter = {
                        ...baseFilter,
                        rbd: RBD,
                    };

                    const { percent: airlinesDiscountPercent, amount: airlinesDiscountAmount } = await resolveDiscountPolicy(
                        ValidatingCarrier,
                        "2S",
                        filter
                    );

                    const discountPercentValue = (TotalFareWithMarkUp * (airlinesDiscountPercent / 100)) || 0;
                    const FareAfterDiscount = TotalFareWithMarkUp - discountPercentValue - airlinesDiscountAmount;
                    const DiscountAmount = Number(discountPercentValue + airlinesDiscountAmount);
                    const NetFare = Number(FareAfterDiscount.toFixed(2));
                    const Fees = agentMarkUpAmount;

                    if (NetFare > TotalFare) TotalFare = NetFare;

                    const Refundable : boolean = !flights.pricingInformation?.[0].fare.passengerInfoList?.[0].passengerInfo.nonRefundable;
                    let TimeLimit : string;
                    if (flights?.pricingInformation?.[0]?.fare?.lastTicketDate) {
                        const lastTicketDate : string = flights.pricingInformation?.[0]?.fare?.lastTicketDate;
                        const lastTicketTime : string = flights.pricingInformation?.[0]?.fare?.lastTicketTime;
                        TimeLimit = `${lastTicketDate}T${lastTicketTime}:00`;
                    }

                    let Class : string = AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]?.segment?.cabinCode || 'Y';
                    switch (Class) {
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

                    const PriceBreakDown : any[] = AllPassenger?.map(allPassenger => {
                        const addValue = DiscountAmount < 0 ? DiscountAmount : 0;
                        const anotherFees = adminMarkUpAmount + agentMarkUpAmount;

                        const PaxType = allPassenger?.passengerInfo?.passengerType;
                        const paxCount = allPassenger?.passengerInfo?.passengerNumber;
                        let PaxtotalFare = Number(allPassenger?.passengerInfo?.passengerTotalFare?.totalFare) || 0;
                        let totalTaxAmount = Number(allPassenger?.passengerInfo?.passengerTotalFare?.totalTaxAmount) || 0;
                        let PaxequivalentAmount = Number(allPassenger?.passengerInfo?.passengerTotalFare?.equivalentAmount) || 0;

                        PaxequivalentAmount = (PaxequivalentAmount + (-addValue) + anotherFees) / conversionRate;
                        totalTaxAmount = totalTaxAmount / conversionRate;
                        PaxtotalFare = Number((PaxequivalentAmount + totalTaxAmount).toFixed(2));

                
                        const BaggageAllowance = allPassenger?.passengerInfo?.baggageInformation;
                        const Baggage = BaggageAllowance?.map(baggageAllowance => {
                            const BagAirlineCode = baggageAllowance?.airlineCode;
                            const AllowanceRef = AllBaggage[baggageAllowance?.allowance?.ref - 1];

                            let Allowance : string;
                            if(AllowanceRef?.pieceCount){
                                Allowance = AllowanceRef?.pieceCount+ ' Piece';
                            }else{
                                Allowance = AllowanceRef?.weight+ ' KG';
                            }
                            
                            return {
                                Airline: BagAirlineCode,
                                Allowance: Allowance,
                            };
                        });


                        return {
                            PaxType: PaxType,
                            BaseFare: Number(PaxequivalentAmount).toFixed(2),
                            Taxes: Number(totalTaxAmount).toFixed(2),
                            TotalFare: Number(PaxtotalFare).toFixed(2),
                            PaxCount: paxCount,
                            Bag: Baggage,
                            ASC: Number(adminMarkUpAmount + agentMarkUpAmount).toFixed(2),
                            FareComponent: {}
                        };
                    });

                    const AllLegsInfo = [];
                    const AllLegsData = flights?.pricingInformation?.[0]?.fare?.passengerInfoList[0]?.passengerInfo?.fareComponents;
                    const LegDescRef = flights?.legs;


                    for (let i = 0; i < LegDescRef.length; i++) {
                        const SingleLegs : number = LegDescRef[i].ref - 1;
                        const legDesc : any = AllLegDescs[SingleLegs];
                        const LegDuration : string = legDesc?.elapsedTime;
                    
                        const AllLegs : any[] = GroupLegDescs || [];
                        const departureDate : string = AllLegs[i].departureDate;
                    
                        const legInfo = {
                            DepDate: AllLegs[i]?.departureDate,
                            DepFrom: AllLegs[i]?.departureLocation,
                            ArrTo: AllLegs[i]?.arrivalLocation,
                            Duration: LegDuration
                        };
                    
                        const segments = [];
                        const legDescRefList = legDesc?.schedules;
                        let allSegments = [];
                        for(const singleLegs of AllLegsData){
                            for(const leg of singleLegs?.segments){
                                allSegments.push(leg.segment);
                            }
                        }
                    
                        for (let index = 0; index < legDescRefList.length; index++) {
                            try {
                                const singleLegDesc = legDescRefList[index].ref - 1;
                                const Schedules = AllscheduleDescs[singleLegDesc];
                                const DateAdjustment = legDescRefList[index];

                                let AdjustDepDate = 0;
                                let AdjustedDepDate = departureDate;
                                if (DateAdjustment?.departureDateAdjustment) {
                                    AdjustDepDate = DateAdjustment?.departureDateAdjustment;
                                    const departureDateTime = new Date(departureDate);
                                    departureDateTime.setDate(departureDateTime.getDate() + AdjustDepDate);
                                    AdjustedDepDate = new Date(departureDateTime).toISOString().split('T')[0];
                                }

                                let AdjustedArrDate = AdjustedDepDate;
                                let AdjustArrDate = 0;
                                if (Schedules?.arrival?.dateAdjustment) {
                                    AdjustArrDate = Schedules?.arrival?.dateAdjustment;
                                    const arrivalDateTime = new Date(AdjustedDepDate);
                                    arrivalDateTime.setDate(arrivalDateTime.getDate() + AdjustArrDate);
                                    AdjustedArrDate = new Date(AdjustedDepDate).toISOString().split('T')[0];
                                }
                        
                                const OperatedBy = Schedules?.arrival?.disclosure || Schedules?.carrier?.operating;
                        
                                const SingleSegments = {
                                    MarketingCarrier: Schedules?.carrier?.marketing,
                                    MarketingCarrierName: await this.getAirlineName(Schedules.carrier.marketing),
                                    MarketingFlightNumber: Schedules?.carrier?.marketingFlightNumber,
                                    OperatingCarrier: Schedules?.carrier?.operating,
                                    OperatingFlightNumber: Schedules?.carrier?.operatingFlightNumber,
                                    OperatingCarrierName: await this.getAirlineName(Schedules.carrier.operating),
                                    DepFrom: Schedules?.departure?.airport,
                                    DepAirPort: (await this.getAirports(Schedules.departure.airport))?.name,
                                    DepLocation:(await this.getAirports(Schedules.departure.airport))?.location,
                                    DepDateAdjustment: AdjustDepDate,
                                    DepTime: `${AdjustedDepDate}T${Schedules.departure.time}`,
                                    ArrTo: Schedules?.arrival?.airport,
                                    ArrAirPort: (await this.getAirports(Schedules.arrival.airport)).name,
                                    ArrLocation: (await this.getAirports(Schedules.arrival.airport)).location,
                                    ArrDateAdjustment: AdjustArrDate,
                                    ArrTime: `${AdjustedArrDate}T${Schedules.arrival.time}`,
                                    OperatedBy: await this.airlinesService.getAirlinesName(OperatedBy),
                                    StopCount: Schedules?.stopCount,
                                    Duration: Schedules?.elapsedTime,
                                    AircraftTypeName: Schedules?.carrier?.equipment?.code || 'N/A',
                                    DepartureGate: Schedules?.departure?.terminal || 'TBA',
                                    ArrivalGate: Schedules?.arrival?.terminal || 'TBA',
                                    HiddenStops: Schedules?.hiddenStops || [],
                                    TotalMilesFlown: Schedules?.totalMilesFlown || 0,
                                    SegmentCode: allSegments[index],
                                };

                                segments.push(SingleSegments);
                            } catch (error) {
                                console.error(error instanceof Error ? error.message : String(error));
                            }
                        }

                        legInfo['Segments'] = segments;
                        AllLegsInfo.push(legInfo);
                    }

                        FlightItenary.push({
                        Token: '',
                        Key : '',
                        System: "Sabre",
                        TripType: TripType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        ProviderCode: "2S",
                        Cabinclass: Class,
                        Currency: agentdata?.currency,
                        BaseFare: Number(equivalentAmount).toFixed(2),
                        Taxes : Number(Taxes).toFixed(2),
                            NetFare: Number(NetFare).toFixed(2),
                        GrossFare: Number(TotalFare).toFixed(2),
                            Fees: Number(Fees).toFixed(2),
                        MarkUp: Number(-DiscountAmount).toFixed(2),
                        ConversionRate : conversionRate,
                        TimeLimit: TimeLimit,
                        Refundable: Refundable,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo : AllLegsInfo
                        });
                }
            }

            return FlightItenary;
        }else{
            return [];
        }
    }

    async getAirports(code: string) {
        const foundItem = airportsData.find(item => item.code === code);
        if (foundItem) {
          return foundItem;
        } else {
          return {code: '', name : '', location: ''};
        }
    }

    async getAirlineName(code: string) {
        const foundItem = airlinesData.find(item => item.iata === code);
        if (foundItem) {
          return foundItem.marketing_name;
        } else {
          return 'N/F';
        }
    }

}