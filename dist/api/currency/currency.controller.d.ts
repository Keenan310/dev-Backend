import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    create(header: Headers, createCurrencyDto: CreateCurrencyDto): Promise<CreateCurrencyDto & import("./entities/currency.entity").CurrencyConverter>;
    findAll(header: Headers): Promise<import("./entities/currency.entity").CurrencyConverter[]>;
    update(header: Headers, id: string, updateCurrencyDto: UpdateCurrencyDto): Promise<import("typeorm").UpdateResult>;
    remove(header: Headers, id: string): Promise<import("typeorm").DeleteResult>;
}
