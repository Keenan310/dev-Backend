import { VoidService } from './void.service';
import { VoidModel } from './void.model';
export declare class VoidController {
    private readonly voidService;
    constructor(voidService: VoidService);
    createVoidRequest(header: string, bookingUId: string, createVoidDto: VoidModel): Promise<{
        message: string;
    }>;
    voidDecision(header: Headers, bookingUId: string, status: string, servicefee: number): Promise<{
        message: string;
    }>;
}
