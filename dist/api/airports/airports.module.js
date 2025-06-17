"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirportsModule = void 0;
const common_1 = require("@nestjs/common");
const airports_service_1 = require("./airports.service");
const airports_controller_1 = require("./airports.controller");
const typeorm_1 = require("@nestjs/typeorm");
const airports_model_1 = require("./airports.model");
const mail_service_1 = require("../../mail/mail.service");
const booking_model_1 = require("../booking/booking.model");
const agent_model_1 = require("../agent/agent.model");
let AirportsModule = class AirportsModule {
};
exports.AirportsModule = AirportsModule;
exports.AirportsModule = AirportsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([airports_model_1.AirportsModel, agent_model_1.AgentModel, booking_model_1.BookingModel])],
        controllers: [airports_controller_1.AirportsController],
        providers: [airports_service_1.AirportsService, mail_service_1.MailService],
    })
], AirportsModule);
//# sourceMappingURL=airports.module.js.map