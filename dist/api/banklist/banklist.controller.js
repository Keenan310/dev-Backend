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
exports.BanklistController = void 0;
const common_1 = require("@nestjs/common");
const banklist_service_1 = require("./banklist.service");
const banklist_model_1 = require("./banklist.model");
const swagger_1 = require("@nestjs/swagger");
let BanklistController = class BanklistController {
    constructor(banklistService) {
        this.banklistService = banklistService;
    }
    admincreate(header, createBanklistDto) {
        return this.banklistService.createadmin(header, createBanklistDto);
    }
    findAllBankList(header) {
        return this.banklistService.findAllBankList(header);
    }
    findAllByAdmin(header) {
        return this.banklistService.findAllByAdmin(header);
    }
    updateadmin(header, uid, updateBanklistDto) {
        return this.banklistService.updateadmin(header, uid, updateBanklistDto);
    }
    removeadmin(header, uid) {
        return this.banklistService.removeadmin(header, uid);
    }
    agentcreate(agentUId, createBanklistDto) {
        return this.banklistService.createagent(agentUId, createBanklistDto);
    }
    findAllByAgent(agentUId) {
        return this.banklistService.findAllByAgent(agentUId);
    }
    updateagent(uid, updateBanklistDto) {
        return this.banklistService.updateagent(uid, updateBanklistDto);
    }
    removeagent(uid) {
        return this.banklistService.removeagent(uid);
    }
};
exports.BanklistController = BanklistController;
__decorate([
    (0, common_1.Post)('admin/banklist'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, banklist_model_1.BankListModel]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "admincreate", null);
__decorate([
    (0, common_1.Get)('banklist/all'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "findAllBankList", null);
__decorate([
    (0, common_1.Get)('admin/banklist/all'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "findAllByAdmin", null);
__decorate([
    (0, common_1.Patch)('admin/banklist/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, banklist_model_1.BankListModel]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "updateadmin", null);
__decorate([
    (0, common_1.Delete)('admin/banklist/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "removeadmin", null);
__decorate([
    (0, common_1.Post)('agent/banklist/:agentUId'),
    __param(0, (0, common_1.Param)('agentUId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, banklist_model_1.BankListModel]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "agentcreate", null);
__decorate([
    (0, common_1.Get)('agent/banklist/:agentUId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "findAllByAgent", null);
__decorate([
    (0, common_1.Patch)('agent/banklist/:uid'),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, banklist_model_1.BankListModel]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "updateagent", null);
__decorate([
    (0, common_1.Delete)('agent/banklist/:uid'),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BanklistController.prototype, "removeagent", null);
exports.BanklistController = BanklistController = __decorate([
    (0, swagger_1.ApiTags)('Bank List'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [banklist_service_1.BanklistService])
], BanklistController);
//# sourceMappingURL=banklist.controller.js.map