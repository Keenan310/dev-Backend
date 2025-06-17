"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModule = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./staff.service");
const staff_controller_1 = require("./staff.controller");
const typeorm_1 = require("@nestjs/typeorm");
const staff_model_1 = require("./staff.model");
const agent_model_1 = require("../agent/agent.model");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const admin_model_1 = require("../admin/admin.model");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let StaffModule = class StaffModule {
};
exports.StaffModule = StaffModule;
exports.StaffModule = StaffModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([staff_model_1.StaffModel, booking_model_1.BookingModel, admin_model_1.AdminModel, agent_model_1.AgentModel, auth_model_1.OTPModel])],
        controllers: [staff_controller_1.StaffController],
        providers: [staff_service_1.StaffService, mail_service_1.MailService, auth_service_1.AuthService, auth_utils_1.AuthUtils, jwt_1.JwtService],
    })
], StaffModule);
//# sourceMappingURL=staff.module.js.map