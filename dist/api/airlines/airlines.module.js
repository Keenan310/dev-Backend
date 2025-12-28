"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlinesModule = void 0;
const common_1 = require("@nestjs/common");
const airlines_service_1 = require("./airlines.service");
const airlines_controller_1 = require("./airlines.controller");
const typeorm_1 = require("@nestjs/typeorm");
const airlines_model_1 = require("./airlines.model");
const jwt_1 = require("@nestjs/jwt");
const agent_model_1 = require("../agent/agent.model");
const admin_model_1 = require("../admin/admin.model");
const staff_model_1 = require("../staff/staff.model");
const auth_service_1 = require("../auth/auth.service");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let AirlinesModule = class AirlinesModule {
};
exports.AirlinesModule = AirlinesModule;
exports.AirlinesModule = AirlinesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([airlines_model_1.AirlinesModel, airlines_model_1.AirlineDiscount, airlines_model_1.AirlineDiscountForAgent, booking_model_1.BookingModel, agent_model_1.AgentModel, admin_model_1.AdminModel, staff_model_1.StaffModel, auth_model_1.OTPModel])],
        controllers: [airlines_controller_1.AirlinesController],
        providers: [airlines_service_1.AirlinesService, jwt_1.JwtService, auth_service_1.AuthService, auth_utils_1.AuthUtils, mail_service_1.MailService],
    })
], AirlinesModule);
//# sourceMappingURL=airlines.module.js.map