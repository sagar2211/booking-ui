import { Injectable } from "@angular/core";
// import { User } from '../_models/user';
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { URL } from "../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
@Injectable({
  providedIn: "root",
})

export class AuthenticationService {
  currentUser = {};
  users: any;
  token = localStorage.getItem("authToken");
  headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', ' GET, POST, PATCH, PUT, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
    .set('Content-Type', 'application/x-www-form-urlencoded, multipart/form-data, text/plain,application/json')

  public isAuthenticated$: Subject<boolean> = new Subject();
  constructor(private http: HttpClient, public router: Router, private _snackBar: MatSnackBar) {
    if (this.users != undefined) {
      this.users = this.getUser(this.getToken());
    }
  }
  // Sign-up
  signUp(user: any): Observable<any> {
    let api = `${URL}/user/createUser`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in 
  signIn(user: any) {
    return this.http.post<any>(`${URL}/user/authenticate`, user)
      .subscribe({
        next: (res: any) => {
          let exprireTime = res.expiresIn;
          localStorage.setItem("exprireTime", res.expiresIn);
          localStorage.setItem("userId", res.user._id);
          localStorage.setItem("bookingHistory", JSON.stringify(res.ticketArray));
          localStorage.setItem("authToken", res.token);
          localStorage.setItem("authUser", JSON.stringify(res.user));
          this.users = this.getUser(res.token);
          this.setAuthentication(true);
          this.router.navigate(["/search/searchFlight"]);
          this.openSnackBar("Login Successful", 'success', true);
        },
        error: (error) => {
          this.openSnackBar(error.error.message.MESSAGE, 'Danger', false);
        },
        complete: () => {
        }
      })
  }

  // Sign-in 
  signInPopup(user: any) {
    return this.http.post<any>(`${URL}/user/authenticate`, user)
  }

  public setAuthentication(value: boolean) {
    this.isAuthenticated$.next(value);
  }

  //getUserInfo
  getUserInfo(id: any) {
    const reqUrl = `${URL}/user/getUser/${id}`;
    return this.http.get(reqUrl).pipe(map((res: any) => {
      if (res.error === false && res.message.data) {
        return res.message.data;
      } else {
        return [];
      }
    }));
  }

  public getUser(token: any) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  getToken() {
    return this.token;
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem("authToken");
    return authToken !== null ? true : false;
  }

  getUserId() {
    let userId = localStorage.getItem("userId");
    return userId;
  }

  getBookingHistory() {
    let id = localStorage.getItem("userId");
    
    let ticketHistory = this.http.get(`${URL}/user/getHistory/${id}`);
    // let ticketHistory = localStorage.getItem("bookingHistory");
    // ticketHistory = ticketHistory ? JSON.parse(ticketHistory) : null;
    return ticketHistory;
  }

  autoLogout() {
    this.doLogout()
  }

  doLogout = () => {
    let removeToken = localStorage.removeItem("authToken");
    let userId = localStorage.removeItem("userId");
    let userToekn = localStorage.removeItem("authUser");
    if (typeof removeToken === "undefined" && typeof userId === "undefined" && typeof userToekn == "undefined") {
      this.setAuthentication(false);
      this.router.navigate(["/"]);
      // window.location.reload();
    }
    this.token = localStorage.getItem("authToken")
  }

  // updateTraveller
  updateTravellerInfo(id: any, userInfo: any): Observable<any> {
    return this.http.post(`${URL}/user/updateTraveller/${id}`, userInfo);
  }

  // updateTraveller
  deleteTravellerInfo(id: any, userInfo: any): Observable<any> {
    return this.http.post(`${URL}/user/deleteTraveller/${id}`, userInfo);
  }

  // updateUser
  updateUserInfo(id: any, userInfo: any): Observable<any> {
    return this.http.post(`${URL}/user/update/${id}`, userInfo);
  }

  updateUser(id: any, body: any, file: any): Observable<any> {
    let userObj = JSON.stringify(body);
    let headers = new HttpHeaders({
      "userObj": userObj
    });
    const formData = new FormData();
    formData.append("profile-upload", file[0], file[0].name);
    return this.http.post(`${URL}/user/update/${id}`, formData, { headers: headers });
  }

  updateProfile(id: any, file: any) {
    const formData = new FormData();
    formData.append("profile-upload", file[0], file[0].name);
    return this.http.post(`${URL}/user/upload-profile/${id}`, formData);
  }

  getUserList() {
    let userList = this.http.get(`${URL}/user/allUser`);
    return userList;
  }

  forgotPassword(email: any) {
    let forgotPassword = this.http.post(`${URL}/user/forgotPassword`, email);
    return forgotPassword;
  }

  changePassword(data: any) {
    let changePassword = this.http.post(`${URL}/user/reset-password`, data);
    return changePassword;
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

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ['success-snackbar'] : ['danger-snackbar']
    });
  }
}