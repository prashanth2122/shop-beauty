import {
  Inject,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  HostListener,
  OnDestroy
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { SingletonService } from "../services/singleton.service";
import { DeliveryComponentService } from "./delivery/delivery.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "./../translate.service";
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import { environment }     from '../../environments/environment';
declare var AmpCa: any;
declare var $: any;
declare var window:any;
declare var google:any;
@Component({
  selector: "app-checkout-cart",
  templateUrl: "./checkout-cart.component.html",
  styleUrls: ["./checkout-cart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutCartComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild("policyEl") policyEl: ElementRef;
  countryData:Array<any>=environment.countryJsonData;
  subscription: Subscription;
  deviceInfo: any;
  mobileDevice: boolean;
  desktopDevice: boolean;
  cuurent: boolean;
  login: boolean;
  delivery: boolean;
  confirmation: boolean;
  modalTitle: string;
  deEmail: boolean;
  customerCenter: string;
  footerLinks: Array<any>;
  eventTrigger: boolean;
  bundleCount: number = 0;
  bundleProductCount: number = 0;
  mergeCart: boolean = false;
  callFailTime: number = 0;
  loadOverlay:boolean;
  previousUrl:string;
  loadModalOverlay:boolean;
  pageLoad:boolean;
  addressInfo:any;
  constructor(
    @Inject(DOCUMENT) public dom,
    public deviceService: DeviceDetectorService,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private translate: TranslateService,
    public deliveryServ: DeliveryComponentService
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.pageLoad=true;
    const _location=this.location['_platformStrategy']._platformLocation.location;
    this.addressInfo=_location;
  }

  ngOnInit() {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
    const  url = that.singletonServ.googleScriptKey;
    let checkExist = setInterval(function() {
     if (typeof google === 'object' && typeof google.maps === 'object') {
        clearInterval(checkExist);
     }else{
       const _checkUrl = that.singletonServ.isMyScriptLoaded(url);
       setTimeout(()=>{
          if(!_checkUrl){
            that.loadScript(url);
          }
       });
     }
  }, 100);
    this.getDeviceInfo();
    this.deliveryServ.getStaticContent(baseSite.lngCode).subscribe(
      staticData => {
        this.footerLinks = staticData["checkoutCart"]["footerLinks"];
        this.getFooterInfo();
      },
      err => { 

      });
    if (baseSite.isoCode == "GB") {
      this.customerCenter = "+44 (0) 808 178 1188";
    } else if (baseSite.isoCode == "DE") {
      this.deEmail = true;
      this.customerCenter = "customer@moltonbrown.com";

    } else if (baseSite.isoCode == "EU") {
      this.customerCenter = "00 800 4585 00 76";
    } else if (baseSite.isoCode == "US") {
      this.customerCenter = "1-866-933-2344";
    }
    const splitPath = window.location.pathname.split("/");
    const page = splitPath[splitPath.length - 1];
    if (page === 'login') {
      this.cuurent = true;
      this.login = true;
      this.delivery = false;
      this.confirmation = false;
    } else if (page === 'shipping') {
      this.cuurent = true;
      this.login = false;
      this.delivery = true;
      this.confirmation = false;
    } else if (page === 'mbOrderConfirmResponse') {
      this.cuurent = true;
      this.login = false;
      this.delivery = false;
      this.confirmation = true;
    }
  
  }
  loadScript(url){
    this.singletonServ.loadScript(url).then(() => {
    });
  }
  setDigicertScript(){
    const _hostname = this.location['_platformStrategy']._platformLocation.location.origin;
    const _index = _.findIndex(this.countryData, function(o) { 
          return (o.hostname == _hostname||o.serverName == _hostname);
    });
    if(_index !=-1){
      const _hostData=this.countryData[_index];
      const url=`https://seal.geotrust.com/getgeotrustsslseal?host_name==www.moltonbrown.co.uk&amp;size=M&amp;lang=en`;
       let head= this.dom.getElementsByTagName('body')[0];
       let script= this.dom.createElement('script');
       script.type= 'text/javascript';
       script.src= url
       head.appendChild(script);
    }else{
      const url=`https://seal.geotrust.com/getgeotrustsslseal?host_name==www.moltonbrown.co.uk&amp;size=M&amp;lang=en`;
       let head= this.dom.getElementsByTagName('head')[0];
       let script= this.dom.createElement('script');
       script.type= 'text/javascript';
       script.src= url
       head.appendChild(script);
    }
   
  // this.singletonServ.loadScript(url).then(() => {
   
  // });
  }
  IfZero(num) {
    return ((num <= 9) ? ("0" + num) : num);
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  getFooterInfo() {
    this.footerLinks.map((obj, k) => {
      const baseSite = this.singletonServ.catalogVersion;
      AmpCa.utils = new AmpCa.Utils();
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: 'https://c1.adis.ws',
          id: obj.contentId,
          store: 'moltonbrown',
          templateName: obj.templateName,
          locale: baseSite.locale
        },
        callback: function (htm) {
          obj['htm'] = htm;
        }
      });
    });
    this.singletonServ.footerLinks = this.footerLinks;
  }
  ngAfterViewInit() {
    this.subscription = this.singletonServ.getMessage().subscribe(message => {
      if (message.deliveryreturn) {
        this.pageLoad=true;
        this.modalTitle = this.footerLinks[0].name;
        this.policyEl.nativeElement.innerHTML = this.footerLinks[0].htm;
        $('#modalCheckoutPopup').animate({
          scrollTop: $('.modal-body').offset().top
        });
        this.loadModalOverlay=true;
        setTimeout(() => {
          const _target ='#UK_dl_Restrictions';
          this.waitForEl(_target, 5);
        });
      }else if(message.toggleOverlay){
        this.loadOverlay=message.toggleOverlay.status;
        if(message.toggleOverlay.orderConfirmation){
          this.cuurent = true;
          this.login = false;
          this.delivery = false;
          this.confirmation = true;
        }
      }
    });
    // this.setDigicertScript();
  }
  onDigicertContextMenu(){
    return false;
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
    if (isDesktopDevice) {
      this.desktopDevice = true;
    } else {
      this.desktopDevice = false;
    }
  }
  getCartTabTextWelcome(tabText: string,bol) {
    if ((this.mobileDevice && this.login) || this.desktopDevice) {
      return tabText;
    } else {
      if(bol){
        return tabText;
      }else{
        return '1';
      }      
    }
  }

  getCartTabTextDelandPay(tabText: string,bol) {
    if ((this.mobileDevice && this.delivery) || this.desktopDevice) {
      return tabText;
    } else {
      if(bol){
        return tabText;
      }else{
        return '2';
      }
    }
  }
  getCartTabTextConfirm(tabText: string,bol) {
    if ((this.mobileDevice && this.confirmation) || this.desktopDevice) {
      return tabText;
    } else {
      if(bol){
        return tabText;
      }else{
        return '3';
      }
    }
  }

  goToHome(event) {
        if(event.ctrlKey && event.which === 1){
        event.stopPropagation();
        event.preventDefault();
      this.setHomeRoute(event);
    } 
    else{
      window.location.href="store/index";
    }
  }
  setHomeRoute(event){
    event.preventDefault();
    const baseSite = this.singletonServ.catalogVersion;
    if (this.location.path() === "/checkout/confirmation") {
      this.singletonServ.removeItem(baseSite.guest);
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        this.singletonServ.cartObj=undefined;
        const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        delete _user['code'];
        delete _user['token'];
        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
        window.open('/store/index');
      } else    if (this.singletonServ.getStoreData(baseSite.guest)) {
        this.singletonServ.removeItem(baseSite.guest);
        window.open('/store/index');
      } else{
        window.open('/store/index');
      } 
    } else  {
      window.open('/store/index');
    }
  }
  onOpenCartModal(data) {
    const that=this;
     if(data.name == "Returns Policy"){
      this.modalTitle = data.name;
      this.policyEl.nativeElement.innerHTML = data.htm;
        this.loadModalOverlay=true;
        setTimeout(() => {
          that.pageLoad=true;
          const _target ='#Returns';
          this.waitForEl(_target, 5);
        });

      }else{
        this.pageLoad=true;
        this.modalTitle = data.name;
        this.policyEl.nativeElement.innerHTML = data.htm;        
        setTimeout(() => {
          this.pageLoad=false;
        },200);
      }

  }

  waitForEl(selector, count) {
    const that=this;
    this.pageLoad=true;
   if ($(selector).length) {
   this.scrollToEl(selector);
   } else {
       if(!count) {
         count=0;
       }
       count++;
       if(count<10) {
         that.waitForEl(selector,count);
       } else {
         return;
        }
   }
 }
 scrollToEl(target){ 
  const elemq = $(target);
  if(elemq){
    if(elemq.offset()){
    this.scrollToElement(elemq);

    }
  }
}
  scrollToElement(element) {
   this.singletonServ.scrollToElWithinC('.chck-modal-body',element);
    setTimeout(()=>{
      this.pageLoad=false;
    },200);
}
  goToStore() {
      this.mergeCart = false;
      this.loadOverlay=false;
      this.router.navigate(["store","index"]);
   }
   onDismiss(event){
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile||isTablet){
      this.loadOverlay=false;
      this.singletonServ.sendMessage({viewOrdersummary:{status:false}});
    }
   }
  ngOnDestroy(){
    if( this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
