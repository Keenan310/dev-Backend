import { AdminModel, AdminModelUpdate } from './admin.model';
import { Repository } from 'typeorm';
import { StaffModel } from '../staff/staff.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
export declare class AdminService {
    private readonly adminRepository;
    private readonly agentRepository;
    private readonly staffRepository;
    private authService;
    constructor(adminRepository: Repository<AdminModel>, agentRepository: Repository<AgentModel>, staffRepository: Repository<StaffModel>, authService: AuthService);
    create(header: any, createAdminDto: AdminModel): Promise<AdminModel>;
    findAll(header: any): Promise<AdminModel[]>;
    findOne(header: any, uid: string): Promise<AdminModel>;
    update(header: any, uid: string, updateAdminDto: AdminModelUpdate): Promise<import("typeorm").UpdateResult>;
}
