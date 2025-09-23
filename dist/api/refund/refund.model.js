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
exports.RefundDecisionModel = exports.RefundQuotation = exports.RefundRequestModel = exports.RefundModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let RefundModel = class RefundModel {
};
exports.RefundModel = RefundModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RefundModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RefundModel.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RefundModel.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RefundModel.prototype, "passengerdata", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RefundModel.prototype, "netfare", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RefundModel.prototype, "refundpenalty", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RefundModel.prototype, "servicefee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RefundModel.prototype, "quotationamount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RefundModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RefundModel.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RefundModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RefundModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], RefundModel.prototype, "uid", void 0);
exports.RefundModel = RefundModel = __decorate([
    (0, typeorm_1.Entity)('refund')
], RefundModel);
class RefundRequestModel {
}
exports.RefundRequestModel = RefundRequestModel;
__decorate([
    (0, swagger_1.ApiProperty)({ default: "Given name/Surname-TicketNumber" }),
    __metadata("design:type", String)
], RefundRequestModel.prototype, "text", void 0);
class RefundQuotation {
}
exports.RefundQuotation = RefundQuotation;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RefundQuotation.prototype, "refundpenalty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RefundQuotation.prototype, "servicefee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RefundQuotation.prototype, "quotationamount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], RefundQuotation.prototype, "remarks", void 0);
class RefundDecisionModel {
}
exports.RefundDecisionModel = RefundDecisionModel;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], RefundDecisionModel.prototype, "remarks", void 0);
//# sourceMappingURL=refund.model.js.map