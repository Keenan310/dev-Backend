import { BkashService } from './bkash.service';
export declare class BkashController {
    private readonly bkashService;
    constructor(bkashService: BkashService);
    createPayment(agentUId: string, amount: number): Promise<any>;
    getPayment(paymentID: string, status: string, res: any): any;
    refundPayment(depositUId: string): Promise<any>;
    searchPayment(transactionId: string): Promise<any>;
    queryPayment(paymentId: string): Promise<any>;
}
