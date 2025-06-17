import { ActivitylogService } from './activitylog.service';
export declare class ActivitylogController {
    private readonly activitylogService;
    constructor(activitylogService: ActivitylogService);
    findAllAgent(header: Headers): void;
    findAllAdmin(header: string): void;
}
