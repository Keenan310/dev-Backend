import { StaffModel, StaffModelUpdate, StaffModelUpdateByAgent } from './staff.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthUtils } from '../auth/auth.utils';
import { AuthService } from '../auth/auth.service';
export declare class StaffService {
    private readonly staffRepository;
    private readonly agentRepository;
    private readonly authService;
    private readonly authUtils;
    constructor(staffRepository: Repository<StaffModel>, agentRepository: Repository<AgentModel>, authService: AuthService, authUtils: AuthUtils);
    create(header: any, createStaffDto: StaffModel): Promise<StaffModel>;
    findAllByAgentUId(header: any): Promise<StaffModel[]>;
    findOne(header: any, staffUId: string): Promise<StaffModel>;
    update(header: any, staffUId: string, updateStaffDto: StaffModelUpdateByAgent): Promise<import("typeorm").UpdateResult>;
    myaccount(header: any, staffUId: string): Promise<StaffModel>;
    myaccountupdate(header: any, staffUId: string, updateStaffDto: StaffModelUpdate): Promise<import("typeorm").UpdateResult>;
}
