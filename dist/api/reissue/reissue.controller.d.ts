import { ReissueService } from './reissue.service';
import { ReissueQuotation, ReissueRequestModel } from './reissue.model';
export declare class ReissueController {
    private readonly reissueService;
    constructor(reissueService: ReissueService);
    createagentreaquest(header: string, bookingUId: string, createReissueDto: ReissueRequestModel): Promise<{
        message: string;
    }>;
    sendquatation(header: Headers, bookingUId: string, quotationReissueDto: ReissueQuotation): Promise<{
        message: string;
    }>;
    quatationDecision(header: string, status: string, bookingUId: string): Promise<"Unknown error" | {
        message: string;
    }>;
    reissueDecision(header: Headers, status: string, bookingUId: string): Promise<{
        message: string;
    }>;
}
