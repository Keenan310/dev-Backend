"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModule = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const role_controller_1 = require("./role.controller");
const typeorm_1 = require("@nestjs/typeorm");
const admin_model_1 = require("../admin.model");
const mail_service_1 = require("../../../mail/mail.service");
const booking_model_1 = require("../../booking/booking.model");
const control_entity_1 = require("../control/entities/control.entity");
const agent_model_1 = require("../../agent/agent.model");
const staff_model_1 = require("../../staff/staff.model");
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([control_entity_1.ControlModel, agent_model_1.AgentModel, staff_model_1.StaffModel, admin_model_1.AdminModel, mail_service_1.MailService, booking_model_1.BookingModel])],
        controllers: [role_controller_1.RoleController],
        providers: [role_service_1.RoleService],
    })
], RoleModule);
//# sourceMappingURL=role.module.js.map