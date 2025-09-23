import { VoidDesicion, VoidModel } from './void.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { AgentLedgerModel } from '../report/report.model';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../../mail/mail.service';
export declare class VoidService {
    private readonly voidRepository;
    private readonly agentRepository;
    private readonly bookingRepository;
    private readonly agentLedgerRepository;
    private readonly authService;
    private readonly mailService;
    constructor(voidRepository: Repository<VoidModel>, agentRepository: Repository<AgentModel>, bookingRepository: Repository<BookingModel>, agentLedgerRepository: Repository<AgentLedgerModel>, authService: AuthService, mailService: MailService);
    createVoidRequest(header: any, bookingUId: string, createVoidDto: VoidModel): Promise<{
        message: string;
    }>;
    voidDecision(header: any, bookingUId: string, status: string, servicefee: number, voidDesicionDto: VoidDesicion): Promise<{
        message: string;
    }>;
}
