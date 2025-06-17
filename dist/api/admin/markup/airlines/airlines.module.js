"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlinesModule = void 0;
const common_1 = require("@nestjs/common");
const airlines_service_1 = require("./airlines.service");
const airlines_controller_1 = require("./airlines.controller");
let AirlinesModule = class AirlinesModule {
};
exports.AirlinesModule = AirlinesModule;
exports.AirlinesModule = AirlinesModule = __decorate([
    (0, common_1.Module)({
        controllers: [airlines_controller_1.AirlinesController],
        providers: [airlines_service_1.AirlinesService],
    })
], AirlinesModule);
//# sourceMappingURL=airlines.module.js.map