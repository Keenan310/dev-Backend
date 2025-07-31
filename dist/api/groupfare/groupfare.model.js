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
exports.GroupFareSearch = exports.GroupFareModelUpdate = exports.GroupFareDto = exports.GroupFareModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let GroupFareModel = class GroupFareModel {
};
exports.GroupFareModel = GroupFareModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupFareModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "GroupId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "TripType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "PNR", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "Carrier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "RouteFrom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "RouteTo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "DepDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GroupFareModel.prototype, "NetFare", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "Baggage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "seatsAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "mealCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GroupFareModel.prototype, "segment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "DepartureFrom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "ArrivalTo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "DepTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "ArrTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "FlightNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "DepartureFrom1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "ArrivalTo1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "DepTime1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "ArrTime1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "FlightNumber1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rDepFrom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rSegment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rArrTo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rFlightNo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rDepTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rArrTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rDepFrom1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rArrTo1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rFlightNo1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rDepTime1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "rArrTime1", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], GroupFareModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], GroupFareModel.prototype, "uid", void 0);
exports.GroupFareModel = GroupFareModel = __decorate([
    (0, typeorm_1.Entity)('groupfare')
], GroupFareModel);
class GroupFareDto {
}
exports.GroupFareDto = GroupFareDto;
class GroupFareModelUpdate {
}
exports.GroupFareModelUpdate = GroupFareModelUpdate;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'EK' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "Carrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DAC' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "DepFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DXB' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "ArrTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-01' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "DepDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '30000' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GroupFareModelUpdate.prototype, "BaseFare", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '10000' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GroupFareModelUpdate.prototype, "Taxes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Economy' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "Cabinclass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '30000' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GroupFareModelUpdate.prototype, "NetFare", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'true' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GroupFareModelUpdate.prototype, "Refundable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-01T00:00:00' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "TimeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '20 KG' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "Baggage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '50' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GroupFareModelUpdate.prototype, "seatsAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'M' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "mealCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Y' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "cabinCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DAC' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "DepartureFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DXB' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "ArrivalTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-01T04:40:00' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "DepTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-01T023:40:00' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "ArrTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '535' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "FlightNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DXB' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "DepartureFrom1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'JFK' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "ArrivalTo1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-01T04:40:00' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "DepTime1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-01T04:40:00' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "ArrTime1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '565' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupFareModelUpdate.prototype, "FlightNumber1", void 0);
class GroupFareSearch {
}
exports.GroupFareSearch = GroupFareSearch;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DAC' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GroupFareSearch.prototype, "depfrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DXB' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GroupFareSearch.prototype, "arrto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-06-12' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GroupFareSearch.prototype, "depdate", void 0);
//# sourceMappingURL=groupfare.model.js.map