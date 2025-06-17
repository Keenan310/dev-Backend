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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightCacheModel = void 0;
const typeorm_1 = require("typeorm");
let FlightCacheModel = class FlightCacheModel {
};
exports.FlightCacheModel = FlightCacheModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlightCacheModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "resultid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "triptype", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "depdate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "returndate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "depfrom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "arrto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FlightCacheModel.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FlightCacheModel.prototype, "adult", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FlightCacheModel.prototype, "child", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FlightCacheModel.prototype, "infant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', }),
    __metadata("design:type", Object)
], FlightCacheModel.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FlightCacheModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FlightCacheModel.prototype, "updatedAt", void 0);
exports.FlightCacheModel = FlightCacheModel = __decorate([
    (0, typeorm_1.Entity)('flight_cache')
], FlightCacheModel);
//# sourceMappingURL=cache-flight.entity.js.map