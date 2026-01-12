import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as dotenv from "dotenv";
import { Like, Repository } from 'typeorm';
import { FlightSearchModel } from './dto/search-flight.dto';
import { AgentModel } from '../agent/agent.model';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { airportsData } from './data/airports.data';
import { airlinesData } from './data/airlines.data';
import { Revalidation } from './dto/revalidation-flight.dto';
import { CurrencyConverter } from '../currency/entities/currency.entity';
import { SaveFlightsData } from './entity/save-flight.entity';
import { AirlineDiscount, AirlineDiscountForAgent } from '../airlines/airlines.model';
dotenv.config()

type AlhindFlightLeg = {
    Type?: string;
    Origin?: string;
    Destination?: string;
    AirlineCode?: string;
    FlightNo?: string;
    DepartureTime?: string;
    ArrivalTime?: string;
    CodeShare?: string;
    DepartureTerminal?: string;
    ArrivalTerminal?: string;
    hiddenStops?: any[];
    Distance?: number;
    RBD?: string;
    MealKey?: string;
    FreeBaggages?: any[];
};

type AlhindFare = {
    PTC?: string;
    Tax?: number;
    BaseFare?: number;
};

@Injectable()
export class AlhindAPI {
    constructor(
      @InjectRepository(CurrencyConverter)
      private readonly currencyConverterRepository: Repository<CurrencyConverter>,
      @InjectRepository(AirlineDiscount)
      private readonly airlineDiscountRepository: Repository<AirlineDiscount>,
      @InjectRepository(AirlineDiscountForAgent)
      private readonly airlineDiscountForAgentRepository: Repository<AirlineDiscountForAgent>,
      @InjectRepository(SaveFlightsData)
      private readonly saveFlightsData: Repository<SaveFlightsData>,
      private readonly airlinesService: AirlinesService,
      private readonly airportsService: AirportsService,
    ) {}

  async flights(agent : AgentModel, flightDto : FlightSearchModel) {

    const segments = flightDto?.segments ?? [];
    const firstSegment = segments[0];
    if (!firstSegment?.arrto) return [];

    const data: any = {
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
        if (firstSegment.arrto !== segments[1]?.depfrom) return [];
        data.TripMode = "R";
        data.ReturnDate = segments[1].depdate;
    }

    const headers = {
      Accept: '/',
      'Content-Type': 'application/json',
    };

    try{
      const response = await axios.post(`https://b2b.keenantravel.com/search.php`, data, {headers});
        const result = response?.data;
        return this.flightsUtilsUpdate(result, agent, flightDto);
    }catch (err) {
      console.log(err?.response?.data);
      return [];
    }
  }

