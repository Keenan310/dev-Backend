import { NagadService } from './nagad.service';
export declare class NagadController {
    private readonly nagadService;
    constructor(nagadService: NagadService);
    createPayment(agentUId: string, amount: number): Promise<void>;
}
