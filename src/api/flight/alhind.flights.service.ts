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
dotenv.config()


@Injectable()
export class AlhindAPI {
    constructor(
      @InjectRepository(BookingModel)
      private readonly bookingRepository: Repository<BookingModel>,
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
                "UserId": "AEDXB029001500",
                "Password": "APIuser@1234",
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
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try{
      const response = await axios.post(process.env.AH_ENDPOINT_SEARCH, data, {headers});
        const result = response?.data;
        return this.flightUtils(result, agent, flightDto);
    }catch (err) {
      console.log(err.response.data);
      return err.response.data;
    }
  }

  async flightUtils(result : any, agentdata: AgentModel, flighDto: FlightSearchModel){

    if(result?.Journy?.FlightOptions?.length > 0){
   
            const DepPlace  = flighDto.segments[0].depfrom;
            const ArrPlace = flighDto.segments[0].arrto;

            const DepCounty = await this.airportsService.getCountry(DepPlace);
            const ArrCounty = await this.airportsService.getCountry(ArrPlace);

            let farepolicy: string;
            let partialoption: boolean;
            if(DepCounty === 'AE' && ArrCounty === 'AE'){
                farepolicy = 'domestic';
                partialoption = false;
            }else if(DepCounty != 'AE' && ArrCounty != 'AE'){
                farepolicy = 'soto';
                partialoption = false;
            }else if(DepCounty != 'AE' && ArrCounty === 'AE'){
                farepolicy = 'soti';
                partialoption = true;
            }else if(DepCounty === 'AE' && ArrCounty != 'AE'){
                farepolicy = 'sito';
                partialoption = true;
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
            for(const flights of AllFlights){
                for(const flight of flights?.FlightFares){
                    flights['PriceBreakDown'] = flight;
                     delete flights.FlightFares;
                    AllFareWithPrice.push(flights)

                }
               
            }

            for (const flights of AllFareWithPrice){
                const ValidatingCarrier : string = flights?.TicketingCarrier;
                const airlineData : any = await this.airlinesService.getAirlines(ValidatingCarrier);
                const FareType: string = flights?.ProviderCode;
                const AllPassenger : any[] = flights.PriceBreakDown?.Fares;
                const CarrierName: string = airlineData?.marketing_name || 'N/F';
                const Instant_Payment : boolean = false; //airlineData?.instantPayment;
                const IssuePermit : boolean = false; //airlineData?.issuePermit;
                const IsBookable : boolean = true; //airlineData?.bookable;
                const equivalentAmount : number = flights.PriceBreakDown?.AprxTotalBaseFare;
                const Taxes : number =flights.PriceBreakDown?.AprxTotalTax;
                let TotalFare: number = flights.PriceBreakDown?.TotalAmount;

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

                const PartialAmount: number = 0;

                const Refundable : boolean = flights.PriceBreakDown?.RefundableInfo;
                let TimeLimit : string = '';
                const BrandName = flights.PriceBreakDown?.FareName;
                let cabinclass : string = 'Y';
                let Class = flights.PriceBreakDown?.FareName;
                // switch (cabinclass) {
                //     case 'P':
                //     Class = "First";
                //     break;
                //     case 'J':
                //     Class = "Premium Business";
                //     break;
                //     case 'C':
                //     Class = "Business";
                //     break;
                //     case 'S':
                //     Class = "Premium Economy";
                //     break;
                //     case 'Y':
                //     Class = "Economy";
                //     break;
                // }

                const PriceBreakDown : any[] = AllPassenger?.map(allPassenger => {
                    const PaxType = allPassenger?.PTC;
                    let paxCount = 0;
                    if(PaxType === 'ADT'){
                        paxCount = flighDto.adultcount
                    }else if(PaxType === 'CHD'){
                        paxCount = flighDto.childcount
                    }else if(PaxType === 'INF'){
                        paxCount = flighDto.childcount
                    }
    
                    const totalTaxAmount = allPassenger?.Tax;
                    const PaxequivalentAmount = allPassenger?.BaseFare;
                    const PaxtotalFare = PaxequivalentAmount + totalTaxAmount;
            
                    const BaggageAllowance = flights?.FlightLegs;
                    const Baggage = BaggageAllowance?.map(baggageAllowance => {
                        const BagAirlineCode = baggageAllowance?.airlineCode;
                        const AllowanceRef = ''; //AllBaggage[baggageAllowance?.allowance?.ref - 1];

                        let Allowance : string ='';
                        if(AllowanceRef){
                            Allowance = AllowanceRef+ ' Piece';
                        }else{
                            Allowance = AllowanceRef+ ' KG';
                        }
                        
                        return {
                            Airline: BagAirlineCode,
                            Allowance: Allowance,
                        };
                    });

                    let i=0;
                    // const FareBasis = allPassenger?.passengerInfo?.fareComponents?.map(fareComponent =>{
                    //     i++;
                    //     const farecompoRef = fareComponent?.ref;
                    //     //const fareCompo = AllFareCompoDescs[farecompoRef-1];
                    //     return {
                    //         Origin : fareComponent?.beginAirport,
                    //         Destination: fareComponent?.endAirport,
                    //         DepDate: '', //GroupLegDescs[i-1]?.departureDate || GroupLegDescs[0]?.departureDate,
                    //         FareBasisCode: '',//fareCompo.fareBasisCode,
                    //         Carrier: '',//fareCompo.governingCarrier
                    //     }
                    // });

                    return {
                        PaxType: PaxType,
                        BaseFare: PaxequivalentAmount,
                        Taxes: totalTaxAmount,
                        TotalFare: PaxtotalFare,
                        PaxCount: paxCount,
                        //Bag: Baggage,
                        //FareComponent: FareBasis
                    };
                });

                const AllLegsInfo = [];
                const AllLegsData = flights?.FlightLegs;

                let i = 0;
                for (const segment of AllLegsData) {
                    i++;
                    const LegDuration : string = '';
                    const departureDate : string = flights[i-1]?.depdate;
                
                    const legInfo = {
                        DepDate: '', //AllLegs[i]?.departureDate,
                        DepFrom: '' , //AllLegs[i]?.departureLocation,
                        ArrTo: '', //AllLegs[i]?.arrivalLocation,
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
                        SegmentCode: '' //allSegments[index],
                    };
                    AllLegsInfo.push(SingleSegments);
                }

                FlightItenary.push({
                    //ResultId: '',
                    //OfferId: uuidv4(),
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
                    PriceBreakDown: PriceBreakDown,
                    AllLegsInfo : AllLegsInfo
                });
            
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