  async flightUtils(result : any, agentdata: AgentModel, flighDto: FlightSearchModel){

    if (!(result?.Journy?.FlightOptions?.length > 0)) {
        return [];
    }

    // ---- STEP 1: Pre-fetch static values ----
    const DepPlace = flighDto.segments[0].depfrom;
    const ArrPlace = flighDto.segments[0].arrto;

    const [DepCounty, ArrCounty] = await Promise.all([
        this.airportsService.getCountry(DepPlace),
        this.airportsService.getCountry(ArrPlace)
    ]);

    const farepolicy =
        DepCounty === 'AE' && ArrCounty === 'AE' ? 'domestic' :
        DepCounty !== 'AE' && ArrCounty !== 'AE' ? 'soto' :
        DepCounty !== 'AE' && ArrCounty === 'AE' ? 'soti' :
        'sito';

    const TripType = flighDto?.segments?.length === 1 ? 'Oneway' : 'Return';
    const AllFlights: any[] = result?.Journy?.FlightOptions || [];

    // ---- STEP 2: Flatten all fares with price ----
    const AllFareWithPrice = AllFlights.flatMap(mflights =>
        (mflights?.FlightFares ?? []).map(flight => {
            const copy = { ...mflights, PriceBreakDown: flight };
            delete copy.FlightFares;
            return copy;
        })
    );

    this.saveFlightsData.save({
        token: result?.Token || '',
        triptype: TripType,
        data: AllFareWithPrice || [],
    });

    // ---- STEP 3: Fetch conversion rate once ----
    const conversionData = await this.currencyConverterRepository.findOne({where: { alternate: agentdata.currency }});
    const conversionRate = conversionData?.exchange_rate || 1;

    // ---- STEP 4: Cache airports & airlines to avoid repeated DB/API calls ----
    const airportCache = new Map<string, any>();
    const airlineCache = new Map<string, any>();

    const getAirport = async (code: string) => {
        if (!airportCache.has(code)) {
            airportCache.set(code, await this.getAirports(code));
        }
        return airportCache.get(code);
    };

    const getAirline = async (code: string) => {
        if (!airlineCache.has(code)) {
            airlineCache.set(code, await this.airlinesService.getAirlines(code));
        }
        return airlineCache.get(code);
    };

    // ---- STEP 5: Process all flights in parallel ----
    const FlightItenary = await Promise.all(AllFareWithPrice.map(async flights => {
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

        // Admin markup
        const adminMarkUpAmount = agentdata?.markuptype === 'percent'
            ? equivalentAmount * (agentdata.markup / 100)
            : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;

        // Commission policy
        const ComissionPolicy = airlineData?.[farepolicy] ?? 0;
        const airlinesMarkUpAmount = equivalentAmount * (ComissionPolicy / 100);

        // Agent markup
        const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
            ? equivalentAmount * (agentdata.clientmarkup / 100)
            : agentdata?.clientmarkuptype === 'amount' ? agentdata.clientmarkup: 0;

        const addAmount = airlineData?.addAmount || 0;
        const NetFare = equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes;
        if (NetFare > TotalFare) TotalFare = NetFare;

        const Fees = agentMarkUpAmount;

        const legs: AlhindFlightLeg[] = flights?.FlightLegs ?? [];
        // Outbound baggage (always exists if FlightLegs has data)
        const firstLegBaggage = legs[0]?.FreeBaggages ?? [];
        const firstLegBagAllowance = firstLegBaggage.find(b => b.FID === FID);

        // Return baggage (only if more than 1 leg)
        const lastLegBaggage = legs.length > 1 ? legs[legs.length - 1]?.FreeBaggages ?? [] : [];
        const lastLegBagAllowance = lastLegBaggage.find(b => b.FID === FID);

        const PriceBreakDown = Fares.map((pax: AlhindFare) => {
        const PaxType = pax?.PTC === 'CHD' ? 'CNN' : pax?.PTC;
        const paxCount =
            PaxType === 'ADT'
            ? flighDto.adultcount
            : PaxType === 'CHD' || PaxType === 'CNN'
            ? flighDto.childcount
            : flighDto.infantcount || 0;

        const bagType =
            PaxType === 'ADT'
            ? 'Adt_Baggage'
            : PaxType === 'CHD' || PaxType === 'CNN'
            ? 'Chd_Baggage'
            : 'Inf_Baggage';

        // Build baggage info
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

        // ---- STEP 6: Split segments into onward & return ----
        const onwardSegments = legs.filter(seg => seg.Type === '0');
        const returnSegments = legs.filter(seg => seg.Type === '1');

        const mapSegments = async (segments: AlhindFlightLeg[]) => {
            return Promise.all(segments.map(async segment => {
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

  async flightsUtilsUpdate(result: any, agentdata: AgentModel, flightDto: FlightSearchModel) {
    const today = new Date();
    if (!(result?.Journy?.FlightOptions?.length > 0)) return [];

    const segments = flightDto?.segments ?? [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const TripType = segments.length === 1 ? 'Oneway' : 'Return';
    const AllFlights: any[] = result?.Journy?.FlightOptions || [];

    // ---- Flatten all fares ----
    const AllFareWithPrice = AllFlights.flatMap(mflights =>
        (mflights?.FlightFares ?? []).map(flight => {
            const copy = { ...mflights, PriceBreakDown: flight };
            delete copy.FlightFares;
            return copy;
        })
    );

    // ---- Save raw flights data ----
    await this.saveFlightsData.save({
        token: result?.Token || '',
        triptype: TripType,
        data: AllFareWithPrice || [],
    });

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
    if(agentdata.currency === 'PKR'){
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

    // ---- Process all flights ----
    const FlightItenary = await Promise.all(AllFareWithPrice.map(async flights => {

        const Token = result?.Token || '';
        const Key = flights?.Key;
        const availableSeat = flights?.AvailableSeat || 9;

        const airlineData = await getAirline(flights?.TicketingCarrier);
        const CarrierName = airlineData?.marketing_name || 'N/F';
        const ProviderCode = flights?.ProviderCode || 'NF';

        const { AprxTotalBaseFare, AprxTotalTax, TotalAmount, Fares, RefundableInfo, FareName, FID } = flights?.PriceBreakDown;
        const isRefundable = RefundableInfo === "Refundable";

        let conversionRate: any = 1;
        if(agentdata.currency === 'PKR'){
            const key = `${ProviderCode}-${agentdata.currency}`;
            const data = rateMap.get(key);
            conversionRate = data?.exchange_rate || rateMap?.get('DF-PKR').exchange_rate;
        }

        // ---- Base fare & taxes ----
        const equivalentAmount = AprxTotalBaseFare * conversionRate;
        const Taxes = AprxTotalTax * conversionRate;
        let TotalFare = (TotalAmount * conversionRate);

        // Admin markup
        const adminMarkUpAmount = agentdata?.markuptype === 'percent'
            ? equivalentAmount * (agentdata.markup / 100)
            : agentdata?.markuptype === 'amount' ? agentdata.markup : 0;

        // Agent markup
        const agentMarkUpAmount = agentdata?.clientmarkuptype === 'percent'
            ? equivalentAmount * (agentdata.clientmarkup / 100)
            : agentdata?.clientmarkuptype === 'amount' ? agentdata.clientmarkup : 0;

        const TotalFareWithMarkUp = equivalentAmount + adminMarkUpAmount + agentMarkUpAmount + Taxes;

        const legs: AlhindFlightLeg[] = flights?.FlightLegs ?? [];
        const filter = {
            ...baseFilter,
            rbd: legs[0]?.RBD,
        };

        const { percent: airlinesDiscountPercent, amount: airlinesDiscountAmount } = await resolveDiscountPolicy(
            flights?.TicketingCarrier,
            flights?.ProviderCode,
            filter
        );

        const discountPercentValue = (TotalFareWithMarkUp * (airlinesDiscountPercent / 100)) || 0;
        const FareAfterDiscount = TotalFareWithMarkUp - discountPercentValue - airlinesDiscountAmount;
        const DiscountAmount = Number(discountPercentValue + airlinesDiscountAmount);
        const NetFare = Number(FareAfterDiscount.toFixed(2));
        const Fees = agentMarkUpAmount;

        if (NetFare > TotalFare) TotalFare = NetFare;

        // ---- Build passenger price breakdown with ASC ----
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

        const buildBaggageInfo = (bagType: string) => {
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

        const PriceBreakDown = Fares.map((pax: AlhindFare) => {
            const PaxType = pax?.PTC === 'CHD' ? 'CNN' : pax?.PTC;
            const paxCount = paxCounts[PaxType] ?? 0;
            const bagType = PaxType === 'ADT' ? 'Adt_Baggage'
                          : PaxType === 'CHD' || PaxType === 'CNN' ? 'Chd_Baggage'
                          : 'Inf_Baggage';

            const baggageInfo = buildBaggageInfo(bagType);
            const PaxequivalentAmount = (pax?.BaseFare + (-addValue) + anotherFees) * conversionRate;
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

        // ---- Split segments ----
        const onwardSegments = legs.filter(seg => seg.Type === '0') ?? [];
        const returnSegments = legs.filter(seg => seg.Type === '1') ?? [];

        const mapSegments = async (segments: AlhindFlightLeg[]) => {
            return Promise.all(segments.map(async segment => {
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
            Taxes : Number(Taxes).toFixed(2),
            NetFare,
            GrossFare: Number(TotalFare).toFixed(2),
            Fees,
            MarkUp: Number(-DiscountAmount).toFixed(2),
            ConversionRate : conversionRate,
            TimeLimit: '',
            Refundable: isRefundable,
            PriceBreakDown,
            AllLegsInfo
        };
    }));

    return FlightItenary;

  }

  async priceCheck(agent : AgentModel, revalidation: Revalidation){
    return revalidation;
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
