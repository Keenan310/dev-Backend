import { AgentBalanceUpdate, AgentCreditModel, AgentMarkUpUpdate, AgentModel, AgentModelUpdateAdmin, AgentModelUpdateAgent } from './agent.model';
import { Repository } from 'typeorm';
import { BookingModel } from '../booking/booking.model';
import { DepositModel } from '../deposit/deposit.model';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
export declare class AgentService {
    private readonly agentRepository;
    private readonly agentLedgerRepository;
    private readonly agentCreditRepository;
    private readonly bookingRepository;
    private readonly depositRepository;
    private authService;
    private authUtils;
    private mailService;
    constructor(agentRepository: Repository<AgentModel>, agentLedgerRepository: Repository<AgentLedgerModel>, agentCreditRepository: Repository<AgentCreditModel>, bookingRepository: Repository<BookingModel>, depositRepository: Repository<DepositModel>, authService: AuthService, authUtils: AuthUtils, mailService: MailService);
    findAllAdmin(header: any, page: number, status: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: AgentModel[];
    }>;
    findAllStatus(headers: any, status: string): Promise<AgentModel[]>;
    findOne(headers: any, uid: string): Promise<AgentModel>;
    update(header: any, uid: string, updateAgentDto: AgentModelUpdateAdmin): Promise<import("typeorm").UpdateResult>;
    updateAgentStatus(header: any, uid: string, status: string): Promise<{
        message: string;
    }>;
    resetpasswordadmin(header: any, uid: string): Promise<string>;
    remove(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
    myaccountadmin(header: any, uid: string): Promise<AgentModel>;
    myaccount(header: any): Promise<AgentModel>;
    agentmyaccountadmin(header: any, agentUId: string, updateMyAgentDto: AgentModelUpdateAdmin): Promise<import("typeorm").UpdateResult>;
    updateagentmyaccount(header: string, updateMyAgentDto: AgentModelUpdateAgent): Promise<import("typeorm").UpdateResult>;
    updateagentmarkup(header: any, updateMyAgentMarkUpDto: AgentMarkUpUpdate): Promise<import("typeorm").UpdateResult>;
    getcredit(uid: string): Promise<AgentCreditModel[]>;
    addcredit(header: any, uid: string, creditModel: AgentCreditModel): Promise<import("typeorm").UpdateResult>;
    addBalance(header: any, uid: string, updateAgentBalanceDto: AgentBalanceUpdate): Promise<{
        agentId: string;
        trxtype: string;
        debit: number;
        refId: string;
        ticketcost: number;
        netfare: number;
        pnr: string;
        details: string;
        companyname: string;
    } & AgentLedgerModel>;
}
