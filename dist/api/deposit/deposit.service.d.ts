import { DepositBonuseModel, DepositModel, DepositModelUpdateStatus } from './deposit.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
export declare class DepositService {
    private readonly depositRepository;
    private readonly agentRepository;
    private readonly agentLedgerRepository;
    private readonly authService;
    private mailService;
    constructor(depositRepository: Repository<DepositModel>, agentRepository: Repository<AgentModel>, agentLedgerRepository: Repository<AgentLedgerModel>, authService: AuthService, mailService: MailService);
    findAllAdmin(header: any, page: number, status: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: DepositModel[];
    }>;
    findAllAgent(header: any, page: number, status: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: DepositModel[];
    }>;
    update(header: any, uid: string, updateDepositDto: DepositModelUpdateStatus): Promise<import("typeorm").UpdateResult>;
    updatestatus(header: any, uid: string, updateDepositDto: DepositModelUpdateStatus): Promise<import("typeorm").UpdateResult>;
    addDepositBonus(header: any, agentUId: string, depositBonuseModel: DepositBonuseModel): Promise<{
        agentId: string;
        trxtype: string;
        credit: number;
        refId: string;
        details: string;
        companyname: string;
    } & AgentLedgerModel>;
    findAllAgentByAdmin(header: any, agentUId: string, page: number, status: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: DepositModel[];
    }>;
}
