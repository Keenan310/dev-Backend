import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TravellerModel, TravellerModelUpdate } from './traveller.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TravellerService {
  constructor(
    @InjectRepository(TravellerModel)
    private readonly TravellerRepository: Repository<TravellerModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    private readonly authService: AuthService
  ) {}
  async create(header: any, createTravellerDto: TravellerModel) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    createTravellerDto['agentId']  = agent.agentId;
    return await this.TravellerRepository.save(createTravellerDto);
  }

  async findAllByAgentId(header: string) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    return await this.TravellerRepository.find({where: { agentId: agent.agentId}});;
  }

  async findOne(header: any, uid: string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }
    
    return await this.TravellerRepository.findOne({where: { uid: uid }});

  }

  async update(header: any, uid: string, updateTravellerDto: TravellerModelUpdate) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const Traveller = await this.TravellerRepository.findOne({where: { uid: uid }});
    if (!Traveller) {
      throw new NotFoundException('Traveller not found');
    }
    return await this.TravellerRepository.update(Traveller.id, updateTravellerDto);
    
  }

  async remove(header: any, uid: string) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }
    
    const Traveller = await this.TravellerRepository.findOne({where: { uid: uid }});
    if (!Traveller) {
      throw new NotFoundException('Traveller not found');
    }
    return this.TravellerRepository.delete(Traveller.id);
  }

  async createBookingPax(TravellerData, agentId : string, bookingId : string){

    const adult = (TravellerData?.adult).length || 1;
    const child = (TravellerData?.child).length || 0;
    const infant = (TravellerData?.infant).length || 0;

    const paxData=[];
    if (adult > 0) {
      for (const adultPax of TravellerData?.adult) {
          const prefix = adultPax.gender == 'Male' ? 'MR' : 'MS';
          const adultInfo = {
              agentId: agentId,
              prefix: prefix,
              givenname: adultPax?.givenname.toUpperCase(),
              surname: adultPax?.surname.toUpperCase(),
              gender: adultPax?.gender.toUpperCase(),
              dob: adultPax?.dob,
              type: "ADT",
              document: adultPax?.document.toUpperCase(),
              expiredate: adultPax?.expiredate,
              nationality: adultPax?.nationality.toUpperCase(),
          };
            const Traveller = await this.TravellerRepository.findOne({
              where: { document: adultPax?.document.toUpperCase()},
            });
            if(!Traveller){
              paxData.push(adultInfo);
            }else{
              paxData.push(adultInfo);
          }
      }
    }

    if (child > 0) {
      for (const childPax of TravellerData?.child) {
        const prefix = childPax.gender == 'Male' ? 'MSTR' : 'MISS';
        const childInfo = {
            agentId: agentId,
            prefix: prefix,
            givenname: childPax.givenname.toUpperCase(),
            surname: childPax.surname.toUpperCase(),
            gender: childPax.gender.toUpperCase(),
            dob: childPax.dob,
            type: "CNN",
            document: childPax.document.toUpperCase(),
            expiredate: childPax.expiredate,
            nationality: childPax.nationality.toUpperCase(),
        };
          const Traveller = await this.TravellerRepository.findOne({
            where: { document: childPax?.document.toUpperCase()},
          });
          if(!Traveller){
            paxData.push(childInfo);
          }else{
            paxData.push(childInfo);
          }
      }
    }

    if (infant > 0) {
      for (const infantPax of TravellerData?.infant) {
        const prefix = infantPax.gender == 'Male' ? 'MSTR' : 'MISS';
        const infantInfo = {
          agentId: agentId,
          prefix: prefix,
          givenname: infantPax.givenname.toUpperCase(),
          surname: infantPax.surname.toUpperCase(),
          gender: infantPax.gender.toUpperCase(),
          dob: infantPax.dob,
          type: "INF",
          document: infantPax.document.toUpperCase(),
          expiredate: infantPax.expiredate,
          nationality: infantPax.nationality.toUpperCase(),
        };

          const Traveller = await this.TravellerRepository.findOne({
            where: { document: infantPax?.document.toUpperCase()},
          });
          if(!Traveller){
            paxData.push(infantInfo);
          }else{
            paxData.push(infantInfo);
        }
      }
    }
    await this.TravellerRepository.save(paxData);
  }
}
