import { AirlinesService } from './airlines.service';
import { AirlinesUpdateModel } from './airlines.model';
import { CreateAirlineDiscountDto, UpdateAirlineDiscountDto } from './airlines.dto';
export declare class AirlinesController {
    private readonly airlinesService;
    constructor(airlinesService: AirlinesService);
    createAirlineDiscount(header: Headers, dto: CreateAirlineDiscountDto): Promise<import("./airlines.model").AirlineDiscount>;
    viewAirlineDiscount(header: Headers, currency: string): Promise<import("./airlines.model").AirlineDiscount[]>;
    updateAirlineDiscount(header: Headers, id: string, updateAirlineDiscountDto: UpdateAirlineDiscountDto): Promise<import("typeorm").UpdateResult>;
    deleteAirlineDiscount(header: Headers, id: string): Promise<import("typeorm").DeleteResult>;
    createAirlineDiscountForAgent(header: Headers, dto: CreateAirlineDiscountDto): Promise<import("./airlines.model").AirlineDiscountForAgent>;
    viewAirlineDiscountForAgent(header: Headers, agentId: string): Promise<import("./airlines.model").AirlineDiscountForAgent[]>;
    updateAirlineDiscountForAgent(header: Headers, id: string, updateAirlineDiscountDto: UpdateAirlineDiscountDto): Promise<import("typeorm").UpdateResult>;
    deleteAirlineDiscountForAgent(header: Headers, id: string): Promise<import("typeorm").DeleteResult>;
    updatemarkup(header: Headers, id: string, updateAirlineDto: AirlinesUpdateModel): Promise<import("typeorm").UpdateResult>;
}
