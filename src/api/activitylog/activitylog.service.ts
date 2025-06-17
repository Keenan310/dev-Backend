import { Injectable } from '@nestjs/common';
import { CreateActivitylogDto } from './dto/create-activitylog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogModel } from './entities/activitylog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivitylogService {
  constructor(
    @InjectRepository(ActivityLogModel)
    private readonly acivityLogRepository: Repository<ActivityLogModel>,

  ){}
  async create(createActivitylogDto: CreateActivitylogDto) {
    return this.acivityLogRepository.save(createActivitylogDto);
  }

  findByAdmin(header: any){

  }

  findByAgent(header: any){

  }
}
