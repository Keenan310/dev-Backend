"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const typeorm_1 = require("@nestjs/typeorm");
const admin_model_1 = require("./admin.model");
const staff_model_1 = require("../staff/staff.model");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const role_module_1 = require("./role/role.module");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([admin_model_1.AdminModel, staff_model_1.StaffModel, agent_model_1.AgentModel, booking_model_1.BookingModel, auth_model_1.OTPModel]), role_module_1.RoleModule],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, auth_service_1.AuthService, auth_utils_1.AuthUtils, jwt_1.JwtService, mail_service_1.MailService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map