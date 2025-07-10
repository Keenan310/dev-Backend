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
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const currency_entity_1 = require("./entities/currency.entity");
const auth_service_1 = require("../auth/auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CurrencyService = class CurrencyService {
    constructor(currencyConverterRepository, authService) {
        this.currencyConverterRepository = currencyConverterRepository;
        this.authService = authService;
    }
    async create(header, createCurrencyDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return this.currencyConverterRepository.save(createCurrencyDto);
    }
    async findAll(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return this.currencyConverterRepository.find();
    }
    async update(header, id, updateCurrencyDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const data = await this.currencyConverterRepository.findOneBy({ id: id });
        if (!data) {
            throw new common_1.NotFoundException("Data Id Not Valid");
        }
        return await this.currencyConverterRepository.update(id, updateCurrencyDto);
    }
    async remove(header, id) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const data = await this.currencyConverterRepository.findOneBy({ id: id });
        if (!data) {
            throw new common_1.NotFoundException("Data Id Not Valid or may be deleted");
        }
        return await this.currencyConverterRepository.delete(data.id);
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_entity_1.CurrencyConverter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map