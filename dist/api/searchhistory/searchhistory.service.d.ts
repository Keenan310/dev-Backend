import { SearchHistoryModel } from './searchhistory.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { FlightSearchModel } from '../flight/dto/search-flight.dto';
export declare class SearchhistoryService {
    private readonly searchHistoryRepository;
    private readonly agentRepository;
    private readonly authService;
    constructor(searchHistoryRepository: Repository<SearchHistoryModel>, agentRepository: Repository<AgentModel>, authService: AuthService);
    create(agentdata: AgentModel, flightDto: FlightSearchModel): Promise<SearchHistoryModel>;
    todaysearch(headers: any): Promise<SearchHistoryModel[]>;
    findByAgentId(header: any): Promise<SearchHistoryModel[]>;
}
