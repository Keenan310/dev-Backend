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
exports.AirportsController = void 0;
const common_1 = require("@nestjs/common");
const airports_service_1 = require("./airports.service");
const swagger_1 = require("@nestjs/swagger");
const airports_model_1 = require("./airports.model");
let AirportsController = class AirportsController {
    constructor(airportsService) {
        this.airportsService = airportsService;
    }
    create(createAirportDto) {
        return this.airportsService.create(createAirportDto);
    }
    findAll() {
        return this.airportsService.findAll();
    }
    findFormateAll() {
        return this.airportsService.findFormateAll();
    }
    findOne(id) {
        return this.airportsService.findOne(+id);
    }
    update(id, updateAirportDto) {
        return this.airportsService.update(+id, updateAirportDto);
    }
    remove(id) {
        return this.airportsService.remove(+id);
    }
};
exports.AirportsController = AirportsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [airports_model_1.AirportsModel]),
    __metadata("design:returntype", void 0)
], AirportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AirportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('formate/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AirportsController.prototype, "findFormateAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AirportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, airports_model_1.AirportsModelUpdate]),
    __metadata("design:returntype", void 0)
], AirportsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AirportsController.prototype, "remove", null);
exports.AirportsController = AirportsController = __decorate([
    (0, swagger_1.ApiTags)("Airports Module"),
    (0, common_1.Controller)('admin/airports'),
    __metadata("design:paramtypes", [airports_service_1.AirportsService])
], AirportsController);
//# sourceMappingURL=airports.controller.js.map