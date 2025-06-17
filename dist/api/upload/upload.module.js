"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const common_1 = require("@nestjs/common");
const upload_service_1 = require("./upload.service");
const upload_controller_1 = require("./upload.controller");
const upload_provider_service_1 = require("./upload.provider.service");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../agent/agent.model");
const admin_model_1 = require("../admin/admin.model");
const staff_model_1 = require("../staff/staff.model");
const booking_model_1 = require("../booking/booking.model");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const reissue_model_1 = require("../reissue/reissue.model");
const promotion_model_1 = require("../promotion/promotion.model");
const deposit_model_1 = require("../deposit/deposit.model");
const passenger_model_1 = require("../passenger/passenger.model");
const gateway_1 = require("../../gateway/gateway");
const mail_service_1 = require("../../mail/mail.service");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agent_model_1.AgentModel, passenger_model_1.PassengerModel, deposit_model_1.DepositModel, admin_model_1.AdminModel,
                staff_model_1.StaffModel, agent_model_1.AgentModel, booking_model_1.BookingModel, reissue_model_1.ReissueModel, promotion_model_1.PromotionModel, auth_model_1.OTPModel])],
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService, upload_provider_service_1.DoSpacesServicerovider, auth_service_1.AuthService, jwt_1.JwtService, auth_utils_1.AuthUtils, gateway_1.EventsGateway, mail_service_1.MailService],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map