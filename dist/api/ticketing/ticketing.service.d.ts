import { BookingModel, TicketModel } from '../booking/booking.model';
import { AgentModel } from '../agent/agent.model';
import { AgentLedgerModel } from '../report/report.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { MakeTicketModel } from './ticketing.model';
import { PassengerModel } from '../passenger/passenger.model';
import { MailService } from '../../mail/mail.service';
import { ActivitylogService } from '../activitylog/activitylog.service';
export declare class TicketingService {
    private readonly activityLogService;
    private readonly agentRepository;
    private readonly agentLedgerRepository;
    private readonly ticketingRepository;
    private readonly bookingRepository;
    private readonly passengerRepository;
    private readonly mailService;
    private readonly authService;
    constructor(activityLogService: ActivitylogService, agentRepository: Repository<AgentModel>, agentLedgerRepository: Repository<AgentLedgerModel>, ticketingRepository: Repository<TicketModel>, bookingRepository: Repository<BookingModel>, passengerRepository: Repository<PassengerModel>, mailService: MailService, authService: AuthService);
    ticketIssueRequest(header: any, bookingUId: string, payment: string): Promise<{
        message: string;
    }>;
    createTicket(header: any, bookingUId: string, makeTicketModel: MakeTicketModel): Promise<{
        message: string;
    }>;
    rejectTicket(header: any, bookingUId: string, remarks: string): Promise<{
        message: string;
    }>;
}
