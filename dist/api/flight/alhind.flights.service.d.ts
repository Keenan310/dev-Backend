import { Repository } from 'typeorm';
import { FlightSearchModel } from './dto/search-flight.dto';
import { AgentModel } from '../agent/agent.model';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { Revalidation } from './dto/revalidation-flight.dto';
import { CurrencyConverter } from '../currency/entities/currency.entity';
export declare class AlhindAPI {
    private readonly currencyConverterRepository;
    private readonly airlinesService;
    private readonly airportsService;
    constructor(currencyConverterRepository: Repository<CurrencyConverter>, airlinesService: AirlinesService, airportsService: AirportsService);
    flights(agent: AgentModel, flightDto: FlightSearchModel): Promise<{
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: any;
        Cabinclass: any;
        Currency: string;
        BaseFare: number;
        Taxes: number;
        NetFare: number;
        GrossFare: number;
        Comission: any;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: any;
        AllLegsInfo: any[];
    }[]>;
    sflightUtils(result: any, agentdata: AgentModel, flighDto: FlightSearchModel): Promise<any[]>;
    flightUtils(result: any, agentdata: AgentModel, flighDto: FlightSearchModel): Promise<{
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: any;
        Cabinclass: any;
        Currency: string;
        BaseFare: number;
        Taxes: number;
        NetFare: number;
        GrossFare: number;
        Comission: any;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: any;
        AllLegsInfo: any[];
    }[]>;
    priceCheck(agent: AgentModel, revalidation: Revalidation): Promise<Revalidation>;
    getAirports(code: string): Promise<{
        code: string;
        name: string;
        location: string;
    } | {
        code: string;
        name: string;
        location: Location;
    }>;
    getAirlineName(code: string): Promise<string>;
}
