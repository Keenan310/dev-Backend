import { ControlService } from './control.service';
export declare class ControlController {
    private readonly controlService;
    constructor(controlService: ControlService);
    findOne(header: Headers): Promise<import("./entities/control.entity").ControlModel>;
    update(header: Headers, status: string): Promise<import("typeorm").UpdateResult>;
}
