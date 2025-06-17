import { NoteModel } from './notes.model';
export declare class NotesService {
    create(createNoteDto: NoteModel): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateNoteDto: NoteModel): string;
    remove(id: number): string;
}
