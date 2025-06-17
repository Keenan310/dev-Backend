import { TicketingService } from './ticketing.service';
import { MakeTicketModel } from './ticketing.model';
export declare class TicketingController {
    private readonly ticketingService;
    constructor(ticketingService: TicketingService);
    ticketIssueRequest(header: Headers, bookingUId: string, payment: string): Promise<{
        message: string;
    }>;
    createTicket(header: Headers, bookingUId: string, makeTicketingDto: MakeTicketModel): Promise<{
        message: string;
    }>;
    rejectTicket(header: Headers, bookingUId: string, remarks: string): Promise<{
        message: string;
    }>;
}
