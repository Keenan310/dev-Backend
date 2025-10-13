import { Repository } from 'typeorm';
import { AirlineDiscount, AirlinesModel, AirlinesUpdateModel } from './airlines.model';
import { AuthService } from '../auth/auth.service';
import { CreateAirlineDiscountDto, UpdateAirlineDiscountDto } from './airlines.dto';
export declare class AirlinesService {
    private readonly airlinesRepository;
    private readonly airlineDiscountRepository;
    private readonly authService;
    constructor(airlinesRepository: Repository<AirlinesModel>, airlineDiscountRepository: Repository<AirlineDiscount>, authService: AuthService);
    createAirlineDiscount(header: any, createAirlineDiscountDto: CreateAirlineDiscountDto): Promise<AirlineDiscount>;
    viewAirlineDiscount(header: any): Promise<AirlineDiscount[]>;
    updateAirlineDiscount(header: any, id: number, updateAirlineDiscountDto: UpdateAirlineDiscountDto): Promise<import("typeorm").UpdateResult>;
    deleteAirlineDiscount(header: any, id: number): Promise<import("typeorm").DeleteResult>;
    create(header: any, createAirlineDto: AirlinesModel): Promise<AirlinesModel>;
    getAirlines(code: string): Promise<"" | AirlinesModel>;
    getAirlinesName(code: string): Promise<string>;
    findAll(header: any): Promise<AirlinesModel[]>;
    findOne(header: any, id: number): Promise<AirlinesModel>;
    update(header: any, id: number, updateAirlineDto: AirlinesUpdateModel): Promise<import("typeorm").UpdateResult>;
}
