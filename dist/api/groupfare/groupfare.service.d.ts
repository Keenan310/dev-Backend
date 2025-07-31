import { GroupFareModel } from './groupfare.model';
import { AgentModel } from '../agent/agent.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { CurrencyConverter } from '../currency/entities/currency.entity';
export declare class GroupfareService {
    private readonly groupFareRepository;
    private readonly currencyConverterRepository;
    private readonly authService;
    private readonly airlinesService;
    private readonly airportsService;
    constructor(groupFareRepository: Repository<GroupFareModel>, currencyConverterRepository: Repository<CurrencyConverter>, authService: AuthService, airlinesService: AirlinesService, airportsService: AirportsService);
    create(header: any, data: any): Promise<any>;
    findAllAdmin(header: any): Promise<GroupFareModel[] | (any[] | {
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
            Segments: any[];
        }[];
    })[]>;
    findAllAgent(header: any): Promise<GroupFareModel[] | (any[] | {
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
            Segments: any[];
        }[];
    })[]>;
    findOne(agent: AgentModel, uid: string): Promise<any[] | {
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
            Segments: any[];
        }[];
    }>;
    findOneAdmin(header: any, uid: string): Promise<GroupFareModel>;
    remove(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
    flightParser(agent: AgentModel, resultData: any): Promise<any[] | {
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
            Segments: any[];
        }[];
    }>;
}
