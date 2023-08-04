import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from "../translate.service";
import { SingletonService } from "./../services/singleton.service";

@Component({
  selector: 'app-cookiebar',
  templateUrl: './cookiebar.component.html',
  styleUrls: ['./cookiebar.component.scss']
})
export class CookiebarComponent implements OnInit {
  cookie:any;
  cookieValue = 'UNKNOWN';

  constructor(public cookieService: CookieService,
    private translate: TranslateService,
    public singletonServ: SingletonService) {

   }
   
  setLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    // const allCookies: {} = this.cookieService.getAll();

    // if(baseSite.isoCode=='GB'){
    //   if(allCookies['cookiestored-gb']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }

    //  if(baseSite.isoCode=='US'){
    //   if(allCookies['cookiestored-US']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }

    //  if(baseSite.isoCode=='EU'){
    //   if(allCookies['cookiestored-eu']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }

    //  if(baseSite.isoCode=='DE'){
    //   if(allCookies['cookiestored-de']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }    

    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  acceptCookie(){
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=='GB'){
      this.cookieService.set('cookiestored-gb','cookiestored-gb',7);
    }
     if(baseSite.isoCode=='US'){
      this.cookieService.set('cookiestored-US','cookiestored-US',7);
    }
   if(baseSite.isoCode=='EU'){
      this.cookieService.set('cookiestored-eu','cookiestored-eu',7);
    }
    if(baseSite.isoCode=='DE'){
      this.cookieService.set('cookiestored-de','cookiestored-de',7);
      
    }
    document.getElementById("cookie").style.display="none";
    this.cookie=document.cookie;
    
  }
}
