"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupfareModule = void 0;
const common_1 = require("@nestjs/common");
const groupfare_service_1 = require("./groupfare.service");
const groupfare_controller_1 = require("./groupfare.controller");
const typeorm_1 = require("@nestjs/typeorm");
const groupfare_model_1 = require("./groupfare.model");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const airlines_service_1 = require("../airlines/airlines.service");
const airlines_model_1 = require("../airlines/airlines.model");
const airports_model_1 = require("../airports/airports.model");
const airports_service_1 = require("../airports/airports.service");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
const currency_entity_1 = require("../currency/entities/currency.entity");
let GroupfareModule = class GroupfareModule {
};
exports.GroupfareModule = GroupfareModule;
exports.GroupfareModule = GroupfareModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([groupfare_model_1.GroupFareModel, booking_model_1.BookingModel, agent_model_1.AgentModel, staff_model_1.StaffModel, admin_model_1.AdminModel, airlines_model_1.AirlinesModel, airports_model_1.AirportsModel, auth_model_1.OTPModel, currency_entity_1.CurrencyConverter])],
        controllers: [groupfare_controller_1.GroupfareController],
        providers: [groupfare_service_1.GroupfareService, auth_service_1.AuthService, jwt_1.JwtService, auth_utils_1.AuthUtils, airlines_service_1.AirlinesService, airports_service_1.AirportsService, mail_service_1.MailService],
    })
], GroupfareModule);
//# sourceMappingURL=groupfare.module.js.map