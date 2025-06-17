import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportsModel, AirportsModelUpdate } from './airports.model';
import { Repository } from 'typeorm';

@Injectable()
export class AirportsService {

  constructor(
    @InjectRepository(AirportsModel)
    private readonly airportsRepository: Repository<AirportsModel>,
  ) {}

  async create(createAirportDto: AirportsModel) {
    const airportData = await this.airportsRepository.findOne(
      {where: { iata: createAirportDto.iata }
    });

    if(airportData){
      throw new HttpException("Airport already exist", HttpStatus.CONFLICT);
    }
    return this.airportsRepository.create(createAirportDto);
  }

  async findAll() {
    return this.airportsRepository.find();
  }

  async findFormateAll() {
    return this.airportsRepository.find({
      select: [
        'iata',
        'name',
        'city_code',
        'country_code',
        'timezone',
        'utc',
        'latitude',
        'longitude',
      ],
    });
  }

  async findOne(id: number) {
    const airportData = await this.airportsRepository.findOne(
      {where: { id: id }
    });

    if(airportData){
      throw new NotFoundException("Aiport doesn't exist");
    }

    return airportData;

  }

  async update(id: number, updateAirportDto: AirportsModelUpdate) {
    const airportData = await this.airportsRepository.findOne(
      {where: { id: id }
    });

    if(airportData){
      throw new NotFoundException("Aiport doesn't exist");
    }

    return this.airportsRepository.update(airportData[0].id, updateAirportDto);
  }

  async remove(id: number) {
    const airportData = await this.airportsRepository.findOne(
      {where: { id: id }
    });

    if(airportData){
      throw new NotFoundException("Aiport doesn't exist");
    }

    return this.airportsRepository.remove(airportData[0].id);

  }

  async getAirportName(code: string) {
    const airportsData = await this.airportsRepository.findOne({where: { iata: code }});
  
    if(!airportsData){
      return "Not Found";
    }
      return airportsData.name;
  }

  async getAirportLocation(code: string) {
    const airportsData = await this.airportsRepository.findOne({where: { iata: code }});
  
    if(!airportsData){
      return "Not Found";
    }
      return airportsData.city_code +","+ airportsData.country_code;
  }

  async getCountry(code : string){
    const airportsData = await this.airportsRepository.findOne({where: { iata: code }});
  
    if(!airportsData){
      return "Not Found";
    }
      return airportsData.country_code;
  }
}
