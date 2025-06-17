import { CreateAllDto } from './dto/create-all.dto';
import { UpdateAllDto } from './dto/update-all.dto';
export declare class AllService {
    create(createAllDto: CreateAllDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAllDto: UpdateAllDto): string;
    remove(id: number): string;
}
