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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_model_1 = require("./auth.model");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signin(authModel) {
        return this.authService.agentsignin(authModel);
    }
    adminsignin(authModel) {
        return this.authService.adminsignin(authModel);
    }
    forgetPasswordAgent(email) {
        return this.authService.agentForgetPassword(email);
    }
    verifyOTPagent(code, newpassword) {
        return this.authService.verifyOTPUpdatePassword(code, newpassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agent sign in', description: 'Only agent can sign in here' }),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_model_1.AuthModel]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Admin sign in', description: 'Only admin can sign in' }),
    (0, common_1.Post)('admin/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_model_1.AuthModel]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "adminsignin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agent forget Password', description: 'Only agent can' }),
    (0, common_1.Post)('agent/forgetpassword/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgetPasswordAgent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agent verify OTP', description: 'Only Agent can' }),
    (0, common_1.Post)('agent/verify/:otp/:newpassword'),
    __param(0, (0, common_1.Param)('otp')),
    __param(1, (0, common_1.Param)('newpassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOTPagent", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map