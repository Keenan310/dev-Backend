import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { PassengerService } from '../passenger/passenger.service';
import { BookingModel } from '../booking/booking.model';
import { AgentModel } from '../agent/agent.model';
import { BookingService } from '../booking/booking.service';
import { SabreUtils } from './sabre.flight.utils';
import { FlightSearchModel } from './dto/search-flight.dto';
import { SearchhistoryService } from '../searchhistory/searchhistory.service';
dotenv.config()

@Injectable()
export class SabreService {
    constructor(
      @InjectRepository(BookingModel)
      private readonly bookingRepository: Repository<BookingModel>,
      private readonly passengerService: PassengerService,
      private readonly bookingService: BookingService,
      private readonly sabreUtils: SabreUtils,
      private readonly searchHistoryService: SearchhistoryService
    ) {}

  async restToken(): Promise<string> {
    const encodeBase64 = (value: string) => Buffer.from(value).toString('base64');

    const client_id_raw = `V1:${process.env.SABRE_ID}:${process.env.SABRE_PCC}:AA`;
    const client_id = encodeBase64(client_id_raw);
    const client_secret = encodeBase64(process.env.SABRE_PASSWORD ?? '');
    const token = encodeBase64(`${client_id}:${client_secret}`);
    const data = 'grant_type=client_credentials';

    const headers = {
      Authorization: `Basic ${token}`,
      Accept: '/',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try{
      const response = await axios.post(process.env.SABRE_AUTH_ENDPOINT, data, {headers});
        const result = response?.data;
        return result['access_token'];
    }catch (err) {
      console.log(err);
    }
  }

  async shopping(agentdata : AgentModel, flightDto: FlightSearchModel) {
   
    let adultCount = flightDto?.adultcount || 1;
    let childCount = flightDto?.childcount || 0;
    let infantCount = flightDto?.infantcount || 0;
    let cabinclass = flightDto.cabinclass
    let segments = flightDto.segments;

    await this.searchHistoryService.create(agentdata, flightDto);

    const SabreRequestPax = [];
    if (adultCount > 0) {
      const PaxQuantity = {
        Code: "ADT",
        Quantity: adultCount,
      };
      SabreRequestPax.push(PaxQuantity);
    }
    if (childCount > 0) {
      const PaxQuantity = {
        Code: "CNN",
        Quantity: childCount,
      };
      SabreRequestPax.push(PaxQuantity);
    }
    if (infantCount > 0) {
      const PaxQuantity = {
        Code: "INF",
        Quantity: infantCount,
      };
      SabreRequestPax.push(PaxQuantity);
    }

    const SegmentList = [];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const DepFrom = segment.depfrom;
      const ArrTo = segment.arrto;
      const DepDate = segment.depdate + "T00:00:00";
  
      const SingleSegment = {
        RPH: i.toString(),
        DepartureDateTime: DepDate,
        OriginLocation: {
          LocationCode: DepFrom,
        },
        DestinationLocation: {
          LocationCode: ArrTo,
          LocationType: "C",
          AllAirports:true
        },
        TPA_Extensions:{
        }
      };

      SegmentList.push(SingleSegment);
    }
  
    const sabreToken = await this.restToken();

    let payload_data = {
      OTA_AirLowFareSearchRQ: {
        Version: "5",
        POS: {
          Source: [
            {
              PseudoCityCode: process.env.SABRE_PCC,
              RequestorID: {
                "Type": "1",
                "ID": "1",
                "CompanyName": {
                  "Code": "TN"
                }
              }
            }
          ]
        },
        OriginDestinationInformation: SegmentList,
        TravelPreferences: {
          TPA_Extensions: {
            "DataSources": {
              "NDC": "Disable",
              "ATPCO": "Enable",
              "LCC": "Disable"
            },
            "LongConnectTime": {
              "Min": 59,
              "Max": 1439,
              "Enable": true
            },
            "CodeShareIndicator": {
              "ExcludeCodeshare": false,
              "KeepOnlines": true
            },
            "PreferNDCSourceOnTie": {
              "Value": true
            },
            "XOFares": {
              "Value": true
            }
          },
          "CabinPref": [
            {
                "Cabin": cabinclass,
                "PreferLevel": "Preferred"
            }
          ]
        },
        "TravelerInfoSummary": {
          "AirTravelerAvail": [
            {
              "PassengerTypeQuantity": SabreRequestPax
            }
          ],
          PriceRequestInformation: {
            TPA_Extensions: {
              BrandedFareIndicators: {
                MultipleBrandedFares: true
              }
            }
          },
        },
        TPA_Extensions: {
          IntelliSellTransaction: {
            RequestType: {
              Name: "50ITINS"
            }
          }
        }
      }
    };

    const shoppingrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRSEARCH_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${sabreToken}`,
      },
      data : payload_data
    };
    
    try {
      const response = await axios.request(shoppingrequest);
      return await this.sabreUtils.restBFMParser(agentdata, flightDto, response?.data);
    } catch (e) {
      return e;
    }
  }

  async revalidation(agentdata: AgentModel, revalidationDto: any){

    let AdultCount = 0;
    let ChildCount = 0;
    let InfantCount = 0;
  
    const PriceBreakDown = revalidationDto.PriceBreakDown;
    for (const pricebreakdown of PriceBreakDown) {
      if (pricebreakdown.PaxType === 'ADT') {
        AdultCount = pricebreakdown.PaxCount;
      } else if (pricebreakdown.PaxType === 'C09') {
        ChildCount = pricebreakdown.PaxCount;
      } else if (pricebreakdown.PaxType === 'INF') {
        InfantCount = pricebreakdown.PaxCount;
      } else {
        throw new Error("Invalid Price Break down");
      }
    }
    
    const SabreRequestPax = [];
  
    if (AdultCount > 0) {
      SabreRequestPax.push({
        Code: "ADT",
        Quantity: AdultCount,
      });
    }
  
    if (ChildCount > 0) {
      SabreRequestPax.push({
        Code: "CNN",
        Quantity: ChildCount,
      });
    }
  
    if (InfantCount > 0) {
      SabreRequestPax.push({
        Code: "INF",
        Quantity: InfantCount,
      });
    }

    let seatsReq = AdultCount + ChildCount;
    const RPHRequestArray = [];
    const AllSegments = revalidationDto?.AllLegsInfo;
    for (let i = 0; i < AllSegments.length; i++) {
      const segmentList = AllSegments[i];
      const MultiFlights = [];
      for (const segment of segmentList?.Segments || []) {
        const MarketingCarrier = segment.MarketingCarrier;
        const MarketingFlightNumber = segment.MarketingFlightNumber;
        const OperatingCarrier = segment.OperatingCarrier;
        const DepFrom = segment.DepFrom;
        const ArrTo = segment.ArrTo;
        const DepTime = segment.DepTime.slice(0, 19);
        const ArrTime = segment.ArrTime.slice(0, 19);
        const BookingCode = segment.SegmentCode.bookingCode;

        const Flights =
          {
                Number: MarketingFlightNumber,
                DepartureDateTime: DepTime,
                ArrivalDateTime: ArrTime,
                Type: "A",
                ClassOfService: BookingCode,
                OriginLocation: {
                  LocationCode: DepFrom,
                },
                DestinationLocation: {
                  LocationCode: ArrTo,
                },
                Airline: {
                  Operating: OperatingCarrier,
                  Marketing: MarketingCarrier,
                },
          };
          MultiFlights.push(Flights);
      }
      const MultiRequest = {
          RPH: String(i + 1),
          DepartureDateTime: segmentList?.Segments[0]?.DepTime.slice(0, 19),
          OriginLocation: {
            LocationCode: segmentList.DepFrom,
          },
          DestinationLocation: {
            LocationCode: segmentList.ArrTo,
          },
          TPA_Extensions: {
            SegmentType: {
              Code: "O",
            },
            Flight: MultiFlights,
          },
      };
      RPHRequestArray.push(MultiRequest);
    }

    const sabre_revalidation_request_data = {
      OTA_AirLowFareSearchRQ: {
        Version: "4",
        TravelPreferences: {
          TPA_Extensions: {
            VerificationItinCallLogic: {
              Value: "L",
            },
          },
        },
        TravelerInfoSummary: {
          SeatsRequested: [seatsReq],
          AirTravelerAvail: [
            {
              PassengerTypeQuantity: SabreRequestPax,
            },
          ],
        },
        POS: {
          Source: [
            {
              PseudoCityCode: process.env.SABRE_PCC,
              RequestorID: {
                Type: "1",
                ID: "1",
                CompanyName: {
                  Code: "TN",
                },
              },
            },
          ],
        },
        OriginDestinationInformation: RPHRequestArray,
        TPA_Extensions: {
          IntelliSellTransaction: {
            RequestType: {
              Name: "50ITINS",
            },
          },
        },
      },
    };

    
    const sabreToken = await this.restToken(); 

    let sabreflightrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRPRICE_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Conversation-ID': '2021.01.DevStudio', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : sabre_revalidation_request_data
    };
  
      try {
        const revalidation_response = await axios.request(sabreflightrequest);
        const RevalidationResponse = revalidation_response?.data;
        return this.sabreUtils.restRevalidationParser(agentdata, revalidationDto, RevalidationResponse);
      }catch (error) {
        console.error(error);
        throw error;
      }
  }

  async booking(agentdata: AgentModel, bookingDto: any){

    if(bookingDto.PaymentType === 'Hold'){
      const bookingPNR = null;
      const airlinesPNR = null;
      return this.bookingService.createBooking(agentdata, bookingPNR, airlinesPNR, bookingDto);
    }

    const time_now = new Date();
    const email : string = bookingDto.ContactInfo.email || "dev@flyjatt.com";
    const leadPassengerEmail : string = email.replace("@", "//");
    const phone : string = bookingDto.ContactInfo.phone || "08801685370455";

    const adult : number = (bookingDto.PassengerInfo.adult).length;
    const child : number = (bookingDto.PassengerInfo.child).length || 0;
    const infant : number = (bookingDto.PassengerInfo.infant).length || 0;

    let AllPerson = [];
    let AdvancePassenger = [];
    let SecureFlight = [];
    let AllSsr = [];
    let PaxInfo=[];

    if(adult > 0 && child > 0 && infant > 0){
      PaxInfo = [
        {
          Code: 'ADT',
          Quantity: adult.toString()
        },
        {
          Code: 'CNN',
          Quantity: child.toString()
        },
        {
          Code: 'INF',
          Quantity: infant.toString()
        }
      ];

      //adult part
      let adultCount : number = 0;
      let totalCount : number = 0;
      for (const adultPax of bookingDto?.PassengerInfo?.adult) {
        adultCount++;
        totalCount++;

        const givenname : string = adultPax?.givenname.toUpperCase();
        const surname : string = adultPax?.surname.toUpperCase();
        let gender : string = adultPax?.gender?.toUpperCase();
        const dob : string = adultPax?.dob;
        const document : string = adultPax?.document?.toUpperCase();
        const expiredate : string = adultPax?.expiredate;
        const nationality : string = adultPax?.nationality?.toUpperCase();

        let title: string;
        if (gender === 'MALE') {
          gender = 'M';
          title = 'MR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          title = 'MS';
        }

        const Person = {
          "NameNumber": `${totalCount}.1`,
          "GivenName": `${givenname} ${title}`,
          "Surname": surname,
          "Infant": false,
          "PassengerType": "ADT",
          "NameReference": "",
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "OTHS",
          "Text": `CC ${givenname} ${surname}`,
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
          },
          "SegmentNumber": "A",
        };
        AllSsr.push(SSROThers);

        const SSRCTCM = {
          "SSR_Code": "CTCM",
          "Text": phone,
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
          },
          "SegmentNumber": "A",
        };
        AllSsr.push(SSRCTCM);

        const SSRCTCE = {
          "SSR_Code": "CTCE",
          "Text": leadPassengerEmail,
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
          },
          "SegmentNumber": "A",
        };
        AllSsr.push(SSRCTCE);
      }

      //child part
      let childCount : number = 0;
      for (const childPax of bookingDto?.PassengerInfo?.child) {
        adultCount++;
        childCount++;
        totalCount++;

        const givenname : string = childPax?.givenname?.toUpperCase();
        const surname : string = childPax?.surname?.toUpperCase();
        let gender : string = childPax?.gender?.toUpperCase();
        const dob : string = childPax?.dob;
        const document : string = childPax?.document?.toUpperCase();
        const expiredate : string = childPax?.expiredate;
        const nationality : string = childPax?.nationality?.toUpperCase();

        const cdate = new Date(dob);
        const year = cdate.getFullYear().toString().slice(-2); // Get the last two digits of the year
        const month = cdate.toLocaleString('en-US', { month: 'short' }); // Get the short month name
        const day = cdate.getDate().toString().padStart(2, '0'); // Get the day with leading zero

        const childSSR = `${day}${month}${year}`;
        const cAge = time_now.getFullYear() - cdate.getFullYear();

        let ctitle: string;
        if (gender === 'MALE') {
          gender = 'M';
          ctitle = 'MSTR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          ctitle = 'MISS';
        }

        const Person = {
          "NameNumber": `${totalCount}.1`,
          "GivenName": `${givenname} ${ctitle}`,
          "Surname": surname,
          "Infant": false,
          "PassengerType": `C${String(cAge).padStart(2, '0')}`,
          "NameReference": `C${String(cAge).padStart(2, '0')}`,
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "CHLD",
          "Text": childSSR,
          "PersonName": {
            "NameNumber": `${totalCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);
      }

