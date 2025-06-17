"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidModule = void 0;
const common_1 = require("@nestjs/common");
const void_service_1 = require("./void.service");
const void_controller_1 = require("./void.controller");
const typeorm_1 = require("@nestjs/typeorm");
const void_model_1 = require("./void.model");
const booking_model_1 = require("../booking/booking.model");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
const report_model_1 = require("../report/report.model");
const admin_model_1 = require("../admin/admin.model");
const staff_model_1 = require("../staff/staff.model");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let VoidModule = class VoidModule {
};
exports.VoidModule = VoidModule;
exports.VoidModule = VoidModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([void_model_1.VoidModel, agent_model_1.AgentModel, booking_model_1.BookingModel, admin_model_1.AdminModel, staff_model_1.StaffModel, report_model_1.AgentLedgerModel, auth_model_1.OTPModel])],
        controllers: [void_controller_1.VoidController],
        providers: [void_service_1.VoidService, auth_service_1.AuthService, jwt_1.JwtService, auth_utils_1.AuthUtils, mail_service_1.MailService],
    })
], VoidModule);
//# sourceMappingURL=void.module.js.map