import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from "@angular/common";
import { DeviceDetectorService } from 'ngx-device-detector';
import { TranslateServiceSubService } from '.././pipe/translate-service-sub.service';
import {SingletonService} from '.././services/singleton.service';
import {ParamMap, RouterOutlet, Router, ActivatedRoute,NavigationStart,NavigationEnd } from "@angular/router";
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
@Component({
  selector: 'app-checkoutpage',
  templateUrl: './checkoutpage.component.html',
  styleUrls: ['./checkoutpage.component.scss']
})
export class CheckoutpageComponent implements OnInit,AfterViewInit {
  deviceInfo:any;
  mobileDevice:boolean;
  desktopDevice:boolean;
  basket:boolean;
  sample:boolean;
  confirmation:boolean;
  constructor(
    public location: Location,
    public deviceService: DeviceDetectorService,
    public translate: TranslateServiceSubService,
    public singletonServ:SingletonService,
    public router: Router,
    public route: ActivatedRoute
    ) {

     }
     isCurrentRoute(path){
     }
    setLang(lang: string) {
      this.translate.use(lang);
    }
  ngOnInit() {
    this.getDeviceInfo();
    const baseSite=this.singletonServ.catalogVersion;
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }
  }
  ngAfterViewInit(){
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isMobile || isTablet){
      this.mobileDevice=true;
     }else{
       this.mobileDevice=false;
     }
     if(isDesktopDevice){
       this.desktopDevice =true;
     }else{
       this.desktopDevice =false;
     }

 
  }
  getBasketTabText(tabText:string,bol:boolean){
    if(this.mobileDevice && this.basket ||this.desktopDevice ){       
          return tabText;
    } else{
      if(bol){
        return tabText;
      }else{
        return '1';
      }
    }
    }
  
    getBasketTabTextSample(tabText:string,bol:boolean){
    if(this.mobileDevice && this.sample ||this.desktopDevice ){
          return tabText
    } else{
      if(bol){
        return tabText;
      }else{
        return '2';
      }
    }
    }
    getBasketTabTextCheckout(tabText:string,bol:boolean){
    if(this.mobileDevice && this.confirmation ||this.desktopDevice){
        return tabText
    } else{
      if(bol){
        return tabText;
      }else{
        return '3';
      }
    }
    }
}