      //infant part
      let infantCount : number = 0;
      for (const infantPax of bookingDto?.PassengerInfo?.infant) {
        adultCount++;
        infantCount++;
        totalCount++;

        const givenname : string = infantPax?.givenname.toUpperCase();
        const surname : string = infantPax?.surname.toUpperCase();
        let gender : string = infantPax?.gender?.toUpperCase();
        const dob : string = infantPax?.dob;
        const document : string = infantPax.document?.toUpperCase();
        const expiredate : string = infantPax.expiredate;
        const nationality : string = infantPax.nationality.toUpperCase();

        const idate = new Date(dob);
        const year = idate.getFullYear().toString().slice(-2); // Get the last two digits of the year
        const month = idate.toLocaleString('en-US', { month: 'short' }); // Get the short month name
        const day = idate.getDate().toString().padStart(2, '0'); // Get the day with leading zero

        const infantSSR = `${day}${month}${year}`;
        const iAge = Math.ceil(time_now.getFullYear() - idate.getFullYear()) * 12 + (time_now.getMonth() - idate.getMonth());

        let title : string;
        if (gender === 'MALE') {
          gender = 'M';
          title = 'MSTR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          title = 'MISS';
        }

        const Person = {
          "NameNumber": `${totalCount}.1`,
          "GivenName": `${givenname} ${title}`,
          "Surname": surname,
          "Infant": true,
          "PassengerType": "INF",
          "NameReference": `I${String(iAge).padStart(2, '0')}`,
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${infantCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": `${gender}I`,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${infantCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": `${gender}I`,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "INFT",
          "Text": `${givenname}/${surname} ${title}/${infantSSR}`,
          "PersonName": {
            "NameNumber": `${infantCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);
      }

    }else if(adult > 0 && child > 0){
      PaxInfo = [
        {
        Code: 'ADT',
        Quantity: adult.toString(),
      },
      {
        Code: 'C09',
        Quantity: child.toString(),
      }
    ];

      let adultCount : number = 0;
      let childCount : number = 0;

      // Adult Part
      for (const adultPax of bookingDto?.PassengerInfo?.adult) {
        adultCount++;

        const givenname : string = adultPax?.givenname?.toUpperCase();
        const surname : string = adultPax?.surname?.toUpperCase();
        let gender : string = adultPax?.gender?.toUpperCase();
        const dob : string = adultPax?.dob;
        const document : string = adultPax?.document?.toUpperCase();
        const expiredate : string = adultPax?.expiredate;
        const nationality : string = adultPax?.nationality?.toUpperCase();

        let atitle : string;
        if (gender === 'MALE') {
          gender = 'M';
          atitle = 'MR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          atitle = 'MS';
        }

        const Person = {
          "NameNumber": `${adultCount}.1`,
          "GivenName": `${givenname} ${atitle}`,
          "Surname": surname,
          "Infant": false,
          "PassengerType": "ADT",
          "NameReference": "",
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "OTHS",
          "Text": `CC ${givenname} ${givenname}`,
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);

        const SSRCTCM = {
          "SSR_Code": "CTCM",
          "Text": phone, // Make sure Phone is defined
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSRCTCM);

        const SSRCTCE = {
          "SSR_Code": "CTCE",
          "Text": leadPassengerEmail, // Make sure leadPassengerEmail is defined
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSRCTCE);
      }

      // Child Part
      for (const childPax of bookingDto?.PassengerInfo?.child) {
        adultCount++;
        childCount++;

        const givenname : string = childPax?.givenname?.toUpperCase();
        const surname : string = childPax?.surname?.toUpperCase();
        let gender : string = childPax?.gender?.toUpperCase();
        const dob : string = childPax?.dob;
        const document : string = childPax?.document?.toUpperCase();
        const expiredate : string = childPax?.expiredate;
        const nationality : string = childPax?.nationality?.toUpperCase();

        const cdate = new Date(dob);
        const year = cdate.getFullYear().toString().slice(-2); // Get the last two digits of the year
        const month = cdate.toLocaleString('en-US', { month: 'short' }); // Get the short month name
        const day = cdate.getDate().toString().padStart(2, '0'); // Get the day with leading zero

        const childSSR = `${day}${month}${year}`;
        const cAge = time_now.getFullYear() - cdate.getFullYear();

        let ctitle : string;
        if (gender === 'MALE') {
          gender = 'M';
          ctitle = 'MSTR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          ctitle = 'MISS';
        }

        const Person = {
          "NameNumber": `${adultCount}.1`,
          "GivenName": `${givenname} ${ctitle}`,
          "Surname": surname,
          "Infant": false,
          "PassengerType": `C${String(cAge).padStart(2, '0')}`,
          "NameReference": `C${String(cAge).padStart(2, '0')}`,
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "CHLD",
          "Text": childSSR,
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);
      }

    }else if(adult > 0 && infant > 0){
      PaxInfo = [
        {
        Code: 'ADT',
        Quantity: adult.toString(),
      },
      {
        Code: 'INF',
        Quantity: infant.toString(),
      }
    ];

      //Adult Part
      let adultCount : number = 0;
      for (const adultPax of bookingDto?.PassengerInfo?.adult) {
        adultCount++;
        const givenname : string = adultPax?.givenname.toUpperCase();
        const surname : string = adultPax?.surname?.toUpperCase();
        let gender : string = adultPax?.gender?.toUpperCase();
        const dob : string = adultPax?.dob;
        const document : string = adultPax?.document?.toUpperCase();
        const expiredate : string = adultPax?.expiredate;
        const nationality : string = adultPax?.nationality?.toUpperCase();

        let atitle : string;
        if (gender === 'MALE') {
          gender = 'M';
          atitle = 'MR';
        } else if (gender === 'MALE'){
          gender = 'F';
          atitle = 'MS';
        }

        const Person = {
          "NameNumber": `${adultCount}.1`,
          "GivenName": `${givenname} ${atitle}`,
          "Surname": surname,
          "Infant": false,
          "PassengerType": "ADT",
          "NameReference": "",
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "OTHS",
          "Text": `CC ${givenname} ${givenname}`,
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);

        const SSRCTCM = {
          "SSR_Code": "CTCM",
          "Text": phone,
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSRCTCM);

        const SSRCTCE = {
          "SSR_Code": "CTCE",
          "Text": leadPassengerEmail,
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSRCTCE);
      }

      // Infant Part
      let infantCount = 0;
      for (const infantPax of bookingDto?.PassengerInfo?.infant) {
        adultCount++;
        infantCount++;

        const givenname : string = infantPax?.givenname?.toUpperCase();
        const surname : string = infantPax?.surname?.toUpperCase();
        let gender : string = infantPax?.gender?.toUpperCase();
        const dob : string = infantPax?.dob;
        const document : string = infantPax?.document?.toUpperCase();
        const expiredate : string = infantPax?.expiredate;
        const nationality : string = infantPax?.nationality?.toUpperCase();

        const idate = new Date(dob);
        const year = idate.getFullYear().toString().slice(-2); // Get the last two digits of the year
        const month = idate.toLocaleString('en-US', { month: 'short' }); // Get the short month name
        const day = idate.getDate().toString().padStart(2, '0'); // Get the day with leading zero

        const infantSSR = `${day}${month}${year}`;
        const iAge =
          Math.ceil(time_now.getFullYear() - idate.getFullYear()) * 12 + (time_now.getMonth() - idate.getMonth());

        let ititle : string;
        if (gender === 'MALE') {
          gender = 'M';
          ititle = 'MSTR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          ititle = 'MISS';
        }

        const Person = {
          "NameNumber": `${adultCount}.1`,
          "GivenName": `${givenname} ${ititle}`,
          "Surname": surname,
          "Infant": true,
          "PassengerType": "INF",
          "NameReference": `I${String(iAge).padStart(2, '0')}`,
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${infantCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": `${gender}I`,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${infantCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": `${gender}I`,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "INFT",
          "Text": `${givenname}/${surname} ${ititle}/${infantSSR}`,
          "PersonName": {
            "NameNumber": `${infantCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);
      }

    }else{
      PaxInfo = [
        {
        Code: 'ADT',
        Quantity: adult.toString(),
      }
    ];

      let adultCount : number = 0;
      for (const adultPax of bookingDto?.PassengerInfo.adult) {
        adultCount++;

        const givenname : string = adultPax?.givenname?.toUpperCase();
        const surname : string = adultPax?.surname?.toUpperCase();
        let gender : string = adultPax?.gender?.toUpperCase();
        const dob : string = adultPax?.dob;
        const document : string = adultPax?.document?.toUpperCase();
        const expiredate : string = adultPax?.expiredate;
        const nationality : string = adultPax?.nationality?.toUpperCase();

        let atitle : string;
        if (gender === 'MALE') {
          gender = 'M';
          atitle = 'MR';
        } else if (gender === 'FEMALE') {
          gender = 'F';
          atitle = 'MS';
        }

        const Person = {
          "NameNumber": `${adultCount}.1`,
          "GivenName": `${givenname} ${atitle}`,
          "Surname": surname,
          "Infant": false,
          "PassengerType": "ADT",
          "NameReference": "",
        };

        AllPerson.push(Person);

        const AdvPax = {
          "Document": {
            "Number": document,
            "IssueCountry": nationality,
            "NationalityCountry": nationality,
            "ExpirationDate": expiredate,
            "Type": "P",
          },
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "MiddleName": "",
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        AdvancePassenger.push(AdvPax);

        const secureFlightPax = {
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
            "GivenName": givenname,
            "Surname": surname,
            "DateOfBirth": dob,
            "Gender": gender,
          },
          "SegmentNumber": "A",
        };

        SecureFlight.push(secureFlightPax);

        const SSROThers = {
          "SSR_Code": "OTHS",
          "Text": `CC ${givenname} ${givenname}`,
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSROThers);

        const SSRCTCM = {
          "SSR_Code": "CTCM",
          "Text": phone, // Make sure Phone is defined
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSRCTCM);

        const SSRCTCE = {
          "SSR_Code": "CTCE",
          "Text": leadPassengerEmail, // Make sure leadPassengerEmail is defined
          "PersonName": {
            "NameNumber": `${adultCount}.1`,
          },
          "SegmentNumber": "A",
        };

        AllSsr.push(SSRCTCE);
      }

    }

    const flightData = bookingDto.FlightInfo.AllLegsInfo;
    const seatReq : number = adult + child;
    let FlightSegment = [];
    for (let sgFlight of flightData) {
      for (let flight of sgFlight.Segments) {
        const depFrom : string = flight.DepFrom;
        const arrTo : string = flight.ArrTo;
        const depTime : string = flight.DepTime.substr(0, 19);
        const arrTime : string = flight.ArrTime.substr(0, 19);
        const bookingCode : string = flight.SegmentCode.bookingCode;
        const marketingCarrier : string = flight.MarketingCarrier;
        const marketingFlightNumber : string = flight.MarketingFlightNumber;
        const availabilityBreak : boolean = flight.SegmentCode.availabilityBreak;

        let marrigegroup : string ='O';
        if(availabilityBreak === true){
          marrigegroup ='I';
        }

        const singleSegment = {
          DepartureDateTime: depTime,
          ArrivalDateTime: arrTime,
          FlightNumber: marketingFlightNumber.toString(),
          NumberInParty: seatReq.toString(),
          ResBookDesigCode: bookingCode,
          Status: 'NN',
          OriginLocation: {
            LocationCode: depFrom,
          },
          DestinationLocation: {
            LocationCode: arrTo,
          },
          MarketingAirline: {
            Code: marketingCarrier,
            FlightNumber: marketingFlightNumber.toString(),
          },
          MarriageGrp: marrigegroup,
        };

        FlightSegment.push(singleSegment);
      }
    }

    const sabre_booking_request = {
      CreatePassengerNameRecordRQ: {
        targetCity: process.env.SABRE_PCC,
        haltOnAirPriceError: true,
        TravelItineraryAddInfo: {
          AgencyInfo: {
            Address: {
              AddressLine: process.env.AGENCY_NAME,
              CityName: process.env.SABRE_CITY_NAME,
              CountryCode: process.env.SABRE_PCC_COUNTRY,
              PostalCode: process.env.SABRE_POSTAL_CODE,
              StateCountyProv: {
                StateCode: process.env.SABRE_STATE_CODE,
              },
              StreetNmbr: process.env.SABRE_AGENCY_STNO,
            },
            Ticketing: {
              TicketType: "7TAW",
            },
          },
          CustomerInfo: {
            ContactNumbers: {
              ContactNumber: [
                {
                  NameNumber: "1.1",
                  Phone: phone,
                  PhoneUseType: "H",
                },
              ],
            },
            Email:[
              {
                NameNumber: "1.1",
                Address: email,
                Type: "CC",
              }
            ],
            PersonName: AllPerson,
          },
        },
        AirBook: {
          HaltOnStatus: [
            { Code: "HL" },
            { Code: "KK" },
            { Code: "LL" },
            { Code: "NN" },
            { Code: "NO" },
            { Code: "UC" },
            { Code: "US" },
          ],
          OriginDestinationInformation: {
            FlightSegment: FlightSegment,
          },
          RedisplayReservation: {
            NumAttempts: 10,
            WaitInterval: 300,
          },
        },
        AirPrice: [
          {
            PriceRequestInformation: {
              Retain: true,
              OptionalQualifiers: {
                FOP_Qualifiers: {
                  BasicFOP: {
                    Type: "CASH",
                  },
                },
                PricingQualifiers: {
                  PassengerType: PaxInfo,
                },
              },
            },
          },
        ],
        SpecialReqDetails: {
          SpecialService: {
            SpecialServiceInfo: {
              AdvancePassenger: AdvancePassenger,
              SecureFlight: SecureFlight,
              Service: AllSsr,
            },
          },
        },
        PostProcessing: {
          EndTransaction: {
            Source: {
              ReceivedFrom: "API WEB",
            }
          },
          RedisplayReservation: {
            waitInterval: 1000,
          },
        },
      },
    };

    const sabreToken = await this.restToken();
    let sabrebookingrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRBOOKING_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : sabre_booking_request
    };
    
    try {
      const response = await axios.request(sabrebookingrequest);
      const responseDatas = response?.data;
      if(responseDatas?.CreatePassengerNameRecordRS?.ItineraryRef?.ID){
        const responseData = await this.airretrieve(responseDatas?.CreatePassengerNameRecordRS?.ItineraryRef?.ID);
        const bookingPNR = responseDatas?.CreatePassengerNameRecordRS?.ItineraryRef?.ID;
        const airlinesPNR = responseData?.flights?.[0]?.confirmationId;
        return this.bookingService.createBooking(agentdata, bookingPNR, airlinesPNR, bookingDto);
      }else if(responseDatas?.ApplicationResults){
        return{
          "status": "error",
          "error": responseDatas.ApplicationResults,
          "message": "Booking Failed",
        };
      }
    }catch (error) {
      console.error(error);
      throw error;
    }
  }

