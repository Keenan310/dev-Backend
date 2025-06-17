import { PromotionModel } from './promotion.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
export declare class PromotionService {
    private readonly promotionRepository;
    private readonly authService;
    constructor(promotionRepository: Repository<PromotionModel>, authService: AuthService);
    findAllAgent(header: any): Promise<PromotionModel[]>;
    findAllAdmin(header: any): Promise<PromotionModel[]>;
    remove(header: any, id: number): Promise<import("typeorm").DeleteResult>;
}
