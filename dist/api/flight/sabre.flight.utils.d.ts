import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { AgentModel } from '../agent/agent.model';
export declare class SabreUtils {
    private readonly airlinesService;
    private readonly airportsService;
    constructor(airlinesService: AirlinesService, airportsService: AirportsService);
    tokenParser(data: any): Promise<any>;
    restBFMParser(agentdata: AgentModel, SearchResponse: any): Promise<any[]>;
    restGetBooking(agentdata: AgentModel, getBookingResponse: any): Promise<void>;
    soapBFMParser(agentdata: AgentModel, SearchResponse: any): Promise<void>;
    seatMapParser(data: any): Promise<void>;
    fareRulesParser(data: any): Promise<{}>;
    xmlParser(data: any): Promise<any>;
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
