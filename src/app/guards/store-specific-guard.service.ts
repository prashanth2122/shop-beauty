import { Injectable } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SingletonService } from "../services/singleton.service";
@Injectable({
  providedIn: 'root'
})

export class StoreSpecificRoleGuardService implements CanActivate {


  constructor(private _authService: AuthenticationService, private _router: Router,public singletonServ:SingletonService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this._authService.decode();
    const baseSite =this.singletonServ.catalogVersion;
    if (user.role === next.data.role) {
      return true;
    }

    // navigate to not found page
    this._router.navigate(['/404']);
    return false;
  }

}