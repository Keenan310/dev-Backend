import { AgentModel } from 'src/api/agent/agent.model';
import { Repository } from 'typeorm';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { MailService } from 'src/mail/mail.service';
export declare class BkashService {
    private readonly agentRepository;
    private readonly depositRepository;
    private readonly agentLedgerRepository;
    private readonly mailService;
    private bkashConfig;
    constructor(agentRepository: Repository<AgentModel>, depositRepository: Repository<DepositModel>, agentLedgerRepository: Repository<AgentLedgerModel>, mailService: MailService);
    createPayment(agentUId: string, amount: number): Promise<any>;
    executePayment(paymentID: string, status: string, res: any): Promise<any>;
    refundPayment(depositUId: string): Promise<any>;
    searchPayment(trxID: string): Promise<any>;
    queryPayment(paymentID: string): Promise<any>;
}
