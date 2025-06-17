import { StaffService } from './staff.service';
import { StaffModel, StaffModelUpdate, StaffModelUpdateByAgent } from './staff.model';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(header: string, createStaffDto: StaffModel): Promise<StaffModel>;
    findAllByAgentUId(header: string): Promise<StaffModel[]>;
    findOne(header: string, uid: string): Promise<StaffModel>;
    update(header: string, staffUId: string, updateStaffDtoagent: StaffModelUpdateByAgent): Promise<import("typeorm").UpdateResult>;
    myaccount(header: string, staffUId: string): Promise<StaffModel>;
    myaccountupdate(header: string, staffUId: string, updateStaffDto: StaffModelUpdate): Promise<import("typeorm").UpdateResult>;
}
