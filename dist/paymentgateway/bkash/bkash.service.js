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
exports.BkashService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const bkash_payment_1 = require("bkash-payment");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../../api/agent/agent.model");
const typeorm_2 = require("typeorm");
const deposit_model_1 = require("../../api/deposit/deposit.model");
const report_model_1 = require("../../api/report/report.model");
const axios_1 = require("axios");
const mail_service_1 = require("../../mail/mail.service");
dotenv.config();
let BkashService = class BkashService {
    constructor(agentRepository, depositRepository, agentLedgerRepository, mailService) {
        this.agentRepository = agentRepository;
        this.depositRepository = depositRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.mailService = mailService;
        this.bkashConfig = {
            base_url: process.env.BKASH_BASE_URL,
            username: process.env.BKASH_USERNAME,
            password: process.env.BAKSH_PASSWORD,
            app_key: process.env.BKASH_APP_KEY,
            app_secret: process.env.BKASH_APP_SECRET
        };
    }
    async createPayment(agentUId, amount) {
        const agent = await this.agentRepository.findOne({ where: { uid: agentUId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        try {
            const now = new Date();
            const unixTimestampSeconds = Math.floor(now.getTime() / 1000);
            const orderID = 'MFSB' + unixTimestampSeconds;
            const paymentDetails = {
                amount: amount || 10,
                callbackURL: process.env.BKASH_CALLBACKURL,
                orderID: orderID || 'Order_101',
                reference: agent.uid || 'x'
            };
            const result = await (0, bkash_payment_1.createPayment)(this.bkashConfig, paymentDetails);
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    async executePayment(paymentID, status, res) {
        try {
            if (status === 'success') {
                let result;
                result = await (0, bkash_payment_1.executePayment)(this.bkashConfig, paymentID);
                if (result?.transactionStatus === 'Completed' && result?.statusMessage === 'Successful') {
                    const agent = await this.agentRepository.findOne({ where: { uid: result.payerReference } });
                    if (!agent) {
                        throw new common_1.NotFoundException('Invalid agentUId');
                    }
                    const deposit = await this.depositRepository.find({
                        order: { id: 'DESC' }, take: 1,
                    });
                    let depositId;
                    if (deposit.length === 1) {
                        let old_deposit_id = (deposit[0].depositId).replace("POD", '');
                        depositId = "POD" + (parseInt(old_deposit_id) + 1);
                    }
                    else {
                        depositId = 'POD1000';
                    }
                    const depositModel = new deposit_model_1.DepositModel;
                    depositModel.depositId = depositId;
                    depositModel.agentId = agent.agentId;
                    depositModel.sender = result?.customerMsisdn || '';
                    depositModel.receiver = "Bkash";
                    depositModel.paymentway = "MFS";
                    depositModel.paymentId = result.paymentID,
                        depositModel.trxId = result.trxID,
                        depositModel.ref = result.merchantInvoiceNumber;
                    depositModel.status = "approved";
                    depositModel.amount = result.amount;
                    depositModel.attachment = '';
                    depositModel.companyname = agent.company;
                    const depositResult = await this.depositRepository.save(depositModel);
                    const details = result.amount + ' BDT Deposit By ' + result.sender + '. Through Bkash- ' + result?.customerMsisdn;
                    const actualAmount = Number(result.amount) - (Number(result.amount) * 1.4 / 100);
                    const AgentLedgerData = {
                        agentId: depositResult.agentId,
                        trxtype: 'deposit',
                        amount: actualAmount,
                        refId: depositResult.depositId,
                        details: details,
                        companyname: depositResult.companyname
                    };
                    const agentleader = await this.agentLedgerRepository.findOne({ where: { refId: depositId,
                            trxtype: 'deposit'
                        }
                    });
                    if (agentleader) {
                        throw new common_1.HttpException('Deposit Info already exist in ledger', axios_1.HttpStatusCode.AlreadyReported);
                    }
                    await this.agentLedgerRepository.save(AgentLedgerData);
                    await this.mailService.depositRequestDecision(depositResult);
                    return res.redirect('https://b2b.etripzone.com/payment/success');
                }
                else {
                    const url = 'https://b2b.etripzone.com/payment/' + result?.statusMessage;
                    return res.redirect(url);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async refundPayment(depositUId) {
        const deposit = await this.depositRepository.findOne({ where: { uid: depositUId } });
        if (!deposit) {
            throw new common_1.NotFoundException('Agent not found');
        }
        try {
            const refundDetails = {
                paymentID: deposit.paymentId,
                trxID: deposit.trxId,
                amount: deposit.amount,
            };
            const result = await (0, bkash_payment_1.refundTransaction)(this.bkashConfig, refundDetails);
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    async searchPayment(trxID) {
        try {
            const result = await (0, bkash_payment_1.searchTransaction)(this.bkashConfig, trxID);
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    async queryPayment(paymentID) {
        try {
            const result = await (0, bkash_payment_1.queryPayment)(this.bkashConfig, paymentID);
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
};
exports.BkashService = BkashService;
exports.BkashService = BkashService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(1, (0, typeorm_1.InjectRepository)(deposit_model_1.DepositModel)),
    __param(2, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], BkashService);
//# sourceMappingURL=bkash.service.js.map