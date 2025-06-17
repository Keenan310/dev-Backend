import { AirlinesService } from './airlines.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
export declare class AirlinesController {
    private readonly airlinesService;
    constructor(airlinesService: AirlinesService);
    create(createAirlineDto: CreateAirlineDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAirlineDto: UpdateAirlineDto): string;
    remove(id: string): string;
}
