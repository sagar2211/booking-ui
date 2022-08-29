import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthService {

  constructor() { }

  isAuthUser() {
    let authUser = JSON.parse(localStorage.getItem('basicAuthUser') || '{}');
    if(authUser.status){
      return true;
    } else {
      return false;
    }
    
  }
}
