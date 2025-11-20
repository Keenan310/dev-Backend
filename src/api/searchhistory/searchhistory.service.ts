import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SearchHistoryModel } from './searchhistory.model';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { FlightSearchModel } from '../flight/dto/search-flight.dto';

@Injectable()
export class SearchhistoryService {
  constructor(
    @InjectRepository(SearchHistoryModel)
    private readonly searchHistoryRepository: Repository<SearchHistoryModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    private readonly authService: AuthService
  ) {}

  async create(agentdata: AgentModel, flightDto: FlightSearchModel): Promise<SearchHistoryModel> {

    const shModel = new SearchHistoryModel();
    shModel.agentId = agentdata.agentId;
    shModel.companyname = agentdata.company;
    shModel.triptype =  flightDto.segments?.[0].depfrom == flightDto.segments?.[0].arrto ? 'Return' : 'Oneway';
    shModel.adult = flightDto.adultcount;
    shModel.child = flightDto.childcount;
    shModel.infant = flightDto.infantcount;
    shModel.depfrom = flightDto.segments?.[0].depfrom;
    shModel.arrto = flightDto.segments?.[0].arrto;
    shModel.depdate = flightDto.segments?.[0]?.depdate;
    shModel.returndate = flightDto.segments?.[1]?.depdate;

    return await this.searchHistoryRepository.save(shModel);

  }
  
  async todaysearch(headers : any): Promise<SearchHistoryModel[]> {

    const verifyAdminId = await this.authService.verifyAdminToken(headers);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const now = new Date();
    return await this.searchHistoryRepository.find({
      where: {
        depdate: MoreThan(now),          
      },
      order: {
        created_at: 'DESC',
      },
      take: 1000,
    });

  }

  async findByAgentId(header: any) : Promise<SearchHistoryModel[]>  {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const search_histories = await this.searchHistoryRepository.find({
      where: { agentId: agent.agentId },
      order: { created_at: 'DESC' },
      take: 20,
    });
    if (!search_histories) {
      throw new NotFoundException('No data found');
    }

    return search_histories;
  }
}
