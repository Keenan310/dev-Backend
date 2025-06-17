import { Injectable } from '@nestjs/common';
import { NoteModel } from './notes.model';

@Injectable()
export class NotesService {
  create(createNoteDto: NoteModel) {
    return 'This action adds a new note';
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: NoteModel) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
