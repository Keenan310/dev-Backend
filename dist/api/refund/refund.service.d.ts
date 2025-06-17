import { RefundDecisionModel, RefundModel, RefundQuotation, RefundRequestModel } from './refund.model';
import { Repository } from 'typeorm';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
export declare class RefundService {
    private readonly refundRepository;
    private readonly bookingRepository;
    private readonly agentLedgerRepository;
    private readonly authService;
    constructor(refundRepository: Repository<RefundModel>, bookingRepository: Repository<BookingModel>, agentLedgerRepository: Repository<AgentLedgerModel>, authService: AuthService);
    createAgentRequest(header: any, bookingUId: string, createRefundDto: RefundRequestModel): Promise<{
        message: string;
    }>;
    sendQuotation(header: any, bookingUId: string, quotationRefundDto: RefundQuotation): Promise<{
        message: string;
    }>;
    quotationDecision(header: any, status: string, bookingUId: string): Promise<{
        message: string;
    }>;
    refundDecision(header: any, status: string, bookingUId: string, refundDecisionDto: RefundDecisionModel): Promise<{
        message: string;
    }>;
}
