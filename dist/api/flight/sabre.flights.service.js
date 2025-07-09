"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SabreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("axios");
const base64 = require("base-64");
const dotenv = require("dotenv");
const typeorm_2 = require("typeorm");
const passenger_service_1 = require("../passenger/passenger.service");
const booking_model_1 = require("../booking/booking.model");
const booking_service_1 = require("../booking/booking.service");
const sabre_flight_utils_1 = require("./sabre.flight.utils");
const searchhistory_service_1 = require("../searchhistory/searchhistory.service");
dotenv.config();
let SabreService = class SabreService {
    constructor(bookingRepository, passengerService, bookingService, sabreUtils, searchHistoryService) {
        this.bookingRepository = bookingRepository;
        this.passengerService = passengerService;
        this.bookingService = bookingService;
        this.sabreUtils = sabreUtils;
        this.searchHistoryService = searchHistoryService;
    }
    async restToken() {
        const client_id_raw = `V1:${process.env.SABRE_ID}:${process.env.SABRE_PCC}:AA`;
        const client_id = base64.encode(client_id_raw);
        const client_secret = base64.encode(process.env.SABRE_PASSWORD);
        const token = base64.encode(`${client_id}:${client_secret}`);
        const data = 'grant_type=client_credentials';
        const headers = {
            Authorization: `Basic ${token}`,
            Accept: '/',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        try {
            const response = await axios_1.default.post(process.env.SABRE_AUTH_ENDPOINT, data, { headers });
            const result = response?.data;
            return result['access_token'];
        }
        catch (err) {
            console.log(err);
        }
    }
    async shopping(agentdata, flightDto) {
        let adultCount = flightDto?.adultcount || 1;
        let childCount = flightDto?.childcount || 0;
        let infantCount = flightDto?.infantcount || 0;
        let cabinclass = flightDto.cabinclass;
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
                Code: "C09",
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
                    AllAirports: true
                },
                TPA_Extensions: {}
            };
            SegmentList.push(SingleSegment);
        }
        const sabreToken = await this.restToken();
        let payload_data = {
            "OTA_AirLowFareSearchRQ": {
                "Version": "5",
                "POS": {
                    "Source": [
                        {
                            "PseudoCityCode": process.env.SABRE_PCC,
                            "RequestorID": {
                                "Type": "1",
                                "ID": "1",
                                "CompanyName": {
                                    "Code": "TN"
                                }
                            }
                        }
                    ]
                },
                "OriginDestinationInformation": SegmentList,
                "TravelPreferences": {
                    "TPA_Extensions": {
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
                    ]
                },
                "TPA_Extensions": {
                    "IntelliSellTransaction": {
                        "RequestType": {
                            "Name": "50ITINS"
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
            data: payload_data
        };
        try {
            const response = await axios_1.default.request(shoppingrequest);
            return await this.sabreUtils.restBFMParser(agentdata, response?.data);
        }
        catch (error) {
            return error?.response?.data;
        }
    }
    async revalidation(agentdata, revalidationDto) {
        let AdultCount = 0;
        let ChildCount = 0;
        let InfantCount = 0;
        const PriceBreakDown = revalidationDto.PriceBreakDown;
        for (const pricebreakdown of PriceBreakDown) {
            if (pricebreakdown.PaxType === 'ADT') {
                AdultCount = pricebreakdown.PaxCount;
            }
            else if (pricebreakdown.PaxType === 'C09') {
                ChildCount = pricebreakdown.PaxCount;
            }
            else if (pricebreakdown.PaxType === 'INF') {
                InfantCount = pricebreakdown.PaxCount;
            }
            else {
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
                Code: "C09",
                Quantity: ChildCount,
            });
        }
        if (InfantCount > 0) {
            SabreRequestPax.push({
                Code: "INF",
                Quantity: InfantCount,
            });
        }
        let SeatReq = AdultCount + ChildCount;
        const RequestArray = [];
        const AllSegments = revalidationDto.AllLegsInfo;
        for (const segments of AllSegments) {
            for (let i = 0; i < segments.Segments.length; i++) {
                const segment = segments.Segments[i];
                const MarketingCarrier = segment.MarketingCarrier;
                const MarketingFlightNumber = segment.MarketingFlightNumber;
                const OperatingCarrier = segment.OperatingCarrier;
                const DepFrom = segment.DepFrom;
                const ArrTo = segment.ArrTo;
                const DepTime = segment.DepTime.slice(0, 19);
                const ArrTime = segment.ArrTime.slice(0, 19);
                const BookingCode = segment.SegmentCode.bookingCode;
                const MultiRequest = {
                    RPH: String(i + 1),
                    DepartureDateTime: DepTime,
                    OriginLocation: {
                        LocationCode: DepFrom,
                    },
                    DestinationLocation: {
                        LocationCode: ArrTo,
                    },
                    TPA_Extensions: {
                        SegmentType: {
                            Code: "O",
                        },
                        Flight: [
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
                            },
                        ],
                    },
                };
                RequestArray.push(MultiRequest);
            }
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
                    SeatsRequested: [SeatReq],
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
                OriginDestinationInformation: RequestArray,
                TPA_Extensions: {
                    IntelliSellTransaction: {
                        RequestType: {
                            Name: "100ITINS",
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
            data: sabre_revalidation_request_data
        };
        try {
            const revalidation_response = await axios_1.default.request(sabreflightrequest);
            const RevalidationResponse = revalidation_response.data;
            return RevalidationResponse;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async price_check(agentdata, revalidationDto) {
        let AdultCount = 0;
        let ChildCount = 0;
        let InfantCount = 0;
        const PriceBreakDown = revalidationDto?.PriceBreakDown;
        for (const pricebreakdown of PriceBreakDown) {
            if (pricebreakdown.PaxType === 'ADT') {
                AdultCount = pricebreakdown.PaxCount;
            }
            else if (pricebreakdown.PaxType === 'C09') {
                ChildCount = pricebreakdown.PaxCount;
            }
            else if (pricebreakdown.PaxType === 'INF') {
                InfantCount = pricebreakdown.PaxCount;
            }
            else {
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
                Code: "C09",
                Quantity: ChildCount,
            });
        }
        if (InfantCount > 0) {
            SabreRequestPax.push({
                Code: "INF",
                Quantity: InfantCount,
            });
        }
        let SeatReq = AdultCount + ChildCount;
        const RequestArray = [];
        const AllSegments = revalidationDto.AllLegsInfo;
        for (const segments of AllSegments) {
            for (let i = 0; i < segments.Segments.length; i++) {
                const segment = segments.Segments[i];
                const MarketingCarrier = segment.MarketingCarrier;
                const MarketingFlightNumber = segment.MarketingFlightNumber;
                const OperatingCarrier = segment.OperatingCarrier;
                const DepFrom = segment.DepFrom;
                const ArrTo = segment.ArrTo;
                const DepTime = segment.DepTime.slice(0, 19);
                const ArrTime = segment.ArrTime.slice(0, 19);
                const BookingCode = segment.SegmentCode.bookingCode;
                const MultiRequest = {
                    RPH: String(i + 1),
                    DepartureDateTime: DepTime,
                    OriginLocation: {
                        LocationCode: DepFrom,
                    },
                    DestinationLocation: {
                        LocationCode: ArrTo,
                    },
                    TPA_Extensions: {
                        SegmentType: {
                            Code: "O",
                        },
                        Flight: [
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
                            },
                        ],
                    },
                };
                RequestArray.push(MultiRequest);
            }
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
                    SeatsRequested: [SeatReq],
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
                OriginDestinationInformation: RequestArray,
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
            data: sabre_revalidation_request_data
        };
        try {
            const response = await axios_1.default.request(sabreflightrequest);
            return await this.sabreUtils.restBFMParser(agentdata, response?.data);
        }
        catch (error) {
            throw error;
        }
    }
    async booking(agentdata, bookingDto) {
        const priceCheck = await this.price_check(agentdata, bookingDto.FlightInfo);
        if (priceCheck[0].IsBookable === false) {
            return this.bookingService.createBooking(agentdata, '', bookingDto, priceCheck[0]);
        }
        const time_now = new Date();
        const email = bookingDto.ContactInfo.email || "dev@flyjatt.com";
        const leadPassengerEmail = email.replace("@", "//");
        const phone = bookingDto.ContactInfo.phone || "08801685370455";
        const adult = (bookingDto.PassengerInfo.adult).length;
        const child = (bookingDto.PassengerInfo.child).length || 0;
        const infant = (bookingDto.PassengerInfo.infant).length || 0;
        let AllPerson = [];
        let AdvancePassenger = [];
        let SecureFlight = [];
        let AllSsr = [];
        let PaxInfo = [];
        if (adult > 0 && child > 0 && infant > 0) {
            PaxInfo = [
                {
                    Code: 'ADT',
                    Quantity: adult.toString()
                },
                {
                    Code: 'C09',
                    Quantity: child.toString()
                },
                {
                    Code: 'INF',
                    Quantity: infant.toString()
                }
            ];
            let adultCount = 0;
            let totalCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo?.adult) {
                adultCount++;
                totalCount++;
                const givenname = adultPax?.givenname.toUpperCase();
                const surname = adultPax?.surname.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let title;
                if (gender === 'MALE') {
                    gender = 'M';
                    title = 'MR';
                }
                else if (gender === 'FEMALE') {
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
            let childCount = 0;
            for (const childPax of bookingDto?.PassengerInfo?.child) {
                adultCount++;
                childCount++;
                totalCount++;
                const givenname = childPax?.givenname?.toUpperCase();
                const surname = childPax?.surname?.toUpperCase();
                let gender = childPax?.gender?.toUpperCase();
                const dob = childPax?.dob;
                const document = childPax?.document?.toUpperCase();
                const expiredate = childPax?.expiredate;
                const nationality = childPax?.nationality?.toUpperCase();
                const cdate = new Date(dob);
                const year = cdate.getFullYear().toString().slice(-2);
                const month = cdate.toLocaleString('en-US', { month: 'short' });
                const day = cdate.getDate().toString().padStart(2, '0');
                const childSSR = `${day}${month}${year}`;
                const cAge = time_now.getFullYear() - cdate.getFullYear();
                let ctitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    ctitle = 'MSTR';
                }
                else if (gender === 'FEMALE') {
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
            let infantCount = 0;
            for (const infantPax of bookingDto?.PassengerInfo?.infant) {
                adultCount++;
                infantCount++;
                totalCount++;
                const givenname = infantPax?.givenname.toUpperCase();
                const surname = infantPax?.surname.toUpperCase();
                let gender = infantPax?.gender?.toUpperCase();
                const dob = infantPax?.dob;
                const document = infantPax.document?.toUpperCase();
                const expiredate = infantPax.expiredate;
                const nationality = infantPax.nationality.toUpperCase();
                const idate = new Date(dob);
                const year = idate.getFullYear().toString().slice(-2);
                const month = idate.toLocaleString('en-US', { month: 'short' });
                const day = idate.getDate().toString().padStart(2, '0');
                const infantSSR = `${day}${month}${year}`;
                const iAge = Math.ceil(time_now.getFullYear() - idate.getFullYear()) * 12 + (time_now.getMonth() - idate.getMonth());
                let title;
                if (gender === 'MALE') {
                    gender = 'M';
                    title = 'MSTR';
                }
                else if (gender === 'FEMALE') {
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
        }
        else if (adult > 0 && child > 0) {
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
            let adultCount = 0;
            let childCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo?.adult) {
                adultCount++;
                const givenname = adultPax?.givenname?.toUpperCase();
                const surname = adultPax?.surname?.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let atitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    atitle = 'MR';
                }
                else if (gender === 'FEMALE') {
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
            for (const childPax of bookingDto?.PassengerInfo?.child) {
                adultCount++;
                childCount++;
                const givenname = childPax?.givenname?.toUpperCase();
                const surname = childPax?.surname?.toUpperCase();
                let gender = childPax?.gender?.toUpperCase();
                const dob = childPax?.dob;
                const document = childPax?.document?.toUpperCase();
                const expiredate = childPax?.expiredate;
                const nationality = childPax?.nationality?.toUpperCase();
                const cdate = new Date(dob);
                const year = cdate.getFullYear().toString().slice(-2);
                const month = cdate.toLocaleString('en-US', { month: 'short' });
                const day = cdate.getDate().toString().padStart(2, '0');
                const childSSR = `${day}${month}${year}`;
                const cAge = time_now.getFullYear() - cdate.getFullYear();
                let ctitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    ctitle = 'MSTR';
                }
                else if (gender === 'FEMALE') {
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
        }
        else if (adult > 0 && infant > 0) {
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
            let adultCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo?.adult) {
                adultCount++;
                const givenname = adultPax?.givenname.toUpperCase();
                const surname = adultPax?.surname?.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let atitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    atitle = 'MR';
                }
                else if (gender === 'MALE') {
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
            let infantCount = 0;
            for (const infantPax of bookingDto?.PassengerInfo?.infant) {
                adultCount++;
                infantCount++;
                const givenname = infantPax?.givenname?.toUpperCase();
                const surname = infantPax?.surname?.toUpperCase();
                let gender = infantPax?.gender?.toUpperCase();
                const dob = infantPax?.dob;
                const document = infantPax?.document?.toUpperCase();
                const expiredate = infantPax?.expiredate;
                const nationality = infantPax?.nationality?.toUpperCase();
                const idate = new Date(dob);
                const year = idate.getFullYear().toString().slice(-2);
                const month = idate.toLocaleString('en-US', { month: 'short' });
                const day = idate.getDate().toString().padStart(2, '0');
                const infantSSR = `${day}${month}${year}`;
                const iAge = Math.ceil(time_now.getFullYear() - idate.getFullYear()) * 12 + (time_now.getMonth() - idate.getMonth());
                let ititle;
                if (gender === 'MALE') {
                    gender = 'M';
                    ititle = 'MSTR';
                }
                else if (gender === 'FEMALE') {
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
        }
        else {
            PaxInfo = [
                {
                    Code: 'ADT',
                    Quantity: adult.toString(),
                }
            ];
            let adultCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo.adult) {
                adultCount++;
                const givenname = adultPax?.givenname?.toUpperCase();
                const surname = adultPax?.surname?.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let atitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    atitle = 'MR';
                }
                else if (gender === 'FEMALE') {
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
        }
        const flightData = bookingDto.FlightInfo.AllLegsInfo;
        const seatReq = adult + child;
        let FlightSegment = [];
        for (let sgFlight of flightData) {
            for (let flight of sgFlight.Segments) {
                const depFrom = flight.DepFrom;
                const arrTo = flight.ArrTo;
                const depTime = flight.DepTime.substr(0, 19);
                const arrTime = flight.ArrTime.substr(0, 19);
                const bookingCode = flight.SegmentCode.bookingCode;
                const marketingCarrier = flight.MarketingCarrier;
                const marketingFlightNumber = flight.MarketingFlightNumber;
                const availabilityBreak = flight.SegmentCode.availabilityBreak;
                let marrigegroup = 'O';
                if (availabilityBreak === true) {
                    marrigegroup = 'I';
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
                        Email: [
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
                        },
                        Email: {
                            Ind: true
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
            data: sabre_booking_request
        };
        try {
            const response = await axios_1.default.request(sabrebookingrequest);
            return this.bookingService.createBooking(agentdata, response?.data, bookingDto, priceCheck[0]);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async import_pnr(pnr, agentdata) {
        const getBooking = await this.checkpnr(pnr);
        try {
            if (getBooking?.isTicketed === false && getBooking?.fares && getBooking?.journeys) {
                const booking = await this.bookingRepository.find({ order: { id: 'DESC' }, take: 1 });
                let bookingId = 'KTB1000';
                if (booking.length == 1) {
                    let old_booking_id = (booking[0].bookingId).replace("KTB", '');
                    bookingId = "KTB" + (parseInt(old_booking_id) + 1);
                }
                const rawemail = getBooking?.specialServices?.find(item => item.code === 'CTCE')?.message || '';
                const rawphone = getBooking?.specialServices?.find(item => item.code === 'CTCM')?.message || '';
                if (!rawemail) {
                    throw new common_1.NotFoundException("CTCE Email not found");
                }
                let email = '';
                if (rawemail != '') {
                    const step1 = rawemail.replace(/\/\//g, '@');
                    email = step1.replace(/\//g, '');
                }
                let phone = '';
                if (!rawphone) {
                    throw new common_1.NotFoundException("CTCM Mobile not found");
                }
                if (rawphone != '') {
                    phone = rawphone.replace(/\/\//g, '');
                }
                let adult = 0;
                for (const item of getBooking?.travelers) {
                    if (item.type === 'ADULT') {
                        adult++;
                    }
                }
                let child = 0;
                for (const item of getBooking?.travelers) {
                    if (item.type === 'CHILD') {
                        child++;
                    }
                }
                let infant = 0;
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
                }
                ;
                const timelimitText = getBooking?.specialServices?.find(item => item.code === 'ADTK')?.message || '';
                const currentDate = new Date();
                let timelimit;
                if (timelimitText) {
                    timelimit = new Date(currentDate.getTime() + 30 * 60000).toLocaleString();
                }
                let TripType;
                if (getBooking?.journeys.length == 1) {
                    TripType = 'Oneway';
                }
                else if (getBooking?.journeys.length == 2) {
                    TripType = 'Return';
                }
                else {
                    TripType = 'Multicity';
                }
                const itenary = {
                    "System": "Sabre",
                    "PriceBreakDown": Pricebreakdown
                };
                const bookingData = {
                    agentId: agentdata.agentId,
                    bookingId: bookingId,
                    system: 'Sabre',
                    carrier_name: getBooking?.flights[0]?.airlineName || '',
                    carrier_code: getBooking?.flights[0]?.airlineCode || '',
                    depfrom: getBooking?.journeys[0]?.firstAirportCode || '',
                    pnr: pnr,
                    airlinespnr: getBooking?.flights[0]?.confirmationId,
                    refundable: getBooking?.fareRules[0].isRefundable || false,
                    arrto: getBooking?.journeys[0]?.lastAirportCode || '',
                    triptype: TripType,
                    netfare: getBooking?.payments?.flightTotals[0].total || 0,
                    grossfare: getBooking?.payments?.flightTotals[0].total || 0,
                    status: "Hold",
                    name: getBooking?.travelers[0]?.identityDocuments[0].givenName + ' ' + getBooking?.travelers[0]?.identityDocuments[0].surname || '',
                    email: email || 'N/A',
                    phone: phone || 'N/A',
                    adultcount: adult,
                    childcount: child,
                    infantcount: infant,
                    totalpax: adult + child + infant,
                    timelimit: timelimit || 'N/F',
                    itenary: itenary,
                    flightdata: getBooking?.flights,
                    flightdate: getBooking?.journeys[0]?.departureDate || '',
                    companyname: agentdata.company
                };
                const passengerData = getBooking?.travelers;
                await this.bookingRepository.save(bookingData);
                await this.passengerService.createBookingPaxForImport(agentdata.agentId, bookingId, passengerData);
                const bookingdatas = await this.bookingRepository.findOne({ where: { bookingId: bookingId } });
                return bookingdatas;
            }
            else {
                return {
                    "status": "error",
                    "error": 'PNR Cannot Import Failed',
                    "message": "Fares may be not loaded or segment notavailable or already ticketd",
                };
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async aircancel(pnr) {
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
            data: payload
        };
        try {
            const aircancel_response = await axios_1.default.request(sabrecancelrequest);
            const CancelResponse = aircancel_response.data;
            return CancelResponse;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airretrieve(pnr) {
        const payload = {
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
            data: payload
        };
        try {
            const get_booking_response = await axios_1.default.request(sabreflightrequest);
            return get_booking_response.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async checkpnr(pnr) {
        const payload = {
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
            data: payload
        };
        try {
            const get_booking_response = await axios_1.default.request(sabreflightrequest);
            return get_booking_response.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airticketing(BookingData) {
        const adult = BookingData.adultcount;
        const child = BookingData.childcount;
        const infant = BookingData.infantcount;
        const pnr = BookingData.pnr;
        let passengerArray = [];
        if (adult > 0 && child > 0 && infant > 0) {
            passengerArray = [{ Number: 1 }, { Number: 2 }, { Number: 3 }];
        }
        else if (adult > 0 && child == 0) {
            passengerArray = [{ Number: 1 }];
        }
        else if (adult > 0 && child > 0) {
            passengerArray = [{ Number: 1 }, { Number: 2 }];
        }
        else if (adult > 0 && infant > 0) {
            passengerArray = [{ Number: 1 }, { Number: 2 }];
        }
        const payload = {
            "AirTicketRQ": {
                "version": "1.3.0",
                "targetCity": process.env.SABRE_PCC,
                "DesignatePrinter": {
                    "Printers": {
                        "Ticket": {
                            "CountryCode": process.env.SABRE_PCC_COUNTRY
                        },
                        "Hardcopy": {
                            "LNIATA": process.env.SABRE_LNIATA
                        },
                        "InvoiceItinerary": {
                            "LNIATA": process.env.SABRE_LNIATA
                        }
                    }
                },
                "Itinerary": {
                    "ID": pnr
                },
                "Ticketing": [
                    {
                        "MiscQualifiers": {
                            "Commission": {
                                "Percent": 7
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
                "PostProcessing": {
                    "EndTransaction": {
                        "Source": {
                            "ReceivedFrom": "SABRE WEB"
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
            data: payload
        };
        try {
            const ticketing_response = await axios_1.default.request(sabreissuerequest);
            const get_ticket_data = ticketing_response.data;
            if (get_ticket_data.AirTicketRS.Summary) {
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
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airvoid(pnr) {
        const payload = {
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
            data: payload
        };
        try {
            const void_response = await axios_1.default.request(sabrevoidrequest);
            const voidreponse = void_response.data;
            return voidreponse;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.SabreService = SabreService;
exports.SabreService = SabreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        passenger_service_1.PassengerService,
        booking_service_1.BookingService,
        sabre_flight_utils_1.SabreUtils,
        searchhistory_service_1.SearchhistoryService])
], SabreService);
//# sourceMappingURL=sabre.flights.service.js.map