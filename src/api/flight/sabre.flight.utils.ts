import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { AgentModel } from '../agent/agent.model';
import { airportsData } from './data/airports.data';
import { airlinesData } from './data/airlines.data';
dotenv.config()

@Injectable()
export class SabreUtils {
    constructor(
        private readonly airlinesService: AirlinesService,
        private readonly airportsService: AirportsService,
    ){}


    async restBFMParser(agentdata : AgentModel, SearchResponse: any) {

        if(SearchResponse?.groupedItineraryResponse?.statistics?.itineraryCount > 0){
   
            const DepPlace  = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0].groupDescription?.legDescriptions[0]?.departureLocation;
            const ArrPlace = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0].groupDescription?.legDescriptions[0]?.arrivalLocation;

            const DepCounty = await this.airportsService.getCountry(DepPlace);
            const ArrCounty = await this.airportsService.getCountry(ArrPlace);

            let farepolicy: string;
            let partialoption: boolean;
            if(DepCounty === 'BD' && ArrCounty === 'BD'){
                farepolicy = 'domestic';
                partialoption = false;
            }else if(DepCounty != 'BD' && ArrCounty != 'BD'){
                farepolicy = 'soto';
                partialoption = false;
            }else if(DepCounty != 'BD' && ArrCounty === 'BD'){
                farepolicy = 'soti';
                partialoption = true;
            }else if(DepCounty === 'BD' && ArrCounty != 'BD'){
                farepolicy = 'sito';
                partialoption = true;
            }

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

                for (const flights of GroupAllFlights.flat()) {
                    const ValidatingCarrier : string = flights.pricingInformation[0].fare.validatingCarrierCode;
                    const airlineData : any = await this.airlinesService.getAirlines(ValidatingCarrier);
                    const AllPassenger : any[] = flights.pricingInformation[0].fare.passengerInfoList;
                    const CarrierName: string = airlineData?.marketing_name || 'N/F';
                    const equivalentAmount : number = flights.pricingInformation[0].fare.totalFare.equivalentAmount;
                    const Taxes : number = flights.pricingInformation[0].fare.totalFare.totalTaxAmount;
                    let TotalFare: number = flights.pricingInformation[0].fare.totalFare.totalPrice;

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

                    const NetFare = equivalentAmount + adminMarkUpAmount + airlinesMarkUpAmount + addAmount + agentMarkUpAmount + Taxes;

                    if(NetFare > TotalFare){
                        TotalFare = NetFare;
                    }

                    const Refundable : boolean = !flights.pricingInformation?.[0].fare.passengerInfoList?.[0].passengerInfo.nonRefundable;
                    let TimeLimit : string;
                    if (flights?.pricingInformation?.[0]?.fare?.lastTicketDate) {
                        const lastTicketDate : string = flights.pricingInformation?.[0]?.fare?.lastTicketDate;
                        const lastTicketTime : string = flights.pricingInformation?.[0]?.fare?.lastTicketTime;
                        TimeLimit = `${lastTicketDate}T${lastTicketTime}:00`;
                    }

                    let cabinclass : string = AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]?.segment?.cabinCode || 'Y';
                    let Class : string;
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

                    const PriceBreakDown : any[] = AllPassenger?.map(allPassenger => {
                        const PaxType = allPassenger?.passengerInfo?.passengerType;
                        const paxCount = allPassenger?.passengerInfo?.passengerNumber;
                        const PaxtotalFare = allPassenger?.passengerInfo?.passengerTotalFare?.totalFare;
                        const totalTaxAmount = allPassenger?.passengerInfo?.passengerTotalFare?.totalTaxAmount;
                        const PaxequivalentAmount = allPassenger?.passengerInfo?.passengerTotalFare?.equivalentAmount;
                
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
                            BaseFare: PaxequivalentAmount,
                            Taxes: totalTaxAmount,
                            TotalFare: PaxtotalFare,
                            PaxCount: paxCount,
                            Bag: Baggage,
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
                                console.error(error.message);
                            }
                        }

                        legInfo['Segments'] = segments;
                        AllLegsInfo.push(legInfo);
                    }

                    FlightItenary.push({
                        System: "Sabre",
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