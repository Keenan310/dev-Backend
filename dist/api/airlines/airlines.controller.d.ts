import { AirlinesService } from './airlines.service';
import { AirlinesUpdateModel } from './airlines.model';
export declare class AirlinesController {
    private readonly airlinesService;
    constructor(airlinesService: AirlinesService);
    findAll(header: Headers): Promise<import("./airlines.model").AirlinesModel[]>;
    updatemarkup(header: Headers, id: string, updateAirlineDto: AirlinesUpdateModel): Promise<import("typeorm").UpdateResult>;
}
