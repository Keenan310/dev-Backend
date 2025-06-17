"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModule = void 0;
const common_1 = require("@nestjs/common");
const promotion_service_1 = require("./promotion.service");
const promotion_controller_1 = require("./promotion.controller");
const typeorm_1 = require("@nestjs/typeorm");
const promotion_model_1 = require("./promotion.model");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let PromotionModule = class PromotionModule {
};
exports.PromotionModule = PromotionModule;
exports.PromotionModule = PromotionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([promotion_model_1.PromotionModel, agent_model_1.AgentModel, staff_model_1.StaffModel, admin_model_1.AdminModel, booking_model_1.BookingModel, auth_model_1.OTPModel])],
        controllers: [promotion_controller_1.PromotionController],
        providers: [promotion_service_1.PromotionService, auth_service_1.AuthService, jwt_1.JwtService, auth_utils_1.AuthUtils, mail_service_1.MailService],
    })
], PromotionModule);
//# sourceMappingURL=promotion.module.js.map