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
exports.ReissueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SegmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DAC' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    __metadata("design:type", String)
], SegmentDto.prototype, "depfrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DXB' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    __metadata("design:type", String)
], SegmentDto.prototype, "arrto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-07-01' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SegmentDto.prototype, "depdate", void 0);
class ReissueDto {
}
exports.ReissueDto = ReissueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: "Sabre" }),
    __metadata("design:type", String)
], ReissueDto.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "123456789" }),
    __metadata("design:type", Number)
], ReissueDto.prototype, "ticketNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SegmentDto] }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(4),
    __metadata("design:type", Array)
], ReissueDto.prototype, "segments", void 0);
//# sourceMappingURL=reissue-flight.dto.js.map