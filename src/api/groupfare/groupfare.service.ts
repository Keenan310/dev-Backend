import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
import { AgentModel } from '../agent/agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { FlightSearchModel } from '../flight/dto/search-flight.dto';
import { CurrencyConverter } from '../currency/entities/currency.entity';

@Injectable()
export class GroupfareService {

  constructor(
    @InjectRepository(GroupFareModel)
    private readonly groupFareRepository: Repository<GroupFareModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(CurrencyConverter)
    private readonly currencyConverterRepository: Repository<CurrencyConverter>,
    private readonly authService: AuthService,
    private readonly airlinesService: AirlinesService,
    private readonly airportsService: AirportsService,
  ){}
  async create(header: any, createGroupfareDto: GroupFareModel) {
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

    createGroupfareDto['GroupId'] = groupId;
    
    return  this.groupFareRepository.save(createGroupfareDto);
  }

  async findAllAdmin(header: any) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const groupdata = await this.groupFareRepository.find();

    let agent: any;
    if(groupdata.length > 0){
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

    const groupdata = await this.groupFareRepository.find();

    if(groupdata?.length > 0){
      const flightParserPromises = groupdata.map(group => this.flightParser(agent,group));
      return await Promise.all(flightParserPromises);
    }else{
      return groupdata;
    }
  }

  async findBySearchFlight(flightDto: FlightSearchModel) {

    const groupdata =  await this.groupFareRepository.find(
      { where: {
        DepFrom: flightDto.segments[0].depfrom,
        ArrTo: flightDto.segments[0].arrto,
        DepDate: flightDto.segments[0].depdate+'',
      }});

      let agent: any;
      const flightParserPromises = groupdata.map(group => this.flightParser(agent, group));
      const AllGrouFare = await Promise.all(flightParserPromises);

    return AllGrouFare;
  }

  async findBySearch(header: any, searchGF: GroupFareSearch) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const groupdata =  await this.groupFareRepository.find(
      { where: {
          DepFrom: searchGF.depfrom,
          ArrTo: searchGF.arrto,
          DepDate: searchGF.depdate
        }
      });

      const flightParserPromises = groupdata.map(group => this.flightParser(agent, group));
      const AllGrouFare = await Promise.all(flightParserPromises);

    return AllGrouFare;
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

  async update(header: any, uid: string, updateGroupfareDto: GroupFareModelUpdate) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const groupfaredata = await this.groupFareRepository.findOneBy({uid: uid});
    if(!groupfaredata){
      throw new  NotFoundException();
    }

    return this.groupFareRepository.update(groupfaredata.id, updateGroupfareDto);
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
    let Segments = [];
    let Duration: number=0;

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

    let Class : string;
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

    if(resultData.segment === 1){

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
    }else if((resultData.segment === 2)){
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
        "Segments": Segments
      }
    ];

    const conversionData = await this.currencyConverterRepository.findOne({where: {alternate: agent?.currency}});
    const converstionrate = conversionData?.exchange_rate || 1;

    const Basic = {
      "OfferId": resultData.uid,
      "System": "GroupFare",
     // "FarePolicy": "sito",
     // "InstantPayment": true,
      //"IssuePermit": "manual",
      "TripType": "Oneway",
      //"FareType": "Special",
      "Carrier": resultData.Carrier,
      "CarrierName": await this.airlinesService.getAirlinesName(resultData.Carrier),
      "Cabinclass": Class,
      "BaseFare": resultData.BaseFare,
      "Taxes": resultData.Taxes,
      "NetFare": resultData.NetFare * converstionrate,
      "GrossFare": resultData.NetFare * converstionrate,
      "Comission": 0,
      "Currency": agent?.currency || 'INR',
      "TimeLimit": '',
      "Refundable": false,
      "PriceBreakDown": PriceBreakdown,
      "AllLegsInfo": AllLegs
    };

    return Basic;
  }

  
}
