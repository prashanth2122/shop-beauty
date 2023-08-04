import {
  Inject,
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  HostListener,
  OnDestroy
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { HeaderComponentService } from "./header.service";
import { SingletonService } from "../../services/singleton.service";
import { BasketPageComponentService } from "../../checkoutpage/basketpage/basketpage.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { environment }     from '../../../environments/environment';
import { TranslateService } from '../../translate.service';
import {CartComponent} from './cart/cart.component';
import { productviewComponentService } from "../productview/productview.service";
import { Subscription, Subject } from "rxjs";
import { filter, map, take, toArray, takeUntil } from 'rxjs/operators';
declare var $: any;
declare var AmpCa: any;
declare var window:any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild("scrollContainer") scrollCartContainer: ElementRef;
  @ViewChild("storeCartCount") cartCountElement:ElementRef;
  @ViewChild("cartRefElement") cartCo:CartComponent;
  @ViewChild('submenuContainer') menuCartCo:ElementRef;
  @ViewChild('promotionalText') promotionalText:ElementRef;
  countryText: any;
  toggle: boolean;
  subscription: Subscription;
  cartSubscription:Subscription;
  createCartSubscription:Subscription;
  entryCartSubscription:Subscription;
  generateCartSubscription:Subscription;
  deliveryText: string;
  loggedIn: boolean;
  countries = environment.countryJsonData;
  currentCountryCode:string;
  sidemenuStatus:boolean;
  renderCart:boolean=true;
  message:any;
  updateBasket:boolean;
  hideCart:boolean;
  localData:any;
  private unsubscribe$=new Subject<void>();
  enableJP:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,
    public headerServ: HeaderComponentService,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public basketServ: BasketPageComponentService,
    public translate: TranslateService,
    public quickServ: productviewComponentService
  ) {
    this.sidemenuStatus = false;
    this.deliveryText = "Free UK Standard Delivery when you spend £49.*";
    this.loggedIn = false;
    
  }

  onSignOut() {  
    const that =this;
    this.loggedIn=false;
    this.singletonServ.removeItem("order");
    const _sessionNames=Object.keys(localStorage);
    if(_sessionNames.length){
      _sessionNames.map((obj)=>{
        if(obj !='prefered_lng'){
           that.singletonServ.removeItem(obj);
        }
      })
    }
    this.cartCo.retrieveCartDetails(); 
    this.router.navigate(["store", "myacc"]);
  }

  ngOnInit() {
    const that=this;
    const baseSite =this.singletonServ.catalogVersion;
    if(baseSite){
      const _isoCode=this.singletonServ.catalogVersion.isoCode;
      this.setLocalLang(baseSite.lngCode);
      this.getTopStaticCntnt(baseSite.lngCode);
      this.countries.map((obj)=>{
        if(_isoCode==obj.isoCode){
          obj['current']=true;
          this.currentCountryCode=obj.countryName;
        }else{
          obj['current']=false;
        }
      });
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        this.loggedIn = true;
        this.singletonServ.loggedIn = true;
      }
    }

    this.cartCo.retrieveCartDetails(); 
  }
  setLocalLang(lng) {
    this.headerServ.getStaticContent(lng).subscribe((response:any) => {
      this.singletonServ.appLocaleData = response;
      this.localData=response;

    });
  }
  getTopStaticCntnt(lang: string){
    this.headerServ.getPolicyContent(lang).subscribe((response:any)=>{
      this.getTopHeadCntnt(response.headerPromotion);
    });
  }
 
    /*rendering Amplience Content Using Ampca variable IIFE Function located in assets/js*/
    getTopHeadCntnt(cntnt) {
      const that=this;
      AmpCa.utils = new AmpCa.Utils();
      const baseSite=this.singletonServ.catalogVersion;
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: "https://c1.adis.ws",
          id: cntnt.content,
          store: "moltonbrown",
          templateName: "slot-contentWrapper",
          locale:baseSite.locale
        },
        callback: function(data) {
            that.promotionalText.nativeElement.innerHTML= data;
       }
      });
    }

  ngAfterViewInit() {
    this.subscription = this.singletonServ.getMessage().pipe(takeUntil(this.unsubscribe$)).subscribe(message => {
          if (message.access_token) {
              this.loggedIn = true;
              this.singletonServ.loggedIn = true;
            }else if (message.updateCart) {
            this.message=message;
            this.updateBasket=true;
            this.cartCo.retrieveCartDetails(); 
            }else if( message.showCartPopUp) {
              this.message=message;
              this.updateBasket=true;
              this.cartCo.retrieveCartDetails(); 
           } else if(message.sampleAdded){
            this.cartCo.retrieveCartDetails(); 
           }else if(message.retrieveAsASM){
            this.cartCo.retrieveCartDetails(); 
           } else if(message.updateBasketCount){
             this.cartCo.cart=message.cart;
           }else if(message.refreshCart){
            this.cartCo.retrieveCartDetails(); 
           }
    });



  }

  onNewsletterClick() {
    this.router.navigate(["store", "newsletter-sign-up"]);
  }


  onProfileClick() {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.router.navigate(["store", "myaccount", "profile"]);
    } else {
      this.loggedIn=false;
      this.router.navigate(["store", "myacc"]);
    }
  }
  onCountryChange(data) {
    if(data.isoCode != 'JP'){
      this.countryText = data;
      this.enableJP=false;
    } else {
      this.countryText = data;
      this.enableJP=true;
    }
  }

  onCancelModal(bol) {  
   if(!this.enableJP){
       const baseSite = this.singletonServ.catalogVersion;
        let user;
        if(this.singletonServ.getStoreData(baseSite.reg)){
          user= JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        }
        if (bol) {

          this.singletonServ.setStoreData("prefered_lng",JSON.stringify(this.countryText));    
          const _isoCode=this.countryText.isoCode;
          this.countries.map((obj)=>{
            if(_isoCode==obj.isoCode){
              obj['current']=true;
            }else{
              obj['current']=false;
            }
          });  
          const _obj = {
            baseSiteChange: true,
          };
          if(this.singletonServ.getStoreData(baseSite.reg)){
            if(!this.singletonServ.getStoreData(this.countryText.reg)){       
              const currentUser={email:''};
              currentUser.email=user.email;
              this.singletonServ.setStoreData(
                this.countryText.reg,
                JSON.stringify(currentUser)
              );
              if(user.token){
                this.headerServ.getUserData(baseSite,user.token,user.email).subscribe((response)=>{
                  const userDtls= JSON.parse(this.singletonServ.getStoreData(this.countryText.reg));
                  userDtls['isExpressCheckout']=(response['isExpressCheckout'])?true:false;
                  this.singletonServ.setStoreData(
                    this.countryText.reg,
                    JSON.stringify(currentUser)
                  );
                },err=>{

                })
              }
              this.singletonServ.catalogVersion =  JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
              this.singletonServ.sendMessage(_obj);      
              this.goToStore();
            }else{
              this.singletonServ.catalogVersion =  JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
              this.singletonServ.sendMessage(_obj);      
              this.goToStore();
        }
        }else{
          this.singletonServ.catalogVersion =  JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
          this.singletonServ.sendMessage(_obj);      
          this.goToStore();
        }
    
        }
  } else {
    window.location.href=this.countryText.query;
  }
}
  onleaveRichCart(event){
    this.cartCo.showCartBlock=false;
    this.cartCo.onleaveCart(event);
  }
  onHoverProfileIcon(event) {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    this.cartCo.onleaveCart(event);
  }
  onFindStoreClick(event){
    this.router.navigate(['store','company','stores']);
  }
  toggleMenu(event) {
    event.preventDefault();
    this.onSidemenutap();
 }
 swipMenu(event) {
  this.onSidemenutap();
 }
  onSidemenutap() {
    this.singletonServ.scrollToElWithinC('.sidenav',"#sidenavInput");
    $('#mainBar').toggleClass("open-sidebar");
    $('#sidebar').toggleClass('change-sidebar');
    this.sidemenuStatus = !this.sidemenuStatus;
    this.toggle=this.sidemenuStatus;
    const toggle = {
      moltonSideumenu: {
        state: this.sidemenuStatus
      }
    };    
    this.singletonServ.sendMessage(toggle);
    if(this.sidemenuStatus){
      this.dom.querySelector('body').classList.add("overlay-scroll-hidden");
    }else{
      this.dom.querySelector('body').classList.remove("overlay-scroll-hidden");
    }
  }
  removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" ;
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
    var allsuspects=this.dom.getElementsByTagName(targetelement);
    for (var i=allsuspects.length; i>=0; i--){ 
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) ;
    }
  }
  goToStore(){
      const baseSite = this.singletonServ.catalogVersion;
      this.singletonServ.alarmTime=undefined;
      this.singletonServ.sessionStarts=false;
      this.removejscssfile(baseSite.bv,'js');
      if(this.singletonServ.getStoreData(baseSite.csCustomer)){
          if(baseSite.isoCode =="GB"){
            this.singletonServ.alarmTime=undefined;
            this.singletonServ.sessionStarts=false;
            const ukurl=baseSite.query+'?ASM=true';
            window.location.href=ukurl;
          }else{
            this.singletonServ.alarmTime=undefined;
            this.singletonServ.sessionStarts=false;
            const _biturl=baseSite.query+'&ASM=true';
            window.location.href=_biturl; 
          }
      }else{
        this.singletonServ.alarmTime=undefined;
        this.singletonServ.sessionStarts=false;
        window.location.href=baseSite.query;
      }
  }
 

/* End Add to basket */
discardSubscription(event){
  event.preventDefault();
  if(this.subscription){
  this.subscription.unsubscribe();
}
}
ngOnDestroy(){
    if( this.subscription){
      this.subscription.unsubscribe();
    }
    if(this.createCartSubscription){
      this.createCartSubscription.unsubscribe();
    }
    if(this.entryCartSubscription){
      this.entryCartSubscription.unsubscribe();
    }
    if(this.generateCartSubscription){
      this.generateCartSubscription.unsubscribe();
    }
}
}
