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
exports.AirlineDiscount = exports.AirlinesUpdateModel = exports.AirlinesModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let AirlinesModel = class AirlinesModel {
};
exports.AirlinesModel = AirlinesModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AirlinesModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "iata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AirlinesModel.prototype, "soto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AirlinesModel.prototype, "soti", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AirlinesModel.prototype, "sito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AirlinesModel.prototype, "domestic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'addamount' }),
    __metadata("design:type", Number)
], AirlinesModel.prototype, "addAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'instant_payment' }),
    __metadata("design:type", Boolean)
], AirlinesModel.prototype, "instantPayment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_permit', default: 'manual' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "issuePermit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_blocked', default: false }),
    __metadata("design:type", Boolean)
], AirlinesModel.prototype, "isBlocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AirlinesModel.prototype, "bookable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "docs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "icao", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "marketing_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "alliance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ffp_name' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "ffpName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lowcost' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "lowCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_name' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "countryName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "founded", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'baggage_url' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "baggageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'web_checkin_url' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "webCheckinUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_checkin_url' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "mobileCheckinUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlinesModel.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at' }),
    __metadata("design:type", String)
], AirlinesModel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], AirlinesModel.prototype, "uid", void 0);
exports.AirlinesModel = AirlinesModel = __decorate([
    (0, typeorm_1.Entity)('airlinesdata')
], AirlinesModel);
class AirlinesUpdateModel {
}
exports.AirlinesUpdateModel = AirlinesUpdateModel;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AirlinesUpdateModel.prototype, "soto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AirlinesUpdateModel.prototype, "soti", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AirlinesUpdateModel.prototype, "sito", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AirlinesUpdateModel.prototype, "domestic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AirlinesUpdateModel.prototype, "addAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AirlinesUpdateModel.prototype, "instantPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AirlinesUpdateModel.prototype, "issuePermit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AirlinesUpdateModel.prototype, "isBlocked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AirlinesUpdateModel.prototype, "bookable", void 0);
let AirlineDiscount = class AirlineDiscount {
};
exports.AirlineDiscount = AirlineDiscount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AirlineDiscount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlineDiscount.prototype, "airline", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AirlineDiscount.prototype, "discount_percent", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AirlineDiscount.prototype, "fix_discount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlineDiscount.prototype, "travel_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirlineDiscount.prototype, "booking_date", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], AirlineDiscount.prototype, "from_list", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], AirlineDiscount.prototype, "from_except", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], AirlineDiscount.prototype, "to_list", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], AirlineDiscount.prototype, "to_except", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], AirlineDiscount.prototype, "rbd", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], AirlineDiscount.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AirlineDiscount.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AirlineDiscount.prototype, "update_at", void 0);
exports.AirlineDiscount = AirlineDiscount = __decorate([
    (0, typeorm_1.Entity)('airline_discounts')
], AirlineDiscount);
//# sourceMappingURL=airlines.model.js.map