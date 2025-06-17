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
exports.AirBookingModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ContactInfoModel {
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: "user@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ContactInfoModel.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "08801685370455" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactInfoModel.prototype, "phone", void 0);
class PaxModel {
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: "KAYES FAHIM" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaxModel.prototype, "givenname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "FUAD" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaxModel.prototype, "surname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "Male" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaxModel.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2011-01-01" }),
    __metadata("design:type", Date)
], PaxModel.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "A20932903" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaxModel.prototype, "document", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2032-01-01" }),
    __metadata("design:type", Date)
], PaxModel.prototype, "expiredate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "BD" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaxModel.prototype, "nationality", void 0);
class PassengerInfoModel {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PaxModel] }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(9),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PassengerInfoModel.prototype, "adult", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "{}" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(8),
    __metadata("design:type", Array)
], PassengerInfoModel.prototype, "child", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "{}" }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(4),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PassengerInfoModel.prototype, "infant", void 0);
class AirBookingModel {
}
exports.AirBookingModel = AirBookingModel;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", ContactInfoModel)
], AirBookingModel.prototype, "ContactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", PassengerInfoModel)
], AirBookingModel.prototype, "PassengerInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AirBookingModel.prototype, "FlightInfo", void 0);
//# sourceMappingURL=booking-flight.dto.js.map