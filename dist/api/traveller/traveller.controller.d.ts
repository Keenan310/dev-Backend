import { TravellerService } from './traveller.service';
import { TravellerModel, TravellerModelUpdate } from './traveller.model';
export declare class TravellerController {
    private readonly TravellerService;
    constructor(TravellerService: TravellerService);
    create(header: string, createTravellerDto: TravellerModel): Promise<TravellerModel>;
    findAllByAgentId(header: string): Promise<TravellerModel[]>;
    findOne(header: string, uid: string): Promise<TravellerModel>;
    update(header: string, uid: string, updateTravellerDto: TravellerModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(header: string, uid: string): Promise<import("typeorm").DeleteResult>;
}
