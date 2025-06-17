"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
let NotesService = class NotesService {
    create(createNoteDto) {
        return 'This action adds a new note';
    }
    findAll() {
        return `This action returns all notes`;
    }
    findOne(id) {
        return `This action returns a #${id} note`;
    }
    update(id, updateNoteDto) {
        return `This action updates a #${id} note`;
    }
    remove(id) {
        return `This action removes a #${id} note`;
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)()
], NotesService);
//# sourceMappingURL=notes.service.js.map