import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
import { AgentModel } from '../agent/agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { MoreThan } from "typeorm";
import { CurrencyConverter } from '../currency/entities/currency.entity';
import { airportsData } from '../flight/data/airports.data';

@Injectable()
export class GroupfareService {

  constructor(
    @InjectRepository(GroupFareModel)
    private readonly groupFareRepository: Repository<GroupFareModel>,
    @InjectRepository(CurrencyConverter)
    private readonly  CurrencyConverterRepository: Repository<CurrencyConverter>,
    private readonly authService: AuthService,
    private readonly airlinesService: AirlinesService,
    private readonly airportsService: AirportsService,
  ){}

  private formatAirportLabel(code?: string) {
    if (!code) return '';
    const airport = airportsData.find(item => item.code === code);
    const city = airport?.location?.split(',')[0]?.trim();
    const cityLabel = city ? city.toUpperCase() : '';
    return cityLabel ? `${code} (${cityLabel})` : code;
  }
  async create(header: any, data: any) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const groupfare = await this.groupFareRepository.find({order: { id: 'DESC' }, take : 1});

    let groupId: string;
    if(groupfare.length == 1){
      let old_group_id = (groupfare[0].GroupId).replace("KTG",'');
      groupId = "KTG" + (parseInt(old_group_id) + 1);
    }else{
      groupId = 'KTG1000';
    }

