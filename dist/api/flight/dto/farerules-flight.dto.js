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
exports.FareRulesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FareRulesDto {
}
exports.FareRulesDto = FareRulesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: "Sabre" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FareRulesDto.prototype, "System", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2024-01-10" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FareRulesDto.prototype, "DepDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "DAC" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FareRulesDto.prototype, "Origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "DXB" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FareRulesDto.prototype, "Destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "GF" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FareRulesDto.prototype, "Carrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "WERTYUI" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FareRulesDto.prototype, "FareBasisCode", void 0);
//# sourceMappingURL=farerules-flight.dto.js.map