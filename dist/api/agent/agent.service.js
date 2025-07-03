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
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const agent_model_1 = require("./agent.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dotenv = require("dotenv");
const booking_model_1 = require("../booking/booking.model");
const deposit_model_1 = require("../deposit/deposit.model");
const axios_1 = require("axios");
const auth_service_1 = require("../auth/auth.service");
const report_model_1 = require("../report/report.model");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
dotenv.config();
let AgentService = class AgentService {
    constructor(agentRepository, agentLedgerRepository, agentCreditRepository, bookingRepository, depositRepository, authService, authUtils, mailService) {
        this.agentRepository = agentRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.agentCreditRepository = agentCreditRepository;
        this.bookingRepository = bookingRepository;
        this.depositRepository = depositRepository;
        this.authService = authService;
        this.authUtils = authUtils;
        this.mailService = mailService;
    }
    async findAllAdmin(header, page, status, filter, limit) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let queryBuilder = this.agentRepository.createQueryBuilder("agent");
        if (status) {
            queryBuilder = queryBuilder.where("agent.status = :status", { status });
        }
        if (filter) {
            queryBuilder = queryBuilder.andWhere("(agent.agentId LIKE :filter OR agent.name LIKE :filter OR agent.company LIKE :filter OR agent.email LIKE :filter OR agent.phone LIKE :filter)", { filter: `%${filter}%` });
        }
        const totaldata = await queryBuilder.getCount();
        const agents = await queryBuilder
            .orderBy("agent.id", "DESC")
            .skip(skip)
            .take(take)
            .getMany();
        const agentsData = {
            limit: Number(limit),
            page: Number(page),
            totalpage: Math.ceil(totaldata / limit),
            totaldata: totaldata,
            data: agents
        };
        return agentsData;
    }
    async findAllStatus(headers, status) {
        const verifyAdminId = await this.authService.verifyAdminToken(headers);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.agentRepository.find({ where: { status: status } });
    }
    async findOne(headers, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(headers);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({
            where: { uid: uid },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return agent;
    }
    async update(header, uid, updateAgentDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({
            where: { uid: uid },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return this.agentRepository.update(agent.id, updateAgentDto);
    }
    async updateAgentStatus(header, uid, status) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        if (agent.status === status || agent.status === 'pending' || agent.status === 'deactive') {
            agent['status'] = status;
            const agentresponse = await this.agentRepository.update(agent.id, agent);
            if (agentresponse.affected === 1) {
                await this.mailService.signUpDecisionMail(agent);
                return { message: 'Agent ' + status + ' Successfully.' };
            }
            else {
                return { message: 'Something error' };
            }
        }
    }
    async resetpasswordadmin(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const generatePassword = await this.authUtils.generateRandomPassword();
        const hashedPassword = await this.authUtils.encrypt(generatePassword);
        agent.password = hashedPassword;
        const update = await this.agentRepository.update(agent.id, agent);
        if (update.affected === 1) {
            await this.mailService.resetPasswordMail(agent, generatePassword);
            return 'Password rest successfully. New password send to agent email';
        }
        else {
            throw new common_1.HttpException('error Occure', axios_1.HttpStatusCode.BadRequest);
        }
    }
    async remove(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({
            where: { uid: uid },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const booking = await this.bookingRepository.findOne({
            where: { agentId: agent.agentId },
        });
        const deposit = await this.depositRepository.findOne({
            where: { agentId: agent.agentId },
        });
        if (booking) {
            throw new common_1.HttpException('Agent has booking or ticket. You cannot delete agent', axios_1.HttpStatusCode.Forbidden);
        }
        if (deposit) {
            throw new common_1.HttpException('Agent has deposit. You cannot delete agent', axios_1.HttpStatusCode.Forbidden);
        }
        return await this.agentRepository.delete(agent.id);
    }
    async myaccountadmin(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const agentLedger = await this.agentLedgerRepository
            .createQueryBuilder()
            .select('SUM(amount)', 'sum')
            .where('agentId = :agentId', { agentId: agent.agentId })
            .getRawOne();
        agent['balance'] = agentLedger.sum != null ? agentLedger.sum : 0;
        return agent;
    }
    async myaccount(header) {
        const verifyAgent = await this.authService.verifyAgentToken(header);
        if (!verifyAgent) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: verifyAgent.uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        delete agent.password;
        const agentLedger = await this.agentLedgerRepository
            .createQueryBuilder()
            .select('SUM(amount)', 'sum')
            .where('agentId = :agentId', { agentId: agent.agentId })
            .getRawOne();
        agent['balance'] = agentLedger.sum != null ? agentLedger.sum : 0;
        return agent;
    }
    async agentmyaccountadmin(header, agentUId, updateMyAgentDto) {
        const verifyAdmin = await this.authService.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: agentUId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return this.agentRepository.update(agent.id, updateMyAgentDto);
    }
    async updateagentmyaccount(header, updateMyAgentDto) {
        const verifyAgent = await this.authService.verifyAgentToken(header);
        if (!verifyAgent) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: verifyAgent.uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        if (updateMyAgentDto?.password) {
            const hashedPassword = await this.authUtils.encrypt(updateMyAgentDto.password);
            agent.password = hashedPassword;
        }
        if (updateMyAgentDto?.markuptype) {
            agent.clientmarkuptype = updateMyAgentDto.markuptype;
            agent.clientmarkup = updateMyAgentDto.markup;
        }
        return this.agentRepository.update(agent.id, updateMyAgentDto);
    }
    async updateagentmarkup(header, updateMyAgentMarkUpDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        agent['clientmarkup'] = updateMyAgentMarkUpDto.markup;
        agent['clientmarkuptype'] = updateMyAgentMarkUpDto.markuptype;
        return this.agentRepository.update(agent.id, agent);
    }
    async getcredit(uid) {
        const agent = await this.agentRepository.findOne({ where: { uid: uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const agentCredit = await this.agentCreditRepository.find({ where: { agentId: agent.agentId }, order: { id: 'DESC' } });
        return agentCredit;
    }
    async addcredit(header, uid, creditModel) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const previousCredit = agent.credit;
        const newCredit = previousCredit + Number(creditModel.amount);
        agent['credit'] = newCredit;
        const createModels = new agent_model_1.AgentCreditModel();
        createModels.agentId = agent.agentId;
        createModels.amount = newCredit;
        createModels.description = creditModel.description;
        createModels.credited_by = verifyAdminId.firstname + verifyAdminId.lastname;
        await this.agentCreditRepository.save(createModels);
        return this.agentRepository.update(agent.id, agent);
    }
    async addBalance(header, uid, updateAgentBalanceDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const agent = await this.agentRepository.findOne({ where: { uid: uid } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const details = updateAgentBalanceDto.amount + ' AED By ' + verifyAdminId.firstname;
        const AgentLedgerData = {
            agentId: agent.agentId,
            trxtype: updateAgentBalanceDto.trxtype,
            amount: updateAgentBalanceDto.amount,
            refId: updateAgentBalanceDto.refId,
            details: details,
            companyname: agent.company
        };
        return await this.agentLedgerRepository.save(AgentLedgerData);
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(1, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_model_1.AgentCreditModel)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(4, (0, typeorm_1.InjectRepository)(deposit_model_1.DepositModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        auth_utils_1.AuthUtils,
        mail_service_1.MailService])
], AgentService);
//# sourceMappingURL=agent.service.js.map