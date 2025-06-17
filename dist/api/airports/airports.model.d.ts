export declare class AirportsModel {
    id: number;
    iata: string;
    icao: string;
    name: string;
    city_code: string;
    country_code: string;
    timezone: string;
    utc: string;
    latitude: number;
    longitude: number;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class AirportsModelUpdate {
    iata: string;
    icao: string;
    name: string;
    city_code: string;
    country_code: string;
    timezone: string;
    utc: string;
    latitude: number;
    longitude: number;
}
