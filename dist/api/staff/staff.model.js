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
exports.StaffModelUpdate = exports.StaffModelUpdateByAgent = exports.StaffModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let StaffModel = class StaffModel {
};
exports.StaffModel = StaffModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StaffModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StaffModel.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ default: "Kayes Fahim" }),
    __metadata("design:type", String)
], StaffModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ default: "staff@flyjatt.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], StaffModel.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ default: "01685370455" }),
    __metadata("design:type", String)
], StaffModel.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ default: "12345678" }),
    __metadata("design:type", String)
], StaffModel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ default: "Accountant" }),
    __metadata("design:type", String)
], StaffModel.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StaffModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StaffModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StaffModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], StaffModel.prototype, "uid", void 0);
exports.StaffModel = StaffModel = __decorate([
    (0, typeorm_1.Entity)('staffs')
], StaffModel);
class StaffModelUpdateByAgent {
}
exports.StaffModelUpdateByAgent = StaffModelUpdateByAgent;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "Kayes Fahim" }),
    __metadata("design:type", String)
], StaffModelUpdateByAgent.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "staff@flyjatt.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], StaffModelUpdateByAgent.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "01685370455" }),
    __metadata("design:type", String)
], StaffModelUpdateByAgent.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "12345678" }),
    __metadata("design:type", String)
], StaffModelUpdateByAgent.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "accountant" }),
    __metadata("design:type", String)
], StaffModelUpdateByAgent.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "pending" }),
    __metadata("design:type", String)
], StaffModelUpdateByAgent.prototype, "status", void 0);
class StaffModelUpdate {
}
exports.StaffModelUpdate = StaffModelUpdate;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "Kayes Fahim" }),
    __metadata("design:type", String)
], StaffModelUpdate.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "01685370455" }),
    __metadata("design:type", String)
], StaffModelUpdate.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: "12345678" }),
    __metadata("design:type", String)
], StaffModelUpdate.prototype, "password", void 0);
//# sourceMappingURL=staff.model.js.map