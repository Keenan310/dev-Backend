declare class ContactInfoModel {
    email: string;
    phone: string;
}
declare class PaxModel {
    givenname: string;
    surname: string;
    gender: string;
    dob: Date;
    document: string;
    expiredate: Date;
    nationality: string;
}
declare class PassengerInfoModel {
    adult: PaxModel[];
    child: [];
    infant: [];
}
export declare class AirBookingModel {
    ContactInfo: ContactInfoModel;
    PassengerInfo: PassengerInfoModel;
    FlightInfo: any;
}
export {};
