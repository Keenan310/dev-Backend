import { TravellerModel, TravellerModelUpdate } from './traveller.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
export declare class TravellerService {
    private readonly TravellerRepository;
    private readonly agentRepository;
    private readonly authService;
    constructor(TravellerRepository: Repository<TravellerModel>, agentRepository: Repository<AgentModel>, authService: AuthService);
    create(header: any, createTravellerDto: TravellerModel): Promise<TravellerModel>;
    findAllByAgentId(header: string): Promise<TravellerModel[]>;
    findOne(header: any, uid: string): Promise<TravellerModel>;
    update(header: any, uid: string, updateTravellerDto: TravellerModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
    createBookingPax(TravellerData: any, agentId: string, bookingId: string): Promise<void>;
}
