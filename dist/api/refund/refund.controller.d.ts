import { RefundService } from './refund.service';
import { RefundDecisionModel, RefundQuotation, RefundRequestModel } from './refund.model';
export declare class RefundController {
    private readonly refundService;
    constructor(refundService: RefundService);
    createAgentReaquest(header: string, bookingUId: string, createRefundDto: RefundRequestModel): Promise<{
        message: string;
    }>;
    sendQuotation(header: Headers, bookingUId: string, quotationRefundDto: RefundQuotation): Promise<{
        message: string;
    }>;
    quotationDecision(header: string, bookingUId: string, status: string): Promise<{
        message: string;
    }>;
    refundDecision(header: Headers, bookingUId: string, status: string, refundDecisionDto: RefundDecisionModel): Promise<{
        message: string;
    }>;
}
