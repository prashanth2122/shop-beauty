import {
  Inject,
  Component,
  OnInit,
  HostBinding,
  HostListener,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID
} from "@angular/core";
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { SingletonService } from "./services/singleton.service";
import { Subscription } from "rxjs";
import { TranslateService } from "./translate.service";
import { Location } from "@angular/common";
import { environment }     from '../environments/environment';
import { ConfigService } from './services/config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ParamMap, RouterOutlet, Router, ActivatedRoute,NavigationStart,NavigationEnd } from "@angular/router";
import { Meta } from '@angular/platform-browser';
import * as _ from "lodash";
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import {fadeAnimation} from "./services/animation";
import {AppService} from "./app.service";
import { GtmMethodService } from './services/gtmmethods.service';
// import { SwUpdate } from "@angular/service-worker";
import { SEOService } from "./services/seo.service";

declare var ClientIP: any;
declare var retrieveIP:any;
declare const $: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  privateIP: any;
  toggleMainMenu: boolean;
  togglePosition: boolean;
  subscription: Subscription;
  contentDeliveryUrl: any;
  public publicKey$: Observable<string>;
  checkoutStatus: boolean;
  convertScript:any;
  countryData:Array<any>=environment.countryJsonData;
  rootFr:boolean;
  rootLM:boolean;
  isSessionExpire:boolean;
  animationsDisabled = false;
  timeStart = false;
  seconds = 15;
  clientX = 0;
  clientY = 0;
  loadGMscript:boolean;
  @HostListener('mousemove') onMove(e) {
  } 
  @HostListener('keypress') onKeyPress(e) {

  } 
  @HostListener('document:click', ['$event'])
  onBlockSession(event) {
    const that=this;
    // Validate click event
    if(event.target.pathname == "/store/browse/feedback/feedback"){
      let query=event.target.search;
      let queryparam=query.split("=");
      this.router.navigate([event.target.pathname], { queryParams: { type: queryparam[1]} });
    }
    else if (event.target.tagName == 'A' || $(event.target).closest('a').length > 0) {

      let href = event.target.getAttribute('href') ? event.target.getAttribute('href') : $(event.target).closest('a').attr('href');
      if (!href) {
        event.preventDefault();
      } else {
        let url = new URL(href, href.indexOf('http') === -1 ? window.location.origin : undefined);
        if (url.origin == window.location.origin) {
          event.preventDefault();
          event.stopPropagation();
          if(url.pathname == "/store/faqs" || url.pathname =="/store/promo-terms-conditions" || url.pathname =="/store/faqs-order" || url.pathname =="/store/faqs-account" ||url.pathname == "/store/faqs-product" ||url.pathname == "/store/gift-cards/faqs"){
            let faqId=url.hash;
            this.singletonServ.scrollToTarget(faqId);
          }
          else{
            this.router.navigateByUrl(url.pathname);
          }

        
        }
      }
    }
    const _timeout = new Date();
    const baseSite = this.singletonServ.catalogVersion;
    const _timestamp=moment.utc( _timeout ).valueOf(); 
    if(baseSite){
      if(this.singletonServ.getStoreData("prefered_lng")){ 
          if(this.singletonServ.alarmTime){
            if(_timestamp>this.singletonServ.alarmTime){
                localStorage.clear();
                this.singletonServ.alarmTime=undefined;
                this.singletonServ.sessionStarts=false;
                this.singletonServ.setStoreData("prefered_lng", JSON.stringify(this.singletonServ.catalogVersion));
                    
                    that.router.events.subscribe(( event: NavigationEvent ) : void => {
                          if ( event instanceof NavigationEnd ) {    
                                const _path =event.url.slice(1).split("/");                              
                                if (  _path[1] === "storeportal" ) {
                                  window.location.href="/store/storeportal";
                                } else if(_path[1] === "bireport"){
                                  window.location.href="/store/bireport";
                                } else{
                                  window.location.href="/store/global/sessionExpired";
                                }
                            }
                          });
            }else{
              _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime);            
              this.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
              this.singletonServ.sessionStarts=true;
            }
          }else{
            const _timeout = new Date();
            _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime);            
            this.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
            this.singletonServ.sessionStarts=true;
          }
    }else{
      localStorage.clear();
      this.singletonServ.alarmTime=undefined;
      this.singletonServ.sessionStarts=false;
      this.singletonServ.setStoreData("prefered_lng", JSON.stringify(this.singletonServ.catalogVersion));
      that.router.events.subscribe(( event: NavigationEvent ) : void => {
        if ( event instanceof NavigationEnd ) {    
              const _path =event.url.slice(1).split("/");                              
              if (  _path[1] === "storeportal" ) {
                window.location.href="/store/storeportal";
              } else if(_path[1] === "bireport"){
                window.location.href="/store/bireport";
              } else{
                window.location.href="/store/global/sessionExpired";
              }
          }
        });
    }
}
  }

  @HostBinding('@.disabled')
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  IfZero(num) {
    return ((num <= 9) ? ("0" + num) : num);
  }
  enableCSHeader:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ: SingletonService,
    public location: Location,
    private translate: TranslateService,
    private config: ConfigService,
    public router: Router,
    public quickServ:AppService,
    public route: ActivatedRoute,
    private meta: Meta,
    public cookieService: CookieService,
    public gtmServ:GtmMethodService,
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const that=this;
    this.privateIP = "";//ClientIP;
     that.publicKey$ = config.getConfig().pipe(
      map(configValues => configValues.publicKey)
    );
    that.toggleMainMenu = false;
    translate.use("en").then(() => {
    });
    this.router.events.subscribe(
      ( event: NavigationEvent ) : void => {
          if ( event instanceof NavigationEnd ) {        
            const _path =event.url.slice(1).split("/");
            that.constructPageHeader(event);
            that.switchSession(_path);

          const _location_url = event.url;
          //let wLocation: any;
          let prefered_lng: any = {};

          if (isPlatformBrowser(this.platformId)) {
            prefered_lng = JSON.parse(localStorage.getItem("prefered_lng"));
          }
          this.constructSEOService(prefered_lng.lngCode, _location_url);         
          return;
          }
      }
  );
  /* let refreshing;
  swUpdate.available.subscribe(update => {
    if(refreshing) {
      return;
    }
    refreshing = true;
    window.location.reload();
  }); */
}
constructSEOService(lngCode, _location_url){
  this.seoService.getValue(lngCode, _location_url).subscribe(response => {
    if(response != undefined) {
      this.seoService.updateTitle(response.title);
      this.seoService.updateKeywords(response["key-word"]);
      this.seoService.updateDCSUBJECT(response["key-word"]);
      this.seoService.updateDescription(response.description);
      this.seoService.updateDCDescription(response.description);
      this.seoService.updateOGDescription(response.description);
      this.seoService.updateOGLocale(lngCode);
      this.seoService.updateOGImage();
      //let base_url = wLocation.protocol + "//" + wLocation.hostname + (wLocation.port ? ':' + wLocation.port : '');
      // const canonical_url = base_url + wLocation.pathname;
      this.seoService.updateOGURL(response["url-UK"]);
      this.seoService.createCanonicalURL(response["url-UK"]);
      this.seoService.updateAlternateLink("x-default", response["url-UK"]);
      this.seoService.updateAlternateLink("en-gb", response["url-UK"]);
      this.seoService.updateAlternateLink("en-us", response["url-US"]);
      this.seoService.updateAlternateLink("en-ca", response["url-US"]);
      this.seoService.updateAlternateLink("en-de", response["url-DE"]);
      this.seoService.updateAlternateLink("de-de", response["url-DE"]);
      this.seoService.updateAlternateLink("en-eu", response["url-EU"]);
      this.seoService.updateAlternateLink("en", response["url-EU"]);
    }else {//if data present in json file
      const default_title = "Molton Brown® UK | Luxury Beauty, Fragrance, Bath & Body Gift Sets";
      const default_path =  "/store/index";
      const default_keywords = "molton brown, luxury bath & body, luxury gifts, luxury gifts for her, luxury gifts for him, luxury skincare, luxury skin care, luxury shampoo, luxury conditioner, luxury candles, luxury fragrance, luxury perfume,";
      const default_description = "Discover luxury beauty, fragrance, bath & body gifts sets from Molton Brown. Find exquisite gifts for the home and receive a free sample with every order.";
      this.seoService.updateTitle(default_title);
      this.seoService.updateKeywords(default_keywords);
      this.seoService.updateDCSUBJECT(default_keywords);
      this.seoService.updateDescription(default_description);
      this.seoService.updateDCDescription(default_description);
      this.seoService.updateOGDescription(default_description);
      this.seoService.updateOGLocale(lngCode);
      this.seoService.updateOGImage();
      this.seoService.updateOGURL(default_path);
      this.seoService.createCanonicalURL(default_path);
      this.seoService.updateAlternateLink("x-default", default_path);
      this.seoService.updateAlternateLink("en-gb", default_path);
      this.seoService.updateAlternateLink("en-us", default_path);
      this.seoService.updateAlternateLink("en-ca", default_path);
      this.seoService.updateAlternateLink("en-de", default_path);
      this.seoService.updateAlternateLink("de-de", default_path);
      this.seoService.updateAlternateLink("en-eu", default_path);
      this.seoService.updateAlternateLink("en", default_path);
    }
  });
}
switchSession(_path){
  const that=this;
  const _timeout = new Date();
  const baseSite = that.singletonServ.catalogVersion;
  if(baseSite){
    if(that.singletonServ.getStoreData("prefered_lng")){
        const _timestamp=moment.utc( _timeout ).valueOf();   
        if(that.singletonServ.alarmTime){
          if(_timestamp>that.singletonServ.alarmTime){
              localStorage.clear();
              that.singletonServ.alarmTime=undefined;
              that.singletonServ.sessionStarts=false;
              that.singletonServ.setStoreData("prefered_lng", JSON.stringify(that.singletonServ.catalogVersion));
              if (  _path[1] === "storeportal" ) {
                window.location.href="/store/storeportal";
              } else if(_path[1] === "bireport"){
                window.location.href="/store/bireport";
              } else{
                window.location.href="/store/global/sessionExpired";
              }
          }else{
            const _timeout = new Date();
            _timeout.setMinutes(_timeout.getMinutes() + that.singletonServ.sessionTime);            
            that.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
            that.singletonServ.sessionStarts=true;
          }
  }else{
    const _timeout = new Date();
    _timeout.setMinutes(_timeout.getMinutes() + that.singletonServ.sessionTime);            
    that.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
    that.singletonServ.sessionStarts=true;
  }
}else{
localStorage.clear();
that.singletonServ.alarmTime=undefined;
that.singletonServ.sessionStarts=false;
that.singletonServ.setStoreData("prefered_lng", JSON.stringify(that.singletonServ.catalogVersion));
if (  _path[1] === "storeportal" ) {
  window.location.href="/store/storeportal";
} else if(_path[1] === "bireport"){
  window.location.href="/store/bireport";
} else{
  window.location.href="/store/global/sessionExpired";
}
}
}
}
constructPageHeader(event){
  const that=this;
  const _path =event.url.slice(1).split("/");
  const page= _path[_path.length-1];
  if( _path[0] === "checkout" ){
    
    if (page === 'checkout') {
      this.singletonServ.welcomeTab = true;
      this.singletonServ.shippingTab = false;
      this.singletonServ.confirmationtab = false;
    }else if (page === 'login') {
      this.singletonServ.welcomeTab = true;
      this.singletonServ.shippingTab = false;
      this.singletonServ.confirmationtab = false;
    } else if (page === 'shipping') {
      this.singletonServ.welcomeTab = false;
      this.singletonServ.shippingTab = true;
      this.singletonServ.confirmationtab = false;
    } else if (page === 'mbOrderConfirmResponse') {
      this.singletonServ.welcomeTab = false;
      this.singletonServ.shippingTab = false;
      this.singletonServ.confirmationtab = true;
    }else if(page.search('expressCheckout') !=-1){
      this.singletonServ.welcomeTab = false;
      this.singletonServ.shippingTab = true;
      this.singletonServ.confirmationtab = false;
    }else if (page.search('mbOrderConfirmResponse')!=-1) {
      this.singletonServ.welcomeTab = false;
      this.singletonServ.shippingTab = false;
      this.singletonServ.confirmationtab = true;
    }

    that.checkoutStatus = false;
  } else if(page.search('update-your-preferences')!=-1){
    that.checkoutStatus = false;
  }else if (  _path[1] === "storeportal" ) {
    that.checkoutStatus = false;
  } else if(_path[1] === "bireport"){
    that.checkoutStatus = false;
  } else if(event.url=="/store/update-your-preferences/unsubscribe") {
    that.checkoutStatus = false;
  }else if(event.url=="/store/update-your-preferences/confirmation") {
    that.checkoutStatus = false;
  } else {   
    const page= _path[_path.length-1];
    if(page=="mbBasket"){
      that.singletonServ.basketTab=true;
      that.singletonServ.sampleTab=false;
      that.singletonServ.checkOutTab=false;
    }else if(page=="mbSamples"){
      that.singletonServ.basketTab=false;
      that.singletonServ.sampleTab=true;
      that.singletonServ.checkOutTab=false;
    }else if(page=="mbcart"){
      that.singletonServ.basketTab=true;
      that.singletonServ.sampleTab=false;
      that.singletonServ.checkOutTab=false;
    }
    that.checkoutStatus = true;
  }
}
  setLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    const that=this;
    const _hostname = that.location['_platformStrategy']._platformLocation.location.hostname;
    const _index = _.findIndex(this.countryData,(o)=>{ 
          return (o.hostname == _hostname||o.serverName == _hostname);
    });
    if(_index !=-1){
      this.singletonServ.catalogVersion = this.countryData[_index];
      this.singletonServ.setStoreData("prefered_lng", JSON.stringify(this.countryData[_index]));
      this.setBVScript();
    } else if (this.singletonServ.getStoreData("prefered_lng")){
      const _data = JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
      this.singletonServ.catalogVersion = _data;
      this.setBVScript();
    }else{
       this.route.queryParams.subscribe(params => {
     const myParam =  params['country_store'];
    if (myParam) {
      const _index = _.findIndex(this.countryData, function(o) {
        return o.lngCode == myParam;
      });
      if(_index !=-1 ){
        this.singletonServ.catalogVersion = this.countryData[_index];
        this.setBVScript();
        this.singletonServ.setStoreData("prefered_lng", JSON.stringify(this.countryData[_index]));
      }else if (this.singletonServ.getStoreData("prefered_lng")){
              const _data = JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
              this.singletonServ.catalogVersion = _data;
              this.setBVScript();
      }else{
        this.setCatlogVersion();
      }
    } else{
      this.setCatlogVersion();
    }       
  });
    }
    this.cookiebarverify();

  }

  loadScript(url){
    this.singletonServ.loadScript(url).then(() => {
      this.loadGMscript=true;
    });
}
appendConvertstart(){
  const baseSite=this.singletonServ.catalogVersion;  
  if(baseSite.isoCode == "US"){
  this.convertScript="//cdn-3.convertexperiments.com/js/10023594-10024919.js";
  }
  else if(baseSite.isoCode == "EU"){
    this.convertScript="//cdn-3.convertexperiments.com/js/10023594-10024920.js";
  }
  else if(baseSite.isoCode == "GB"){
    this.convertScript="//cdn-3.convertexperiments.com/js/10023594-10024866.js";
  }
  else
  {
    this.convertScript="//cdn-3.convertexperiments.com/js/10023594-10024921.js";
  }
  this.singletonServ.loadScript(this.convertScript);
}

