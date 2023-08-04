import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { DeliveryComponentService } from "../delivery.service";
import { SingletonService } from "../../../services/singleton.service";
import { Subscription, Subject } from "rxjs";
import {
  countries,
  EUROPEAN_COUNTRIES,
  DE_COUNTRIES,
  US_COUNTRIES
} from "../../../app.constant";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
declare var conv_confirmShipping_Method:number;
declare var _conv_q:any;

import { GtmMethodService } from '../../../services/gtmmethods.service';
@Component({
  selector: "app-delivery-service",
  templateUrl: "./delivery-service.component.html",
  styleUrls: ["./delivery-service.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryServiceComponent
  implements OnInit, OnChanges, AfterViewInit,OnDestroy {
  @Output() onSecureChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() onupdateCart: EventEmitter<any> = new EventEmitter<any>();
  @Output() onupdateExpressCart: EventEmitter<any> = new EventEmitter<any>();
  @Input() deliveryInfo: any;
  @Input() expressCheckout: boolean;
  @ViewChild("policyEl") policyEl: ElementRef;
  deliveryTypeChckselected: string;
  deliveryTypeselected: string = "";
  showBlock: boolean;
  serviceBody: boolean;
  shippingInfo: any;
  shippingServices: any;
  deliveryPayments: any;
  payTypeId: number;
  choosenDeliveryService: any;
  outstationDelivery: any;
  outstation: boolean;
  totalToPay:boolean;
  totalPriceData:any;
  namedDay: any;
  imgPath = "assets/imgs/StandardDelivery.png";
  deliveryModeType: any;
  euSpecific: boolean;
  payselect: boolean;
  modalTitle: string;
  express: boolean;
  countries: Array<any>;
  serviceLoad:boolean;
  nameDayLoad:boolean;
  ukspecific:boolean;
  isHazardous:boolean;

  singletonServSubscription:Subscription;
  subscription: Subscription;
  dlusMethodSubscriptn:Subscription;
  cartTokenSubscription:Subscription;
  internationalSubscription:Subscription;
  getDlMthodSubscription:Subscription;
  setdlMthdTocartSubscriptn:Subscription;
  setIntDlSubscription:Subscription;
  setDlNamedDaySubscription:Subscription;
  
  constructor(
    public delivryServ: DeliveryComponentService,
    public singletonServ: SingletonService,
    public router: Router,
    public route: ActivatedRoute,
    public gtmServe: GtmMethodService
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "GB") {
      this.ukspecific=true;
     }
    this.express = false;
    this.serviceBody = true;
    this.outstation = false;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "GB") {
        this.ukspecific=true;
     }
     if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
        this.shippingInfo = changes["deliveryInfo"]["currentValue"];
        this.setCountrySet();
      }
    }
    if (changes["expressCheckout"]) {
      if (changes["expressCheckout"]["currentValue"] != undefined) {
        if (changes["expressCheckout"]["currentValue"]) {          
          this.express = true;
        }
      }
    }
  }
  ngOnInit() {
    if (!this.express) {
     this.serviceLoad=true;
     this.fetchDlMethods();
    }else{
      this.serviceBody = false; 
    }
    const _baseSite = this.singletonServ;
    const pageType = 'Delivery Service Page';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
    if(this.deliveryInfo.orderSummary){
      const cart=this.singletonServ.setupEntryStream(this.deliveryInfo.orderSummary);
      this.gtmServe.gtmSetFeed(cart,"3");
    }
  }
  ngAfterViewInit() {
  this.singletonServSubscription = this.singletonServ.getMessage().subscribe(message => {
      if(message.discardDlMethodLoader){
       this.serviceLoad=false;
       this.nameDayLoad=false;
      } else if(message.discardServiceBody){
        this.serviceLoad=false;
        this.serviceBody=false;
        this.nameDayLoad=false;    
        this.shippingServices=undefined;     
      }
    });
  }
  setCountrySet() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode === "GB") {
      this.countries = this.nestedCopy(countries);
    } else if (baseSite.isoCode === "EU") {
      this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
    } else if (baseSite.isoCode === "DE") {
      this.countries = this.nestedCopy(DE_COUNTRIES);
    } else if (baseSite.isoCode == "US") {
      this.countries = this.nestedCopy(US_COUNTRIES);
    }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  onOpenCartModal() {
    this.singletonServ.sendMessage({deliveryreturn:true});
  }
  fetchDlMethods() {
    const country_code = this.shippingInfo.dlShippingAddress.country.isocode;
    const baseSite = this.singletonServ.catalogVersion;
    this.euSpecific =
      baseSite.isoCode == "EU" || baseSite.isoCode == "DE" ? true : false;
    if (
      (country_code == "GB" && baseSite.isoCode == "GB") 
    ) {
      this.outstation = false;
      this.getDeliveryMethod();

    } else if( baseSite.isoCode == "US") { 
      this.getDlUSMethods();
    } else {
      this.outstation = true;
      this.getInternationalDeliveryMethod(country_code);
    }
  }
  getDlUSMethods(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;    
    const _hazardous=this.shippingInfo.dlShippingAddress.hazardousProducts;
    const _country=this.shippingInfo.dlShippingAddress.country;
    const _countryid=_.findIndex(this.countries,(obj)=>{
      return obj.name ==_country.name
      });
    if(_countryid !=-1) { 
      const _dlCountry=this.countries[_countryid];  
      const _delveryCountryId = (baseSite.isoCode == "US")? _dlCountry.id: false;
      if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.dlusMethodSubscriptn= this.delivryServ.getDlUSMethod(baseSite,user.token,user.email,user.code,_delveryCountryId).subscribe((resp)=>{

            if (resp["deliveryModes"]) {
              const dlMethods = resp["deliveryModes"];
              this.deliveryPayments = dlMethods;
            } else {
              if(_delveryCountryId =="US-CA"){
                this.outstation=true;
                this.outstationDelivery=resp;
              }else if( _delveryCountryId =="US-US"){
                const dlServies:any=resp;
                const _usSortDlMethods =dlServies.sort(function(a, b) {
                  return a['position'] - b['position'];
                });
                _usSortDlMethods.map((item:any)=>{                  
                  if(item.disableShippingMethod){
                    that.isHazardous=true;
                    item['disableAction']=true;
                    item['disabled'] ='disable';
                    item['hazardous']=true;
                  }
                })
                if(_hazardous){
                  this.isHazardous=true;
                    _usSortDlMethods.map((obj)=>{
                      if(obj.id=="US-standard-shipping"){
                        obj['disableAction']=false;
                      }else{
                        obj['disableAction']=true;
                        obj['disabled'] ='disable';
                        obj['hazardous']=true;
                      }
                    });
                    this.deliveryPayments = _usSortDlMethods;
                  } else{
                    _usSortDlMethods.map((item)=>{
                        if(item.disableShippingMethod){
                          item['disableAction']=true;
                          item['disabled'] ='disable';
                          item['hazardous']=true;
                        }else{
                          item['disableAction']=false;
                        }
                    });
                    this.deliveryPayments = _usSortDlMethods;
                  } 
              } else{
                const dlServies:any=resp;
                const _usSortDlMethods =dlServies.sort(function(a, b) {
                  return a['position'] - b['position'];
                });
                this.deliveryPayments = _usSortDlMethods;
              }
  
            this.serviceLoad=false;
          }
          },err=>{
            this.serviceLoad=false;
            if(err.error){
              if(err.error["errors"]){
                if(err.error["errors"][0]){
                  if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    this.delivryServ.generateCartToken(baseSite).subscribe((resp)=>{                   
                       const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this.getDlUSMethods();
                     });
                  }
                }
                }
               }
            });
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guestuser = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.dlusMethodSubscriptn = this.delivryServ.getDlUSMethod(
                       baseSite,
                       _guestuser.token,
                       'anonymous',
                       _guestuser.guid,
                       _delveryCountryId
                       ).subscribe((resp)=>{
          if (resp["deliveryModes"]) {
            const dlMethods = resp["deliveryModes"];
            this.deliveryPayments = dlMethods;
          } else {
            if(_delveryCountryId =="US-CA"){
              this.outstation=true;
              this.outstationDelivery=resp;
            }else if( _delveryCountryId =="US-US"){
              const dlServies:any=resp;
              const _usSortDlMethods =dlServies.sort(function(a, b) {
                return a['position'] - b['position'];
              });
              if(_hazardous){
                this.isHazardous=true;
                  _usSortDlMethods.map((obj)=>{
                    if(obj.id=="US-standard-shipping"){
                      obj['disableAction']=false;
                    }else{
                      obj['disableAction']=true;
                      obj['disabled'] ='disable';
                    }
                  });
                  this.deliveryPayments = _usSortDlMethods;
                } else{
                  _usSortDlMethods.map((obj)=>{
                    if(obj.disableShippingMethod){
                      obj['disableAction']=true;
                      obj['disabled'] ='disable';
                    }
                  });
                  this.deliveryPayments = _usSortDlMethods;
                }      
             
            } else{
              const dlServies:any=resp;
              const _usSortDlMethods =dlServies.sort(function(a, b) {
                return a['position'] - b['position'];
              });
              this.deliveryPayments = _usSortDlMethods;
            }

          this.serviceLoad=false;
        }
      },err=>{
        this.serviceLoad=false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.delivryServ.generateCartToken(baseSite).subscribe((resp)=>{                   
                  const _guestuser=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                  _guestuser.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_guestuser));
                   this.getDlUSMethods();
                });
              }
            }
            }
           }
      });
    }
    } 
  }  
  }
  retrieveDlUSMethods(baseSite,token,email,code,_delveryCountryId){   
    const that=this;
    const _summary=this.shippingInfo.dlShippingAddress.hazardous; 
    this.dlusMethodSubscriptn=  this.delivryServ. getDlUSMethod(baseSite,token,email,code,_delveryCountryId).subscribe((resp)=>{
      if (resp["deliveryModes"]) {
              const dlMethods = resp["deliveryModes"];
              this.deliveryPayments = dlMethods;
            } else {
              if(_delveryCountryId =="US-CA"){
                this.outstation=true;
                this.outstationDelivery=resp;
              }else if( _delveryCountryId =="US-US"){
                const dlServies:any=resp;
                const _usSortDlMethods =dlServies.sort(function(a, b) {
                  return a['position'] - b['position'];
                });
                _usSortDlMethods.map((obj)=>{
                  if(obj.disableShippingMethod){
                    that.isHazardous=true;
                    obj['disableAction']=true;
                    obj['disabled'] ='disable';
                  }
                });
                if(_summary){
                  this.isHazardous=true;
                    _usSortDlMethods.map((obj)=>{
                      if(obj.id=="US-standard-shipping"){
                        obj['disableAction']=false;
                      }else{
                        obj['disableAction']=true;
                        obj['disabled'] ='disable';
                      }
                    });
                    this.deliveryPayments = _usSortDlMethods;
                  } else{
                    _usSortDlMethods.map((obj)=>{
                      if(obj.disableShippingMethod){
                        that.isHazardous=true;
                        obj['disableAction']=true;
                        obj['disabled'] ='disable';
                      }
                    });
                    this.deliveryPayments = _usSortDlMethods;
                  }            
              } else{
                const dlServies:any=resp;
                const _usSortDlMethods =dlServies.sort(function(a, b) {
                  return a['position'] - b['position'];
                });
                this.deliveryPayments = _usSortDlMethods;
              }
           this.serviceLoad=false;
        }
 },err=>{
   this.serviceLoad=false;
   if(err.error){
     if(err.error["errors"]){
       if(err.error["errors"][0]){
         if(err.error["errors"][0]['type']== "InvalidTokenError") {
           this.cartTokenSubscription= this.delivryServ.generateCartToken(baseSite).subscribe(
            (resp:any) => {
                  const _reg=(email!='anonymous')?true:false;
                  if(_reg){
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                    this.retrieveDlUSMethods(baseSite,resp["access_token"],email,code,_delveryCountryId);
                  }else{
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                    this.retrieveDlUSMethods(baseSite,resp["access_token"],email,code,_delveryCountryId);
                  }
                });
         }
       }
       }
      }
   });
  }
  getSortOrder(prop) {  
    return function(a, b) {  
        if (a[prop] > b[prop]) {  
            return 1;  
        } else if (a[prop] < b[prop]) {  
            return -1;  
        }  
        return 0;  
    }  
}
  getIntcon(data) {
    if (data.description == "International Delivery") {
      return true;
    } else if (data.zoneName) {
      if (data.zoneName.indexOf("Zone") != -1) {
        return true;
      }
      return true;
    }
    return false;
  }
  getStdIcon(data) {
    if (data.code) {
      if (data.code.indexOf("standard")) {
        return true;
      } else if (data.code.indexOf("priority") || data.indexOf("express")) {
        return true;
      }
    }
    return false;
  }
  getImgIcon(data) {
    if (
      data.code == "UK-Standard-Delivery" ||
      data.code == "US-Standard-Delivery"
    ) {
      return "assets/imgs/StandardDelivery.png";
    } else if (data.code == "UK-next-day-named-day-or-Saturday") {
      return "assets/imgs/delivery-next.png";
    } else if (
      data.code == "US-priority-shipping" ||
      data.code == "US-express-shipping"
    ) {
      return "assets/imgs/PriorityTruck.png";
    }
    return "assets/imgs/StandardDelivery.png";
  }

  
  getInternationalDeliveryMethod(country_code) {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.getInternationalMethods(
        user.token,
        user.email,
        user.code,
        country_code
      );
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.getInternationalMethods(
          _guest.token,
          "anonymous",
          _guest["guid"],
          country_code
        );
      }
    }
  }
  getInternationalMethods(token, email, code, country_code) {
    const baseSite=this.singletonServ.catalogVersion;
    this.internationalSubscription=this.delivryServ
      .getInternationalDelivery(baseSite,token, email, code, country_code)
      .subscribe(
        response => {
          
          this.outstationDelivery = response["internationalShippingServices"];
          this.serviceLoad=false;
        },
        err => {
          this.serviceLoad=false;
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=this.delivryServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                          const _reg=(email!='anonymous')?true:false;
                          if(_reg){
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.getInternationalMethods(resp["access_token"], email, code, country_code);
                          }else{
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            this.getInternationalMethods(resp["access_token"], email, code, country_code);
                          }
                        });
                }
              }
              }
             }
        }
      );
  }
  getDeliveryMethod() {
    const baseSite = this.singletonServ.catalogVersion;    
    const _country=this.shippingInfo.dlShippingAddress.country;
    const _countryid=_.findIndex(this.countries,(obj)=>{
      return obj.name ==_country.name
      });
    const _dlCountry=this.countries[_countryid];
    if (this.singletonServ.getStoreData(baseSite.reg)) {
        const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const _delveryCountryId =(baseSite.isoCode == "US")  ? _dlCountry.id: false;
        this.retrieveDlmethds(baseSite,user.token,user.email,user.code,_delveryCountryId);
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
            const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            const _delveryCountryId = (baseSite.isoCode == "US") ? _dlCountry.id : false;
            this.retrieveDlmethds(baseSite,_guest.token,'anonymous',_guest.guid,_delveryCountryId);
      }
    }
  }
  retrieveDlmethds(baseSite,token,email,code,_delveryCountryId){  
   this.getDlMthodSubscription= this.delivryServ
    .getDeliveryMethod(baseSite,token, email, code, _delveryCountryId)
    .subscribe((resp:any) => {
        if (resp["deliveryModes"]) {
            const dlMethods = resp["deliveryModes"];        
            dlMethods.sort(function(a, b) {
              return a.position - b.position;
            });
            this.deliveryPayments = dlMethods;
        } else {
          this.deliveryPayments = resp;
        }
          this.serviceLoad=false;
      },(err:any)=> {
        this.serviceLoad=false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription= this.delivryServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                        const _reg=(email!='anonymous')?true:false;
                        if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.retrieveDlmethds(baseSite,resp["access_token"],email,code,_delveryCountryId);
                        }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.retrieveDlmethds(baseSite,resp["access_token"],email,code,_delveryCountryId);
                        }
                      });
              }
            }
            }
           }        
      }
    );
  }
  outstationDt(event, data) {
    this.totalToPay=true;
    this.totalPriceData=this.singletonServ.cartObj.totalPriceWithTax.formattedValue;
    event.preventDefault();
    event.stopPropagation();
    if(data.id== "Canada"){
     this.setDlForCanada(data);
    }else{
      this.setOutStationDl(data);
    }

  }
  setDlForCanada(data){
    const baseSite:any = this.singletonServ.catalogVersion;
    this.serviceLoad=true;
    const body = {
      deliveryCode: data.code ? data.code : data.id,
      description:data.description,
      serviceName:data.serviceName
    };
    this.deliveryModeType = data;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.setDlMethodToCanadaRegion(baseSite,user.token, body, data, user.email, user.code);
    }else    if (this.singletonServ.getStoreData(baseSite.guest)) {
      const guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.setDlMethodToCanadaRegion(baseSite,guest.token, body, data, 'anonymous', guest.guid);
    }
  }
  setDlMethodToCanadaRegion(baseSite,token,body,data,email,code){   
  this.setdlMthdTocartSubscriptn=this.delivryServ
    .deliverymethodToCart(baseSite,token, body, data, email, code)
    .subscribe(
      (resp:any) => {  
        if(resp){   
        if(resp.products){
          const _obj = {
            showhazardous: true,
            hazardousproducts:resp.products
          };
          setTimeout(()=>{
            this.singletonServ.sendMessage(_obj);
          },200);
        }else{
          const _obj = {
            updatOutStationFullCart: true
          };
          setTimeout(()=>{
            this.singletonServ.sendMessage(_obj);
            this.shippingInfo["payType"] = data;
          },200);
       
        }
      }else{
        const _obj = {
          updatOutStationFullCart: true
        };
        setTimeout(()=>{
          this.singletonServ.sendMessage(_obj);
          this.shippingInfo["payType"] = data;
        },200);
 
      }
  
      },
      err => {
        this.serviceLoad=false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription= this.delivryServ.generateCartToken(baseSite).subscribe(
                      (resp:any) => {
                            const _reg=(email!='anonymous')?true:false;
                            if(_reg){
                              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                              user.token= resp["access_token"];
                              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                              this.setDlMethodToCanadaRegion(baseSite,resp["access_token"],body,data,email,code);
                            }else{
                              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                              user.token= resp["access_token"];
                              this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                              this.setDlMethodToCanadaRegion(baseSite,resp["access_token"],body,data,email,code);
                            }
                          });
              }
            }
            }
           }
        
      }
    );
  }
  setOutStationDl(data){
    const baseSite = this.singletonServ.catalogVersion;
    const countryCode = this.shippingInfo.dlShippingAddress.country.isocode;
    data["dlMode"] = true;
    this.serviceLoad=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.setInternationalDeliveryToCart(
        user.token,
        user.email,
        user.code,
        countryCode,
        data
      );
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.setInternationalDeliveryToCart(
          _guest.token,
          "anonymous",
          _guest["guid"],
          countryCode,
          data
        );
      }
    }
  }
  setInternationalDeliveryToCart(token, email, code, countryCode, data) {
    const that=this;
    const baseSite=this.singletonServ.catalogVersion;
    const body={
      serviceName:data.serviceName,
      zoneName:data.zoneName,
      description:data.description
    }
  this.setIntDlSubscription=  this.delivryServ
      .setInternationalDeliveryToCart(baseSite,token, email, code, countryCode,body)
      .subscribe(
        (resp:any) => {
          if(resp){

              if(resp.products){

                  const _obj = {
                    showhazardous: true,
                    hazardousproducts:resp.products
                  };
                  this.singletonServ.sendMessage(_obj);

              }else{            
                  const _obj = {
                    updatOutStationFullCart: true
                  };
                  this.singletonServ.sendMessage(_obj);
                  
                  setTimeout(()=>{
                    this.shippingInfo["payType"] = data; 
                  },1000);   

              }

        }else{ 
   
          const _obj = {
            updatOutStationFullCart: true
          };
          this.singletonServ.sendMessage(_obj);
          setTimeout(()=>{
            this.shippingInfo["payType"] = data; 
          },1000);

        }     
    },(err:any) => {
          this.serviceLoad=false;
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    
                  this.cartTokenSubscription=   this.delivryServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                          const _reg=(email!='anonymous')?true:false;
                          if(_reg){
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.  setInternationalDeliveryToCart(resp["access_token"], email, code, countryCode, data);
                          }else{
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            this.  setInternationalDeliveryToCart(resp["access_token"], email, code, countryCode, data);
                          }
                        });

                }
              }
              }
             }
        }
      );
  }
  retireveCatpath(dataurl){
    const _url= dataurl.url;
    return _url.split("/");   
  }
  onSecureDlPaymentCheck(event, data, k) {   
    this.totalToPay=true;
     this.totalPriceData=this.singletonServ.cartObj.totalPriceWithTax.formattedValue;
    // const cart=this.singletonServ.setupEntryStream(this.deliveryInfo.orderSummary);
    // this.gtmServe.gtmSetFeed(cart,"3");
    if (this.deliveryPayments.length != 1) {     
      this.onSecureCheck();
    } else {
      if(this.deliveryPayments.length == 1) {
        const _obj = this.deliveryPayments[k];
        const _body = {
          deliveryCode: data.code ? data.code : data.id,
          description:data.description,
          serviceName:data.serviceName
        };
        this.setDlMethodToCart(data, _body, _obj);
      }
      this.onSecureCheck();
    }
  }
  setDlMethodToCart(data, _body, _obj) {
    
    const baseSite = this.singletonServ.catalogVersion;
    
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.setDeliveryMethodToCart(
        data,
        user.token,
        _body,
        _obj,
        user.email,
        user.code
      );
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.setDeliveryMethodToCart(
          data,
          _guest.token,
          _body,
          _obj,
          "anonymous",
          _guest.guid
        );
      }
    }
  }
  
  onDeleveryType(event, data, k) {
    conv_confirmShipping_Method=1;
    _conv_q = _conv_q || [];
    _conv_q.push(["run","true"]);
    event.preventDefault();
    event.stopPropagation();
    if(!data.disableAction){ 
        this.namedDay = undefined;
        this.payselect = true;
        this.deliveryTypeselected = data.code
          ? data.code
          : this.deliveryPayments[k].id;
          this.showBlock = true;
          this.deliveryPayments.map((obj, id) => {
            if (id == k) {
              obj["disabled"] = '';
              obj["active"] = true;
              this.payTypeId = id;
            } else {
              obj["disabled"] = 'disable';
              obj["active"] = false;
            }
          });
        const baseSite = this.singletonServ.catalogVersion;
        if (data.code != "UK-next-day-named-day-or-Saturday") {
          if (this.deliveryPayments.length != 1) {
            // if (!this.express) {
                this.serviceLoad=true;
                const _obj = this.deliveryPayments[k];
                const _body = {
                  deliveryCode: data.code ? data.code : data.id,
                  description:data.description,
                  serviceName:data.serviceName
                };
                this.setDlMethodToCart(data, _body, _obj);
            // }
          }
        } else {
          if(!this.shippingServices){
            if (this.singletonServ.getStoreData(baseSite.reg)) {
              const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
              this.retrieveDlDates(user.token, user.email, user.code,this.shippingInfo.payType);
            } else {
              if (this.singletonServ.getStoreData(baseSite.guest)) {
                const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                this.retrieveDlDates(_guest.token, "anonymous", _guest.guid,this.shippingInfo.payType);
              }
            }
          }
        }
      }
  }

  setDeliveryMethodToCart(data, token, body, obj, email, code) {
    const that=this;
    this.deliveryModeType = data;
    const baseSite=this.singletonServ.catalogVersion;
    this.setdlMthdTocartSubscriptn =this.delivryServ
      .deliverymethodToCart(baseSite,token, body, obj, email, code)
      .subscribe(
        (resp:any) => {  
          this.shippingServices=undefined;  
          if(resp){
          if(resp.products){
            const _obj = {
              showhazardous: true,
              hazardousproducts:resp.products
            };
            this.singletonServ.sendMessage(_obj);
          }else{
            const _obj = {
              updatFullCart: true
            };
            this.singletonServ.sendMessage(_obj);
          }
          }else{
            const _obj = {
              updatFullCart: true
            };
            this.singletonServ.sendMessage(_obj);
          }  

        },
        err => {
          this.serviceLoad=false;
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=    this.delivryServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                          const _reg=(email!='anonymous')?true:false;
                          if(_reg){
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.setDeliveryMethodToCart(data, resp["access_token"], body, obj, email, code);
                          }else{
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            this.setDeliveryMethodToCart(data, resp["access_token"], body, obj, email, code);
                          }
                        });
                }
              }
              }
             }
          
        }
      );
  }
  retrieveDlDates(token, email, code,day) {
    this.nameDayLoad=true;
    const baseSite=this.singletonServ.catalogVersion;
    this.setDlNamedDaySubscription=  this.delivryServ.deliveryNamedDayToCart(baseSite,token, email, code).subscribe(
      (resp:any) => {   
        this.shippingServices = resp["namedShippingServices"];   
        if(day){
          this.shippingServices.map((item:any)=>{
            if(day.id==item.id){
             item['active']=true;
            }
          });
        } 
        setTimeout(()=>{
          this.nameDayLoad=false;
        },200);   
      },
      (err) => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription=   this.delivryServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                        const _reg=(email!='anonymous')?true:false;
                        if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.retrieveDlDates(resp["access_token"], email, code,day);
                        }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.retrieveDlDates(resp["access_token"], email, code,day);
                        }
                      });
              }
            }
            }
           }
      }
    );
  }
  onSecureNamedDayCheck(){
    this.serviceBody = false;
    let _payeeMode = this.deliveryPayments[this.payTypeId];
    _payeeMode["dlMode"] = false;
    if (_payeeMode.code == "UK-next-day-named-day-or-Saturday") {
      _payeeMode = this.namedDay;
    }
    this.shippingInfo["payType"] = _payeeMode;
    const obj = {
      payment: true,
      deliverytype: _payeeMode
    };
   
    if (!this.express) {
       this.onSecureChanged.emit(obj);
     }else{
      this.onupdateExpressCart.emit(obj)
     }
  }
  onSecureCheck() { 
    this.totalToPay=true;  
    this.totalPriceData=this.singletonServ.cartObj.totalPriceWithTax.formattedValue;
    let _payeeMode = this.deliveryPayments[this.payTypeId];
    let cart=this.singletonServ.cartObj;
    this.gtmServe.gtmSetFeed(cart,"4");
    _payeeMode["dlMode"] = false;
    this.shippingInfo["payType"] = _payeeMode;    
    if (_payeeMode.code == "UK-next-day-named-day-or-Saturday") {
      this.shippingInfo["payType"]=this.shippingServices.find(function(item){return item.active });
      this.nameDayLoad=true;
      _payeeMode = this.namedDay;
      const _obj = {
        updatOutStationFullCart: true
      };
      this.singletonServ.sendMessage(_obj);
    }else{
      this.serviceBody = false;
      const obj = {
        payment: true,
        deliverytype: _payeeMode
      };
      this.onSecureChanged.emit(obj);
    }
    
  }
  onEditDeliveryServiceType(event) {
    const baseSite = this.singletonServ.catalogVersion;
    this.totalToPay=false;
    if(this.express){
        if (!this.deliveryPayments) {
          const Obj = {
            payment: false,
            service: true
          };
          this.serviceBody = true;
          this.shippingInfo["payType"] = undefined;
          this.onSecureChanged.emit(Obj);
          this.fetchDlMethods();
      } else{
        const Obj = {
          payment: false,
          service: true
        };
        this.onSecureChanged.emit(Obj);
        this.serviceBody = true;
        if(!this.shippingServices){
          if (this.singletonServ.getStoreData(baseSite.reg)) {
            const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
            this.retrieveDlDates(user.token, user.email, user.code,this.shippingInfo.payType);
          } else {
            if (this.singletonServ.getStoreData(baseSite.guest)) {
              const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
              this.retrieveDlDates(_guest.token, "anonymous", _guest.guid,this.shippingInfo.payType);
            }
          }
        }
        this.shippingInfo["payType"] = undefined;
      }
    }else{
    
    if (!this.deliveryPayments) {
      const Obj = {
        payment: false,
        service: true
      };
      this.onSecureChanged.emit(Obj);
      this.serviceBody = true;
      this.shippingInfo["payType"] = undefined;
    } else {
      const Obj = {
        payment: false,
        service: true
      };
      this.onSecureChanged.emit(Obj);
      this.serviceBody = true;
      if(!this.shippingServices){
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.retrieveDlDates(user.token, user.email, user.code,this.shippingInfo.payType);
        } else {
          if (this.singletonServ.getStoreData(baseSite.guest)) {
            const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            this.retrieveDlDates(_guest.token, "anonymous", _guest.guid,this.shippingInfo.payType);
          }
        }
      }
      this.shippingInfo["payType"] = undefined;
    }
  }
  }
  onEditDeliveryType(type) {
    this.totalToPay=false;
    const that = this;
    const obj = {
      payment: false,
      service: false,
      formUpdate: true,
      showDtService: type == "delivery" ? true : false
    };
    this.onEditInfo.emit(obj);
  }
  onSelectNameDay(event,data, id) {
    event.preventDefault();
    this.nameDayLoad=true;
    const baseSite = this.singletonServ.catalogVersion;
    this.shippingServices.map((obj, k) => {
      if (id == k) {
        obj.active = true;
        this.namedDay = data;
      } else {
        obj.active = false;
      }
    });
    const _body = {
      deliveryCode: data.id,
      deliveryDate:data.date,
      serviceName:data.serviceName,
      description:data.description
    };
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));      
      this.setNamedDayServicetoCart(
         user.token,
         user.email, 
         user.code, 
         _body
        );
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.setNamedDayServicetoCart(
          _guest.token,
          "anonymous",
          _guest["guid"],
          _body
        );
      }
    }
  }

  setNamedDayServicetoCart(token, email, code, data) {  
    const baseSite=this.singletonServ.catalogVersion;  
    this.delivryServ
      .setNamedDeliveryModeToCart(baseSite,token, email, code, data)
      .subscribe(
        resp => {
          if (!this.express) {
            this.onupdateCart.emit();
           }else{
            const _obj = {
              updateExpressCart: true
            };
            this.singletonServ.sendMessage(_obj);
           }  
        },
        err => {
          this.nameDayLoad=false;
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=      this.delivryServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                          const _reg=(email!='anonymous')?true:false;
                          if(_reg){
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.setNamedDayServicetoCart(resp["access_token"],email,code,data);
                          }else{
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            this.setNamedDayServicetoCart(resp["access_token"],email,code,data);
                          }
                        });
                }
              }
              }
             }
        }
      );
  }
  ngOnDestroy(){
    if( this.singletonServSubscription){
      this.singletonServSubscription.unsubscribe();
    }
    if(this.dlusMethodSubscriptn){
      this.dlusMethodSubscriptn.unsubscribe();
    }
    if(this.cartTokenSubscription){
      this.cartTokenSubscription.unsubscribe();
    }
    if(this.internationalSubscription){
      this.internationalSubscription.unsubscribe();
    }
    if(this.getDlMthodSubscription){
      this.getDlMthodSubscription.unsubscribe();
    }
    if(this.setdlMthdTocartSubscriptn){
      this.setdlMthdTocartSubscriptn.unsubscribe(); 
    }
    if(this.setIntDlSubscription){
      this.setIntDlSubscription.unsubscribe();
    }
   if(this.setDlNamedDaySubscription){
     this.setDlNamedDaySubscription.unsubscribe();
   }
  }
}
