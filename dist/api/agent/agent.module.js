"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const common_1 = require("@nestjs/common");
const agent_service_1 = require("./agent.service");
const agent_controller_1 = require("./agent.controller");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("./agent.model");
const booking_model_1 = require("../booking/booking.model");
const deposit_model_1 = require("../deposit/deposit.model");
const auth_service_1 = require("../auth/auth.service");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const report_model_1 = require("../report/report.model");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let AgentModule = class AgentModule {
};
exports.AgentModule = AgentModule;
exports.AgentModule = AgentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agent_model_1.AgentModel, agent_model_1.AgentCreditModel, booking_model_1.BookingModel, deposit_model_1.DepositModel, staff_model_1.StaffModel, admin_model_1.AdminModel, report_model_1.AgentLedgerModel, auth_model_1.OTPModel])],
        controllers: [agent_controller_1.AgentController],
        providers: [agent_service_1.AgentService, auth_service_1.AuthService, auth_utils_1.AuthUtils, jwt_1.JwtService, mail_service_1.MailService],
    })
], AgentModule);
//# sourceMappingURL=agent.module.js.map