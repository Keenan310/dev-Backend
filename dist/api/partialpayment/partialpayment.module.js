"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialpaymentModule = void 0;
const common_1 = require("@nestjs/common");
const partialpayment_service_1 = require("./partialpayment.service");
const partialpayment_controller_1 = require("./partialpayment.controller");
const typeorm_1 = require("@nestjs/typeorm");
const partialpayment_entity_1 = require("./entities/partialpayment.entity");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const booking_model_1 = require("../booking/booking.model");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
const report_model_1 = require("../report/report.model");
let PartialpaymentModule = class PartialpaymentModule {
};
exports.PartialpaymentModule = PartialpaymentModule;
exports.PartialpaymentModule = PartialpaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([partialpayment_entity_1.PartialPaymentModel, agent_model_1.AgentModel, booking_model_1.BookingModel, staff_model_1.StaffModel, admin_model_1.AdminModel, auth_model_1.OTPModel, report_model_1.AgentLedgerModel])],
        controllers: [partialpayment_controller_1.PartialpaymentController],
        providers: [partialpayment_service_1.PartialpaymentService, auth_service_1.AuthService, auth_utils_1.AuthUtils, jwt_1.JwtService, mail_service_1.MailService],
    })
], PartialpaymentModule);
//# sourceMappingURL=partialpayment.module.js.map