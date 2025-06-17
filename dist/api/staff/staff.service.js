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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const staff_model_1 = require("./staff.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_model_1 = require("../agent/agent.model");
const axios_1 = require("axios");
const auth_utils_1 = require("../auth/auth.utils");
const auth_service_1 = require("../auth/auth.service");
let StaffService = class StaffService {
    constructor(staffRepository, agentRepository, authService, authUtils) {
        this.staffRepository = staffRepository;
        this.agentRepository = agentRepository;
        this.authService = authService;
        this.authUtils = authUtils;
    }
    async create(header, createStaffDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const staff = await this.staffRepository.find({
            where: [
                { email: createStaffDto.email },
                { phone: createStaffDto.phone },
            ],
        });
        if (staff.length > 0) {
            throw new common_1.HttpException("Staff Already Exist", axios_1.HttpStatusCode.Conflict);
        }
        const agentdata = await this.agentRepository.find({
            where: [
                { email: createStaffDto.email },
                { phone: createStaffDto.phone },
            ],
        });
        if (agentdata.length > 0) {
            throw new common_1.HttpException("Staff Info Already Exist as Agent", axios_1.HttpStatusCode.Conflict);
        }
        createStaffDto.status = 'active';
        const hashedPassword = await this.authUtils.encrypt(createStaffDto.password);
        createStaffDto.password = hashedPassword;
        createStaffDto.agentId = agent.agentId;
        return await this.staffRepository.save(createStaffDto);
    }
    async findAllByAgentUId(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return await this.staffRepository.find({ where: { agentId: agent.agentId } });
        ;
    }
    async findOne(header, staffUId) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return await this.staffRepository.findOne({ where: { uid: staffUId } });
        ;
    }
    async update(header, staffUId, updateStaffDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const staff = await this.staffRepository.findOne({ where: { uid: staffUId } });
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        updateStaffDto['agentId'] = agent.agentId;
        return await this.staffRepository.update(staff.id, updateStaffDto);
    }
    async myaccount(header, staffUId) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return await this.staffRepository.findOne({ where: { uid: staffUId } });
    }
    async myaccountupdate(header, staffUId, updateStaffDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const staff = await this.staffRepository.findOne({ where: { uid: staffUId } });
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        return this.staffRepository.update(staff.id, updateStaffDto);
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_model_1.StaffModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        auth_utils_1.AuthUtils])
], StaffService);
//# sourceMappingURL=staff.service.js.map