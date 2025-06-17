"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkupModule = void 0;
const common_1 = require("@nestjs/common");
const airlines_module_1 = require("./airlines/airlines.module");
const route_module_1 = require("./route/route.module");
const all_module_1 = require("./all/all.module");
let MarkupModule = class MarkupModule {
};
exports.MarkupModule = MarkupModule;
exports.MarkupModule = MarkupModule = __decorate([
    (0, common_1.Module)({
        imports: [airlines_module_1.AirlinesModule, route_module_1.RouteModule, all_module_1.AllModule]
    })
], MarkupModule);
//# sourceMappingURL=markup.module.js.map