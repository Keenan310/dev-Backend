import { ControlModel } from './entities/control.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/api/auth/auth.service';
export declare class ControlService {
    private readonly controlRepository;
    private readonly authService;
    constructor(controlRepository: Repository<ControlModel>, authService: AuthService);
    findOne(header: any): Promise<ControlModel>;
    update(header: any, status: string): Promise<import("typeorm").UpdateResult>;
}
