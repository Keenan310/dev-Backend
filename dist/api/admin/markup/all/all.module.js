"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllModule = void 0;
const common_1 = require("@nestjs/common");
const all_service_1 = require("./all.service");
const all_controller_1 = require("./all.controller");
let AllModule = class AllModule {
};
exports.AllModule = AllModule;
exports.AllModule = AllModule = __decorate([
    (0, common_1.Module)({
        controllers: [all_controller_1.AllController],
        providers: [all_service_1.AllService],
    })
], AllModule);
//# sourceMappingURL=all.module.js.map