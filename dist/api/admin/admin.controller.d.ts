import { AdminService } from './admin.service';
import { AdminModel, AdminModelUpdate } from './admin.model';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(header: Headers, createAdminDto: AdminModel): Promise<AdminModel>;
    findAll(header: Headers): Promise<{
        id: number;
        adminId: string;
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        status: string;
        role: string;
        otp: string;
        created_at: Date;
        updated_at: Date;
        uid: string;
    }[]>;
    findAllAdmin(header: Headers): Promise<AdminModel[]>;
    findOne(header: Headers, uid: string): Promise<AdminModel>;
    update(header: Headers, uid: string, updateAdminDto: AdminModelUpdate): Promise<import("typeorm").UpdateResult>;
    delete(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
}
