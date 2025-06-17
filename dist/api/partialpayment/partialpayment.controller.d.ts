import { PartialpaymentService } from './partialpayment.service';
import { UpdatePartialpaymentDto } from './dto/update-partialpayment.dto';
export declare class PartialpaymentController {
    private readonly partialpaymentService;
    constructor(partialpaymentService: PartialpaymentService);
    findAllAdmin(header?: string, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./entities/partialpayment.entity").PartialPaymentModel[];
    }>;
    updateOneAdmin(header: Headers, uid: string, updatePartialpaymentDto: UpdatePartialpaymentDto): Promise<import("typeorm").UpdateResult>;
    findAllAgent(header?: string, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./entities/partialpayment.entity").PartialPaymentModel[];
    }>;
    payduePartialPayment(header: string, uid: string): Promise<{
        message: string;
    }>;
}
