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
    @InjectRepository(CurrencyConverter)
    private readonly currencyConverterRepository: Repository<CurrencyConverter>,
    private readonly authService: AuthService,
    private readonly airlinesService: AirlinesService,
    private readonly airportsService: AirportsService,
  ){}
  async create(header: any, data: any) {

    // const verifyAdminId = await this.authService.verifyAdminToken(header);

    // if(!verifyAdminId){
    //     throw new UnauthorizedException();
    // }

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
      return  this.groupFareRepository.save(createGroupfareDto);
    }else if(data?.length == 2){
      const createGroupfareDto = data?.[0];
      createGroupfareDto['GroupId'] = groupId;
      this.groupFareRepository.save(createGroupfareDto);

      const createGroupfareDto1 = data?.[1];
      createGroupfareDto1['GroupId'] = groupId;
      return  this.groupFareRepository.save(createGroupfareDto1);
    }else{
      console.log("LOl")
    }
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

    if(resultData?.length === 1){
      let Segments = [];
      let Leg1 = resultData[0];
      let Duration: number=0;

      const PriceBreakdown = [
        {
          "PaxType": "ADT",
          "BaseFare": Leg1.BaseFare,
          "Taxes": Leg1.Taxes,
          "TotalFare": Leg1.NetFare,
          "PaxCount": 1,
          "Bag": [
            {
              "Airline": Leg1.Carrier,
              "Allowance": Leg1.Baggage
            }
          ]
        }
      ];

      let Class : string;
      switch (Leg1.Cabinclass) {
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

      if(Leg1?.segment === 1){

        Segments = [
          {
          "MarketingCarrier": Leg1.Carrier,
          "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "MarketingFlightNumber": Leg1.FlightNumber,
          "OperatingCarrier": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "OperatingFlightNumber": Leg1.FlightNumber,
          "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "DepFrom": Leg1.DepartureFrom,
          "DepAirPort": await this.airportsService.getAirportName(Leg1.DepartureFrom),
          "DepLocation": await this.airportsService.getAirportLocation(Leg1.DepartureFrom),
          "DepDateAdjustment": 0,
          "DepTime": Leg1.DepTime,
          "ArrTo": Leg1.ArrivalTo,
          "ArrAirPort": await this.airportsService.getAirportName(Leg1.ArrivalTo),
          "ArrLocation": await this.airportsService.getAirportLocation(Leg1.ArrivalTo),
          "ArrDateAdjustment": 0,
          "ArrTime": Leg1.ArrTime,
          "OperatedBy": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "StopCount": 0,
          "Duration": Leg1.Duration,
          "SegmentCode": {
            "bookingCode": "X",
            "cabinCode": Leg1.cabinCode,
            "mealCode": Leg1.mealCode,
            "seatsAvailable": Leg1.seatsAvailable
          }
          }
        ];
        Duration = 0;
      }else if((Leg1?.segment === 2)){
        Segments = [
          {
          "MarketingCarrier": Leg1.Carrier,
          "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "MarketingFlightNumber": Leg1.FlightNumber,
          "OperatingCarrier": Leg1.Carrier,
          "OperatingFlightNumber": Leg1.FlightNumber,
          "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "DepFrom": Leg1.DepartureFrom,
          "DepAirPort": await this.airportsService.getAirportName(Leg1.DepartureFrom),
          "DepLocation": await this.airportsService.getAirportLocation(Leg1.DepartureFrom),
          "DepDateAdjustment": 0,
          "DepTime": Leg1.DepTime,
          "ArrTo": Leg1.ArrivalTo,
          "ArrAirPort": await this.airportsService.getAirportName(Leg1.ArrivalTo),
          "ArrLocation": await this.airportsService.getAirportLocation(Leg1.ArrivalTo),
          "ArrDateAdjustment": 0,
          "ArrTime": Leg1.ArrTime,
          "OperatedBy": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "StopCount": 0,
          "Duration": Leg1.Duration,
          "SegmentCode": {
            "bookingCode": "X",
            "cabinCode": Leg1.cabinCode,
            "mealCode": Leg1.mealCode,
            "seatsAvailable": Leg1.seatsAvailable
          }
          },
          {
            "MarketingCarrier": Leg1.Carrier,
            "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
            "MarketingFlightNumber": Leg1.FlightNumber1,
            "OperatingCarrier": Leg1.Carrier,
            "OperatingFlightNumber": Leg1.FlightNumber1,
            "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
            "DepFrom": Leg1.DepartureFrom1,
            "DepAirPort": await this.airportsService.getAirportName(Leg1.DepartureFrom1),
            "DepLocation": await this.airportsService.getAirportLocation(Leg1.DepartureFrom1),
            "DepDateAdjustment": 0,
            "DepTime": Leg1.DepTime1,
            "ArrTo": Leg1.ArrivalTo1,
            "ArrAirPort": await this.airportsService.getAirportName(Leg1.ArrivalTo1),
            "ArrLocation": await this.airportsService.getAirportLocation(Leg1.ArrivalTo1),
            "ArrDateAdjustment": 0,
            "ArrTime": Leg1.ArrTime1,
            "OperatedBy": await this.airlinesService.getAirlinesName(Leg1.Carrier),
            "StopCount": 0,
            "Duration": Leg1.Duration1,
            "SegmentCode": {
              "bookingCode": "X",
              "cabinCode": Leg1.cabinCode,
              "mealCode": Leg1.mealCode,
              "seatsAvailable": Leg1.seatsAvailable
            }
            }
        ];

        Duration = 0;
      }

      const AllLegs = [
        {
          "DepDate": Leg1.DepDate,
          "DepFrom": Leg1.DepFrom,
          "ArrTo": Leg1.ArrTo,
          "Duration": Duration,
          "Segments": Segments
        }
      ];

      const conversionData = await this.currencyConverterRepository.findOne({where: {alternate: agent?.currency}});
      const converstionrate = conversionData?.exchange_rate || 1;

      const Basic = {
        "OfferId": Leg1.uid,
        "System": "GroupFare",
        "TripType": "Oneway",
        "Carrier": Leg1.Carrier,
        "CarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
        "Cabinclass": Class,
        "BaseFare": Leg1.BaseFare,
        "Taxes": Leg1.Taxes,
        "NetFare": Leg1.NetFare * converstionrate,
        "GrossFare": Leg1.NetFare * converstionrate,
        "Comission": 0,
        "Currency": agent?.currency || 'INR',
        "TimeLimit": '',
        "Refundable": false,
        "PriceBreakDown": PriceBreakdown,
        "AllLegsInfo": AllLegs
      };
      return Basic;
    }else if(resultData?.length === 2){
      let Segments = [];
      let Segments1 = [];
      let Duration: number=0;

      let Leg1 = resultData[0];
      let Leg2 = resultData[1];

      const PriceBreakdown = [
        {
          "PaxType": "ADT",
          "BaseFare": Leg1.BaseFare,
          "Taxes": Leg1.Taxes,
          "TotalFare": Leg1.NetFare,
          "PaxCount": 1,
          "Bag": [
            {
              "Airline": Leg1.Carrier,
              "Allowance": Leg1.Baggage
            }
          ]
        }
      ];

      let Class : string;
      switch (Leg1.Cabinclass) {
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

      if(Leg2?.segment === 1){

        Segments = [
          {
          "MarketingCarrier": Leg1.Carrier,
          "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "MarketingFlightNumber": Leg1.FlightNumber,
          "OperatingCarrier": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "OperatingFlightNumber": Leg1.FlightNumber,
          "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "DepFrom": Leg1.DepartureFrom,
          "DepAirPort": await this.airportsService.getAirportName(Leg1.DepartureFrom),
          "DepLocation": await this.airportsService.getAirportLocation(Leg1.DepartureFrom),
          "DepDateAdjustment": 0,
          "DepTime": Leg1.DepTime,
          "ArrTo": Leg1.ArrivalTo,
          "ArrAirPort": await this.airportsService.getAirportName(Leg1.ArrivalTo),
          "ArrLocation": await this.airportsService.getAirportLocation(Leg1.ArrivalTo),
          "ArrDateAdjustment": 0,
          "ArrTime": Leg1.ArrTime,
          "OperatedBy": await this.airlinesService.getAirlinesName(Leg1.Carrier),
          "StopCount": 0,
          "Duration": 0,
          "SegmentCode": {
            "bookingCode": "X",
            "cabinCode": Leg1.cabinCode,
            "mealCode": Leg1.mealCode,
            "seatsAvailable": Leg1.seatsAvailable
          }
          }
        ];

        Segments1 = [
          {
          "MarketingCarrier": Leg2.Carrier,
          "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "MarketingFlightNumber": Leg2.FlightNumber,
          "OperatingCarrier": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "OperatingFlightNumber": Leg2.FlightNumber,
          "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "DepFrom": Leg2.DepartureFrom,
          "DepAirPort": await this.airportsService.getAirportName(Leg2.DepartureFrom),
          "DepLocation": await this.airportsService.getAirportLocation(Leg2.DepartureFrom),
          "DepDateAdjustment": 0,
          "DepTime": Leg2.DepTime,
          "ArrTo": Leg2.ArrivalTo,
          "ArrAirPort": await this.airportsService.getAirportName(Leg2.ArrivalTo),
          "ArrLocation": await this.airportsService.getAirportLocation(Leg2.ArrivalTo),
          "ArrDateAdjustment": 0,
          "ArrTime": Leg2.ArrTime,
          "OperatedBy": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "StopCount": 0,
          "Duration": Leg2.Duration,
          "SegmentCode": {
            "bookingCode": "X",
            "cabinCode": Leg2.cabinCode,
            "mealCode": Leg2.mealCode,
            "seatsAvailable": Leg2.seatsAvailable
          }
          }
        ];
        Duration = 0;
      }else if((Leg2?.segment === 2)){
        Segments = [
          {
          "MarketingCarrier": Leg2.Carrier,
          "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "MarketingFlightNumber": Leg2.FlightNumber,
          "OperatingCarrier": Leg2.Carrier,
          "OperatingFlightNumber": Leg2.FlightNumber,
          "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "DepFrom": Leg1.DepartureFrom,
          "DepAirPort": await this.airportsService.getAirportName(Leg2.DepartureFrom),
          "DepLocation": await this.airportsService.getAirportLocation(Leg2.DepartureFrom),
          "DepDateAdjustment": 0,
          "DepTime": Leg2.DepTime,
          "ArrTo": Leg2.ArrivalTo,
          "ArrAirPort": await this.airportsService.getAirportName(Leg2.ArrivalTo),
          "ArrLocation": await this.airportsService.getAirportLocation(Leg2.ArrivalTo),
          "ArrDateAdjustment": 0,
          "ArrTime": Leg2.ArrTime,
          "OperatedBy": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "StopCount": 0,
          "Duration": 0,
          "SegmentCode": {
            "bookingCode": "X",
            "cabinCode": Leg2.cabinCode,
            "mealCode": Leg2.mealCode,
            "seatsAvailable": Leg2.seatsAvailable
          }
          },
          {
            "MarketingCarrier": Leg2.Carrier,
            "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
            "MarketingFlightNumber": Leg2.FlightNumber1,
            "OperatingCarrier": Leg2.Carrier,
            "OperatingFlightNumber": Leg2.FlightNumber1,
            "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
            "DepFrom": Leg2.DepartureFrom1,
            "DepAirPort": await this.airportsService.getAirportName(Leg2.DepartureFrom1),
            "DepLocation": await this.airportsService.getAirportLocation(Leg2.DepartureFrom1),
            "DepDateAdjustment": 0,
            "DepTime": Leg2.DepTime1,
            "ArrTo": Leg2.ArrivalTo1,
            "ArrAirPort": await this.airportsService.getAirportName(Leg2.ArrivalTo1),
            "ArrLocation": await this.airportsService.getAirportLocation(Leg2.ArrivalTo1),
            "ArrDateAdjustment": 0,
            "ArrTime": Leg2.ArrTime1,
            "OperatedBy": await this.airlinesService.getAirlinesName(Leg2.Carrier),
            "StopCount": 0,
            "Duration": 0,
            "SegmentCode": {
              "bookingCode": "X",
              "cabinCode": Leg2.cabinCode,
              "mealCode": Leg2.mealCode,
              "seatsAvailable": Leg2.seatsAvailable
            }
          }
        ];

        Segments1 = [
          {
          "MarketingCarrier": Leg2.Carrier,
          "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "MarketingFlightNumber": Leg2.FlightNumber,
          "OperatingCarrier": Leg2.Carrier,
          "OperatingFlightNumber": Leg2.FlightNumber,
          "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "DepFrom": Leg2.DepartureFrom,
          "DepAirPort": await this.airportsService.getAirportName(Leg2.DepartureFrom),
          "DepLocation": await this.airportsService.getAirportLocation(Leg2.DepartureFrom),
          "DepDateAdjustment": 0,
          "DepTime": Leg2.DepTime,
          "ArrTo": Leg2.ArrivalTo,
          "ArrAirPort": await this.airportsService.getAirportName(Leg2.ArrivalTo),
          "ArrLocation": await this.airportsService.getAirportLocation(Leg2.ArrivalTo),
          "ArrDateAdjustment": 0,
          "ArrTime": Leg2.ArrTime,
          "OperatedBy": await this.airlinesService.getAirlinesName(Leg2.Carrier),
          "StopCount": 0,
          "Duration": Leg2.Duration,
          "SegmentCode": {
            "bookingCode": "X",
            "cabinCode": Leg2.cabinCode,
            "mealCode": Leg2.mealCode,
            "seatsAvailable": Leg2.seatsAvailable
          }
          },
          {
            "MarketingCarrier": Leg2.Carrier,
            "MarketingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
            "MarketingFlightNumber": Leg2.FlightNumber1,
            "OperatingCarrier": Leg2.Carrier,
            "OperatingFlightNumber": Leg2.FlightNumber1,
            "OperatingCarrierName": await this.airlinesService.getAirlinesName(Leg2.Carrier),
            "DepFrom": Leg2.DepartureFrom1,
            "DepAirPort": await this.airportsService.getAirportName(Leg2.DepartureFrom1),
            "DepLocation": await this.airportsService.getAirportLocation(Leg2.DepartureFrom1),
            "DepDateAdjustment": 0,
            "DepTime": Leg2.DepTime1,
            "ArrTo": Leg2.ArrivalTo1,
            "ArrAirPort": await this.airportsService.getAirportName(Leg2.ArrivalTo1),
            "ArrLocation": await this.airportsService.getAirportLocation(Leg2.ArrivalTo1),
            "ArrDateAdjustment": 0,
            "ArrTime": Leg2.ArrTime1,
            "OperatedBy": await this.airlinesService.getAirlinesName(Leg2.Carrier),
            "StopCount": 0,
            "Duration": 0,
            "SegmentCode": {
              "bookingCode": "X",
              "cabinCode": Leg2.cabinCode,
              "mealCode": Leg2.mealCode,
              "seatsAvailable": Leg2.seatsAvailable
            }
          }
        ];

        Duration = 0;
      }

      const AllLegs = [
        {
          "DepDate": Leg1.DepDate,
          "DepFrom": Leg1.DepFrom,
          "ArrTo": Leg1.ArrTo,
          "Duration": Duration,
          "Segments": Segments
        },
        {
          "DepDate": Leg2.DepDate,
          "DepFrom": Leg2.DepFrom,
          "ArrTo": Leg2.ArrTo,
          "Duration": Duration,
          "Segments": Segments1
        }
      ];

      const conversionData = await this.currencyConverterRepository.findOne({where: {alternate: agent?.currency}});
      const converstionrate = conversionData?.exchange_rate || 1;

      const Basic = {
        "OfferId": Leg1.uid,
        "System": "GroupFare",
        "TripType": "Oneway",
        "Carrier": Leg1.Carrier,
        "CarrierName": await this.airlinesService.getAirlinesName(Leg1.Carrier),
        "Cabinclass": Class,
        "BaseFare": Leg1.BaseFare,
        "Taxes": Leg1.Taxes,
        "NetFare": Leg1.NetFare * converstionrate,
        "GrossFare": Leg1.NetFare * converstionrate,
        "Comission": 0,
        "Currency": agent?.currency || 'INR',
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
