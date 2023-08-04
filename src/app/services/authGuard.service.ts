import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SingletonService } from "./singleton.service";
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public singletonServ:SingletonService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    const baseSite = this.singletonServ.catalogVersion;
    if(!baseSite){
      if (this.singletonServ.getStoreData("prefered_lng")){
        const _data = JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
        if (this.singletonServ.getStoreData(_data.reg)) { return true; }
      }
    }else{
    if (this.singletonServ.getStoreData(baseSite.reg)) { return true; }
    }
    // Store the attempted URL for redirecting
    this.singletonServ.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(["store","myacc","mbLogin"]);
    return false;
  }
}