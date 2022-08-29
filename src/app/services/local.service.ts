import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, Subject } from "rxjs";
import { URL } from "../../environments/environment";
import { SUBSCRIPTION_URL } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";
import * as _ from "lodash";

var travellers: any = {
  adult: 0,
  child: 0,
  infant: 0,
};
@Injectable({
  providedIn: "root",
})
export class LocalService {
  obj: any;
  noOfTravellors: any;
  public travellers$: Subject<boolean> = new Subject();
  public spinner$: BehaviorSubject<any> = new BehaviorSubject(false);
  public serviceArray$: BehaviorSubject<any> = new BehaviorSubject(null);
  public serviceTotalPrice$: Subject<any> = new Subject();
  profilePic = new BehaviorSubject<any>(null);
  public extraServices$ = new BehaviorSubject<any>(null);
  public ipAddress: BehaviorSubject<any> = new BehaviorSubject(null);
  public location: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient,
    private authService: AuthenticationService) { }

  getTravellers() {
    return travellers;
  }

  getIPAddress() {
    fetch('https://jsonip.com', { mode: 'cors' })
      .then((resp) => resp.json())
      .then((ip) => {
        this.ipAddress.next(ip);
      });
  }

  getLocation() {
    fetch('https://api.ipregistry.co/?key=tryout')
      .then((response) => {
        return response.json();
      })
      .then((payload) => {
        this.location.next(payload.location)
      });
  }

  setSubscription(email: any) {
    return this.http.post(`${SUBSCRIPTION_URL}/subscribe-news`, email).pipe(
      map((res: any) => {
        return res;
      }) 
    );
  }

  setValue(value: number) {
    let values: Array<object> = [];
    for (let i = 0; i < value; i++) {
      values.push({});
    }
    return values;
  }

  setSpinner(val: boolean) {
    this.spinner$.next(val);
  }

  updateExtraServices(serviceData?: any) {
    localStorage.setItem('extraServices', JSON.stringify(serviceData));
  }

  updateServiceArray(serviceArray: any) {
    this.serviceArray$.next(serviceArray);
  }

  updateSelectedAncServcPrice(price: any) {
    this.serviceTotalPrice$.next(price);
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return msg;

  }

  // Sign-up
  newsLetterForm(user: any): Observable<any> {
    let api = `${URL}/newsletter/subscribe-news`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  //get product from hepstar
  getProduct(travellerInfo: any): Observable<any> {
    let api = `${URL}/hepstar/getProduct`;
    return this.http.post(api, travellerInfo).pipe(catchError(this.handleError));
  }

  //purchase product from hepstar
  purchaseProduct(data: any): Observable<any> {
    let api = `${URL}/hepstar/purchaseProduct`;
    return this.http.post(api, data).pipe(catchError(this.handleError));
  }
}
