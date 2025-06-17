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
exports.NagadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../../api/agent/agent.model");
const deposit_model_1 = require("../../api/deposit/deposit.model");
const report_model_1 = require("../../api/report/report.model");
const mail_service_1 = require("../../mail/mail.service");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
const node_fetch_1 = require("node-fetch");
const nagad_utils_1 = require("./nagad.utils");
const date_fns_1 = require("date-fns");
let NagadService = class NagadService {
    constructor(agentRepository, depositRepository, agentLedgerRepository, mailService) {
        this.agentRepository = agentRepository;
        this.depositRepository = depositRepository;
        this.agentLedgerRepository = agentLedgerRepository;
        this.mailService = mailService;
    }
    async createPayment(agentUId, amount) {
        const agent = await this.agentRepository.findOne({ where: { uid: agentUId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const api_public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.NAGAD_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
        const api_private_key = `-----BEGIN PRIVATE KEY-----\n${process.env.NAGAD_PRIVATE_KEY}\n-----END PRIVATE KEY-----`;
        const MerchantID = process.env.NAGAD_MERCHANT_ID;
        const OrderString = `${Date.now()}${Math.floor(Math.random() * 99 + 1)}`;
        const OrderId = `${agent.agentId}X${OrderString}`.substring(0, 20);
        const random = crypto.randomBytes(20).toString("hex");
        const PostURL = process.env.NAGAD_BASE_URL + `api/dfs/check-out/initialize/${MerchantID}/${OrderId}`;
        const merchantCallbackURL = "http://localhost:8080/pgw/nagad";
        const SensitiveData = {
            merchantId: MerchantID,
            datetime: (0, date_fns_1.format)(new Date(), "yyyyMMddHHmmSS"),
            orderId: OrderId,
            challenge: random
        };
        const PostData = {
            dateTime: (0, date_fns_1.format)(new Date(), "yyyyMMddHHmmSS"),
            sensitiveData: (0, nagad_utils_1.encryptSensitiveData)({
                sensitive_data: JSON.stringify(SensitiveData),
                public_key: api_public_key,
            }),
            signature: (0, nagad_utils_1.generateDigitalSignature)({
                sensitive_data: JSON.stringify(SensitiveData),
                private_key: api_private_key,
            }),
        };
        const checkout_initialize = await (0, node_fetch_1.default)(PostURL, {
            method: "POST",
            headers: {
                "X-KM-IP-V4": "127.0.0.1",
                "X-KM-Client-Type": "PC_WEB",
                "X-KM-Api-Version": "v-0.2.0",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(PostData),
        });
        const checkout_init_res = await checkout_initialize.json();
        console.log(checkout_init_res);
        const decrypted_checkout_init_res = JSON.parse((0, nagad_utils_1.decryptSensitiveData)({
            sensitive_data: checkout_init_res.sensitiveData,
            private_key: api_private_key,
        }));
        console.log(decrypted_checkout_init_res);
        const isCheckoutInitVerified = (0, nagad_utils_1.isVerifiedDigitalSignature)({
            sensitive_data: JSON.stringify(decrypted_checkout_init_res),
            signature: checkout_init_res.signature,
            public_key: api_public_key,
        });
        console.log(isCheckoutInitVerified);
    }
    async executePayment() {
    }
    async refundPayment() {
    }
    async searchPayment() {
    }
};
exports.NagadService = NagadService;
exports.NagadService = NagadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(1, (0, typeorm_1.InjectRepository)(deposit_model_1.DepositModel)),
    __param(2, (0, typeorm_1.InjectRepository)(report_model_1.AgentLedgerModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], NagadService);
//# sourceMappingURL=nagad.service.js.map