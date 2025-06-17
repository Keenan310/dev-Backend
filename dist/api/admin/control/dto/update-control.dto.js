"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateControlDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_control_dto_1 = require("./create-control.dto");
class UpdateControlDto extends (0, swagger_1.PartialType)(create_control_dto_1.CreateControlDto) {
}
exports.UpdateControlDto = UpdateControlDto;
//# sourceMappingURL=update-control.dto.js.map