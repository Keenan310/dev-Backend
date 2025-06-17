import { AgentModel } from 'src/api/agent/agent.model';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
export declare class NagadService {
    private readonly agentRepository;
    private readonly depositRepository;
    private readonly agentLedgerRepository;
    private readonly mailService;
    constructor(agentRepository: Repository<AgentModel>, depositRepository: Repository<DepositModel>, agentLedgerRepository: Repository<AgentLedgerModel>, mailService: MailService);
    createPayment(agentUId: string, amount: number): Promise<void>;
    executePayment(): Promise<void>;
    refundPayment(): Promise<void>;
    searchPayment(): Promise<void>;
}
