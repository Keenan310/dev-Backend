"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const report_controller_1 = require("./report.controller");
const typeorm_1 = require("@nestjs/typeorm");
const report_model_1 = require("./report.model");
const agent_model_1 = require("../agent/agent.model");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const booking_model_1 = require("../booking/booking.model");
const deposit_model_1 = require("../deposit/deposit.model");
const mail_service_1 = require("../../mail/mail.service");
const searchhistory_model_1 = require("../searchhistory/searchhistory.model");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([report_model_1.AgentLedgerModel, agent_model_1.AgentModel, staff_model_1.StaffModel, admin_model_1.AdminModel, booking_model_1.BookingModel, deposit_model_1.DepositModel, searchhistory_model_1.SearchHistoryModel, auth_model_1.OTPModel, report_model_1.AdminExpenseModel])],
        controllers: [report_controller_1.ReportController],
        providers: [report_service_1.ReportService, auth_service_1.AuthService, jwt_1.JwtService, auth_utils_1.AuthUtils, mail_service_1.MailService],
    })
], ReportModule);
//# sourceMappingURL=report.module.js.map