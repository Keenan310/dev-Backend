import { Repository } from 'typeorm';
import { AirlinesModel, AirlinesUpdateModel } from './airlines.model';
import { AuthService } from '../auth/auth.service';
export declare class AirlinesService {
    private readonly airlinesRepository;
    private readonly authService;
    constructor(airlinesRepository: Repository<AirlinesModel>, authService: AuthService);
    create(header: any, createAirlineDto: AirlinesModel): Promise<AirlinesModel>;
    getAirlines(code: string): Promise<"" | AirlinesModel>;
    getAirlinesName(code: string): Promise<string>;
    findAll(header: any): Promise<AirlinesModel[]>;
    findOne(header: any, id: number): Promise<AirlinesModel>;
    update(header: any, id: number, updateAirlineDto: AirlinesUpdateModel): Promise<import("typeorm").UpdateResult>;
}
