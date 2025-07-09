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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_model_1 = require("./admin.model");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const dotenv = require("dotenv");
const staff_model_1 = require("../staff/staff.model");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
dotenv.config();
let AdminService = class AdminService {
    constructor(adminRepository, agentRepository, staffRepository, authService) {
        this.adminRepository = adminRepository;
        this.agentRepository = agentRepository;
        this.staffRepository = staffRepository;
        this.authService = authService;
    }
    async create(header, createAdminDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const existAdmin = await this.adminRepository.findOne({ where: { email: createAdminDto.email } });
        const existAgent = await this.agentRepository.findOne({ where: { email: createAdminDto.email } });
        const existStaff = await this.staffRepository.findOne({ where: { email: createAdminDto.email } });
        if (existAdmin) {
            throw new common_1.HttpException("Admin already exists", common_1.HttpStatus.CONFLICT);
        }
        if (existAgent) {
            throw new common_1.HttpException("Email already exists, agent list", common_1.HttpStatus.CONFLICT);
        }
        if (existStaff) {
            throw new common_1.HttpException("Email already exists, staff list", common_1.HttpStatus.CONFLICT);
        }
        const admin = await this.adminRepository.find({ order: { id: 'DESC' }, take: 1 });
        let adminId = '';
        if (admin.length == 1) {
            let old_admin_id = (admin[0].adminId).replace("KTAD", '');
            adminId = "KTAD" + (parseInt(old_admin_id) + 1);
        }
        else {
            adminId = 'KTAD1000';
        }
        createAdminDto["adminId"] = adminId;
        createAdminDto["status"] = "active";
        return await this.adminRepository.save(createAdminDto);
    }
    async findAll(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const allAdmins = await this.adminRepository.find();
        return allAdmins.slice(1);
    }
    async findOne(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const admin = await this.adminRepository.findOneBy({ uid: uid });
        if (!admin) {
            throw new common_1.NotFoundException();
        }
        return admin;
    }
    async update(header, uid, updateAdminDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const admin = await this.adminRepository.findOne({ where: { uid: uid } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        return this.adminRepository.update(admin.id, updateAdminDto);
    }
    async delete(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const admin = await this.adminRepository.findOne({ where: { uid: uid } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        console.log(admin);
        if (verifyAdminId.role !== 'superadmin' && verifyAdminId.role !== 'admin') {
            throw new common_1.NotAcceptableException("Only Super admin can delete account");
        }
        return this.adminRepository.delete(admin.id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(admin_model_1.AdminModel)),
    __param(1, (0, typeorm_2.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_2.InjectRepository)(staff_model_1.StaffModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map