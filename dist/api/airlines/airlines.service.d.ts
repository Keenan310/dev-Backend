import { Repository } from 'typeorm';
import { AirlineDiscount, AirlineDiscountForAgent, AirlinesModel, AirlinesUpdateModel } from './airlines.model';
import { AuthService } from '../auth/auth.service';
import { CreateAirlineDiscountDto, CreateAirlineDiscountForAgentDto, UpdateAirlineDiscountDto, UpdateAirlineDiscountForAgentDto } from './airlines.dto';
export declare class AirlinesService {
    private readonly airlinesRepository;
    private readonly airlineDiscountRepository;
    private readonly airlineDiscountForAgentRepository;
    private readonly authService;
    constructor(airlinesRepository: Repository<AirlinesModel>, airlineDiscountRepository: Repository<AirlineDiscount>, airlineDiscountForAgentRepository: Repository<AirlineDiscountForAgent>, authService: AuthService);
    createAirlineDiscountMain(header: any, createAirlineDiscountDto: CreateAirlineDiscountDto): Promise<AirlineDiscount>;
    viewAirlineDiscountMain(header: any, currency: string): Promise<AirlineDiscount[]>;
    updateAirlineDiscountMain(header: any, id: number, updateAirlineDiscountDto: UpdateAirlineDiscountDto): Promise<import("typeorm").UpdateResult>;
    deleteAirlineDiscountMain(header: any, id: number): Promise<import("typeorm").DeleteResult>;
    createAirlineDiscountForAgent(header: any, createAirlineDiscountForAgentDto: CreateAirlineDiscountForAgentDto): Promise<AirlineDiscountForAgent>;
    viewAirlineDiscountForAgent(header: any, agentId: string): Promise<AirlineDiscountForAgent[]>;
    updateAirlineDiscountForAgent(header: any, id: number, updateAirlineDiscountForAgentDto: UpdateAirlineDiscountForAgentDto): Promise<import("typeorm").UpdateResult>;
    deleteAirlineDiscountForAgent(header: any, id: number): Promise<import("typeorm").DeleteResult>;
    getAirlines(code: string): Promise<AirlinesModel | "">;
    getAirlinesName(code: string): Promise<string>;
    update(header: any, id: number, updateAirlineDto: AirlinesUpdateModel): Promise<import("typeorm").UpdateResult>;
}
