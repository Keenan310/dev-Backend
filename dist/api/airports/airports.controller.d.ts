import { AirportsService } from './airports.service';
import { AirportsModel, AirportsModelUpdate } from './airports.model';
export declare class AirportsController {
    private readonly airportsService;
    constructor(airportsService: AirportsService);
    create(createAirportDto: AirportsModel): Promise<AirportsModel>;
    findAll(): Promise<AirportsModel[]>;
    findFormateAll(): Promise<AirportsModel[]>;
    findOne(id: string): Promise<AirportsModel>;
    update(id: string, updateAirportDto: AirportsModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<AirportsModel[]>;
}
