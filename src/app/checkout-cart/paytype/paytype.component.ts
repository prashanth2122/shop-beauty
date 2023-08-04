import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChange, OnDestroy } from '@angular/core';
import { SingletonService } from "../../services/singleton.service";
import { cardFormComponentService } from "../../paymentType/card-form/card-form.service";
import { Router, ActivatedRoute } from "@angular/router";
import {KlarnaService} from "../../paymentType/klarna/klarna.service";
import * as moment from 'moment';
import { GtmMethodService } from '../../services/gtmmethods.service';
import * as _ from "lodash";
declare var $:any;
declare var Klarna:any;
declare var conv_creditDebitSelect:any;
declare var conv_payPalSelect:any;
declare var conv_giftcardSelect :any;
declare var _conv_q:any;
@Component({
  selector: 'app-paytype',
  templateUrl: './paytype.component.html',
  styleUrls: ['./paytype.component.scss']
})
export class PaytypeComponent implements OnInit, OnChanges, AfterViewInit,OnDestroy {
  @Input() deliveryInfo: any;
  @Input() expressCheckout: any;
  savedCards: boolean;
  divIdDe:any;
  klarnaDeName:any;
  creditcardName:any;
  giftcardName:any;
  deSpecificData:boolean;
  selectedPayType: string;
  cartData: any;
  shippingInfo: any;
  payType: Array<any>;
  switchPaymentType: string;
  expressCard: boolean;
  pageLoad: boolean;
  constructor(
    public singletonServ: SingletonService,
    public cyberService: cardFormComponentService,
    public router: Router,
    public route: ActivatedRoute,
    public KlarnaService:KlarnaService,
    public gtmServe: GtmMethodService
  ) {
    this.switchPaymentType = "";
   
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
         this.shippingInfo = changes["deliveryInfo"]["currentValue"];
      }
    }
    if (changes["expressCheckout"]) {
      if (changes["expressCheckout"]["currentValue"] != undefined) {
        if (changes["expressCheckout"]["currentValue"]) {
          this.expressCard = true;
        } else {
          this.expressCard = false;
        }

      }
    }
  }

  ngOnInit() {
    this.pageLoad = true;
    this.constructPayType(); 
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "DE") {
      this.deSpecificData=true;
      this.divIdDe="GermanData"
    }

    const _timeout = new Date();
    _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime);            
     this.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
     this.singletonServ.sessionStarts=true;
 }

 constructPayType() {
  const baseSite = this.singletonServ.catalogVersion;
  if (baseSite.isoCode == "DE") {
    this.klarnaDeName="Rechnung";
    this.creditcardName="Kredit- oder Debitkarte";
    this.giftcardName="Geschenkgutschein";
    this.divIdDe="GermanData"
  }
  else{
    this.creditcardName="Credit or Debit Card";
    this.giftcardName="Gift Card";
    this.divIdDe="Non-GermanData"
  }

  

  const _payType = [
    {
      name: this.creditcardName,
      value: 'credit'

    },
    {
      name: 'PayPal',
      value: 'paypal',
      disabled:(baseSite.csAgent)?true:false
    },

  ];
  const _payTypeGift = [
    {
      name: this.giftcardName,
      value: 'gift',
      disabled:this.checkGiftCardEntry()
    }
  ]

  if (baseSite.isoCode == "DE") {
    const klarna = [{
      name: 'Rechnung',
      value: 'klarna',
      disabled:(baseSite.csAgent)?true:false
    }, {
      name: 'SEPA',
      value: 'sepa',
      disabled:(baseSite.csAgent)?true:false
    }];
    const _pay = _.unionBy(_payType, klarna,_payTypeGift, 'value');
    _.uniq(_pay);      
     this.payType = _pay; 
     if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.getSavedCards();
    }else{
      this.pageLoad = false;
    }
  } else {
    this.payType = _.unionBy(_payType,_payTypeGift, 'value');;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.getSavedCards();
    }else{
      this.pageLoad = false;
    }
  }
}
 getSavedCards() {
  const baseSite = this.singletonServ.catalogVersion;
  if (this.singletonServ.getStoreData(baseSite.reg)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));  
     this.retrieveSaveCard(baseSite,user.token,user.email)
  }
}

