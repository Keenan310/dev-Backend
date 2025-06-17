import { CreateActivitylogDto } from './dto/create-activitylog.dto';
import { ActivityLogModel } from './entities/activitylog.entity';
import { Repository } from 'typeorm';
export declare class ActivitylogService {
    private readonly acivityLogRepository;
    constructor(acivityLogRepository: Repository<ActivityLogModel>);
    create(createActivitylogDto: CreateActivitylogDto): Promise<CreateActivitylogDto & ActivityLogModel>;
    findByAdmin(header: any): void;
    findByAgent(header: any): void;
}
