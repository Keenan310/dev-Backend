export declare class AgentModel {
    id: number;
    agentId: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    address: string;
    password: string;
    status: string;
    is_verified: boolean;
    logo: string;
    credit: number;
    markuptype: string;
    markup: number;
    clientmarkuptype: string;
    clientmarkup: number;
    searchlimit: number;
    nid: string;
    tradelicense: string;
    civilaviationno: string;
    acc_key_manager: string;
    partial_eligibility: boolean;
    currency: string;
    ip: string;
    otp: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class AgentModelUpdateAdmin {
    name: string;
    email: string;
    is_verified: boolean;
    company: string;
    phone: string;
    status: string;
    searchlimit: number;
    acc_key_manager: string;
    currency: string;
    civilaviationno: string;
}
export declare class AgentModelUpdateAgent {
    name: string;
    phone: string;
    address: string;
    markuptype: string;
    markup: number;
    password: string;
}
export declare class AgentMarkUpUpdate {
    markuptype: string;
    markup: number;
}
export declare class AgentBalanceUpdate {
    debit: number;
    credit: number;
    trxtype: string;
    refId: string;
    details: string;
    ticketcost: number;
    pnr: string;
}
export declare class AgentCreditModel {
    id: number;
    agentId: string;
    amount: number;
    description: string;
    credited_by: string;
    created_at: Date;
    updated_at: Date;
}
