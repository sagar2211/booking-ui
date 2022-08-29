import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { URL } from "../../environments/environment";
import * as _ from "lodash";
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  Subject,
  throwError,
} from "rxjs";
import { isEmpty } from "lodash";

@Injectable({
  providedIn: "root",
})
export class AvailableFaresService {
  public filterFlight$: Subject<any> = new Subject();
  public currentSort$: BehaviorSubject<any> = new BehaviorSubject("recommended");
  public flight$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentTripType$: BehaviorSubject<any> = new BehaviorSubject(null);
  public dailogData$: BehaviorSubject<any> = new BehaviorSubject(null);
  dailogData: any;
  constructor(private http: HttpClient) { }
  flightData: any = {};
  headers = new HttpHeaders()
    .set("Access-Control-Allow-Origin", "*")
    .set( "Access-Control-Allow-Methods",
      " GET, POST, PATCH, PUT, DELETE, OPTIONS" )
    .set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token")
    .set( "Content-Type",
          "application/x-www-form-urlencoded, multipart/form-data, text/plain" );

  public updateFlights(value: any) {
    if (value.length) {
      this.filterFlight$.next(value);
    } else {
      let msg = "Flight not found.";
      this.filterFlight$.next(msg);
    }
  }

  public updateDailogData(value: any) {
    this.dailogData = value;
    this.dailogData$.next(value);
  }

  getDialogData(){
    return this.dailogData;
  }

  public updateCurrentSort(value: any) {
    this.currentSort$.next(value);
  }

  public filghtData(values: any) {
    this.flight$.next(values);
  }

  public updateTripType(values: any) {
    this.currentTripType$.next(values);
  }

  searchFlight(req: any): Observable<any> {
    if (!isEmpty(this.flightData)) {
      return of(this.flightData);
    }
    return this.http.post(`${URL}/availablefares/search`, req).pipe(
      map((res: any) => {
        if (res.Result.result.fareSearchResult.fares.length) {

          this.flightData = res;
          return res;
        } else {
          return (res = []);
        }
      }));
  }

  ancillaries(req: any) {
    return this.http.post(`${URL}/availablefares/get/ancillaries`, req);
  }

  ruleinformationtext(req: any) {
    return this.http.post(`${URL}/availablefares/get/ruleinformationtext`, req);
  }

  flightdetails(req: any) {
    return this.http.post(`${URL}/availablefares/get/flightdetails`, req);
  }

  submitbooking(req: any) {
    return this.http.post(`${URL}/availablefares/submitbooking`, req);
  }

  getFilghtData(): Observable<any> {
    return this.flightData;
  }
}
