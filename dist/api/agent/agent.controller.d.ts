import { AgentService } from './agent.service';
import { AgentBalanceUpdate, AgentCreditModel, AgentMarkUpUpdate, AgentModelUpdateAdmin, AgentModelUpdateAgent } from './agent.model';
export declare class AgentController {
    private readonly agentService;
    constructor(agentService: AgentService);
    findAllAdmin(header: Headers, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./agent.model").AgentModel[];
    }>;
    update(header: Headers, uid: string, updateAgentDto: AgentModelUpdateAdmin): Promise<import("typeorm").UpdateResult>;
    addBalance(header: Headers, uid: string, updateAgentBalanceDto: AgentBalanceUpdate): Promise<{
        agentId: string;
        trxtype: string;
        amount: number;
        refId: string;
        details: string;
        companyname: string;
    } & import("../report/report.model").AgentLedgerModel>;
    updateagentstatus(header: Headers, uid: string, status: string): Promise<{
        message: string;
    }>;
    remove(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
    addcredit(header: Headers, uid: string, creditModel: AgentCreditModel): Promise<import("typeorm").UpdateResult>;
    myaccount(header: string): Promise<import("./agent.model").AgentModel>;
    myaccountAdmin(header: Headers, uid: string): Promise<import("./agent.model").AgentModel>;
    agentmyaccountAdmin(header: Headers, agentUId: string, updateMyAgentDto: AgentModelUpdateAdmin): Promise<import("typeorm").UpdateResult>;
    updateagentmyaccount(header: string, updateMyAgentDto: AgentModelUpdateAgent): Promise<import("typeorm").UpdateResult>;
    updateagentmarkup(header: string, updateMyAgenMarkUptDto: AgentMarkUpUpdate): Promise<import("typeorm").UpdateResult>;
    resetPasswordAdmin(header: Headers, uid: string): Promise<string>;
}
