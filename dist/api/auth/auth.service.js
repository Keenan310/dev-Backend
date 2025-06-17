"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_model_1 = require("../agent/agent.model");
const auth_model_1 = require("./auth.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const staff_model_1 = require("../staff/staff.model");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("./auth.utils");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
let AuthService = class AuthService {
    constructor(agentRepository, staffRepository, adminRepository, otpRepository, jwtService, mailService, authUtils) {
        this.agentRepository = agentRepository;
        this.staffRepository = staffRepository;
        this.adminRepository = adminRepository;
        this.otpRepository = otpRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.authUtils = authUtils;
    }
    async adminsignin(authDto) {
        const existAdmin = await this.adminRepository.findOne({
            where: { email: authDto.email }
        });
        if (!existAdmin) {
            throw new common_1.NotFoundException("Admin not found");
        }
        if (existAdmin.status != 'active') {
            throw new common_1.HttpException(`${existAdmin.status} pending`, common_1.HttpStatus.CONFLICT);
        }
        if (authDto.password === existAdmin.password) {
            const payload = { adminUId: existAdmin.uid };
            const access_token = await this.jwtService.signAsync(payload);
            const { password, ...adminData } = existAdmin;
            adminData['token'] = access_token;
            return adminData;
        }
        throw new common_1.HttpException('Wrong password', common_1.HttpStatus.CONFLICT);
    }
    async agentsignin(authDto) {
        const existAgent = await this.agentRepository.findOne({ where: { email: authDto.email } });
        const existStaff = await this.staffRepository.findOne({ where: { email: authDto.email } });
        if (existAgent) {
            const hashedPassword = await this.authUtils.encrypt(authDto.password);
            if (existAgent.password === hashedPassword) {
                delete existAgent.password;
                existAgent['usertype'] = 'agent';
                existAgent["staffdata"] = [];
                const payload = {
                    company: existAgent.company,
                    uid: existAgent.uid,
                    name: existAgent.name,
                    email: existAgent.email,
                    phone: existAgent.phone,
                    status: existAgent.status,
                    staffdata: {}
                };
                const token = this.jwtService.sign(payload);
                return { access_token: token };
            }
            else {
                throw new common_1.HttpException('Agent Wrong password', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else if (existStaff) {
            const hashedPassword = await this.authUtils.encrypt(authDto.password);
            if (existStaff.password === hashedPassword) {
                const existAgent = await this.agentRepository.findOne({ where: { agentId: existStaff.agentId } });
                delete existStaff.password;
                delete existAgent.password;
                existAgent['usertype'] = 'staff';
                existAgent['staffdata'] = existStaff;
                const payload = {
                    company: existAgent.company,
                    uid: existAgent.uid,
                    name: existAgent.name,
                    phone: existAgent.phone,
                    email: existAgent.email,
                    status: existAgent.status,
                    staffdata: {
                        email: existStaff.email,
                        name: existStaff.name,
                        role: existStaff.role,
                        status: existStaff.status,
                        uid: existStaff.uid
                    }
                };
                const token = this.jwtService.sign(payload);
                return { access_token: token };
            }
            else {
                throw new common_1.HttpException('Agent Wrong password', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new common_1.NotFoundException('User Not Found');
        }
    }
    async agentForgetPassword(email) {
        const existAgent = await this.agentRepository.findOne({ where: { email: email } });
        if (!existAgent) {
            throw new common_1.NotFoundException("Agent not found. Please Sign Up or Contact To The Admin");
        }
        if (existAgent) {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);
            const OTPCount = await this.otpRepository.count({ where: {
                    created_at: (0, typeorm_2.MoreThan)(oneHourAgo),
                    agentUId: existAgent.uid
                }
            });
            if (OTPCount > 3) {
                throw new common_1.NotAcceptableException('Too many attempts. Try Later');
            }
            const OTPcode = await this.authUtils.generateOTP();
            const otpModel = new auth_model_1.OTPModel();
            otpModel.agentUId = existAgent.uid;
            otpModel.code = OTPcode.toString();
            const OTP = await this.otpRepository.save(otpModel);
            await this.mailService.OTPSend(existAgent, OTPcode);
            if (OTP) {
                return { message: 'Check OTP for Mail' };
            }
            else {
                return { message: 'Something error' };
            }
        }
    }
    async verifyOTPUpdatePassword(code, newpassword) {
        const existOTP = await this.otpRepository.findOne({ where: { code: code } });
        if (!existOTP) {
            throw new common_1.NotFoundException("Invalid OTP Code");
        }
        const existAgent = await this.agentRepository.findOne({ where: { uid: existOTP.agentUId } });
        if (existAgent) {
            const newhashedPassword = await this.authUtils.encrypt(newpassword);
            existAgent['password'] = newhashedPassword;
            const resetPassword = await this.agentRepository.update(existAgent.id, existAgent);
            if (resetPassword.affected === 1) {
                await this.otpRepository.delete(existOTP.id);
                await this.mailService.forgetPasswordMail(existAgent);
                return { message: 'Password updated successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
    }
    async generateJwtToken(payload) {
        const access_token = this.jwtService.sign(payload);
        return access_token;
    }
    async verifyAdminToken(header) {
        try {
            const token = header['authorization'].replace('Bearer ', '');
            if (!token) {
                throw new common_1.UnauthorizedException();
            }
            const decodedToken = jwt.verify(token, process.env.JWT_SECREATE_KEY);
            const adminToken = this.jwtService.decode(token);
            const adminData = await this.adminRepository.findOne({ where: { uid: adminToken.adminUId } });
            if (!adminData) {
                throw new common_1.UnauthorizedException();
            }
            return adminData;
        }
        catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new common_1.UnauthorizedException('Token expired');
            }
            throw new common_1.UnauthorizedException();
        }
    }
    async verifyAgentToken(header) {
        try {
            const token = header.authorization.replace('Bearer ', '');
            const decodedToken = jwt.verify(token, process.env.JWT_SECREATE_KEY);
            const agentToken = this.jwtService.decode(token);
            const agentData = await this.agentRepository.findOne({ where: { uid: agentToken.uid } });
            if (!agentData) {
                throw new common_1.UnauthorizedException();
            }
            return agentData;
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new common_1.UnauthorizedException('Token expired');
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_model_1.StaffModel)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_model_1.AdminModel)),
    __param(3, (0, typeorm_1.InjectRepository)(auth_model_1.OTPModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService,
        auth_utils_1.AuthUtils])
], AuthService);
//# sourceMappingURL=auth.service.js.map