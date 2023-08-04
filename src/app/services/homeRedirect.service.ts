import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SingletonService } from "./singleton.service";
@Injectable()
export class HomeRedirectService implements CanActivate {

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
        if (this.singletonServ.getStoreData(_data.guest)) {
          return true;
        }else if(this.singletonServ.getStoreData(_data.reg)){
          const _user =JSON.parse(this.singletonServ.getStoreData(_data.reg));
          if(_user.code){
            return true;
          }
        }
      }
    }else{
    if (this.singletonServ.getStoreData(baseSite.guest)) {
       return true;
     }else if(this.singletonServ.getStoreData(baseSite.reg)){
       const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
       if(_user.code){
         return true;
       }
     }
    }

    // Store the attempted URL for redirecting
    this.singletonServ.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(["store","index"]);
    return false;
  }
}