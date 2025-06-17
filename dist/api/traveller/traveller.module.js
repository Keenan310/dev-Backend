"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravellerModule = void 0;
const common_1 = require("@nestjs/common");
const traveller_service_1 = require("./traveller.service");
const traveller_controller_1 = require("./traveller.controller");
const typeorm_1 = require("@nestjs/typeorm");
const traveller_model_1 = require("./traveller.model");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
const staff_model_1 = require("../staff/staff.model");
const booking_model_1 = require("../booking/booking.model");
const admin_model_1 = require("../admin/admin.model");
const auth_model_1 = require("../auth/auth.model");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
let TravellerModule = class TravellerModule {
};
exports.TravellerModule = TravellerModule;
exports.TravellerModule = TravellerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([traveller_model_1.TravellerModel, agent_model_1.AgentModel, staff_model_1.StaffModel, booking_model_1.BookingModel, admin_model_1.AdminModel, auth_model_1.OTPModel])],
        controllers: [traveller_controller_1.TravellerController],
        providers: [traveller_service_1.TravellerService, auth_service_1.AuthService, jwt_1.JwtService, mail_service_1.MailService, auth_utils_1.AuthUtils],
    })
], TravellerModule);
//# sourceMappingURL=traveller.module.js.map