import { Injectable } from '@nestjs/common';
import { CreateAllDto } from './dto/create-all.dto';
import { UpdateAllDto } from './dto/update-all.dto';

@Injectable()
export class AllService {
  create(createAllDto: CreateAllDto) {
    return 'This action adds a new all';
  }

  findAll() {
    return `This action returns all all`;
  }

  findOne(id: number) {
    return `This action returns a #${id} all`;
  }

  update(id: number, updateAllDto: UpdateAllDto) {
    return `This action updates a #${id} all`;
  }

  remove(id: number) {
    return `This action removes a #${id} all`;
  }
}
