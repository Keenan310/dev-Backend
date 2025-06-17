import { Controller, Get, Headers } from '@nestjs/common';
import { SearchhistoryService } from './searchhistory.service';
import {  ApiTags } from '@nestjs/swagger';


@ApiTags("Search History")
@Controller('search/history')
export class SearchhistoryController {
  constructor(private readonly searchhistoryService: SearchhistoryService) {}


  @Get('today')
  searchToday(@Headers() headers: Headers,) {
    return this.searchhistoryService.todaysearch(headers);
  }

  @Get()
  findByAgentId(
    @Headers() header: string) {
    return this.searchhistoryService.findByAgentId(header);
  }
}
