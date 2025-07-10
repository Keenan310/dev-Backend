import { Controller, Get, Post, Body, Patch,Headers, Param, Delete } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  create(@Headers() header: Headers, @Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(header , createCurrencyDto);
  }

  @Get()
  findAll(@Headers() header: Headers) {
    return this.currencyService.findAll(header);
  }

  @Patch(':id')
  update(@Headers() header: Headers, @Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currencyService.update(header, +id, updateCurrencyDto);
  }

  @Delete(':id')
  remove(@Headers() header: Headers, @Param('id') id: string) {
    return this.currencyService.remove(header, +id);
  }
}
