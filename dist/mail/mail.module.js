"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../api/agent/agent.model");
const booking_model_1 = require("../api/booking/booking.model");
const auth_service_1 = require("../api/auth/auth.service");
const staff_model_1 = require("../api/staff/staff.model");
const admin_model_1 = require("../api/admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const auth_utils_1 = require("../api/auth/auth.utils");
const auth_model_1 = require("../api/auth/auth.model");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agent_model_1.AgentModel, booking_model_1.BookingModel, staff_model_1.StaffModel, admin_model_1.AdminModel, auth_model_1.OTPModel])],
        providers: [mail_service_1.MailService, auth_service_1.AuthService, auth_utils_1.AuthUtils, jwt_1.JwtService],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map