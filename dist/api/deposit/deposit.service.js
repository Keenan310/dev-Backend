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
exports.DepositService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const deposit_model_1 = require("./deposit.model");
const typeorm_2 = require("typeorm");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
const report_model_1 = require("../report/report.model");
const axios_1 = require("axios");
const mail_service_1 = require("../../mail/mail.service");
let DepositService = class DepositService {
    constructor(depositRepository, agentRepository, agentLedgerRepository, authService, mailService) {
        this.depositRepository = depositRepository;
        this.agentRepository = agentRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.authService = authService;
        this.mailService = mailService;
    }
    async findAllAdmin(header, page, status, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.depositRepository.createQueryBuilder("deposit");
        if (status) {
            queryBuilder = queryBuilder.where("deposit.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(deposit.agentId LIKE :filter OR deposit.depositId LIKE :filter OR deposit.companyname LIKE :filter OR deposit.ref LIKE :filter OR deposit.trxId LIKE :filter OR deposit.paymentway LIKE :filter)", { filter: `%${filter}%` });
        }
        const totaldata = await queryBuilder.getCount();
        const deposits = await queryBuilder
            .orderBy("deposit.id", "DESC")
            .skip(skip)
            .take(take)
            .getMany();
        const depositsData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            data: deposits
        };
        return depositsData;
    }
    async findAllAgent(header, page, status, filter, limit) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.depositRepository.createQueryBuilder("deposit");
        if (status) {
            queryBuilder = queryBuilder.where("deposit.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(deposit.depositId LIKE :filter OR deposit.ref LIKE :filter OR deposit.trxId LIKE :filter OR deposit.paymentway LIKE :filter)", { filter: `%${filter}%` });
        }
        const agentId = agent.agentId;
        queryBuilder.andWhere("deposit.agentId = :agentId", { agentId });
        const totaldata = await queryBuilder.getCount();
        const deposits = await queryBuilder
            .orderBy("deposit.id", "DESC")
            .skip(skip)
            .take(take)
            .getMany();
        const depositsData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            data: deposits
        };
        return depositsData;
    }
    async update(header, uid, updateDepositDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const deposit = await this.depositRepository.findOne({
            where: { uid: uid },
        });
        if (!deposit) {
            throw new common_1.NotFoundException('UId not found');
        }
        return this.depositRepository.update(deposit.id, updateDepositDto);
    }
    async updatestatus(header, uid, updateDepositDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const deposit = await this.depositRepository.findOne({ where: { uid: uid } });
        if (!deposit) {
            throw new common_1.NotFoundException('Deposit not found');
        }
        if (deposit.status == 'approved' || deposit.status == 'rejected') {
            throw new common_1.HttpException(`Deposit already ${deposit.status}`, axios_1.HttpStatusCode.Locked);
        }
        if (updateDepositDto.status === 'approved') {
            deposit.status = 'approved';
            const details = deposit.amount + ' AED Deposite By ' + deposit.sender;
            const AgentLedgerData = {
                agentId: deposit.agentId,
                trxtype: 'deposit',
                credit: deposit.amount,
                refId: deposit.depositId,
                details: details,
                companyname: deposit.companyname
            };
            const agentleader = await this.agentLedgerRepository.findOne({ where: { refId: deposit.depositId,
                    trxtype: 'deposit'
                }
            });
            if (agentleader) {
                throw new common_1.HttpException('Deposit Info already exist in ledger', axios_1.HttpStatusCode.AlreadyReported);
            }
            await this.agentLedgerRepository.save(AgentLedgerData);
            await this.mailService.depositRequestApproved(deposit);
        }
        else if (updateDepositDto.status === 'rejected') {
            deposit.status = 'rejected';
            deposit.remarks = updateDepositDto.remarks;
        }
        return this.depositRepository.update(deposit.id, deposit);
    }
    async addDepositBonus(header, agentUId, depositBonuseModel) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: agentUId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const details = depositBonuseModel.bonus + ' AED Deposit Bonus By ' + verifyAdminId.firstname;
        const AgentLedgerData = {
            agentId: agent.agentId,
            trxtype: 'bonus',
            credit: depositBonuseModel.bonus,
            refId: depositBonuseModel.refId,
            details: details,
            companyname: agent.company
        };
        const addAgentLedger = await this.agentLedgerRepository.save(AgentLedgerData);
        await this.mailService.depositBonus(addAgentLedger);
        return addAgentLedger;
    }
    async findAllAgentByAdmin(header, agentUId, page, status, filter, limit) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.depositRepository.createQueryBuilder("deposit");
        if (status) {
            queryBuilder = queryBuilder.where("deposit.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(deposit.depositId LIKE :filter OR deposit.ref LIKE :filter OR deposit.trxId LIKE :filter OR deposit.paymentway LIKE :filter)", { filter: `%${filter}%` });
        }
        const agentId = agent.agentId;
        queryBuilder.andWhere("deposit.agentId = :agentId", { agentId });
        const totaldata = await queryBuilder.getCount();
        const deposits = await queryBuilder
            .orderBy("deposit.id", "DESC")
            .skip(skip)
            .take(take)
            .getMany();
        const depositsData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            data: deposits
        };
        return depositsData;
    }
};
exports.DepositService = DepositService;
exports.DepositService = DepositService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deposit_model_1.DepositModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        mail_service_1.MailService])
], DepositService);
//# sourceMappingURL=deposit.service.js.map