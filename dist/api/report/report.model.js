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
exports.UpdateAdminExpenseDto = exports.AdminExpenseModel = exports.UpdateAdminLedgerDto = exports.AdminLedger = exports.UpdateAgentLedgerDto = exports.AgentLedgerDto = exports.AgentLedgerModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let AgentLedgerModel = class AgentLedgerModel {
};
exports.AgentLedgerModel = AgentLedgerModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AgentLedgerModel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "trxtype", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AgentLedgerModel.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AgentLedgerModel.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "refId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "companyname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AgentLedgerModel.prototype, "ticketcost", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AgentLedgerModel.prototype, "netfare", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "pnr", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AgentLedgerModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AgentLedgerModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], AgentLedgerModel.prototype, "uid", void 0);
exports.AgentLedgerModel = AgentLedgerModel = __decorate([
    (0, typeorm_1.Entity)('agent_ledger')
], AgentLedgerModel);
class AgentLedgerDto {
}
exports.AgentLedgerDto = AgentLedgerDto;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerDto.prototype, "trxtype", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AgentLedgerDto.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], AgentLedgerDto.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerDto.prototype, "refId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AgentLedgerDto.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerDto.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AgentLedgerDto.prototype, "ticketcost", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AgentLedgerDto.prototype, "netfare", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AgentLedgerDto.prototype, "pnr", void 0);
class UpdateAgentLedgerDto extends (0, swagger_1.PartialType)(AgentLedgerDto) {
}
exports.UpdateAgentLedgerDto = UpdateAgentLedgerDto;
let AdminLedger = class AdminLedger {
};
exports.AdminLedger = AdminLedger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AdminLedger.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AdminLedger.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminLedger.prototype, "pnr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], AdminLedger.prototype, "ticketprice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminLedger.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'agentId', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], AdminLedger.prototype, "agentcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], AdminLedger.prototype, "netfare", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'deposit', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], AdminLedger.prototype, "depositAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AdminLedger.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AdminLedger.prototype, "liable", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AdminLedger.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AdminLedger.prototype, "updated_at", void 0);
exports.AdminLedger = AdminLedger = __decorate([
    (0, typeorm_1.Entity)('admin_ledger')
], AdminLedger);
class UpdateAdminLedgerDto extends (0, swagger_1.PartialType)(AdminLedger) {
}
exports.UpdateAdminLedgerDto = UpdateAdminLedgerDto;
let AdminExpenseModel = class AdminExpenseModel {
};
exports.AdminExpenseModel = AdminExpenseModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AdminExpenseModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminExpenseModel.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminExpenseModel.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AdminExpenseModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AdminExpenseModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], AdminExpenseModel.prototype, "uid", void 0);
exports.AdminExpenseModel = AdminExpenseModel = __decorate([
    (0, typeorm_1.Entity)('admin_expense')
], AdminExpenseModel);
class UpdateAdminExpenseDto extends (0, swagger_1.PartialType)(AdminExpenseModel) {
}
exports.UpdateAdminExpenseDto = UpdateAdminExpenseDto;
//# sourceMappingURL=report.model.js.map