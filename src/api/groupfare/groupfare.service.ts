import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException, Provider } from '@nestjs/common';
import { GroupFareModel } from './groupfare.model';
import { AgentModel } from '../agent/agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { MoreThan } from "typeorm";
import { CurrencyConverter } from '../currency/entities/currency.entity';
import { airportsData } from '../flight/data/airports.data';
import axios from 'axios';
import { AirlineDiscount } from '../airlines/airlines.model';

@Injectable()
export class GroupfareService {

  constructor(
    @InjectRepository(GroupFareModel)
    private readonly groupFareRepository: Repository<GroupFareModel>,
    @InjectRepository(CurrencyConverter)
    private readonly  CurrencyConverterRepository: Repository<CurrencyConverter>,
    @InjectRepository(AirlineDiscount)
    private readonly airlineDiscountRepository: Repository<AirlineDiscount>,
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

  private normalizeTripType(tripType?: string) {
    if (!tripType) return '';

    switch (tripType) {
      case 'O':
      case 'ONE_WAY':
      case 'OneWay':
        return 'Oneway';
      case 'R':
      case 'ROUND_TRIP':
      case 'RoundWay':
      case 'RoundTrip':
        return 'Roundtrip';
      default:
        return tripType;
    }
  }

  private formatSpecialFareItem(item: any) {
    const routeFrom = item?.RouteFrom ?? item?.gf_RouteFrom ?? '';
    const routeTo = item?.RouteTo ?? item?.gf_RouteTo ?? '';

    return {
      gf_RouteFrom: routeFrom,
      gf_RouteTo: routeTo,
      DepDate: item?.DepDate ?? item?.departureDate ?? null,
      Returndate: item?.Returndate ?? item?.ReturnDate ?? item?.returnDate ?? item?.rDate ?? null,
      Origin: this.formatAirportLabel(routeFrom),
      tripType: this.normalizeTripType(item?.TripType ?? item?.tripType),
      Destination: this.formatAirportLabel(routeTo),
    };
  }

  private mergeSpecialFareItems(...lists: any[][]) {
    const merged = new Map<string, any>();

    for (const list of lists) {
      for (const item of list || []) {
        const formattedItem = this.formatSpecialFareItem(item);
        const mergeKey = [
          formattedItem.gf_RouteFrom,
          formattedItem.gf_RouteTo,
          formattedItem.DepDate || '',
          formattedItem.Returndate || '',
          formattedItem.tripType || '',
        ].join('|');

        if (!merged.has(mergeKey)) {
          merged.set(mergeKey, formattedItem);
        }
      }
    }

    return Array.from(merged.values()).sort((left, right) => {
      const dateComparison = (left.DepDate || '').localeCompare(right.DepDate || '');
      if (dateComparison !== 0) {
        return dateComparison;
      }

      const originComparison = (left.gf_RouteFrom || '').localeCompare(right.gf_RouteFrom || '');
      if (originComparison !== 0) {
        return originComparison;
      }

      return (left.gf_RouteTo || '').localeCompare(right.gf_RouteTo || '');
    });
  }

  private mapAvailFareItem(item: any) {
    const segmentList = Array.isArray(item?.flightSegmentList) ? item.flightSegmentList : [];
    const firstSegment = segmentList[0];
    const lastSegment = segmentList[segmentList.length - 1] || firstSegment;

    const routeFrom = firstSegment?.origin || item?.route?.split('-')?.[0]?.trim() || '';
    const routeTo = lastSegment?.destination || item?.route?.split('-')?.pop()?.trim() || '';

    return this.formatSpecialFareItem({
      gf_RouteFrom: routeFrom,
      gf_RouteTo: routeTo,
      tripType: this.normalizeTripType(item?.tripType),
    });
  }

  async generateToken(): Promise<string> {
    const data = {
      clientId: process.env.GROUPFARE_CLIENT_ID,
      authFlow: process.env.GROUPFARE_AUTH_FLOW || 'USER_PASSWORD_AUTH',
      authParameters: {
        PASSWORD: process.env.GROUPFARE_PASSWORD,
        USERNAME: process.env.GROUPFARE_USERNAME,
      },
    };

    const payload = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.GROUPFARE_AUTH_URL}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    try{
      const response = await axios.request(payload);
      const accessToken =
        response?.data?.data?.authenticationResult?.accessToken
        || response?.data?.data?.AuthenticationResult?.AccessToken
        || response?.data?.AuthenticationResult?.AccessToken
        || response?.data?.access_token;

      if (!accessToken) {
        throw new HttpException('Group fare access token not found in auth response', HttpStatus.BAD_GATEWAY);
      }

      return accessToken;
    }catch(error){
      console.log(error);
      throw new HttpException('Failed to authenticate with group fare service', HttpStatus.BAD_GATEWAY);
    }
  }