  async import_pnr(pnr: string, agentdata: AgentModel){

    const getBooking = await this.checkpnr(pnr);

    return getBooking;

    try {
      if (getBooking?.isTicketed === false && getBooking?.fares && getBooking?.journeys) {
        const booking = await this.bookingRepository.find({order: { id: 'DESC' }, take : 1});
    
        let bookingId='KTB1000';
        if(booking.length == 1){
          let old_booking_id = (booking[0].bookingId).replace("KTB",'');
          bookingId = "KTB" + (parseInt(old_booking_id) + 1);
        }

        const rawemail = getBooking?.specialServices?.find(item => item.code === 'CTCE')?.message || '';
        const rawphone = getBooking?.specialServices?.find(item => item.code === 'CTCM')?.message || '';

        if(!rawemail){
          throw new NotFoundException("CTCE Email not found");
        }

        let email : string='';
        if(rawemail != ''){
          const step1 = rawemail.replace(/\/\//g, '@');
          email = step1.replace(/\//g, '');
        }

        let phone : string = '';
        if(!rawphone){
          throw new NotFoundException("CTCM Mobile not found");
        }
        if(rawphone != ''){
          phone = rawphone.replace(/\/\//g,'');
        }

        let adult=0;
        for (const item of getBooking?.travelers) {
          if (item.type === 'ADULT') {
            adult++;
          }
        }
        let child=0;
        for (const item of getBooking?.travelers) {
          if (item.type === 'CHILD') {
            child++;
          }
        }
        let infant=0;
        for (const item of getBooking?.travelers) {
          if (item.type === 'INFANT') {
            infant++;
          }
        }

        const Pricebreakdown = [];
        for (const item of getBooking?.fares) {
          const pax = {
            "PaxType": "ADT",
            "BaseFare": item.totals.subtotal,
            "Taxes": item.totals.taxes,
            "TotalFare": item.totals.total,
            "PaxCount": adult,
            "Bag": [
              {
                "Airline": "",
                "Allowance": {
                  "id": 0,
                  "weight": item.fareConstruction?.[0]?.checkedBaggageAllowance?.totalWeightInKilograms || '',
                  "unit": 'kg'
                }
              }
            ]
          };

          Pricebreakdown.push(pax);
        };

        const timelimitText = getBooking?.specialServices?.find(item => item.code === 'ADTK')?.message || '';
        const currentDate = new Date();
        let timelimit: string;
        if(timelimitText){
          timelimit = new Date(currentDate.getTime() + 30 * 60000).toLocaleString();
        }

        let TripType: string;
        if(getBooking?.journeys.length == 1){
          TripType = 'Oneway';
        }else if(getBooking?.journeys.length == 2){
          TripType = 'Return';
        }else{
          TripType = 'Multicity';
        }

        const itenary= {
          "System": "Sabre",
          "PriceBreakDown": Pricebreakdown
        };

        const bookingData = {
          agentId: agentdata.agentId,
          bookingId: bookingId,
          system: 'Sabre',
          carrier_name: getBooking?.flights[0]?.airlineName || '',
          carrier_code: getBooking?.flights[0]?.airlineCode || '',
          depfrom: getBooking?.journeys[0]?.firstAirportCode ||'',
          pnr: pnr,
          airlinespnr:  getBooking?.flights[0]?.confirmationId,
          refundable: getBooking?.fareRules[0].isRefundable || false,
          arrto: getBooking?.journeys[0]?.lastAirportCode ||'',
          triptype: TripType,
          netfare: getBooking?.payments?.flightTotals[0].total || 0,
          grossfare: getBooking?.payments?.flightTotals[0].total || 0,
          status: "Hold",
          name: getBooking?.travelers[0]?.identityDocuments[0].givenName+' '+getBooking?.travelers[0]?.identityDocuments[0].surname ||'',
          email: email || 'N/A',
          phone: phone || 'N/A',
          adultcount: adult,
          childcount: child,
          infantcount: infant,
          totalpax: adult + child +infant,
          timelimit: timelimit || 'N/F',
          itenary: itenary,
          flightdata: getBooking?.flights,
          flightdate: getBooking?.journeys[0]?.departureDate ||'',
          companyname: agentdata.company
        }

        const passengerData = getBooking?.travelers;
        await this.bookingRepository.save(bookingData);
        await this.passengerService.createBookingPaxForImport(agentdata.agentId, bookingId, passengerData);
        const bookingdatas = await this.bookingRepository.findOne({where: { bookingId: bookingId}});
        return bookingdatas;
      }else{
        return{
          "status": "error",
          "error": 'PNR Cannot Import Failed',
          "message": "Fares may be not loaded or segment notavailable or already ticketd",
        };
      }
    }catch (error) {
      console.error(error);
      throw error;
    }
  }

  async aircancel(pnr : string){

    const payload = {
      "confirmationId": pnr,
      "retrieveBooking": true,
      "cancelAll": true,
      "errorHandlingPolicy": "ALLOW_PARTIAL_CANCEL"
    };

    
    const sabreToken = await this.restToken(); 

    let sabrecancelrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRCANCEL_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Conversation-ID': '2021.01.DevStudio', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : payload
    };
  
    try {
      const aircancel_response = await axios.request(sabrecancelrequest);
      const CancelResponse = aircancel_response.data;
      return CancelResponse;
    }catch (error) {
      console.error(error);
      throw error;
    }
    
  }

  async airretrieve(pnr: string){
    const payload ={
      confirmationId: pnr
    };

    
    const sabreToken = await this.restToken();

    let sabreflightrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRRETRIEVE_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Conversation-ID': '2021.01.DevStudio', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : payload
    };
  
      try {
        const get_booking_response = await axios.request(sabreflightrequest);
        return get_booking_response.data;
      }catch (error) {
        console.error(error);
        throw error;
      }

  }

  async checkpnr(pnr: string){

    const payload ={
      confirmationId: pnr
    };

    
    const sabreToken = await this.restToken();

    let sabreflightrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRRETRIEVE_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Conversation-ID': '2021.01.DevStudio', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : payload
    };
  
      try {
        const get_booking_response = await axios.request(sabreflightrequest);
        return get_booking_response.data;
      }catch (error) {
        console.error(error);
        throw error;
      }

  }