    if(data.length === 1){
      const createGroupfareDto = data?.[0];
      createGroupfareDto['GroupId'] = groupId;
      createGroupfareDto['TripType'] = 'O';
      createGroupfareDto['RouteFrom'] = createGroupfareDto.DepFrom;
      createGroupfareDto['RouteTo'] = createGroupfareDto.ArrTo;
      createGroupfareDto.segment = createGroupfareDto.ArrivalTo === createGroupfareDto.DepartureFrom1 ? 2 : 1;
      return  this.groupFareRepository.save(createGroupfareDto);
    }else if(data?.length === 2){
      const createGroupfareDto = data?.[0];
      createGroupfareDto['GroupId'] = groupId;
      createGroupfareDto['TripType'] = 'R';
      createGroupfareDto['RouteFrom'] = createGroupfareDto.DepFrom;
      createGroupfareDto['RouteTo'] = createGroupfareDto.ArrTo;
      createGroupfareDto.segment = createGroupfareDto.ArrivalTo === createGroupfareDto.DepartureFrom1 ? 2 : 1;
      createGroupfareDto['rSegment'] = createGroupfareDto['rArrTo'] === createGroupfareDto['rDepFrom1'] ? 2 : 1;
      createGroupfareDto['rDate'] = data?.[1].DepDate;
      createGroupfareDto['rDepFrom'] = data?.[1].DepartureFrom;
      createGroupfareDto['rArrTo'] = data?.[1].ArrivalTo;
      createGroupfareDto['rDepTime'] = data?.[1].DepTime;
      createGroupfareDto['rArrTime'] = data?.[1].ArrTime;
      createGroupfareDto['rFlightNo'] = data?.[1].FlightNumber;
      createGroupfareDto['rDepFrom1'] = data?.[1].DepartureFrom1;
      createGroupfareDto['rArrTo1'] = data?.[1].ArrivalTo1;
      createGroupfareDto['rDepTime1'] = data?.[1].DepTime1;
      createGroupfareDto['rArrTime1'] = data?.[1].ArrTime1;
      createGroupfareDto['rFlightNo1'] = data?.[1].FlightNumber1;

      return  this.groupFareRepository.save(createGroupfareDto);
    }else{

    }
  }

  async findAllAdmin(header: any) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const groupdata = await this.groupFareRepository.find({
      where: {
        DepDate: MoreThan(today),   // compares lexicographically
      },
      order: {
        DepDate: "ASC",             // string sort works if format is YYYY-MM-DD
      },
    });

    let agent: any;
    if(groupdata.length > 0){
      const flightParserPromises = groupdata.map(group => this.flightParser(agent, group));
      return await Promise.all(flightParserPromises);
    }else{
      return [];
    }
  }

  async findAllAgentSpecialFare(header: any, triptype: string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const groupdata = await this.groupFareRepository
    .createQueryBuilder('gf')
    .select([
      'gf.RouteFrom',
      'gf.RouteTo',
      'MIN(gf.DepDate) as DepDate',
    ])
    .where('gf.DepDate > :today', { today })
    .andWhere('gf.tripType = :tripType', {
      tripType: triptype
    })
    .groupBy('gf.RouteFrom')
    .addGroupBy('gf.RouteTo')
    .orderBy('DepDate', 'ASC')
    .getRawMany();

    return groupdata.map(item => {
      const routeFrom = item.RouteFrom ?? item.gf_RouteFrom;
      const routeTo = item.RouteTo ?? item.gf_RouteTo;
      const originLabel = this.formatAirportLabel(routeFrom);
      const destinationLabel = this.formatAirportLabel(routeTo);

      return {
        ...item,
        Origin: originLabel,
        Destination: destinationLabel,
      };
    });

  }

  async findAllAgentSpecialFareAll(header: any, triptype: string, origin: string, destination : string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0];

    const groupdata = await this.groupFareRepository.find({
      where: {
        DepDate: MoreThan(today),
        TripType: triptype,
        RouteFrom: origin,
        RouteTo: destination,
      },
      order: {
        DepDate: 'ASC',
      },
    });

    if(groupdata?.length > 0){
      const flightParserPromises = groupdata.map(group => this.flightParser(agent, group));
      return await Promise.all(flightParserPromises);
    }else{
      return groupdata;
    }

  }

  async findAllAgent(header: any) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const groupdata = await this.groupFareRepository.find({
      where: {
        DepDate: MoreThan(today),   // compares lexicographically
      },
      order: {
        DepDate: "ASC",             // string sort works if format is YYYY-MM-DD
      },
    });

    if(groupdata?.length > 0){
      const flightParserPromises = groupdata.map(group => this.flightParser(agent,group));
      return await Promise.all(flightParserPromises);
    }else{
      return groupdata;
    }
  }

  async findOne(agent: AgentModel, uid: string) {
    const data = await this.groupFareRepository.findOne({ where: {uid: uid} });
    return this.flightParser(agent, data);
  }

  async findOneAdmin(header:any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.groupFareRepository.findOneBy({uid: uid });
  }

  async remove(header: any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const groupfaredata = await this.groupFareRepository.findOne({ where: {uid: uid} });
    if(!groupfaredata){
      throw new  NotFoundException();
    }
    return this.groupFareRepository.delete(groupfaredata.id);
  }

  async flightParser(agent: AgentModel, resultData: any){

    let Leg = resultData;
    const conversionData = await this.CurrencyConverterRepository.findOne({where: {source: 'Group'}});
    let converstionrate = 1;
    if(agent?.currency === 'AED' && conversionData){
        converstionrate = conversionData.exchange_rate;
    }
    const NetFareConv = Leg.NetFare / converstionrate;
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
    if(resultData?.TripType === 'O'){
      let Segments = [];

      if(Leg?.segment === 1 || Leg?.segment === 0){

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
      }else if((Leg?.segment === 2)){
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
          "DepFrom": Leg.RouteFrom,
          "ArrTo": Leg.RouteTo,
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
        "Currency": agent?.currency || 'AED',
        "TimeLimit": '',
        "Refundable": false,
        "PriceBreakDown": PriceBreakdown,
        "AllLegsInfo": AllLegs
      };
      return Basic;
    }else if(resultData?.TripType === 'R'){
      let Segments = [];
      let Segments1 = [];

      if(Leg?.segment === 1 || Leg?.segment === 0){

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
      }else if((Leg?.segment === 2)){
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
    }else{
      return [];
    }
  }
}
