"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BkashModule = void 0;
const common_1 = require("@nestjs/common");
const bkash_service_1 = require("./bkash.service");
const bkash_controller_1 = require("./bkash.controller");
const mail_service_1 = require("../../mail/mail.service");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../../api/agent/agent.model");
const deposit_model_1 = require("../../api/deposit/deposit.model");
const report_model_1 = require("../../api/report/report.model");
const booking_model_1 = require("../../api/booking/booking.model");
let BkashModule = class BkashModule {
};
exports.BkashModule = BkashModule;
exports.BkashModule = BkashModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agent_model_1.AgentModel, deposit_model_1.DepositModel, report_model_1.AgentLedgerModel, booking_model_1.BookingModel])],
        controllers: [bkash_controller_1.BkashController],
        providers: [bkash_service_1.BkashService, mail_service_1.MailService],
    })
], BkashModule);
//# sourceMappingURL=bkash.module.js.map