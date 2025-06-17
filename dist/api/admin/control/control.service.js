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
exports.ControlService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const control_entity_1 = require("./entities/control.entity");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../../auth/auth.service");
let ControlService = class ControlService {
    constructor(controlRepository, authService) {
        this.controlRepository = controlRepository;
        this.authService = authService;
    }
    async findOne(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.controlRepository.findOne({ where: { id: 1 } });
    }
    async update(header, status) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const control = await this.controlRepository.findOne({ where: { id: 1 } });
        if (!control) {
            throw new common_1.NotFoundException(" Data not found");
        }
        control.status = status;
        return await this.controlRepository.update(1, control);
    }
};
exports.ControlService = ControlService;
exports.ControlService = ControlService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(control_entity_1.ControlModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], ControlService);
//# sourceMappingURL=control.service.js.map