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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./staff.service");
const staff_model_1 = require("./staff.model");
const swagger_1 = require("@nestjs/swagger");
let StaffController = class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    create(header, createStaffDto) {
        return this.staffService.create(header, createStaffDto);
    }
    findAllByAgentUId(header) {
        return this.staffService.findAllByAgentUId(header);
    }
    findOne(header, uid) {
        return this.staffService.findOne(header, uid);
    }
    update(header, staffUId, updateStaffDtoagent) {
        return this.staffService.update(header, staffUId, updateStaffDtoagent);
    }
    myaccount(header, staffUId) {
        return this.staffService.myaccount(header, staffUId);
    }
    myaccountupdate(header, staffUId, updateStaffDto) {
        return this.staffService.myaccountupdate(header, staffUId, updateStaffDto);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_model_1.StaffModel]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "findAllByAgentUId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(':uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)(':uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, staff_model_1.StaffModelUpdateByAgent]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('myaccount/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "myaccount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)('myaccount/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('staffUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, staff_model_1.StaffModelUpdate]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "myaccountupdate", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)("Staff Model"),
    (0, common_1.Controller)('agent/staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map