  async availFare() {
    const accessToken = await this.generateToken();
    const payload = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.GROUPFARE_AVAIL_FARE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        pageIndex: 0,
        pageSize: 2000,
        filter: {},
        sortColumns: [],
      },
    };

    try {
      const response = await axios.request(payload);
      const formattedList = (response?.data?.data?.list);
      return formattedList;

    }catch(error){
      throw new HttpException('Failed to fetch available fares from group fare service', HttpStatus.BAD_GATEWAY);
    }

  }

  async availFareFormated(){
    const availFareList = await this.availFare();
    const formattedList = (availFareList || []).map((item: any) => this.mapAvailFareItem(item));
    return formattedList;
    
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

  async findAllAgentSpecialFare(header: any) {

    const agent = await this.authService.verifyAgentToken(header);
    if(!agent){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0];
    const [groupdata, groupFareNCT] = await Promise.all([
      this.groupFareRepository
        .createQueryBuilder('gf')
        .select([
          'gf.RouteFrom as RouteFrom',
          'gf.RouteTo as RouteTo',
          'gf.TripType as TripType',
        ])
        .where('gf.DepDate > :today', { today })
        .groupBy('gf.RouteFrom')
        .addGroupBy('gf.RouteTo')
        .addGroupBy('gf.TripType')
        .orderBy('DepDate', 'ASC')
        .getRawMany(),
      this.availFareFormated().catch(() => []),
    ]);

    return this.mergeSpecialFareItems(groupdata, groupFareNCT).map(({ DepDate, Returndate, ...item }) => item);

  }

  async findAllAgentSpecialFareAll(header: any, triptype: string, origin: string, destination : string) {

    const agent = await this.authService.verifyAgentToken(header);
    if(!agent){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0];
    const [groupdata, availFareList] = await Promise.all([
      this.groupFareRepository.find({
        where: {
          DepDate: MoreThan(today),
          TripType: triptype,
          RouteFrom: origin,
          RouteTo: destination,
        },
        order: { DepDate: 'ASC' },
      }),
      this.availFare()
    ]);

    const [formatedFareList, groupFareList] = await Promise.all([
      this.NCTflightParser(agent, availFareList, triptype, origin, destination),
      Promise.all(groupdata.map(group => this.flightParser(agent, group)))
    ]);

    return [...formatedFareList, ...groupFareList];
    
  }

  async findAllAgent(header: any) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const groupdata = await this.groupFareRepository.find({
      where: {
        DepDate: MoreThan(today),
      },
      order: {
        DepDate: "ASC",
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
    let converstionrate=1;
    if(agent?.currency === 'AED' && conversionData){
      converstionrate = conversionData.exchange_rate;
    }
    const NetFareConv = Leg.NetFare / converstionrate;
    const markupdata = await this.airlineDiscountRepository.findOne({
        where: {
          airline: "Group",
          source: ILike('%GP-NCT%'),
          currency: agent?.currency || 'AED',
        },
        order: {
          id: 'DESC',
        },
      });

      const fix_discount = markupdata ? markupdata?.fix_discount : 0;
      const discount_percent = markupdata ? markupdata?.discount_percent : 0;
      const percent_discount_amount = (NetFareConv * (discount_percent / 100)) || 0;
      const finalPrice = NetFareConv - fix_discount - percent_discount_amount;

    const PriceBreakdown = [
        {
          "PaxType": "ADT",
          "BaseFare": (Leg.NetFare / converstionrate).toFixed(2),
          "Taxes": 0,
          "TotalFare": (Leg.NetFare / converstionrate).toFixed(2),
          "PaxCount": 1,
          "Bag": [
            {
              "Airline": Leg.Carrier,
              "Allowance": Leg.Baggage
            }
          ]
        }
      ];
    let TT;
    if(resultData?.TripType === 'O'){
      TT= 'OneWay';
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
        OfferId: Leg.uid,
        System: "GroupFare",
        TripType: "Oneway",
        PNR: resultData?.TripType,
        ProviderCode: 'DB',
        Carrier: Leg.Carrier,
        CarrierName: await this.airlinesService.getAirlinesName(Leg.Carrier),
        Cabinclass: 'Economy',
        BaseFare: finalPrice.toFixed(2),
        Taxes: 0,
        NetFare: finalPrice.toFixed(2),
        GrossFare: finalPrice.toFixed(2),
        Comission: 0,
        Currency: agent?.currency || 'AED',
        TimeLimit: '',
        Refundable: false,
        PriceBreakDown: PriceBreakdown,
        AllLegsInfo: AllLegs
      };
      return Basic;
    }else if(resultData?.TripType === 'R'){
      TT= 'Roundway';
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
        OfferId: Leg.uid,
        System: "GroupFare",
        TripType: "Oneway",
        PNR:resultData?.PNR,
        ProviderCode: 'DB',
        Carrier: Leg.Carrier,
        CarrierName: await this.airlinesService.getAirlinesName(Leg.Carrier),
        Cabinclass: 'Economy',
        BaseFare: finalPrice.toFixed(2),
        Taxes: 0,
        NetFare: finalPrice.toFixed(2),
        GrossFare: finalPrice.toFixed(2),
        Comission: 0,
        Currency: agent?.currency || 'AED',
        TimeLimit: '',
        Refundable: false,
        PriceBreakDown: PriceBreakdown,
        AllLegsInfo: AllLegs
      };
      return Basic;
    }else{
      return [];
    }
  }

  async update(header: any, data: any) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const groupfare = await this.groupFareRepository.findOne({where: { uid: data?.uid }});

    if(!groupfare){
      throw new NotFoundException("Group Fare Not Found");
    }


    if(data.length === 1){
      const createGroupfareDto = data?.[0];
      createGroupfareDto['TripType'] = 'O';
      createGroupfareDto['RouteFrom'] = createGroupfareDto.DepFrom;
      createGroupfareDto['RouteTo'] = createGroupfareDto.ArrTo;
      createGroupfareDto.segment = createGroupfareDto.ArrivalTo === createGroupfareDto.DepartureFrom1 ? 2 : 1;
      return  this.groupFareRepository.update(groupfare.id, createGroupfareDto);
    }else if(data?.length === 2){
      const createGroupfareDto = data?.[0];
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

      return  this.groupFareRepository.update(groupfare.id, createGroupfareDto);
    }
  }

  async NCTflightParser(agent: AgentModel, resultData: any, triptype: string, origin: string, destination: string){

    const normalizeCode = (value: any) => String(value ?? '').trim().toUpperCase();
    const parseRouteParts = (route: any) =>
      String(route ?? '')
        .split('-')
        .map(part => part.trim().toUpperCase())
        .filter(Boolean);

    const requestedOrigin = normalizeCode(origin);
    const requestedDestination = normalizeCode(destination);
    const tripTypeFilter = triptype === 'O' ? ['ONE_WAY'] : ['ROUND_TRIP'];

    const flightList = resultData.filter(item => {
      const routeParts = parseRouteParts(item.route);
      let itemOrigin = routeParts[0];
      let itemDestination = routeParts.at(-1);
      const isRoundTripRoute = routeParts.length > 2 && itemOrigin && itemDestination && itemOrigin === itemDestination;
      const outboundDestination = isRoundTripRoute ? routeParts[routeParts.length - 2] : itemDestination;

      if (!itemOrigin || !itemDestination) {
        const segments = Array.isArray(item.flightSegmentList) ? item.flightSegmentList : [];
        if (segments.length > 0) {
          itemOrigin = normalizeCode(segments[0].origin);
          itemDestination = normalizeCode(segments[segments.length - 1].destination);
        }
      }

      const originMatch = itemOrigin === requestedOrigin;
      const destinationMatch = requestedDestination === requestedOrigin && isRoundTripRoute
        ? itemDestination === requestedDestination
        : outboundDestination === requestedDestination;
      const tripMatch = tripTypeFilter.includes(normalizeCode(item.tripType));

      return originMatch && destinationMatch && tripMatch;
    });
    const AllFlights : any [] = [];
    for (const flight of flightList) {
      const conversionData = await this.CurrencyConverterRepository.findOne({where: {source: 'Group'}});
      let converstionrate=1;
      if(agent?.currency === 'AED' && conversionData){
        converstionrate = conversionData.exchange_rate;
      }

      const markupdata = await this.airlineDiscountRepository.findOne({
        where: {
          airline: "Group",
          source: ILike('%GP-NCT%'),
          currency: agent?.currency || 'AED',
        },
        order: {
          id: 'DESC',
        },
      });

      const NetFareConv = flight?.showSellingPrice / converstionrate;
      const fix_discount = markupdata ? markupdata?.fix_discount : 0;
      const discount_percent = markupdata ? markupdata?.discount_percent : 0;
      const percent_discount_amount = (NetFareConv * (discount_percent / 100)) || 0;
      const finalPrice = NetFareConv - fix_discount - percent_discount_amount;


      const PriceBreakdown: any = [];
      for(const paxPrice of flight?.pricingList){
        PriceBreakdown.push({
          "PaxType": paxPrice.paxType,
          "BaseFare": (paxPrice.fare / converstionrate).toFixed(2),
          "Taxes": (paxPrice.tax / converstionrate).toFixed(2),
          "TotalFare": (paxPrice.sellingPrice / converstionrate).toFixed(2),
          "PaxCount": 1,
          "Bag": [
            {
              "Airline": flight.airline,
              "Allowance": flight.flightSegmentList[0].baggage
            }
          ]
        });
      }

      const formatSegment = async (segment: any) => ({
        "MarketingCarrier": flight.airline,
        "MarketingCarrierName": await this.airlinesService.getAirlinesName(flight.airline),
        "MarketingFlightNumber": String(segment.flightNumber ?? '').slice(2,6),
        "OperatingCarrier": await this.airlinesService.getAirlinesName(flight.airline),
        "OperatingFlightNumber": String(segment.flightNumber ?? '').slice(2,6),
        "OperatingCarrierName": await this.airlinesService.getAirlinesName(flight.airline),
        "DepFrom": segment.origin,
        "DepAirPort": await this.airportsService.getAirportName(segment.origin),
        "DepLocation": await this.airportsService.getAirportLocation(segment.origin),
        "DepDateAdjustment": 0,
        "DepTime": `${segment.departureDate}T${segment.departureTime}`,
        "ArrTo": segment.destination,
        "ArrAirPort": await this.airportsService.getAirportName(segment.destination),
        "ArrLocation": await this.airportsService.getAirportLocation(segment.destination),
        "ArrDateAdjustment": 0,
        "ArrTime": `${segment.arrivalDate}T${segment.arrivalTime}`,
        "OperatedBy": await this.airlinesService.getAirlinesName(flight.airline),
        "StopCount": 0,
        "Duration": 0,
        "SegmentCode": {
          "bookingCode": segment.rbd,
          "cabinCode": 'Y',
          "mealCode": segment.meals,
          "seatsAvailable": flight.availableSeats
        }
      });

      const SegmentList = [];
      for(const segment of flight?.flightSegmentList){
        SegmentList.push(await formatSegment(segment));
      }

      const routeParts = parseRouteParts(flight.route);
      const originCode = routeParts[0] || '';
      const firstStop = routeParts[1] || '';
      const returnOrigin = routeParts[routeParts.length - 2] || originCode;

      const outboundSegments: any[] = [];
      const returnSegments: any[] = [];
      let returnStarted = false;

      for (let index = 0; index < (flight?.flightSegmentList || []).length; index++) {
        const segment = flight.flightSegmentList[index];
        const formattedSegment = SegmentList[index];
        const segOrigin = String(segment.origin ?? '').trim().toUpperCase();

        if (!returnStarted && segOrigin === returnOrigin && outboundSegments.length > 0) {
          returnStarted = true;
        }

        if (returnStarted) {
          returnSegments.push(formattedSegment);
        } else {
          outboundSegments.push(formattedSegment);
        }
      }

      const AllLegs = [];
      if (flight.tripType === 'ONE_WAY') {
        AllLegs.push({
          "DepDate": flight.departureDate,
          "DepFrom": originCode,
          "ArrTo": routeParts[routeParts.length - 1] || '',
          "Duration": 0,
          "Segments": SegmentList
        });
      } else if (flight.tripType === 'ROUND_TRIP') {
        AllLegs.push({
          "DepDate": flight.departureDate,
          "DepFrom": originCode,
          "ArrTo": firstStop,
          "Duration": 0,
          "Segments": outboundSegments.length ? outboundSegments : SegmentList
        },
        {
          "DepDate": flight.returnDate,
          "DepFrom": returnOrigin,
          "ArrTo": originCode,
          "Duration": 0,
          "Segments": returnSegments.length ? returnSegments : SegmentList
        });
      }

      AllFlights.push({
        OfferId: flight.uid,
        System: "GroupFare",
        PNR: flight.pnr,
        ProviderCode: 'NCT',
        TripType: flight.tripType === 'ONE_WAY' ? 'Oneway' : 'Roundway',
        Carrier: flight.airline,
        CarrierName: await this.airlinesService.getAirlinesName(flight.airline),
        Cabinclass: 'Economy',
        BaseFare: finalPrice.toFixed(2),
        Taxes: 0,
        NetFare: finalPrice.toFixed(2),
        GrossFare: finalPrice.toFixed(2),
        Comission: 0,
        Currency: agent?.currency || 'AED',
        TimeLimit: flight?.timeLimit || '',
        Refundable: false,
        PriceBreakDown: PriceBreakdown,
        AllLegsInfo: AllLegs,
      });
    }

    return AllFlights;
  }
}
