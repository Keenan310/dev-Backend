"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllService = void 0;
const common_1 = require("@nestjs/common");
let AllService = class AllService {
    create(createAllDto) {
        return 'This action adds a new all';
    }
    findAll() {
        return `This action returns all all`;
    }
    findOne(id) {
        return `This action returns a #${id} all`;
    }
    update(id, updateAllDto) {
        return `This action updates a #${id} all`;
    }
    remove(id) {
        return `This action removes a #${id} all`;
    }
};
exports.AllService = AllService;
exports.AllService = AllService = __decorate([
    (0, common_1.Injectable)()
], AllService);
//# sourceMappingURL=all.service.js.map