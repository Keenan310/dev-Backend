"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlinesService = void 0;
const common_1 = require("@nestjs/common");
let AirlinesService = class AirlinesService {
    create(createAirlineDto) {
        return 'This action adds a new airline';
    }
    findAll() {
        return `This action returns all airlines`;
    }
    findOne(id) {
        return `This action returns a #${id} airline`;
    }
    update(id, updateAirlineDto) {
        return `This action updates a #${id} airline`;
    }
    remove(id) {
        return `This action removes a #${id} airline`;
    }
};
exports.AirlinesService = AirlinesService;
exports.AirlinesService = AirlinesService = __decorate([
    (0, common_1.Injectable)()
], AirlinesService);
//# sourceMappingURL=airlines.service.js.map