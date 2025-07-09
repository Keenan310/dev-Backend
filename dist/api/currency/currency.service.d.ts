import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyConverter } from './entities/currency.entity';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
export declare class CurrencyService {
    private readonly currencyConverterRepository;
    private authService;
    constructor(currencyConverterRepository: Repository<CurrencyConverter>, authService: AuthService);
    create(header: any, createCurrencyDto: CreateCurrencyDto): Promise<CreateCurrencyDto & CurrencyConverter>;
    findAll(header: any): Promise<CurrencyConverter[]>;
    update(header: any, id: number, updateCurrencyDto: UpdateCurrencyDto): Promise<import("typeorm").UpdateResult>;
    remove(header: any, id: number): Promise<import("typeorm").DeleteResult>;
}
