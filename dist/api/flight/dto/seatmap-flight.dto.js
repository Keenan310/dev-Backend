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
exports.SeapMapDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SeapMapDto {
}
exports.SeapMapDto = SeapMapDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: "Sabre" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "System", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2025-01-10" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "DepDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "DAC" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "Origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "DXB" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "Destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "GF" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "Carrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "200" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "FlightNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "Y" }),
    __metadata("design:type", String)
], SeapMapDto.prototype, "CabinClass", void 0);
//# sourceMappingURL=seatmap-flight.dto.js.map