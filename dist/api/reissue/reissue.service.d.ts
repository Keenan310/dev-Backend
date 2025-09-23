import { ReissueModel, ReissueQuotation, ReissueRequestDecision, ReissueRequestModel } from './reissue.model';
import { Repository } from 'typeorm';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
export declare class ReissueService {
    private readonly reissueRepository;
    private readonly agentLedgerRepository;
    private readonly bookingRepository;
    private readonly authService;
    constructor(reissueRepository: Repository<ReissueModel>, agentLedgerRepository: Repository<AgentLedgerModel>, bookingRepository: Repository<BookingModel>, authService: AuthService);
    createAgentRequest(header: any, bookingUId: string, createReissueDto: ReissueRequestModel): Promise<{
        message: string;
    }>;
    sendQuotation(header: any, bookingUId: string, quotationReissueDto: ReissueQuotation): Promise<{
        message: string;
    }>;
    reissueTicketRequest(header: any, status: string, bookingUId: string): Promise<{
        message: string;
    }>;
    reissueDecisionAdmin(header: any, status: string, bookingUId: string, reissueDecisionDto: ReissueRequestDecision): Promise<{
        message: string;
    }>;
}
