import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { URL } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PublicService {
  constructor(private http: HttpClient) {}

  GetAirlinesByPrefix(city: any) {
    return this.http.get(`${URL}/publicservices/GetAirlinesByPrefix/${city}`);
  }

  GetFullAirlineName(airlineCode: any) {
    return this.http.get(
      `${URL}/publicservices/GetFullAirlineName/${airlineCode}`
    );
  }

  GetAirportByIata(iata: any) {
    return this.http.get(`${URL}/publicservices/GetAirportByIata/${iata}`);
  }

  GetAirportsByPrefix(prefix:string) {    
    return this.http.get(`${URL}/publicservices/GetAirportsByPrefix/${prefix}`);
  }

  logo(id: any) {
    return this.http.get(`${URL}/publicservices/images/logo/${id}`);
  }

  waitscreen(id: any) {
    return this.http.get(`${URL}/publicservices/images/waitscreen/${id}`);
  }

  airlineImage(code: any) {
    return this.http.get(`${URL}/publicservices​/images​/airline​/${code}`);
  }
}
