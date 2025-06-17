import { AuthService } from './auth.service';
import { AuthModel } from './auth.model';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signin(authModel: AuthModel): Promise<{
        access_token: string;
    }>;
    adminsignin(authModel: AuthModel): Promise<{
        id: number;
        adminId: string;
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        status: string;
        role: string;
        created_at: Date;
        updated_at: Date;
        uid: string;
    }>;
    forgetPasswordAgent(email: string): Promise<{
        message: string;
    }>;
    verifyOTPagent(code: string, newpassword: string): Promise<{
        message: string;
    }>;
}
