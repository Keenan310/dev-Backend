"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentgatewayModule = void 0;
const common_1 = require("@nestjs/common");
const paymentgateway_service_1 = require("./paymentgateway.service");
const nagad_module_1 = require("./nagad/nagad.module");
const bkash_module_1 = require("./bkash/bkash.module");
let PaymentgatewayModule = class PaymentgatewayModule {
};
exports.PaymentgatewayModule = PaymentgatewayModule;
exports.PaymentgatewayModule = PaymentgatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [nagad_module_1.NagadModule, bkash_module_1.BkashModule],
        controllers: [],
        providers: [paymentgateway_service_1.PaymentgatewayService],
    })
], PaymentgatewayModule);
//# sourceMappingURL=paymentgateway.module.js.map