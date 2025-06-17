/// <reference types="multer" />
import { UploadService } from './upload.service';
import { AgentModel } from '../agent/agent.model';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    signUp(agentDto: AgentModel, files: {
        nid?: Express.Multer.File[];
        tl?: Express.Multer.File[];
    }): Promise<any>;
    uploadAgentLogo(header: string, file: Express.Multer.File, res: any): Promise<void>;
    uploadAgentTL(header: string, file: Express.Multer.File, res: any): Promise<void>;
    uploadDepositFile(header: string, amount: number, sender: string, paymentway: string, receiver: string, reference: string, file: Express.Multer.File, res: any): Promise<void>;
    addPromotion(header: Headers, file: Express.Multer.File, category: string, res: any): Promise<void>;
    uploadPassportCopy(docs: string, paxUId: string, file: Express.Multer.File, res: any): Promise<void>;
    uploadReissueTicketCopy(header: Headers, bookingUId: string, file: Express.Multer.File, res: any): Promise<void>;
}
