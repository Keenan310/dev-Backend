import { Injectable, NotFoundException } from '@nestjs/common';
import { PassengerModel, PassengerModelUpdate } from './passenger.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(PassengerModel)
    private readonly passengerRepository: Repository<PassengerModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
  ) {}

  async createBookingPax(passengerData: any, agentId : string, bookingId : string){

    const adult = (passengerData?.adult).length || 1;
    const child = (passengerData?.child).length || 0;
    const infant = (passengerData?.infant).length || 0;

    const paxData=[];
    if (adult > 0) {
      for (const adultPax of passengerData?.adult) {
          const prefix = adultPax.gender === 'MALE' ? 'MR' : 'MS';
          const adultInfo = {
              agentId: agentId,
              bookingId: bookingId,
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
          paxData.push(adultInfo);
      }
    }

    if (child > 0) {
      for (const childPax of passengerData?.child) {
        const prefix = childPax.gender === 'MALE' ? 'MSTR' : 'MISS';
        const childInfo = {
            agentId: agentId,
            bookingId: bookingId,
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

        paxData.push(childInfo);
      }
    }

    if (infant > 0) {
      for (const infantPax of passengerData?.infant) {
        const prefix = infantPax.gender === 'MALE' ? 'MSTR' : 'MISS';
        const infantInfo = {
          agentId: agentId,
          bookingId: bookingId,
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

        paxData.push(infantInfo);
      }
    }
    await this.passengerRepository.save(paxData);
  }

  async createBookingPaxForImport(agentId : string, bookingId : string, passengerData: any){

    let adult=0;
    const adultData : any = [];
    for (const item of passengerData) {
      if (item.type === 'ADULT') {
        adult++;
        adultData.push(item);
      }
    }
    let child=0;
    const childData : any = [];
    for (const item of passengerData) {
      if (item.type === 'CHILD') {
        child++;
        childData.push(item);
      }
    }
    let infant=0;
    const infantData : any = [];
    for (const item of passengerData) {
      if (item.type === 'INFANT') {
        infant++;
        infantData.push(item);
      }
    }

    const paxData=[];
    if (adult > 0) {
      for (const adultPax of adultData) {
          const prefix = (adultPax?.identityDocuments[0]?.gender === 'MALE') ? 'MR' : 'MS';
          const adultInfo = {
              agentId: agentId,
              bookingId: bookingId,
              prefix: prefix,
              givenname: adultPax?.identityDocuments[0]?.givenName,
              surname: adultPax?.identityDocuments[0]?.surname,
              gender: adultPax?.identityDocuments[0]?.gender,
              dob: adultPax?.identityDocuments[0]?.birthDate,
              type: "ADT",
              document: adultPax?.identityDocuments[0]?.documentNumber,
              expiredate: adultPax?.identityDocuments[0]?.expiryDate,
              nationality: adultPax?.identityDocuments[0]?.residenceCountryCode,
          };
          paxData.push(adultInfo);
      }
    }

    if (child > 0) {
      for (const childPax of childData) {
        const prefix = childPax?.identityDocuments[0]?.gender === 'MALE' ? 'MSTR' : 'MISS';
        const childInfo = {
            agentId: agentId,
            bookingId: bookingId,
            prefix: prefix,
            givenname: childPax?.identityDocuments[0]?.givenName,
            surname: childPax?.identityDocuments[0]?.surname,
            gender: childPax?.identityDocuments[0]?.gender,
            dob: childPax?.identityDocuments[0]?.birthDate,
            type: "CNN",
            document: childPax?.identityDocuments[0]?.documentNumber,
            expiredate: childPax?.identityDocuments[0]?.expiryDate,
            nationality: childPax?.identityDocuments[0]?.residenceCountryCode
        };

        paxData.push(childInfo);
      }
    }

    if (infant > 0) {
      let i = 0;
      for (const infantPax of infantData) {
        i++;
        const prefix = adultData[i-1]?.identityDocuments[1]?.gender === 'INFANT_MALE' ? 'MSTR' : 'MISS';
        const infantInfo = {
          agentId: agentId,
          bookingId: bookingId,
          prefix: prefix,
          givenname: adultData[i-1]?.identityDocuments[1]?.givenName,
          surname: infantPax.surname,
          gender: adultData[i-1]?.identityDocuments[1]?.gender,
          dob: adultData[i-1]?.identityDocuments[1]?.birthDate,
          type: "INF",
          document: adultData[i-1]?.identityDocuments[1]?.documentNumber,
          expiredate: adultData[i-1]?.identityDocuments[1]?.expiryDate,
          nationality: adultData[i-1]?.identityDocuments[1]?.residenceCountryCode
        };

        paxData.push(infantInfo);
      }
    }
    await this.passengerRepository.save(paxData);
  }
}