retrieveSaveCard(baseSite,token,email){
    
  this.cyberService.getUserSavedCards(baseSite,token,email).subscribe((response) => {
    if (response) {
        this.shippingInfo['cardForm'] = {
          listOfCards: []
        }
        if (response.length != 0) {
          response.sort((a, b) => {
            return b.isDefault - a.isDefault;
          });
          this.shippingInfo['cardForm']['listOfCards'] = response;
          if(this.expressCheckout){
            this.payType.map((obj)=>{
              if(obj.value == 'credit'){
                  obj['selected']=true;
              } else {
                obj['selected']=false;
              }
            });
            this.switchPaymentType = 'credit';
          }          
          this.pageLoad = false;
        }else{
          this.pageLoad = false;
        }
    }
    this.pageLoad = false;
  }, err => {
    this.pageLoad = false;
    if(err.error){
      if(err.error["errors"]){
        if(err.error["errors"][0]){
          if(err.error["errors"][0]['type']== "InvalidTokenError") {
            this.cyberService.generateCartToken(baseSite).subscribe(
              (resp:any) => {
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.retrieveSaveCard(baseSite,resp["access_token"],email);
               });
          }
        }
        }
       }
  });
}

  ngAfterViewInit() {
    this.singletonServ.giftWithcardForm=undefined;
    const _baseSite = this.singletonServ;
    const pageType = 'Delivery Type';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
    this.singletonServ.getMessage().subscribe(message => {
     if (message.payTypeCardDetails){
        this.shippingInfo['cardForm']['listOfCards'] = message.cardList;
        this.pageLoad=false;
      } else if (message.setLoading){
        this.pageLoad=message.setLoading.status;
      }
    });
  }
  checkGiftCardEntry(){
    if ( this.singletonServ.cartObj ){
     const cart = this.singletonServ.cartObj;
     const _checkGiftEntry = _.find(cart.entries,(obj)=>{
      return obj.product.isGiftCard
     })
       if(_checkGiftEntry){
         return true
       }else{
         return false
       }
    }
    return false
  }
  onDeleveryPayType(pay, k,status) {
    let cart=this.singletonServ.cartObj;
    this.singletonServ.giftWithcardForm=undefined;
    if(pay =='credit'){
      conv_creditDebitSelect =1;
    _conv_q = _conv_q || []; 
    _conv_q.push(["run","true"]);

    }
    else if(pay =='paypal'){
      conv_payPalSelect =1;
    _conv_q = _conv_q || []; 
    _conv_q.push(["run","true"]);
    }
    else if(pay =='gift'){
      conv_giftcardSelect =1;
    _conv_q = _conv_q || []; 
    _conv_q.push(["run","true"]);
    }
    if (!status) {
      this.pageLoad=true;
      this.switchPaymentType='';
      this.expressCheckout=false;
      this.payType.map((obj, i) => {
        if (i == k) {
          obj['selected'] = true;
          if(pay == 'klarna'){
            this.selectedPayType = pay;
            this.switchPaymentType = pay;
          }else{
            setTimeout(()=>{
              this.pageLoad=false;
              this.selectedPayType = pay;
               this.switchPaymentType = pay;
            },200);
          }

        } else {
          obj['selected'] = false;
        }
      });
      this.singletonServ.scrollToTarget("#mb_payment_header");
     
    }else{
      this.pageLoad=false;
    }
  }
  setRetrieveCall(pay){
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));      
      this.setRetrieveRG(baseSite,user.token,user.email,pay)
    }
  }
  setRetrieveRG(baseSite,token,email,pay){
    this.cyberService.getUserSavedCards(baseSite,token,email).subscribe((response) => {
      if (response) {
          this.shippingInfo['cardForm'] = {
            listOfCards: []
          }
          if (response.length != 0) {
            response.sort((a, b) => {
              return b.isDefault - a.isDefault;
            });
            this.shippingInfo['cardForm']['listOfCards'] = response;        
            this.pageLoad=false;
            this.selectedPayType = pay;
             this.switchPaymentType = pay;
          }else{
            this.pageLoad = false;
          }
      }
      this.pageLoad = false;
    }, err => {
      this.pageLoad = false;
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.cyberService.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                      const _reg=(email!='anonymous')?true:false;
                      if(_reg){
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this.setRetrieveRG(baseSite,resp["access_token"],email,pay);
                      }else{
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this.setRetrieveRG(baseSite,resp["access_token"],email,pay);
                      }
                    });
            }
          }
          }
         }
    });
  }

  createSession(index){
    const baseSite = this.singletonServ.catalogVersion;
    const _body={
     billingAddress:this.shippingInfo.customerAddress
    }
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const reg = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.createKlarnaSession(reg.token,reg.email,reg.code,_body,index);
    }else if(this.singletonServ.getStoreData(baseSite.guest)){
      const guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.createKlarnaSession(guest.token,'anonymous',guest.guid,_body,index);
    }
  }
  createKlarnaSession(token,email,code,_body,index){
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.csAgent){
      _body['isAsm']=true;
    }
    this.KlarnaService.creatKlarnaSession(baseSite,token,email,code,_body).subscribe((resp:any)=>{
      if(resp){
         Klarna.Payments.init({client_token:resp.clientToken}); 
         this.payType[index]['selected']=true;
         this.pageLoad=false;
      }
    },err=>{
      this.pageLoad=false;
    });
   }
  ngOnDestroy(){
    this.switchPaymentType = undefined;
  }
}