  async airticketing(BookingData){

    const adult = BookingData.adultcount;
    const child = BookingData.childcount;
    const infant = BookingData.infantcount;
    const pnr = BookingData.pnr;

    let passengerArray = [];

    if (adult > 0 && child > 0 && infant > 0) {

      passengerArray=[{ Number: 1 }, { Number: 2 }, { Number: 3 }];

    } else if (adult > 0 && child == 0) {
      passengerArray=[{ Number: 1 }];
    } else if (adult > 0 && child > 0) {
      passengerArray=[{ Number: 1 }, { Number: 2 }];
    } else if (adult > 0 && infant > 0) {
      passengerArray=[{ Number: 1 }, { Number: 2 }];
    }

    const payload = {
      "AirTicketRQ":{
        "version":"1.3.0",
        "targetCity": process.env.SABRE_PCC,
        "DesignatePrinter":{
            "Printers":{
              "Ticket":{
                  "CountryCode": process.env.SABRE_PCC_COUNTRY
              },
              "Hardcopy":{
                  "LNIATA": process.env.SABRE_LNIATA
              },
              "InvoiceItinerary":{
                  "LNIATA": process.env.SABRE_LNIATA
              }
            }
        },
        "Itinerary":{
            "ID": pnr
        },
        "Ticketing":[
            {
              "MiscQualifiers":{
                  "Commission":{
                    "Percent":7
                  }
              },
              "PricingQualifiers": {
                "PriceQuote": [
                  {
                    "Record": passengerArray
                  }
                ]
              }
            }         
        ],
        "PostProcessing":{
            "EndTransaction":{
              "Source":{
                  "ReceivedFrom":"SABRE WEB"
              }
            }
        }
      }
    };

    const sabreToken = await this.restToken(); 

    let sabreissuerequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRTICKETING_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Conversation-ID': '2021.01.DevStudio', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : payload
    };
  
