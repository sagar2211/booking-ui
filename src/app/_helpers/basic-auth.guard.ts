import { Injectable } from '@angular/core';
import {
  CanLoad, CanActivate, Route, Router,
  ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { BasicAuthService } from '../services/basic-auth.service';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BasicAuthGuard implements CanLoad {
  constructor(private auth: BasicAuthService,
    private router: Router) { }

    canLoad(route: Route): boolean {
      if(environment.production === false){
        if (this.auth.isAuthUser() === false) {
          this.router.navigate(['/basicAuth']);
          return false;
        }
        return true;
      } else {
        return true;
      }
      
    }
  
}
