"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_controller_1 = require("./booking.controller");
const booking_model_1 = require("./booking.model");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const passenger_model_1 = require("../passenger/passenger.model");
const passenger_service_1 = require("../passenger/passenger.service");
const report_model_1 = require("../report/report.model");
const groupfare_model_1 = require("../groupfare/groupfare.model");
const traveller_service_1 = require("../traveller/traveller.service");
const traveller_model_1 = require("../traveller/traveller.model");
const booking_utils_1 = require("./booking.utils");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
const currency_entity_1 = require("../currency/entities/currency.entity");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([booking_model_1.BookingModel, traveller_model_1.TravellerModel, agent_model_1.AgentModel, staff_model_1.StaffModel,
                admin_model_1.AdminModel, passenger_model_1.PassengerModel, report_model_1.AgentLedgerModel, groupfare_model_1.GroupFareModel, auth_model_1.OTPModel, currency_entity_1.CurrencyConverter])],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService, booking_utils_1.BookingUtils, auth_service_1.AuthService, jwt_1.JwtService, mail_service_1.MailService, passenger_service_1.PassengerService, traveller_service_1.TravellerService, auth_utils_1.AuthUtils],
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map