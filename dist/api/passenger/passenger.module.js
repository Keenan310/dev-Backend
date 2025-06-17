"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerModule = void 0;
const common_1 = require("@nestjs/common");
const passenger_service_1 = require("./passenger.service");
const typeorm_1 = require("@nestjs/typeorm");
const passenger_model_1 = require("./passenger.model");
const agent_model_1 = require("../agent/agent.model");
const booking_model_1 = require("../booking/booking.model");
let PassengerModule = class PassengerModule {
};
exports.PassengerModule = PassengerModule;
exports.PassengerModule = PassengerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([passenger_model_1.PassengerModel, booking_model_1.BookingModel, agent_model_1.AgentModel])],
        controllers: [],
        providers: [passenger_service_1.PassengerService],
    })
], PassengerModule);
//# sourceMappingURL=passenger.module.js.map