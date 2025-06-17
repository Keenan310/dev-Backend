import { NotesService } from './notes.service';
import { NoteModel } from './notes.model';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(createNoteDto: NoteModel): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateNoteDto: NoteModel): string;
    remove(id: string): string;
}
