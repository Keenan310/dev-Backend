import { SearchhistoryService } from './searchhistory.service';
export declare class SearchhistoryController {
    private readonly searchhistoryService;
    constructor(searchhistoryService: SearchhistoryService);
    searchToday(headers: Headers): Promise<import("./searchhistory.model").SearchHistoryModel[]>;
    findByAgentId(header: string): Promise<import("./searchhistory.model").SearchHistoryModel[]>;
}
