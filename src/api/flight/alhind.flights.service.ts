import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as dotenv from "dotenv";
import { Repository } from 'typeorm';
import { PassengerService } from '../passenger/passenger.service';
import { BookingModel } from '../booking/booking.model';
import { BookingService } from '../booking/booking.service';
import { SearchhistoryService } from '../searchhistory/searchhistory.service';
import { FlightSearchModel } from './dto/search-flight.dto';
import { AgentModel } from '../agent/agent.model';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { airportsData } from './data/airports.data';
import { airlinesData } from './data/airlines.data';
import { Revalidation } from './dto/revalidation-flight.dto';
import { CurrencyConverter } from '../currency/entities/currency.entity';
dotenv.config()


@Injectable()
export class AlhindAPI {
    constructor(
      @InjectRepository(BookingModel)
      private readonly bookingRepository: Repository<BookingModel>,
      @InjectRepository(CurrencyConverter)
      private readonly currencyConverterRepository: Repository<CurrencyConverter>,
      private readonly passengerService: PassengerService,
      private readonly bookingService: BookingService,
      private readonly searchHistoryService: SearchhistoryService,

      private readonly airlinesService: AirlinesService,
      private readonly airportsService: AirportsService,
    ) {}

  async flights(agent : AgentModel, flightDto : FlightSearchModel) {

    const totalSegment = flightDto?.segments;
    let data : any;
    if(totalSegment.length < 2 && totalSegment[0]?.arrto){
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
        "UserId": "AEAUH029003100",
        "Password": "Usman@3102",
        "Error": null,
        "IncludeAirline": null,
        "ExcludeAirline": null,
        "Status": null,
        "DestinationNation": "AE",
        "OriginNation": "AE",
        "Classes": "Economy"
    };

    }else if(totalSegment.length > 1 && totalSegment[0]?.arrto === totalSegment[1]?.depfrom){
        if(totalSegment[0]?.arrto){
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
                "UserId": "AEAUH029003100",
                "Password": "Usman@3102",
                "Error": null,
                "IncludeAirline": null,
                "ExcludeAirline": null,
                "Status": null,
                "DestinationNation": "AE",
                "OriginNation": "AE",
                "Classes": "Economy"
            }
        }
    }else{
        return []
    }

    const headers = {
      Accept: '/',
      'Content-Type': 'application/json',
    };

    try{
      const response = await axios.post(`https://b2b.keenantravel.com/search.php`, data, {headers});
        const result = response?.data;
        return this.flightUtils(result, agent, flightDto);
    }catch (err) {
      console.log(err.response.data);
      return [];
    }
  }

  async sflightUtils(result : any, agentdata: AgentModel, flighDto: FlightSearchModel){

    if(result?.Journy?.FlightOptions?.length > 0){
   
            const DepPlace  = flighDto.segments[0].depfrom;
            const ArrPlace = flighDto.segments[0].arrto;

            const DepCounty = await this.airportsService.getCountry(DepPlace);
            const ArrCounty = await this.airportsService.getCountry(ArrPlace);

            let farepolicy: string;
            if(DepCounty === 'AE' && ArrCounty === 'AE'){
                farepolicy = 'domestic';
            }else if(DepCounty != 'AE' && ArrCounty != 'AE'){
                farepolicy = 'soto';
               
            }else if(DepCounty != 'AE' && ArrCounty === 'AE'){
                farepolicy = 'soti';
                
            }else if(DepCounty === 'AE' && ArrCounty != 'AE'){
                farepolicy = 'sito';
                
            }

            const FlightItenary = [];
            const AllFlights : any[] = result?.Journy?.FlightOptions;

            let TripType: string;
            if(flighDto?.segments?.length === 1){
                TripType = 'Oneway';
            }else if(flighDto?.segments?.length > 1){
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

            //return AllFareWithPrice;

            const conversionData = await this.currencyConverterRepository.findOne({
                where: {alternate: agentdata.currency}});

            const converstionrate = conversionData?.exchange_rate || 1;

            for (const flights of AllFareWithPrice){
                const ValidatingCarrier : string = flights?.TicketingCarrier;
                const airlineData : any = await this.airlinesService.getAirlines(ValidatingCarrier);
                const AllPassenger : any[] = flights.PriceBreakDown?.Fares;
                const CarrierName: string = airlineData?.marketing_name || 'N/F';
                const equivalentAmount : number = Math.ceil(flights.PriceBreakDown?.AprxTotalBaseFare * converstionrate * 100)/ 100;
                const Taxes : number = Math.ceil(flights.PriceBreakDown?.AprxTotalTax * converstionrate * 100)/100;
                let TotalFare: number = Math.ceil(flights.PriceBreakDown?.TotalAmount * converstionrate * 100)/100;

                const adminMarkUpType: string = agentdata?.markuptype;
                const adminMarkUp: number = agentdata?.markup;

                let adminMarkUpAmount: number = 0;
                if(adminMarkUpType === 'percent'){
                    adminMarkUpAmount =  equivalentAmount * (adminMarkUp/100);
                }else if((adminMarkUpType === 'amount')){
                    adminMarkUpAmount =  adminMarkUp;
                }

                const addAmount: number = airlineData?.addAmount;
                let ComissionPolicy: number = 0;
                if(farepolicy === 'soti'){
                    ComissionPolicy = airlineData?.soti;
                }else if(farepolicy === 'soto'){
                    ComissionPolicy = airlineData?.soto;
                }else if(farepolicy === 'sito'){
                    ComissionPolicy = airlineData?.sito;
                }else if(farepolicy === 'domestic'){
                    ComissionPolicy = airlineData?.domestic;
                }

                const airlinesMarkUpAmount =  equivalentAmount * (ComissionPolicy/100);
                const agentMarkUpType: string = agentdata?.clientmarkuptype;
                const agentMarkUp: number = agentdata?.clientmarkup;
                const currency: string = agentdata?.currency;

                let agentMarkUpAmount: number = 0;
                if(agentMarkUpType === 'percent'){
                    agentMarkUpAmount =  equivalentAmount * (agentMarkUp/100);
                }else if((agentMarkUpType === 'amount')){
                    agentMarkUpAmount =  agentMarkUp;
                }

                const NetFare = Math.ceil((equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes) * 100)/100;

                if(NetFare > TotalFare){
                    TotalFare = NetFare;
                }


                const Refundable : boolean = flights.PriceBreakDown?.RefundableInfo;
                let TimeLimit : string = '';
                let cabinclass : string = 'Y';
                let Class = flights?.PriceBreakDown?.FareName;

                const PriceBreakDown : any[] = AllPassenger?.map(allPassenger => {
                    const BaggageAllowance = flights?.FlightLegs[0]?.FreeBaggages;
                    const fidToSearch = flights.PriceBreakDown?.FID;
                    const bagAllowance = BaggageAllowance.find(baggage => baggage.FID === fidToSearch);
                    const PaxType = allPassenger?.PTC === 'CHD' ? 'CNN' : allPassenger?.PTC;
                    let paxCount: number;
                    let Baggage: any;
                    if(PaxType === 'ADT'){
                        paxCount = flighDto.adultcount
                        if(flighDto.segments.length === 1){
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Adt_Baggage || '',
                                }
                            ];
                        }else if(flighDto.segments.length === 2){
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
                    }else if(PaxType === 'CHD' || PaxType === 'CNN'){
                        paxCount = flighDto.childcount
                        if(flighDto.segments.length === 1){
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Chd_Baggage || '',
                                }
                            ];
                        }else if(flighDto.segments.length === 2){
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
                    }else if(PaxType === 'INF'){
                        paxCount = flighDto.childcount
                        if(flighDto.segments.length === 1){
                            Baggage = [
                                {
                                    Airline: ValidatingCarrier,
                                    Allowance: bagAllowance?.Inf_Baggage || '',
                                }
                            ];
                        }else if(flighDto.segments.length === 2){
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
    
                    const totalTaxAmount = Math.ceil(allPassenger?.Tax * converstionrate * 100)/100;
                    const PaxequivalentAmount = Math.ceil(allPassenger?.BaseFare * converstionrate * 100) / 100;
                    const PaxtotalFare = Math.ceil((PaxequivalentAmount + totalTaxAmount) * 100)/ 100;


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
                        DepLocation:(await this.getAirports(segment?.Origin))?.location,
                        DepDateAdjustment: '',
                        DepTime: segment?.DepartureTime,
                        ArrTo: segment?.Destination,
                        ArrAirPort: (await this.getAirports(segment?.Destination)).name,
                        ArrLocation: (await this.getAirports(segment?.Destination)).location,
                        ArrDateAdjustment: '',//AdjustArrDate,
                        ArrTime: segment?.ArrivalTime,
                        OperatedBy: segment?.CodeShare, //await this.airlinesService.getAirlinesName(OperatedBy),
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
                            "seatsAvailable": 9 //flights?.AvailableSeat || 9
                        },
                    };
                    AllSegmentInfo.push(SingleSegments);
                }
                const LegDuration : string = '';
                const departureDate = flighDto.segments[0].depdate;

                const AllLegsInfo = [
                    {
                        DepDate: departureDate,
                        DepFrom: flighDto.segments[0].depfrom,
                        ArrTo: flighDto.segments[0].arrto,
                        Duration: LegDuration,
                        Segments: AllSegmentInfo 
                    }];

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
                    AllLegsInfo : AllLegsInfo
                });
            
            }

            return FlightItenary;
        }else{
            return [];
        }
  }

  async flightUtils(result : any, agentdata: AgentModel, flighDto: FlightSearchModel){

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

    // ---- STEP 3: Fetch conversion rate once ----
    const conversionData = await this.currencyConverterRepository.findOne({
        where: { alternate: agentdata.currency }
    });
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
        const availableSeat = flights?.AvailableSeat || 9;
        const airlineData = await getAirline(flights?.TicketingCarrier);
        const CarrierName = airlineData?.marketing_name || 'N/F';
        
        const { AprxTotalBaseFare, AprxTotalTax, TotalAmount, Fares, RefundableInfo, FareName, FID } = flights.PriceBreakDown;

        const isRefundable = RefundableInfo != null && RefundableInfo.toLowerCase() === "Refundable";

        const equivalentAmount = Math.ceil(AprxTotalBaseFare * conversionRate * 100) / 100;
        const Taxes = Math.ceil(AprxTotalTax * conversionRate * 100) / 100;
        let TotalFare = Math.ceil(TotalAmount * conversionRate * 100) / 100;

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
            : agentdata?.clientmarkuptype === 'amount'
                ? agentdata.clientmarkup
                : 0;

        const addAmount = airlineData?.addAmount || 0;
        const NetFare = Math.ceil((equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes) * 100) / 100;
        if (NetFare > TotalFare) TotalFare = NetFare;

        // Price breakdown per passenger
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

        // ---- STEP 6: Split segments into onward & return ----
        const onwardSegments = flights?.FlightLegs?.filter(seg => seg.Type === '0') ?? [];
        const returnSegments = flights?.FlightLegs?.filter(seg => seg.Type === '1') ?? [];

        const mapSegments = async (segments) => {
            return Promise.all(segments.map(async segment => {
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


  async priceCheck(agent : AgentModel, revalidation: Revalidation){
    return revalidation;
  }
  async getAirports(code: string) {
        const foundItem = airportsData.find(item => item.code === code);
        if (foundItem) {
          return foundItem;
        } else {
          return {code: '', name : '', location};
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
