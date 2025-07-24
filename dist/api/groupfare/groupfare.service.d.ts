import { GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
import { AgentModel } from '../agent/agent.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { FlightSearchModel } from '../flight/dto/search-flight.dto';
import { CurrencyConverter } from '../currency/entities/currency.entity';
export declare class GroupfareService {
    private readonly groupFareRepository;
    private readonly agentRepository;
    private readonly currencyConverterRepository;
    private readonly authService;
    private readonly airlinesService;
    private readonly airportsService;
    constructor(groupFareRepository: Repository<GroupFareModel>, agentRepository: Repository<AgentModel>, currencyConverterRepository: Repository<CurrencyConverter>, authService: AuthService, airlinesService: AirlinesService, airportsService: AirportsService);
    create(header: any, createGroupfareDto: GroupFareModel): Promise<GroupFareModel>;
    findAllAdmin(header: any): Promise<GroupFareModel[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findAllAgent(header: any): Promise<GroupFareModel[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findBySearchFlight(flightDto: FlightSearchModel): Promise<{
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findBySearch(header: any, searchGF: GroupFareSearch): Promise<{
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findOne(agent: AgentModel, uid: string): Promise<{
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }>;
    findOneAdmin(header: any, uid: string): Promise<GroupFareModel>;
    update(header: any, uid: string, updateGroupfareDto: GroupFareModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
    flightParser(agent: AgentModel, resultData: any): Promise<{
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }>;
}
