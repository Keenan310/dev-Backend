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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const swagger_1 = require("@nestjs/swagger");
const report_model_1 = require("./report.model");
const agent_model_1 = require("../agent/agent.model");
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    addExpense(header, adminExpenseModel) {
        return this.reportService.addAdminExpense(header, adminExpenseModel);
    }
    editExpense(header, id, adminExpenseModel) {
        return this.reportService.editAdminExpense(header, +id, adminExpenseModel);
    }
    addAdminLedger(header, adminledgerModel) {
        return this.reportService.addAdminLedger(header, adminledgerModel);
    }
    editAdminLedger(header, id, adminLedgerDto) {
        return this.reportService.editAdminLedger(header, +id, adminLedgerDto);
    }
    editAgentLedgerByAdmin(header, id, updateAgentLedgerDto) {
        return this.reportService.editAgentLedgerByAdmin(header, +id, updateAgentLedgerDto);
    }
    findAllAdminLedger(header, startDate, endDate, agentId) {
        return this.reportService.findAllAdminLedger(header, startDate, endDate, agentId);
    }
    findSingleLedgerAdmin(header, agentId) {
        return this.reportService.findSingleAgentLedgerAdmin(header, agentId);
    }
    findAgentSingelAllLedger(header, agentId, page, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Limit Range must be 10-100");
        }
        return this.reportService.findAllAgentSingelAdmin(header, agentId, page, limit);
    }
    findAllAdminBalance(header) {
        return this.reportService.findAllAdminBalanceInquery(header);
    }
    findAllReportAdmin(header, startDate, endDate) {
        return this.reportService.findAllReportAdmin(header, startDate, endDate);
    }
    findAllByAgentId(header, filter) {
        return this.reportService.findAllByAgentId(header, filter);
    }
    findAllBydate(header, startDate, endDate) {
        return this.reportService.findAllByDateRangeAgentId(header, startDate, endDate);
    }
    findDashboard(header) {
        return this.reportService.findDashboard(header);
    }
    findDashboardAgent(header) {
        return this.reportService.findDashboardAgent(header);
    }
    findAdminExpense(header, page, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Limit Range must be 10-100");
        }
        return this.reportService.findAdminExpense(header, page, filter, limit);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/expense'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_model_1.AdminExpenseModel]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "addExpense", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)('admin/expense/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, report_model_1.AdminExpenseModel]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "editExpense", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/ledger'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_model_1.AdminLedger]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "addAdminLedger", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)('admin/ledger/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, report_model_1.UpdateAdminLedgerDto]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "editAdminLedger", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)('admin/ledger/single/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agent_model_1.AgentBalanceUpdate]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "editAgentLedgerByAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({ name: 'agentId', required: false }),
    (0, common_1.Get)('admin/report/ledger/:startDate/:endDate'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __param(3, (0, common_1.Query)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date, String]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAllAdminLedger", null);
__decorate([
    (0, common_1.Get)('admin/report/single/:agentId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findSingleLedgerAdmin", null);
__decorate([
    (0, common_1.Get)('admin/ledger/single/:agentId'),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAgentSingelAllLedger", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/report/balance/inquery'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAllAdminBalance", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/report/:startDate/:endDate'),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date,
        Date]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAllReportAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/report/ledger'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAllByAgentId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/report/:startDate/:endDate'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAllBydate", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/report/dashboard'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findDashboard", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/report/dashboard'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findDashboardAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/report/expense'),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('filter')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, Number]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "findAdminExpense", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)("Report Module"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map