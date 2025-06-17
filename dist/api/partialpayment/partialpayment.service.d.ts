import { PartialPaymentModel } from './entities/partialpayment.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AgentLedgerModel } from '../report/report.model';
import { UpdatePartialpaymentDto } from './dto/update-partialpayment.dto';
export declare class PartialpaymentService {
    private readonly partialPaymentRepository;
    private readonly agentLedgerRepository;
    private readonly bookingRepository;
    private readonly authService;
    private readonly mailService;
    constructor(partialPaymentRepository: Repository<PartialPaymentModel>, agentLedgerRepository: Repository<AgentLedgerModel>, bookingRepository: Repository<BookingModel>, authService: AuthService, mailService: MailService);
    create(partialData: any): Promise<any>;
    findAllAdmin(header: any, page: number, status: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: PartialPaymentModel[];
    }>;
    updateOneAdmin(header: any, uid: string, updatePartialpaymentDto: UpdatePartialpaymentDto): Promise<import("typeorm").UpdateResult>;
    findAllAgent(header: any, page: number, status: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: PartialPaymentModel[];
    }>;
    paydue(header: string, uid: string): Promise<{
        message: string;
    }>;
}
