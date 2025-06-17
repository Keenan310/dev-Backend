import { PromotionService } from './promotion.service';
export declare class PromotionController {
    private readonly promotionService;
    constructor(promotionService: PromotionService);
    findAllAgent(header: string): Promise<import("./promotion.model").PromotionModel[]>;
    findAllAdmin(header: Headers): Promise<import("./promotion.model").PromotionModel[]>;
    remove(header: Headers, id: string): Promise<import("typeorm").DeleteResult>;
}
