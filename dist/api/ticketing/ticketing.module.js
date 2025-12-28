"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketingModule = void 0;
const common_1 = require("@nestjs/common");
const ticketing_service_1 = require("./ticketing.service");
const ticketing_controller_1 = require("./ticketing.controller");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const booking_model_1 = require("../booking/booking.model");
const agent_model_1 = require("../agent/agent.model");
const admin_model_1 = require("../admin/admin.model");
const report_model_1 = require("../report/report.model");
const staff_model_1 = require("../staff/staff.model");
const ticketing_model_1 = require("./ticketing.model");
const mail_service_1 = require("../../mail/mail.service");
const passenger_model_1 = require("../passenger/passenger.model");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let TicketingModule = class TicketingModule {
};
exports.TicketingModule = TicketingModule;
exports.TicketingModule = TicketingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agent_model_1.AgentModel, passenger_model_1.PassengerModel, ticketing_model_1.TicketModel, report_model_1.AgentLedgerModel, admin_model_1.AdminModel, booking_model_1.BookingModel, staff_model_1.StaffModel, auth_model_1.OTPModel])],
        controllers: [ticketing_controller_1.TicketingController],
        providers: [ticketing_service_1.TicketingService, auth_service_1.AuthService, jwt_1.JwtService, auth_utils_1.AuthUtils, mail_service_1.MailService],
    })
], TicketingModule);
//# sourceMappingURL=ticketing.module.js.map