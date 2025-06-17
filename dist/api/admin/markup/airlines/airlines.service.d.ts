import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
export declare class AirlinesService {
    create(createAirlineDto: CreateAirlineDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAirlineDto: UpdateAirlineDto): string;
    remove(id: number): string;
}
