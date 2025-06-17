import { PassengerModel } from './passenger.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
export declare class PassengerService {
    private readonly passengerRepository;
    private readonly agentRepository;
    constructor(passengerRepository: Repository<PassengerModel>, agentRepository: Repository<AgentModel>);
    createBookingPax(passengerData: any, agentId: string, bookingId: string): Promise<void>;
    createBookingPaxForImport(agentId: string, bookingId: string, passengerData: any): Promise<void>;
}
