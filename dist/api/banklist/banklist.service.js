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
exports.BanklistService = void 0;
const common_1 = require("@nestjs/common");
const banklist_model_1 = require("./banklist.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const axios_1 = require("axios");
let BanklistService = class BanklistService {
    constructor(banklistRepository, agentRepository, authService) {
        this.banklistRepository = banklistRepository;
        this.agentRepository = agentRepository;
        this.authService = authService;
    }
    async createadmin(header, createBanklistDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const existBank = await this.banklistRepository.findOne({ where: { bankname: createBanklistDto.bankname,
                accountnumber: createBanklistDto.accountnumber }
        });
        if (existBank) {
            throw new common_1.HttpException("Alreday Exists Banklist", axios_1.HttpStatusCode.Conflict);
        }
        createBanklistDto['agentId'] = 'admin';
        return this.banklistRepository.save(createBanklistDto);
    }
    async findAllBankList(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return this.banklistRepository.find({ where: { agentId: 'admin' } });
    }
    async findAllByAdmin(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return this.banklistRepository.find({ where: { agentId: 'admin' } });
    }
    async updateadmin(header, uid, updateBanklistDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const banklist = await this.banklistRepository.findOne({ where: { uid: uid } });
        if (!banklist) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return this.banklistRepository.update(banklist.id, updateBanklistDto);
    }
    async removeadmin(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const banklist = await this.banklistRepository.findOne({ where: { uid: uid } });
        if (!banklist) {
            throw new common_1.NotFoundException('Bank Id not found');
        }
        return this.banklistRepository.delete(banklist.id);
    }
    async createagent(agentUId, createBanklistDto) {
        const agent = await this.agentRepository.findOne({ where: { uid: agentUId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        createBanklistDto['agentId'] = agent.agentId;
        return this.banklistRepository.create(createBanklistDto);
    }
    async findAllByAgent(agentUId) {
        const agent = await this.agentRepository.findOne({
            where: { uid: agentUId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return this.banklistRepository.find({ where: { agentId: agent.agentId } });
    }
    async updateagent(uid, updateBanklistDto) {
        const banklist = await this.banklistRepository.findOne({ where: { uid: uid } });
        if (!banklist) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return this.banklistRepository.update(banklist.id, updateBanklistDto);
    }
    async removeagent(uid) {
        const banklist = await this.banklistRepository.findOne({ where: { uid: uid } });
        if (!banklist) {
            throw new common_1.NotFoundException('UId not found');
        }
        return this.banklistRepository.delete(banklist.id);
    }
};
exports.BanklistService = BanklistService;
exports.BanklistService = BanklistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banklist_model_1.BankListModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], BanklistService);
//# sourceMappingURL=banklist.service.js.map