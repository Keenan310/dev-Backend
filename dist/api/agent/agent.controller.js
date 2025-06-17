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
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const agent_service_1 = require("./agent.service");
const agent_model_1 = require("./agent.model");
const swagger_1 = require("@nestjs/swagger");
let AgentController = class AgentController {
    constructor(agentService) {
        this.agentService = agentService;
    }
    findAllAdmin(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Maximum Limit must be 10-100");
        }
        return this.agentService.findAllAdmin(header, page, status, filter, limit);
    }
    update(header, uid, updateAgentDto) {
        return this.agentService.update(header, uid, updateAgentDto);
    }
    addBalance(header, uid, updateAgentBalanceDto) {
        return this.agentService.addBalance(header, uid, updateAgentBalanceDto);
    }
    updateagentstatus(header, uid, status) {
        return this.agentService.updateAgentStatus(header, uid, status);
    }
    remove(header, uid) {
        return this.agentService.remove(header, uid);
    }
    addcredit(header, uid, creditModel) {
        return this.agentService.addcredit(header, uid, creditModel);
    }
    myaccount(header) {
        return this.agentService.myaccount(header);
    }
    myaccountAdmin(header, uid) {
        return this.agentService.myaccountadmin(header, uid);
    }
    agentmyaccountAdmin(header, agentUId, updateMyAgentDto) {
        return this.agentService.agentmyaccountadmin(header, agentUId, updateMyAgentDto);
    }
    updateagentmyaccount(header, updateMyAgentDto) {
        return this.agentService.updateagentmyaccount(header, updateMyAgentDto);
    }
    updateagentmarkup(header, updateMyAgenMarkUptDto) {
        return this.agentService.updateagentmarkup(header, updateMyAgenMarkUptDto);
    }
    resetPasswordAdmin(header, uid) {
        return this.agentService.resetpasswordadmin(header, uid);
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agent data', description: 'Get all list of agent data' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('/admin/agent'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "findAllAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update agent data', description: 'Update all kind of agent data' }),
    (0, common_1.Patch)('admin/agent/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agent_model_1.AgentModelUpdateAdmin]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Balance by admin', description: 'Update all kind of agent data' }),
    (0, common_1.Post)('admin/agent/balance/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agent_model_1.AgentBalanceUpdate]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "addBalance", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Only Status', description: 'Update Only Status' }),
    (0, common_1.Patch)('admin/agent/:status/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "updateagentstatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove agent data admin', description: 'Remove a single agent data from the list' }),
    (0, common_1.Delete)('admin/agent/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Credit by admin', description: 'Add Credit for the agent' }),
    (0, common_1.Post)('admin/agent/:uid/credit'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agent_model_1.AgentCreditModel]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "addcredit", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get only agent my account', description: 'Get a single agent all data' }),
    (0, common_1.Get)('agent/myaccount'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "myaccount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get only agent my account', description: 'Get a single agent all data' }),
    (0, common_1.Get)('admin/agent/myaccount/:agentUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "myaccountAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Update agent account By Admin', description: 'Get a single agent all data' }),
    (0, common_1.Put)('admin/agent/myaccount/:agentUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agent_model_1.AgentModelUpdateAdmin]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "agentmyaccountAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Update agent My Account', description: 'Update all kind of agent data' }),
    (0, common_1.Patch)('agent/myaccount'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agent_model_1.AgentModelUpdateAgent]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "updateagentmyaccount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Update agent mark up', description: 'Update Only Mark UP' }),
    (0, common_1.Patch)('agent/markup'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agent_model_1.AgentMarkUpUpdate]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "updateagentmarkup", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin Reset password', description: 'Reset Password' }),
    (0, common_1.Post)('admin/agent/reset/password/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "resetPasswordAdmin", null);
exports.AgentController = AgentController = __decorate([
    (0, swagger_1.ApiTags)("Agent Modules"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [agent_service_1.AgentService])
], AgentController);
//# sourceMappingURL=agent.controller.js.map