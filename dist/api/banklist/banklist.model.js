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
exports.BankListModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let BankListModel = class BankListModel {
};
exports.BankListModel = BankListModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], BankListModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankListModel.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankListModel.prototype, "bankname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankListModel.prototype, "accountname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankListModel.prototype, "accountnumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankListModel.prototype, "iban", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankListModel.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankListModel.prototype, "routingno", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankListModel.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at' }),
    __metadata("design:type", String)
], BankListModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at' }),
    __metadata("design:type", String)
], BankListModel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], BankListModel.prototype, "uid", void 0);
exports.BankListModel = BankListModel = __decorate([
    (0, typeorm_1.Entity)('bank_accounts')
], BankListModel);
//# sourceMappingURL=banklist.model.js.map