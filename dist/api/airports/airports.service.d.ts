import { AirportsModel, AirportsModelUpdate } from './airports.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
export declare class AirportsService {
    private readonly airportsRepository;
    private readonly authService;
    constructor(airportsRepository: Repository<AirportsModel>, authService: AuthService);
    create(createAirportDto: AirportsModel): Promise<AirportsModel>;
    findAll(): Promise<AirportsModel[]>;
    search(header: any, query: string): Promise<{
        code: any;
        name: any;
        location: string;
    }[]>;
    findFormateAll(): Promise<AirportsModel[]>;
    findOne(id: number): Promise<AirportsModel>;
    update(id: number, updateAirportDto: AirportsModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<AirportsModel[]>;
    getAirportName(code: string): Promise<string>;
    getAirportLocation(code: string): Promise<string>;
    getCountry(code: string): Promise<string>;
}