      try {
        const ticketing_response = await axios.request(sabreissuerequest);
        const get_ticket_data = ticketing_response.data;

       // console.log(JSON.stringify(get_ticket_data))
        if(get_ticket_data.AirTicketRS.Summary){

          const allticket_data = [];
          const extractedData = get_ticket_data.AirTicketRS.Summary.map((item) => {
            const givenName = item.FirstName;
            const surname = item.LastName;
            const ticketNumber = item.DocumentNumber;
            const ticketCopy = `${givenName}/${surname}-${ticketNumber}`;
            allticket_data.push(ticketCopy);

          });

          BookingData['ticketcopy'] = allticket_data.join(' ,');
          BookingData['ticketed_at'] = get_ticket_data.AirTicketRS.Summary[0].LocalIssueDateTime; 
          BookingData['status'] = 'Ticketed';

          await this.bookingRepository.update(BookingData.id, BookingData);
          return get_ticket_data;

        }

        return get_ticket_data;

      }catch (error) {
        console.error(error);
        throw error;
      }
    
  }

  async airvoid(pnr : string){
    const payload ={
      confirmationId: pnr,
      "retrieveBooking": true,
      "cancelAll": true,
      "flightTicketOperation": "VOID",
      "errorHandlingPolicy": "HALT_ON_ERROR"
    };

    
    const sabreToken = await this.restToken(); 

    let sabrevoidrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SABRE_AIRVOID_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json', 
        'Conversation-ID': '2021.01.DevStudio', 
        'Authorization': `Bearer ${sabreToken}`, 
      },
      data : payload
    };
  
      try {
        const void_response = await axios.request(sabrevoidrequest);
        const voidreponse = void_response.data;
        return voidreponse;
      }catch (error) {
        console.error(error);
        throw error;
      }
    
  }
}
