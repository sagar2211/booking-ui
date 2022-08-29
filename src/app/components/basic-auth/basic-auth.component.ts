import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AUTHENTICATION_KEY } from "src/environments/environment";
@Component({
  selector: 'app-basic-auth',
  templateUrl: './basic-auth.component.html',
  styleUrls: ['./basic-auth.component.scss']
})
export class BasicAuthComponent implements OnInit {
  authenticationKey : any;
  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.authenticationKey === AUTHENTICATION_KEY){
      let authUser = {
        status : true
      }
      localStorage.setItem("basicAuthUser",JSON.stringify(authUser));
      this.router.navigate(['/search/searchFlight']);
    } else {
      let authUser = {
        status : false
      }
      localStorage.setItem("basicAuthUser",JSON.stringify(authUser));
    }
  }

}
