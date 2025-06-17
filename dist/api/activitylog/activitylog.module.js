"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitylogModule = void 0;
const common_1 = require("@nestjs/common");
const activitylog_service_1 = require("./activitylog.service");
const activitylog_controller_1 = require("./activitylog.controller");
const typeorm_1 = require("@nestjs/typeorm");
const activitylog_entity_1 = require("./entities/activitylog.entity");
let ActivitylogModule = class ActivitylogModule {
};
exports.ActivitylogModule = ActivitylogModule;
exports.ActivitylogModule = ActivitylogModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([activitylog_entity_1.ActivityLogModel])],
        controllers: [activitylog_controller_1.ActivitylogController],
        providers: [activitylog_service_1.ActivitylogService],
    })
], ActivitylogModule);
//# sourceMappingURL=activitylog.module.js.map