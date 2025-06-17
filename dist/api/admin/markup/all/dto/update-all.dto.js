"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAllDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_all_dto_1 = require("./create-all.dto");
class UpdateAllDto extends (0, swagger_1.PartialType)(create_all_dto_1.CreateAllDto) {
}
exports.UpdateAllDto = UpdateAllDto;
//# sourceMappingURL=update-all.dto.js.map