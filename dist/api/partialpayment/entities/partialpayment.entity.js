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
exports.PartialPaymentModel = void 0;
const typeorm_1 = require("typeorm");
let PartialPaymentModel = class PartialPaymentModel {
};
exports.PartialPaymentModel = PartialPaymentModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PartialPaymentModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agentId' }),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bookingId' }),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'carrier' }),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pnr' }),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "pnr", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'netfare' }),
    __metadata("design:type", Number)
], PartialPaymentModel.prototype, "netfare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paidamount' }),
    __metadata("design:type", Number)
], PartialPaymentModel.prototype, "paidamount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dueamount' }),
    __metadata("design:type", Number)
], PartialPaymentModel.prototype, "dueamount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "flightdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_at' }),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "dueAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "companyname", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PartialPaymentModel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PartialPaymentModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], PartialPaymentModel.prototype, "uid", void 0);
exports.PartialPaymentModel = PartialPaymentModel = __decorate([
    (0, typeorm_1.Entity)('partial_payment')
], PartialPaymentModel);
//# sourceMappingURL=partialpayment.entity.js.map