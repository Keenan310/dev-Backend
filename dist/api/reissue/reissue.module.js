"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReissueModule = void 0;
const common_1 = require("@nestjs/common");
const reissue_service_1 = require("./reissue.service");
const reissue_controller_1 = require("./reissue.controller");
const typeorm_1 = require("@nestjs/typeorm");
const agent_model_1 = require("../agent/agent.model");
const reissue_model_1 = require("./reissue.model");
const admin_model_1 = require("../admin/admin.model");
const booking_model_1 = require("../booking/booking.model");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const staff_model_1 = require("../staff/staff.model");
const report_model_1 = require("../report/report.model");
const mail_service_1 = require("../../mail/mail.service");
const auth_module_1 = require("../auth/auth.module");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
let ReissueModule = class ReissueModule {
};
exports.ReissueModule = ReissueModule;
exports.ReissueModule = ReissueModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([agent_model_1.AgentModel, reissue_model_1.ReissueModel, report_model_1.AgentLedgerModel, admin_model_1.AdminModel, booking_model_1.BookingModel, staff_model_1.StaffModel, auth_model_1.OTPModel])],
        controllers: [reissue_controller_1.ReissueController],
        providers: [reissue_service_1.ReissueService, auth_service_1.AuthService, auth_utils_1.AuthUtils, jwt_1.JwtService, mail_service_1.MailService],
    })
], ReissueModule);
//# sourceMappingURL=reissue.module.js.map