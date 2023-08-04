import {
  Inject,
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { DeliveryComponentService } from "./delivery.service";
import { SingletonService } from "../../services/singleton.service";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { profileComponentService } from "../../component/profile-form/profile.service";
import { TranslateServiceSubService } from "./../../pipe/translate-service-sub.service";
import {
  US_COUNTRIES
} from "../../app.constant";
import{OrderSummaryComponent} from '../order-summary/order-summary.component';
import * as _ from "lodash";
import { Subscription, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { GtmMethodService } from '../../services/gtmmethods.service';
declare var conv_delivery_type:any;
declare var _conv_q:any;
declare const google: any;
@Component({
  selector: "app-delivery",
  templateUrl: "./delivery.component.html",
  styleUrls: ["./delivery.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild("cartRefElement") cartCo:OrderSummaryComponent;
  cartObj:any;
  deliverytypeName: string;
  switchServiceType: string;
  switchDeliveryType: string;
  deliveryCost: string;
  paymentBlock: boolean;
  showLoading: boolean;
  expressService: boolean;
  updateCart: any;
  deliveryInfo: any;
  deliveryServiceInfo:any;
  collecionInfo: any;
  editForm: boolean;
  selected: string;
  selectedPayType: string;
  customerInfoUpdate: any;
  deliveryModeTypes: any;
  siteSpecicShipping: boolean;
  deliverySiteName: string;
  expressCheckout:boolean;
  expressChecService:boolean;
  osDetail:any;
  private unsubscribe$=new Subject<void>();
  private validUnsubscribe$=new Subject<void>();
  pageLoad:boolean;
  loadingPage:boolean=true;
  dismisServiceandOverlay:boolean;
  usCountries:Array<any>=US_COUNTRIES;
  singletonServSubscription:Subscription;
  subscription: Subscription;
  confirmAddrSubscription:Subscription;
  cartTokenSubscription:Subscription;
  expressChcSubscription:Subscription;
  dlModeSubscription:Subscription;
  constructor(
    @Inject(DOCUMENT) public dom,
    public deliveryServ: DeliveryComponentService,
    public singletonServ: SingletonService,
    public profileServ: profileComponentService,
    public titleService: Title,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private translate: TranslateServiceSubService,
    public gtmServe: GtmMethodService
  ) {
    this.paymentBlock = false;
    this.deliveryCost = "TBC";
    this.showLoading = false;
    this.expressService = true;
    this.switchServiceType = "delivery";
    this.switchDeliveryType = "";
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.countryCode === "US" || baseSite.countryCode === "gb") {
      this.pageLoad=true;
    }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  ngOnInit() {
    const that=this;
    if( this.singletonServ.giftWithcardForm){
      this.singletonServ.giftWithcardForm.reset();
     }
     if(this.singletonServ.giftcardForm){
       this.singletonServ.giftcardForm.reset();
    }
    const queryStatus = this.route.snapshot.queryParamMap.get(
      "expressCheckout"
    );
    const baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData('paypalGuest')){
      this.singletonServ.removeItem('paypalGuest');
    }
    if(this.singletonServ.getStoreData('order')){
      this.singletonServ.removeItem('order');
    }
    if (baseSite) {
        const lngCode = baseSite.lngCode;
        this.setLang(lngCode);
        if (baseSite.countryCode === "eu" || baseSite.countryCode === "de") {
          this.siteSpecicShipping = false;
          if(queryStatus){
            this.pageLoad=true;
          }else{
            this.switchDeliveryType = "collect";
          }
        } else {
          this.siteSpecicShipping = true;
          this.switchDeliveryType = "";
        }
  }
   this.getDlMethods();

  }
  showOverLay(data){
    this.pageLoad=data.load;
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  getDlMethods(){
    const baseSite = this.singletonServ.catalogVersion;
    const queryStatus = this.route.snapshot.queryParamMap.get(
      "expressCheckout"
    );
    if (this.singletonServ.getStoreData(baseSite.reg)) { 
        const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        if(_user.token){
            if(queryStatus){
              this.getQueryStatus(true);
            }else{
              this.getDeliveryModeType(_user.token, _user.email, _user.code,null);
            }       
      }else{
      this.cartTokenSubscription=  this.deliveryServ.generateCartToken(baseSite).subscribe((token)=>{
          const _token=token['access_token'];
          _user['token']=_token
          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
            if(queryStatus){
              this.getQueryStatus(true);
            }else{
              this.getDeliveryModeType(_user.token, _user.email, _user.code,null);
            }
        },err=>{

        });
      }
    }else{
        if (this.singletonServ.getStoreData(baseSite.guest)) {
          const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            if(_guest.token){
              this.getDeliveryModeType(_guest.token, "anonymous", _guest.guid,null);
            }else{
              this.cartTokenSubscription= this.deliveryServ.generateCartToken(baseSite).subscribe((token)=>{
                const _token=token['access_token'];
                _guest['token']=_token;
                this.getDeliveryModeType(_guest.token, "anonymous", _guest.guid,null);
              },err=>{

              });
            }
        }
    }
  }
 



  getStandardName(data) {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.countryName == "USA") {
      this.deliverySiteName = "Ship to an address";
      return "Ship to an address";
    } else if (baseSite.countryName == "UK") {
      this.deliverySiteName = data.deliveryName;
      return data.deliveryName;
    }
  }
  getStandardDescription(data) {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "GB") {
      return data.deliveryDescription;
    } else if (baseSite.isoCode == "US") {
      return "USA, Canada, Virgin & Outlying Islands ";
    }
  }
  getStdDescrptn(data) {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "GB") {
      return data.deliveryCostDescription;
    } else if (baseSite.isoCode == "US") {
      return "FREE standard + express shipping";
    }
  }

  ngAfterViewInit() {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    const _baseSite = this.singletonServ;
    if(baseSite.isoCode=="DE"){
      this.titleService.setTitle('Molton Brown – Zahlung und Lieferung');
      }
      else{
        this.titleService.setTitle('Molton Brown | Checkout Delivery');
      }
    const pageType = 'Shipping Page';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
    this.singletonServSubscription=  this.singletonServ.getMessage().subscribe(message => {
          if(message.overlay){
                this.pageLoad=true;
          }else if(message.dismissOverlay){
                this.pageLoad=false;
          } else if (message.clickCollect) {
                this.switchServiceType = "service";
                this.expressService = false;
                this.collecionInfo = message.selectedStore;
          }  else  if(message.updateExpressData){
                this.deliveryInfo['cardForm']=message.updateExpressData;
          } else if(message.refreshOsSummary){
                this.retrieveFullCart();
                this.switchServiceType = "service";
                this.expressService = false;
                this.collecionInfo = message.selectedStore;
                this.cartCo.usSaleTax=true; 
          } else if(message.updateExpressCart){
                const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg)); 
                this.getDeliveryModeType(_user.token, _user.email, _user.code,null);
                this.cartCo.usSaleTax=true; 
          } else  if (message.updatFullCart) {
                this.retrieveFullCart();
                this.cartCo.usSaleTax=true; 
          } else if(message.updatOutStationFullCart){
                this.expressCheckout=false;
                this.dismisServiceandOverlay=true;
                this.retrieveFullCart();
                this.cartCo.usSaleTax=true; 
          } else if(message.showhazardous){
              this.expressCheckout=false;
              this.paymentBlock=false;
              const _guest = this.singletonServ.getStoreData(baseSite.reg) ? false : true;
              this.customerInfoUpdate = {
                guest: _guest,
                form: this.deliveryServiceInfo.dlShippingAddress,
                hazardous:true,
                hazardousProducts:message.hazardousproducts
              };
              this.switchServiceType = "delivery";
              this.switchDeliveryType = "collect";
         }
    });

  }

  retrieveFullCart(){
    const baseSite = this.singletonServ.catalogVersion;        
    if(this.singletonServ.getStoreData(baseSite.reg)){
       const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg)); 
       this.getDeliveryModeType(_user.token, _user.email, _user.code,null);
       this.cartCo.usSaleTax=true;
     } else {
       const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
       this.getDeliveryModeType(_user.token,'anonymous', _user.guid,null);
       this.cartCo.usSaleTax=true;
     }
  }
  onViewSummary() {
    this.dom.querySelector('body').style.overflowY="hidden";
    this.singletonServ.sendMessage({viewOrdersummary:{status:true}});
  }
 
  onEditClkCltInfo(){
    this.deliveryModeTypes.map((obj, k) => {
      if (obj.deliveryName.toLowerCase().search("click") !=-1) {
        obj["selected"] = "enabled";
        this.paymentBlock = false;
        this.switchServiceType = "delivery";
        this.switchDeliveryType = "ship";
        this.deliverytypeName = obj.deliveryName;
      } else {
        obj["selected"] = "disabled";
      }
    });
  }
  onDeleveryType(data, p) {
    conv_delivery_type = 1;
    _conv_q = _conv_q || []; 
    _conv_q.push(["run","true"]);
    this.pageLoad=true;
    setTimeout(()=>{
      this.pageLoad=false;
    },500);
    this.deliverytypeName = data.deliveryName;
    this.deliveryModeTypes.map((obj, k) => {
      if (p == k) {
        obj["selected"] = "enabled";
      } else {
        obj["selected"] = "disabled";
      }
    });
    this.switchDeliveryType = data.deliveryName.toLowerCase().indexOf("click")
      ? "collect"
      : "ship";
      // if(this.cartCo.osDetail){
      // const cart=this.singletonServ.setupEntryStream(this.cartCo.osDetail);
      // this.gtmServe.gtmSetFeed(cart,"2");
      // }
    }

  
  onDeleveryPayType(pay) {
    this.selectedPayType = pay;
  }
  onupdateCart(data) {
    this.updateCart = {
      cartUpdate: true
    };
    this.expressCheckout=false;
    this.retrieveFullCart();
  }
  retireveCatpath(dataurl){

    const _url= dataurl.url;
    return _url.split("/");
   
  }
  onCollectionChange(data) {
    if (data.storeType) {
      const deliveryInfo = data;
      if(this.deliveryInfo){
      if(this.deliveryInfo['deliveryName']){
          deliveryInfo['deliveryName']=this.deliveryInfo['deliveryName'];
          deliveryInfo['customerAddress']=this.deliveryInfo['customerAddress'];
          deliveryInfo['payType']=this.deliveryInfo['payType'];
          deliveryInfo['cardForm']=this.deliveryInfo['cardForm'];          
      }
    }
    this.deliveryInfo=deliveryInfo;
      if(this.singletonServ.cartObj){
        this.deliveryInfo['cartObj']=this.cartObj
      }
    }
    this.paymentBlock = data.payment;
    this.pageLoad=false;
  }
  onSelectedStore(data) {
    const baseSite = this.singletonServ.catalogVersion;
    this.switchServiceType = "service";
    this.expressService = false;
    this.collecionInfo = data.selectedStore;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.getDeliveryModeType(_user.token, _user.email, _user.code,null);
      this.cartCo.usSaleTax=true; 
    }else{
      const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.getDeliveryModeType(_user.token,'anonymous', _user.guid,null);
      this.cartCo.usSaleTax=true;
    }
  }
  onShowDeliveryBlock(data) {
    const baseSite = this.singletonServ.catalogVersion;
    const _isocode=data.country.isocode; 
    const obj = {
          customerAddress: data,
          deliveryType: this.deliverytypeName,
          billingAddress: true,
          orderSummary:this.osDetail,
          dlShippingAddress:data
        };        
        if (baseSite.isoCode == "US") {
          const _country = _.find(this.usCountries, obj => {
            return _isocode== obj.isocode;
          });
          obj["customerAddress"]["country"] = _country;
        }
        this.deliveryServiceInfo = obj;
        this.switchServiceType = "service";
        this.expressService = true;
        this.expressCheckout=false;
        this.pageLoad=false;
  }

  onEditBasket() {
    this.router.navigate(["store", "mbcart","mbBasket"]);
  }

  /* start Dl service communication  */
  onEditInfo(data) {
    const baseSite = this.singletonServ.catalogVersion;
    this.paymentBlock = false;
     this.switchServiceType='delivery';
    if (baseSite.countryCode == "eu") {
      this.siteSpecicShipping = false;
      this.switchDeliveryType = "collect";
      if (data.formUpdate) {
        const _guest = this.singletonServ.getStoreData(baseSite.reg) ? false : true;
        this.customerInfoUpdate = {
          guest: _guest,
          form: this.deliveryServiceInfo.dlShippingAddress
        };
        this.switchDeliveryType = "collect";
      } else {
        this.switchDeliveryType = "";
      }
    } else {
      if (data.formUpdate) {
        const _guest = this.singletonServ.getStoreData(baseSite.reg) ? false : true;
        this.customerInfoUpdate = {
          guest: _guest,
          form: this.deliveryServiceInfo.dlShippingAddress
        };
        this.switchDeliveryType = "collect";
      } else {
        this.switchDeliveryType = "";
      }
    }
    this.expressCheckout=false;
  }
  
  onSecureChanged(data) {
    this.expressCheckout=false;
    if (data.hasOwnProperty("payment")) {
      this.paymentBlock = data.payment;
    }
   this.setupDlInfo();  
}
setupDlInfo(){
  
  if(! this.deliveryInfo){
    this.deliveryInfo={};
    this.deliveryInfo['customerAddress']=this.deliveryServiceInfo['customerAddress'];
    if(this.singletonServ.cartObj){
      this.deliveryInfo['cartObj']=this.cartObj
    }
  }else{
    this.deliveryInfo=this.deliveryServiceInfo;
    if(this.singletonServ.cartObj){
      this.deliveryInfo['cartObj']=this.cartObj
    }
  }
}
  postCartData(data){
    this.cartObj=data;
  }
  onUpdateCartData(event){
    const baseSite = this.singletonServ.catalogVersion;
    const queryStatus = this.route.snapshot.queryParamMap.get(
      "expressCheckout"
    );
               
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));

    if(queryStatus){
      this.getQueryStatus(true);
    }else{
      this.getDeliveryModeType(_user.token, _user.email, _user.code,null);
    }
      this.cartCo.usSaleTax=true; 
    }else{
      const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.getDeliveryModeType(_user.token,'anonymous', _user.guid,null);
      this.cartCo.usSaleTax=true;
    }
  }
  getQueryStatus(payment){
    const baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
  this.expressChcSubscription=   this.deliveryServ.expressCheckout(baseSite,user.token,user.email,user.code).pipe(takeUntil(this.validUnsubscribe$)).subscribe((response)=>{
    if(response){ 
      this.deliveryInfo={
        deliveryName:response['shippingMethod'],
        customerAddress:response['defaultShippingAddress'],
        cardForm:response
      };
     const _isocode=this.deliveryInfo.customerAddress.country.isocode;
      // const id=response['defaultShippingAddress']['id'];
    //  this.confirmUserAddress(payment,response);
    const shippingMethod=response['shippingMethod'];
    let availableShippingDay;
   if(response['availableShippingDay']){
     if(response['availableShippingDay']['date']){
       availableShippingDay=response['availableShippingDay'];
     }else{
       availableShippingDay=false;
     }              
   }  
   this.deliveryInfo['payType']=shippingMethod;
   this.deliveryInfo['availableShippingDay']=availableShippingDay;
   this.deliveryServiceInfo= this.deliveryInfo; 
   this.deliveryServiceInfo.dlShippingAddress=this.deliveryServiceInfo.customerAddress;
   this.expressChecService=true;
   this.switchServiceType = "service"; 
   this.expressCheckout=true;  
   if (baseSite.isoCode == "US") {
     if(_isocode){
     const _country = _.find(this.usCountries, obj => {
       return _isocode == obj.isocode;
     });
     if(_country){
       this.deliveryInfo["customerAddress"]["country"] = _country;
      }
     }              
   }
   this.expressService=true;             
    if(baseSite.isoCode =="EU" ||baseSite.isoCode =="DE"){
      const _method="International-Delivery&countryCode="+this.deliveryInfo["customerAddress"]["country"]['isocode'];
      this.getDeliveryModeType(user.token, user.email,user.code,_method);
      this.cartCo.usSaleTax=true;
    }else{
     const _code=response['shippingMethod']['code'];
     this.getDeliveryModeType(user.token, user.email,user.code,_code);
     this.cartCo.usSaleTax=true;
   }
     this.paymentBlock = payment;
     this.deliveryServiceInfo.dlShippingAddress=this.deliveryServiceInfo.customerAddress;
    }
  },err=>{
    this.pageLoad=false;
    if(err.error){
      if(err.error["errors"]){
        if(err.error["errors"][0]){
          if(err.error["errors"][0]['type']== "InvalidTokenError") {
            this.deliveryServ.generateCartToken(baseSite).subscribe((token:any)=>{
              user.token=token.access_token;
              this.singletonServ.setStoreData(baseSite.reg,user);
              this.getQueryStatus(payment)
            });
          }
        }
        }
       }
    })

}
}
confirmUserAddress(payment,response){
  const baseSite = this.singletonServ.catalogVersion;
  const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
  this.deliveryInfo={
    deliveryName:response['shippingMethod'],
    customerAddress:response['defaultShippingAddress'],
    cardForm:response
  };
 const _isocode=this.deliveryInfo.customerAddress.country.isocode;
  const id=response['defaultShippingAddress']['id'];
  this.confirmAddrSubscription=  this.deliveryServ
  .confirmAddress(
    baseSite,
    user.token,
    user.email,
    user.code,
    id
  ).subscribe((del)=>{
    const shippingMethod=response['shippingMethod'];
    let availableShippingDay;
   if(response['availableShippingDay']){
     if(response['availableShippingDay']['date']){
       availableShippingDay=response['availableShippingDay'];
     }else{
       availableShippingDay=false;
     }              
   }  
   this.deliveryInfo['payType']=shippingMethod;
   this.deliveryInfo['availableShippingDay']=availableShippingDay;
   this.deliveryServiceInfo= this.deliveryInfo; 
   this.deliveryServiceInfo.dlShippingAddress=this.deliveryServiceInfo.customerAddress;
   this.expressChecService=true;
   this.switchServiceType = "service"; 
   this.expressCheckout=true;  
   if (baseSite.isoCode == "US") {
     if(_isocode){
     const _country = _.find(this.usCountries, obj => {
       return _isocode == obj.isocode;
     });
     this.deliveryInfo["customerAddress"]["country"] = _country;
     }              
   }
   this.expressService=true;             
    if(baseSite.isoCode =="EU" ||baseSite.isoCode =="DE"){
      const _method="International-Delivery&countryCode="+this.deliveryInfo["customerAddress"]["country"]['isocode'];
      this.getDeliveryModeType(user.token, user.email,user.code,_method);
      this.cartCo.usSaleTax=true;
    }else{
     const _code=response['shippingMethod']['code'];
     this.getDeliveryModeType(user.token, user.email,user.code,_code);
     this.cartCo.usSaleTax=true;
   }
     this.paymentBlock = payment;
     this.deliveryServiceInfo.dlShippingAddress=this.deliveryServiceInfo.customerAddress;
 },err=>{
   this.pageLoad=false;
   if(err.error){
     if(err.error["errors"]){
       if(err.error["errors"][0]){
         if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.deliveryServ.generateCartToken(baseSite).subscribe((token:any)=>{
                user.token=token.access_token;
                this.singletonServ.setStoreData(baseSite.reg,user);
                this.confirmUserAddress(payment,response);
              });
         }
       }
       }
      }
 });
}

  getDeliveryModeType(token, email, code,method) {
    let  _method=null;
    const baseSite = this.singletonServ.catalogVersion;
    const queryStatus = this.route.snapshot.queryParamMap.get(
      "expressCheckout"
    );
    if(queryStatus){
    if(baseSite.isoCode =="EU" ||baseSite.isoCode =="DE"){
      if(this.deliveryServiceInfo){
      if(this.deliveryServiceInfo.dlShippingAddress){
        _method="International-Delivery&countryCode="+this.deliveryServiceInfo.dlShippingAddress.country.isocode;
      }
     }
  }else{
    if(this.expressService){
      if(this.deliveryInfo){
      if(this.deliveryInfo.deliveryName){
          if(this.deliveryInfo.deliveryName.code){
            const _code=this.deliveryInfo.deliveryName.code;
            _method=_code;
        }
      }
    }
  }
  }
}
  this.dlModeSubscription=  this.deliveryServ.getDeliveryModes(baseSite,token, email, code,_method).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        if(response){
          if(response['shippingServices']){
          response['shippingServices'].map(obj => {
            if (obj.deliveryName == "Click & Collect") {
              obj.imageSrc = "assets/imgs/Clickcollect.png";
            } else {
              obj.imageSrc = "assets/imgs/StandardDelivery.png";
            }
          });
          const dlModes=response['shippingServices'];
          dlModes.sort((a,b)=>{
            return a.position-b.position
          });
          this.deliveryModeTypes = dlModes;
        }
          this.osDetail=response;
          this.pageLoad=false;
          if(this.dismisServiceandOverlay){
            this.dismisServiceandOverlay=false;
            this.setupDlInfo();
            this.singletonServ.sendMessage({discardServiceBody:true});
            this.paymentBlock=true;
          }
      }
      },
      err => {      
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.deliveryServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                    const _reg=(email!='anonymous')?true:false;
                    if(_reg){
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.getDeliveryModeType(resp["access_token"], email, code,method);
                    }else{
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                      this.getDeliveryModeType(resp["access_token"], email, code,method);
                    }
                    
                  });

              }else{
                this.pageLoad=false;
                this.singletonServ.sendMessage({discardDlMethodLoader:true});
              }
            }
            }else{
              this.pageLoad=false;
              this.singletonServ.sendMessage({discardDlMethodLoader:true});
            }
           }
      }
    );
  }
  
  ngOnDestroy(){
    this.singletonServ.gfsData=undefined;
    if(this.confirmAddrSubscription){
      this.confirmAddrSubscription.unsubscribe();
    }
    if( this.cartTokenSubscription){
      this.cartTokenSubscription.unsubscribe();
    }
    if(this.expressChcSubscription){
      this.expressChcSubscription.unsubscribe();
    }
    if( this.singletonServSubscription){
      this.singletonServSubscription.unsubscribe();
    }
    if(this.dlModeSubscription){
      this.dlModeSubscription.unsubscribe();
    }
  }
}
