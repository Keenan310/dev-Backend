import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { AgentModel } from '../agent/agent.model';
export declare class SabreUtils {
    private readonly airlinesService;
    private readonly airportsService;
    constructor(airlinesService: AirlinesService, airportsService: AirportsService);
    restBFMParser(agentdata: AgentModel, SearchResponse: any): Promise<any[]>;
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
