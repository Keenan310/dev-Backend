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
exports.AirlinesController = void 0;
const common_1 = require("@nestjs/common");
const airlines_service_1 = require("./airlines.service");
const swagger_1 = require("@nestjs/swagger");
const airlines_model_1 = require("./airlines.model");
const airlines_dto_1 = require("./airlines.dto");
let AirlinesController = class AirlinesController {
    constructor(airlinesService) {
        this.airlinesService = airlinesService;
    }
    createAirlineDiscount(header, dto) {
        return this.airlinesService.createAirlineDiscountMain(header, dto);
    }
    viewAirlineDiscount(header, currency) {
        return this.airlinesService.viewAirlineDiscountMain(header, currency);
    }
    updateAirlineDiscount(header, id, updateAirlineDiscountDto) {
        return this.airlinesService.updateAirlineDiscountMain(header, +id, updateAirlineDiscountDto);
    }
    deleteAirlineDiscount(header, id) {
        return this.airlinesService.deleteAirlineDiscountMain(header, +id);
    }
    createAirlineDiscountForAgent(header, createAirlineDiscountForAgentDto) {
        return this.airlinesService.createAirlineDiscountForAgent(header, createAirlineDiscountForAgentDto);
    }
    viewAirlineDiscountForAgent(header, agentId) {
        return this.airlinesService.viewAirlineDiscountForAgent(header, agentId);
    }
    updateAirlineDiscountForAgent(header, id, updateAirlineDiscountDto) {
        return this.airlinesService.updateAirlineDiscountForAgent(header, +id, updateAirlineDiscountDto);
    }
    deleteAirlineDiscountForAgent(header, id) {
        return this.airlinesService.deleteAirlineDiscountForAgent(header, +id);
    }
    updatemarkup(header, id, updateAirlineDto) {
        return this.airlinesService.update(header, +id, updateAirlineDto);
    }
};
exports.AirlinesController = AirlinesController;
__decorate([
    (0, common_1.Post)('admin/airline/discount'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, airlines_dto_1.CreateAirlineDiscountDto]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "createAirlineDiscount", null);
__decorate([
    (0, common_1.Get)('admin/airline/discount'),
    (0, swagger_1.ApiQuery)({ name: 'currency', required: false }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "viewAirlineDiscount", null);
__decorate([
    (0, common_1.Patch)('admin/airline/discount/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, airlines_dto_1.UpdateAirlineDiscountDto]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "updateAirlineDiscount", null);
__decorate([
    (0, common_1.Delete)('admin/airline/discount/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "deleteAirlineDiscount", null);
__decorate([
    (0, common_1.Post)('admin/singleagent/airline/discount'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, airlines_dto_1.CreateAirlineDiscountForAgentDto]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "createAirlineDiscountForAgent", null);
__decorate([
    (0, common_1.Get)('admin/singleagent/airline/discount'),
    (0, swagger_1.ApiQuery)({ name: 'agentId', required: true }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "viewAirlineDiscountForAgent", null);
__decorate([
    (0, common_1.Patch)('admin/singleagent/airline/discount/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, airlines_dto_1.UpdateAirlineDiscountDto]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "updateAirlineDiscountForAgent", null);
__decorate([
    (0, common_1.Delete)('admin/singleagent/airline/discount/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "deleteAirlineDiscountForAgent", null);
__decorate([
    (0, common_1.Patch)('agent/airlines/markup/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, airlines_model_1.AirlinesUpdateModel]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "updatemarkup", null);
exports.AirlinesController = AirlinesController = __decorate([
    (0, swagger_1.ApiTags)("Admin Module"),
    (0, common_1.Controller)(),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [airlines_service_1.AirlinesService])
], AirlinesController);
//# sourceMappingURL=airlines.controller.js.map