appendGTMstart(){
      const baseSite=this.singletonServ.catalogVersion;
      const langPath = `assets/js/gtm-${baseSite.lngCode || 'en'}.js`;
      let head= this.dom.getElementsByTagName('head')[0];
      let script= this.dom.createElement('script');
      script.type= 'text/javascript';
      script.src=langPath;
      head.appendChild(script);
}
setGTMScript(){
  const baseSite=this.singletonServ.catalogVersion;
  if(baseSite.gtmsrc){
      const head= this.dom.getElementsByTagName('body')[0];
      const script= this.dom.createElement('noscript');
      const _iframe= this.dom.createElement('iframe');
      _iframe.src= baseSite.gtmsrc;
      _iframe.setAttribute("height","0");
      _iframe.setAttribute("width","0");
      _iframe.setAttribute("style","display:none;visibility:hidden;");
      script.appendChild(_iframe);
      head.appendChild(script);
  }
}
  setBVScript(){
    const baseSite=this.singletonServ.catalogVersion;
	  const queryStatus = window.location.search.replace('?', '');
    if (queryStatus.indexOf('ASM') != -1) {
	  this.enableCSHeader=true;
	} else if(baseSite.csCustomer){
	  if(this.singletonServ.getStoreData(baseSite.csCustomer)){
				  this.enableCSHeader=true;
	   }else{
		    this.enableCSHeader=false;
	  }
	}else{
	   this.enableCSHeader=false;
	}
    this.appendGTMstart();
    this.setGTMScript();
    this.appendConvertstart();
    if(baseSite.bv){
        const head= this.dom.getElementsByTagName('head')[0];
        let script= this.dom.createElement('script');
        script.type= 'text/javascript';
        script.src= baseSite.bv;
        head.appendChild(script);
    }
    this.checkUserTypo();
 }
 checkUserTypo(){
  const baseSite=this.singletonServ.catalogVersion;
   if(this.singletonServ.getStoreData(baseSite.reg)){     
    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this.quickServ.generateCartToken(baseSite).subscribe((tokenizer:any)=>{
      this.getUserData(tokenizer.access_token);
   });
   }
 }
 
 getUserData(tokenId) {
  const baseSite = this.singletonServ.catalogVersion;
  const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
  user['token']=tokenId;
  this.quickServ.getUserData(baseSite,tokenId, user.email).subscribe(
    (resp:any) => {
      user['customerId']=resp.customerId;
      user['isExpressCheckout']=(resp['isExpressCheckout'])?true:false;
      this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));       
    },
    (err:any) => {

    }
  );
}
  toggleAnimations() {
    this.animationsDisabled = !this.animationsDisabled;
  }
  setCatlogVersion(){
    const _index = _.findIndex(environment.countryJsonData, function(o) {
      return o.locale == "en-GB";
    });
    if(_index !=-1){
      this.singletonServ.setStoreData("prefered_lng", JSON.stringify(environment.countryJsonData[_index]));
      this.singletonServ.catalogVersion = environment.countryJsonData[_index];
      this.setBVScript();
    }

  }
  ngAfterViewInit() {
    const that=this;
    this.subscription = this.singletonServ.getMessage().subscribe(message => {
      if (message.moltonSideumenu) {
         that.toggleMainMenu = message.moltonSideumenu.state;
         setTimeout(() => {
          that.togglePosition = message.moltonSideumenu.state;
         }, 1000);
      }
   });
   this.dom.addEventListener("add-to-cart", function(e) {
        that.addFRToBasket(e);
    });
    this.dom.addEventListener("create-entry", function(e) {
      that.addLMToBasket(e);
  });
  }
  addFRToBasket(event){
    this.rootFr=true;
    this.rootLM=false;
    this.  addToBasket(event);
   }
   addLMToBasket(event){
    this.rootLM=true;
    this.rootFr=false;
    this.singletonServ.scrollToTarget("#rich_cart");
    this.  addToBasket(event);
   }
  scrollHandler() {}

  onActivate(e, parent){
    parent.scrollTop = 0;
  }


  addToBasket(event) {
    event.preventDefault();
    event.stopPropagation();
    const productObj = event.detail;
    const baseSite = this.singletonServ.catalogVersion;
      this.singletonServ.scrollToTarget('#rich_cart');
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.singletonServ.loggedIn = true;
          if (!user.code) {
            this.createCart(user.email,productObj,true);
          } else {
            if(user["token"]){
              this.addToCart(user["token"],user.email,user.code,productObj);
            }else{
              this.quickServ.generateCartToken(baseSite).subscribe(
                resp => {
                   const token = resp["access_token"];
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                   this.addToCart(token,user.email,user.code,productObj);
                },err=>{

                });
            }
          }
        } else {

          if (!this.singletonServ.getStoreData(baseSite.guest)) {
            this.createCart('anonymous',productObj,false);
          } else {
            const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            const cartId =  _guest["guid"];
            const tokenId =_guest["token"];
            if(cartId){
                if(tokenId){
                  this.addToCart(tokenId,'anonymous',cartId,productObj);
                }else{
                  this.quickServ.generateCartToken(baseSite).subscribe(
                    resp => {
                      const token = resp["access_token"];
                      _guest.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_guest)); 
                      this.addToCart(tokenId,'anonymous',cartId,productObj);
                    },err=>{

                    });
                }
          }else{
            this.createCart('anonymous',productObj,false);
          }
        }
        }

  }

  createCart(email,productObj,logged){
    const baseSite = this.singletonServ.catalogVersion;
    this.quickServ.generateCartToken(baseSite).subscribe(
      resp => {
        const token = resp["access_token"];

    this.quickServ.generateCartId(baseSite,resp["access_token"],email).subscribe(
          data => {
            if(logged){
              const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
              user['code']=data['code'];
              user['guid']=data["guid"];
              user['token']=token;
              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
              this.addToCart(token,email,user['code'],productObj);
            }else{
              const _user = {token:'',guid:''};
              _user["guid"]=data["guid"];
              _user['code']=data['code'];
              _user['token']=resp["access_token"];
              this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
              this.addToCart(resp["access_token"],email,data["guid"],productObj);
            }

          },err=>{
          });
        },
        error => {}
      );
  }
  pageUrl1(dataurl){
    const pageUrl = dataurl.entry.product.url;
    return pageUrl.split("/");

    }
  addToCart(token,email,code,productObj){
    const baseSite = this.singletonServ.catalogVersion;
    this.quickServ.addToBasket(baseSite,token,email,code,productObj).subscribe((response:any)=>{
   // Start gtm add product to cart
   const pageUrlCat = this.pageUrl1(response);
   const pageUrlMainCat= pageUrlCat[1].split('-').join('');
   const pageUrlSubCat= pageUrlCat[2].split('-').join('');

   const cartDetails = {
     'currencyCode': response.entry.product.price.currencyIso,
  'categoryList': pageUrlMainCat+ '-'+ pageUrlSubCat,
         'productName': response.entry.product.productDisplayName,
     'productID': response.entry.product.code,
     'productPrice': (response.entry.product.price)?(response.entry.product.price.value):'',
     'productBrand': "Molton Brown",
   'productCategory': pageUrlSubCat,
     'productVariant': (response.entry.product.productVariant)? response.entry.product.productVariant : "",
   'productQuantity':response.entry.quantity,
     'size': '',
     'reviewRating': (response.entry.product.productAverageRating)?response.entry.product.productAverageRating:'0',
     'reviewsCount': (response.entry.product.reviewCount)?response.entry.product.reviewCount:'0',
     'saleStatus': (response.entry.product.originalPrice)?'True':'False',
     'stockLevel': (response.entry.product.stock.stockLevelStatus == "inStock")?"True":"False",
     'productStockLevelNumber':(response.entry.product.stock.stockLevel)?response.entry.product.stock.stockLevel:'',
      'deleveryType':(response.entry.product.productEdition)?response.entry.product.productEdition:'',
      // 'deliveryType':'Free Delivery',
       'salePrice':(response.entry.product.originalPrice)?response.entry.product.price.value:''



   }

   if(response.entry.product.price['formattedValue']){
    cartDetails['productPrice']=response.entry.product.price.value;
  }
  else{
    if(response.entry.product.originalPrice){
      const originalPrice= response.entry.product.originalPrice;
    const _originalPrice = originalPrice.match(/[\d\.]+/);
    if(_originalPrice){
      cartDetails['productPrice']=_originalPrice[0];
    }else{
      cartDetails['productPrice']=originalPrice;
    }
    }
  }

  //  if(response.entry.product.originalPrice){
  //   const originalPrice= response.entry.product.originalPrice;
  //   const _originalPrice = originalPrice.match(/[\d\.]+/);
  //   if(_originalPrice){
  //     cartDetails['productPrice']=_originalPrice[0];
  //   }else{
  //     cartDetails['productPrice']=originalPrice;
  //   }
  //   }else{
  //     cartDetails['productPrice']=response.entry.product.price.value;
  //   }
    this.gtmServ.gtmAddToCart(cartDetails);

// end gtm add product to cart
          if(this.rootFr){
            const obj = {
              code: productObj['product']["code"],
              showCartPopUp: true
            };
            this.singletonServ.sendMessage(obj);
          } else{
            const obj = {
              refreshCart: true
            };
            this.singletonServ.sendMessage(obj);
          }

    },err=>{
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.quickServ.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                  const _reg=(email!='anonymous')?true:false;
                  if(_reg){
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                    this.addToCart(resp["access_token"],email,code,productObj);
                  }else{
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                    this.addToCart(resp["access_token"],email,code,productObj);
                  }
                });

            } else if(err.error["errors"][0]['type']== "InsufficientStockError"){
              this.singletonServ.sendMessage({outofStock:err.error["errors"][0]});
          }
          }
          }
         }
    });
  }
  cookiebarverify(){
    const baseSite = this.singletonServ.catalogVersion;
    const allCookies: {} = this.cookieService.getAll();
    if(baseSite.isoCode=='GB'){
      if(allCookies['cookiestored-gb']){
        document.getElementById("cookie").style.display="none";
      }
    }

     if(baseSite.isoCode=='US'){
      if(allCookies['cookiestored-US']){
        document.getElementById("cookie").style.display="none";
      }
    }

     if(baseSite.isoCode=='EU'){
      if(allCookies['cookiestored-eu']){
        document.getElementById("cookie").style.display="none";
      }
    }

     if(baseSite.isoCode=='DE'){
      if(allCookies['cookiestored-de']){
        document.getElementById("cookie").style.display="none";
      }
    }
  }
  ngOnDestroy(){

  }


  // coordinates(event: MouseEvent): void {
  //   this.clientX = event.clientX;
  //   this.clientY = event.clientY;
  // }
  onToggleMenu(event){
      $('#mainBar').toggleClass("open-sidebar");
      $('#sidebar').toggleClass('change-sidebar');
  }
}
