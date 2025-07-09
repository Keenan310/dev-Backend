"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCurrencyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCurrencyDto {
}
exports.CreateCurrencyDto = CreateCurrencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', description: 'Base currency code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCurrencyDto.prototype, "base", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EUR', description: 'Alternate currency code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCurrencyDto.prototype, "alternate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.9150, description: 'Exchange rate from base to alternate' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCurrencyDto.prototype, "exchange_rate", void 0);
//# sourceMappingURL=create-currency.dto.js.map