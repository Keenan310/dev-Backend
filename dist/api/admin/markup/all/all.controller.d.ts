import { AllService } from './all.service';
import { CreateAllDto } from './dto/create-all.dto';
import { UpdateAllDto } from './dto/update-all.dto';
export declare class AllController {
    private readonly allService;
    constructor(allService: AllService);
    create(createAllDto: CreateAllDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAllDto: UpdateAllDto): string;
    remove(id: string): string;
}
