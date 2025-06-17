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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositController = void 0;
const common_1 = require("@nestjs/common");
const deposit_service_1 = require("./deposit.service");
const deposit_model_1 = require("./deposit.model");
const swagger_1 = require("@nestjs/swagger");
let DepositController = class DepositController {
    constructor(depositService) {
        this.depositService = depositService;
    }
    findAll(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Limit Range must be 10-100");
        }
        return this.depositService.findAllAdmin(header, page, status, filter, limit);
    }
    findAllAgent(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Limit Range must be 10-100");
        }
        return this.depositService.findAllAgent(header, page, status, filter, limit);
    }
    update(header, uid, updateDepositDto) {
        return this.depositService.update(header, uid, updateDepositDto);
    }
    updatestatus(header, uid, updateDepositDto) {
        return this.depositService.updatestatus(header, uid, updateDepositDto);
    }
    depositBonus(header, agentUId, depositBonuseModel) {
        return this.depositService.addDepositBonus(header, agentUId, depositBonuseModel);
    }
    findAllAgentByAdmin(header, agentUId, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Limit Range must be 10-100");
        }
        return this.depositService.findAllAgentByAdmin(header, agentUId, page, status, filter, limit);
    }
};
exports.DepositController = DepositController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: "Only Admin Can Access", description: "All Deposit Only Admin Can Access" }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('admin/deposit/all'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], DepositController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/deposit/'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], DepositController.prototype, "findAllAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: "Only Admin Can Access", description: "Update Deposit Only Admin Can Access" }),
    (0, common_1.Patch)('admin/deposit/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, deposit_model_1.DepositModelUpdate]),
    __metadata("design:returntype", void 0)
], DepositController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: "Only Admin Can Access", description: "Update Deposit Only Admin Can Access" }),
    (0, common_1.Patch)('admin/deposit/status/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, deposit_model_1.DepositModelUpdateStatus]),
    __metadata("design:returntype", void 0)
], DepositController.prototype, "updatestatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: "Deposit Bonus - admin", description: "Update Deposit Only Admin Can Access" }),
    (0, common_1.Post)('admin/deposit/bonus/:agentUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, deposit_model_1.DepositBonuseModel]),
    __metadata("design:returntype", void 0)
], DepositController.prototype, "depositBonus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/agent/deposit/:agentUId'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentUId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('filter')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], DepositController.prototype, "findAllAgentByAdmin", null);
exports.DepositController = DepositController = __decorate([
    (0, swagger_1.ApiTags)("Deposit Modules"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [deposit_service_1.DepositService])
], DepositController);
//# sourceMappingURL=deposit.controller.js.map