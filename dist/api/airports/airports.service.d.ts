import { AirportsModel, AirportsModelUpdate } from './airports.model';
import { Repository } from 'typeorm';
export declare class AirportsService {
    private readonly airportsRepository;
    constructor(airportsRepository: Repository<AirportsModel>);
    create(createAirportDto: AirportsModel): Promise<AirportsModel>;
    findAll(): Promise<AirportsModel[]>;
    findFormateAll(): Promise<AirportsModel[]>;
    findOne(id: number): Promise<AirportsModel>;
    update(id: number, updateAirportDto: AirportsModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<AirportsModel[]>;
    getAirportName(code: string): Promise<string>;
    getAirportLocation(code: string): Promise<string>;
    getCountry(code: string): Promise<string>;
}
