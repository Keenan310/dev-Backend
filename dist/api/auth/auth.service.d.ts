import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthModel, OTPModel } from './auth.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { StaffModel } from '../staff/staff.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from './auth.utils';
export declare class AuthService {
    private readonly agentRepository;
    private readonly staffRepository;
    private readonly adminRepository;
    private readonly otpRepository;
    private jwtService;
    private mailService;
    private authUtils;
    constructor(agentRepository: Repository<AgentModel>, staffRepository: Repository<StaffModel>, adminRepository: Repository<AdminModel>, otpRepository: Repository<OTPModel>, jwtService: JwtService, mailService: MailService, authUtils: AuthUtils);
    adminLogin(authDto: AuthModel): Promise<{
        status: string;
        message: string;
    }>;
    adminsignin(authDto: AuthModel): Promise<{
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
    }>;
    agentLogin(authDto: AuthModel): Promise<{
        status: string;
        message: string;
    }>;
    agentsignin(authDto: AuthModel): Promise<{
        access_token: string;
    }>;
    agentForgetPassword(email: string): Promise<{
        message: string;
    }>;
    verifyOTPUpdatePassword(code: string, newpassword: string): Promise<{
        message: string;
    }>;
    verifyOTPAgentLogin(otp: string): Promise<{
        access_token: string;
    }>;
    verifyOTPAdminLogin(otp: string): Promise<{
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
    }>;
    generateJwtToken(payload: any): Promise<string>;
    verifyAdminToken(header: any): Promise<AdminModel>;
    verifyAgentToken(header: any): Promise<any>;
    generateOTP(): Promise<string>;
}
