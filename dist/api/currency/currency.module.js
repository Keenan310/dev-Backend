"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyModule = void 0;
const common_1 = require("@nestjs/common");
const currency_service_1 = require("./currency.service");
const currency_controller_1 = require("./currency.controller");
const typeorm_1 = require("@nestjs/typeorm");
const currency_entity_1 = require("./entities/currency.entity");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const auth_model_1 = require("../auth/auth.model");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
let CurrencyModule = class CurrencyModule {
};
exports.CurrencyModule = CurrencyModule;
exports.CurrencyModule = CurrencyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([currency_entity_1.CurrencyConverter, agent_model_1.AgentModel, staff_model_1.StaffModel, admin_model_1.AdminModel, auth_model_1.OTPModel])],
        controllers: [currency_controller_1.CurrencyController],
        providers: [currency_service_1.CurrencyService, auth_service_1.AuthService, jwt_1.JwtService, mail_service_1.MailService, auth_utils_1.AuthUtils],
    })
], CurrencyModule);
//# sourceMappingURL=currency.module.js.map