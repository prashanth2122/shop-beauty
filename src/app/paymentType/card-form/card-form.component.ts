import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  SimpleChange,
  ViewChild,
  ElementRef,
  NgZone,  
  OnDestroy
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { patternValidator } from '../../forms/pattern-validator';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import { cardFormComponentService } from "./card-form.service";
import { SingletonService } from "../../services/singleton.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { DeliveryComponentService } from "../../checkout-cart/delivery/delivery.service";
import { countries } from "../../app.constant";
import { TranslateServiceSubService } from '../../pipe/translate-service-sub.service';
import { Subscription, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import * as _ from "lodash";
declare var Cardinal: any;
declare var window: any;
declare var $:any;
declare var conv_placeOrder:number;
declare var conv_moveToBilling:number;
declare var conv_creditDebit_changeBilling:number;
declare var conv_cancelBillingAddr:number;
declare var _conv_q:any;
@Component({
  selector: "app-card-form",
  templateUrl: "./card-form.component.html",
  styleUrls: ["./card-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CardFormComponent implements OnInit, OnChanges,OnDestroy {
  @Input() deliveryInfo: any;
  @Input() showSubmitBtn: any;
  @Input() updateSavedCard: any;
  @Input() formType: any;
  @ViewChild("paymentCardEl") paymentCardEl: ElementRef;
  switchMode: string;
  checkoutForm: FormGroup;
  reg: boolean;
  termsForm: any;
  billingAddress: boolean;
  countries: Array<any> = JSON.parse(JSON.stringify(countries));
  cardDetailForm: FormGroup;
  expireMonth: Array<any>;
  expireYear: Array<any>;
  shippingAddress: any;
  loading: boolean;
  currentUser: boolean;
  payType: boolean;
  cardDetail: any;
  isValidFormSubmitted: boolean;
  cards: any;
  cardList: Array<any> = [];
  addressForm: FormGroup;
  copyOfShippingAddress: any;
  newCard: boolean;
  sessionID: any;
  jwtToken: string;
  clickColllectGeoPoint:any;
  loadingText:string;
  errorvalidationMsg:boolean;
  private unsubscribe$=new Subject<void>();
  private validUnsubscribe$=new Subject<void>();
  csServiceContact:string;
  systemIp:string;

  subscription: Subscription;
  systemIPsubscription:Subscription;
  cartTokenSubscription:Subscription;
  addpaySubscription:Subscription;
  generateCartSubscription:Subscription;
  expressPaySubscription:Subscription;
  generateJWTSubscription:Subscription;
  shippinngSubscription:Subscription;
  validateExpresPaySubscription:Subscription;
  payAuthSubscription:Subscription;
  confirmOrderSubscription:Subscription;
  postCardSubscription:Subscription;
  validPayModeSubscription:Subscription;

  outofStock:boolean;
  outofStockList:Array<any>;
  cardType: Array<any> = [
    {
      content:'Visa',
      value:'visa',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^4(?:[0-9]{12}|[0-9]{15})$/)
      ]
    },
    {
      content:'Visa Debit',
      value:'visa',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^4(?:[0-9]{12}|[0-9]{15})$/)
      ]
    },
    {
      content:'V-Pay',
      value:'vpay',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^4(?:[0-9]{12}|[0-9]{15})$/)
      ]
    },
    {
      content:'Mastercard', 
      value:'master',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required, 
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^5[1-5][0-9]{14}$/)
      ]
    },
    {
      content:'MasterCard Debit', 
      value:'master',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^5[1-5][0-9]{14}$/)
      ]
    },
    {
      content:'American Express', 
      value:'amex',
      secureCode:4,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{4,4}$/)],
      validators:[
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15),
        patternValidator(/^3[47][0-9]{13}$/)
      ]
    }
  ];
  constructor(
    public location: Location,
    public router: Router,
    public singletonServ: SingletonService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public _checkOutForm: PaymentGateWayForm,
    public cyberService: cardFormComponentService,
    public deviceService: DeviceDetectorService,
    public deliveryServ: DeliveryComponentService,
    private translate: TranslateServiceSubService,
    public ngZone:NgZone,
    private el: ElementRef
  ) {
    this.loadingText="loading";
    this.cardDetailForm = this.fb.group({
      paymentCard: this.fb.group(_checkOutForm.getCardForm()),
      saveCard: [''],
      terms: this.fb.group({
        terms: ['', [Validators.required]],
        policy: ['']
      }),
      billingForm: ['', [Validators.required]]
    });
    this.checkoutForm = this.fb.group({
      cardForm: this.fb.group(this._checkOutForm.getExpressCheckoutForm()),
      cardDetailForm: this.fb.group({
        group: this._checkOutForm.getCardForm()
      }),
      terms: this.fb.group({
        terms: ['', [Validators.required]],
        policy: ['']
      })
    });
    this.addressForm = this.fb.group({
      billingForm: this.fb.group(_checkOutForm.getCCForm())
    });
    this.loading = false;
    const monthBox = [];
    const yearBox = [];
    for (let i = 1; i <= 12; i++) {
      if (i >= 10) {
        const obj = { month: "" + i };
        monthBox.push(obj);
      } else {
        const obj = { month: "0" + i };
        monthBox.push(obj);
      }
    }
    this.expireMonth = monthBox;
    const date = new Date();
    for (let k = 0; k <= 24; k++) {
      const obj = { year: date.getFullYear() + k };
      yearBox.push(obj);
    }
    this.expireYear = yearBox;
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
        const _dt = changes["deliveryInfo"]["currentValue"];
        this.shippingAddress = _dt;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          if (_dt['cardForm']) {
            if (_dt['cardForm']['listOfCards']) {
              if (_dt['cardForm']['listOfCards'].length != 0) {
                this.cardList = _dt['cardForm']['listOfCards'];
                const index = _.findIndex(this.cardList, (obj) => {
                  return obj.isDefault
                });
                if (index != -1) {
                  const _chectypeIndex=_.findIndex(that.cardType,(card)=>{
                    return  that.cardList[index].cardType==card.value;
                  });
                  if(_chectypeIndex !=-1){
                    this.checkoutForm.controls.cardForm['controls'].secureCode.setValidators(that.cardType[_chectypeIndex].cvvValidation);
                  }
                  this.checkoutForm.controls.cardForm['controls']["cardType"].patchValue(that.cardList[index])
                }
                if (_dt.geoPoint) {
                  this.switchMode = "encryptCard";
                  this.payType = false;
                } else {
                  this.switchMode = "encryptCard";
                  this.payType = true;
                }
              } else {
                if (_dt.geoPoint) {
                  this.switchMode = (this.shippingAddress.customerAddress)?"cardForm":"billingForm";
                  this.payType = false;
                } else {
                  this.switchMode = "cardForm";
                  this.payType = true;
                }
              }
            } else {
              if (_dt.geoPoint) {
                this.switchMode = (this.shippingAddress.customerAddress)?"cardForm":"billingForm";
                this.payType = false;
              } else {
                this.switchMode = "cardForm";
                this.payType = true;
              }
            }
            this.copyOfShippingAddress = this.nestedCopy(_dt)
          } else {
            if (_dt.geoPoint) {
              this.switchMode = (this.shippingAddress.customerAddress)?"cardForm":"billingForm";
              this.payType = false;
            } else {
              this.switchMode = "cardForm";
              this.payType = true;
            }
          }
        } else {
          if (_dt.geoPoint) {
            this.switchMode = (this.shippingAddress.customerAddress)?"cardForm":"billingForm";
            this.payType = false;
          } else {
            this.switchMode = "cardForm";
            this.payType = true;
          }
        }
      }
    }
  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="US"){
      this.csServiceContact="uscustomerservice@moltonbrown.com"
    }else{
      this.csServiceContact="customerservice@moltonbrown.com"
    }
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.currentUser = true;
    } else {
      this.currentUser = false;
    }
    if (this.singletonServ.getStoreData('paypalGuest')) {
      this.singletonServ.removeItem('paypalGuest');
    }
    if (this.singletonServ.getStoreData('order')) {
      this.singletonServ.removeItem('order');
    }
    if (this.singletonServ.getStoreData('accCreationDtl')) {
      this.singletonServ.removeItem('accCreationDtl');
    }
    /**function allows you to pass a configuration object into Songbird */
    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
    this.getSystemIp();
    if(!baseSite.csAgent){
      this.generateJWT();
    }
  }
  getSystemIp(){
   this.systemIPsubscription=  this.cyberService.getSystemIp().subscribe((resp:any)=>{
      this.systemIp=resp.ip;
    },err=>{
      
    })
  }
    onChangeBLAddress(event){
    if (event.target.checked) {
      conv_moveToBilling=1;
      _conv_q = _conv_q || [];
      _conv_q.push(["run","true"]);
      this.cardDetailForm['controls']['billingForm'].setValue(true);
    } else {
      this.cardDetailForm['controls']['billingForm'].setValue(false);
      this.cardDetailForm['controls']['billingForm'].setErrors({'incorrect': true});
    }
  }
  onSetTerms(data) {
    if (data.check) {
      this.cardDetailForm['controls']['terms']['controls']['terms'].setValue(true);
    } else {
      this.cardDetailForm['controls']['terms']['controls']['terms'].setValue(false);
      this.cardDetailForm['controls']['terms']['controls']['terms'].setErrors({'incorrect': true});
    }
  }
  onSetPolicyTerms(data){
    if (data.check) {
      this.cardDetailForm['controls']['terms']['controls']['policy'].setValue(true);
    } else {
      this.cardDetailForm['controls']['terms']['controls']['policy'].setValue('');
    }
  }
  onSetEncryptCardTerms(data) {
    if (data.check) {
      this.checkoutForm['controls']['terms']['controls']['terms'].setValue(true);
    } else {
      this.checkoutForm['controls']['terms']['controls']['terms'].setValue(false);      
      this.checkoutForm['controls']['terms']['controls']['terms'].setErrors({'incorrect': true});
    }
  }
  onSetEncryptPolicyTerms(data){
    if (data.check) {
      this.checkoutForm['controls']['terms']['controls']['policy'].setValue(true);
    } else {
      this.checkoutForm['controls']['terms']['controls']['policy'].setValue('');
    }
  }

  onSetBillingAddress(data) {
    this.billingAddress = true;
    this.switchMode = "cardForm"
    this.shippingAddress.customerAddress = data.address;
    this.cardDetailForm['controls']['billingForm'].setValue(true);
  }

  setLang(lang: string) {
    this.translate.use(lang);
  }


  generateJWT() {
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode!="US"){
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if (_user.token) {
        this.generateJWTToken(baseSite,_user.token, _user.email, _user.code);
      } else {
       this.cartTokenSubscription= this.cyberService.generateCartToken(baseSite).subscribe((resp) => {
          const token = resp["access_token"];
          _user['token'] = token;
          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
          this.generateJWTToken(baseSite,_user.token, _user.email, _user.code);
        }, err => {

        });

      }

    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        if (_guest.token) {
          this.generateJWTToken(baseSite,_guest.token, 'anonymous', _guest.guid);
        } else {
          this.cartTokenSubscription= this.cyberService.generateCartToken(baseSite).subscribe((resp) => {
            const token = resp["access_token"];
            _guest['token'] = token;
            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_guest));
            this.generateJWTToken(baseSite,token, 'anonymous', _guest.guid);
          }, err => {

          });

        }
      }
    }
  }
  }

  generateJWTToken(baseSite,token, email, code) {
   this.generateJWTSubscription= this.cyberService.generateJWT(baseSite,token, email, code).subscribe((response: any) => {
      if (response) {
        this.jwtToken = response.jwtToken;
      }
    }, err => {
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                      const _reg=(email!='anonymous')?true:false;
                      if(_reg){
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this.generateJWTToken(baseSite,resp["access_token"], email, code);
                      }else{
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this.generateJWTToken(baseSite,resp["access_token"], email, code);
                      }
                    });
            }
          }
          }
         }
    });
  }


 
  getTypeOf(val) {
    if ((typeof (val) == 'boolean') && !val) {
      return true
    }
    return false
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }



  onChangeCardType(event) {
  }
  onChangeBillingAddress() {
    this.loading = true;
    setTimeout(()=>{
      this.loading = false;
    },200)
    this.billingAddress = false;
    conv_creditDebit_changeBilling = 1;
    _conv_q = _conv_q || [];
    _conv_q.push(["run","true"]);

    this.switchMode = "billingForm"
  }

  addUserAddress(_address, tokenId, email, code) {
   const baseSite=this.singletonServ.catalogVersion;
   this.shippinngSubscription= this.cyberService
      .addCCShippingAddress(baseSite,tokenId, _address, email, code)
      .subscribe(
        response => {
          this.billingAddress = true;
          this.switchMode = "cardForm"
          this.loading = false;
        },
        err => {
          this.loading = false;
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                          const _reg=(email!='anonymous')?true:false;
                          if(_reg){
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.addUserAddress(_address,resp["access_token"], email, code);
                          }else{
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            this.addUserAddress(_address,resp["access_token"], email, code);
                          }
                        });
                }
              }
              }
             }
        }
      );
  }
  onResetAddress() {
    conv_cancelBillingAddr = 1;
    _conv_q = _conv_q || [];
    _conv_q.push(["run","true"]);
    this.billingAddress = true;
    this.switchMode = "cardForm";
    if(this.cardDetailForm['controls']['billingForm'].value){
     this.cardDetailForm['controls']['billingForm'].setValue(true);
    }
  }

  saveCardDetail(event) {
    if (event.target.checked) {

    }
  }
   onChangeCard(card) {
    this.cardList=card.cardList;
    this.checkoutForm.controls.cardForm['controls'].secureCode.reset();
    if(card.type == "amex" ){
      this.checkoutForm.controls.cardForm['controls'].secureCode.setValidators([Validators.required,patternValidator(/^[0-9]{4,4}$/)]);
      this.checkoutForm.controls.cardForm['controls'].secureCode.updateValueAndValidity(); 
    }else{
      this.checkoutForm.controls.cardForm['controls'].secureCode.setValidators([Validators.required,patternValidator(/^[0-9]{3,3}$/)]);
      this.checkoutForm.controls.cardForm['controls'].secureCode.updateValueAndValidity(); 
    }
    this.checkoutForm.updateValueAndValidity();
    // this.checkoutForm.controls[].reset(); 
  }
  onAddNewCard() {
    this.loadingText="loading";
    this.newCard = true;
    this.cardDetailForm = this.fb.group(this._checkOutForm.getCardForm());
  }
  onEditCard() {
    this.loadingText="loading";
    this.newCard = true;
  }

  cancelEMit(data) {
    this.newCard = false;
    if(data.cardList){
      this.cardList = data.cardList;
    }
    this.checkoutForm.reset();
    const index = _.findIndex(this.cardList, (obj) => {
      return obj.isDefault
    });
    if (index != -1) {
      const _chectypeIndex=_.findIndex(this.cardType,(card)=>{
        return  this.cardList[index].cardType==card.value;
      });
      if(_chectypeIndex !=-1){
        this.checkoutForm.controls.cardForm['controls'].secureCode.setValidators(this.cardType[_chectypeIndex].cvvValidation);
      }
      this.checkoutForm.controls.cardForm['controls']["cardType"].patchValue(this.cardList[index])
    }

  }






  
  /** Start of Encrypted pay */
  keyDownEncryptFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onPaymentContinue(event);
      return false;
    }
  }
  onPaymentContinue(event){
  event.preventDefault();
  const baseSite = this.singletonServ.catalogVersion;
  if (!this.checkoutForm.valid) {
      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
      if(formGroupInvalid.length !=0){
        (<HTMLInputElement>formGroupInvalid[0]).focus();
      }
      setTimeout(()=>{              
        this.setCheckFormFocus(this.checkoutForm);
      });
  }
      if(baseSite.csAgent){
      const encryptedCard = this.checkoutForm.value.cardForm;
      const encryptedTerms = this.checkoutForm.value.terms;
      const cardsList = this.cardList;
      this.errorvalidationMsg=false;
      const index = _.findIndex(cardsList, (obj) => {
        return obj.isDefault
      });
      const _ccAccnumber=cardsList[index]['ccaccountnumber'];
      const _accountHolderName=cardsList[index]['firstName'] + ' ' + cardsList[index]['lastName'];
      const _terms =this.checkoutForm['controls']['terms'].valid;
      const _secureCodeValid=this.checkoutForm['controls']['cardForm']['controls']["secureCode"].valid;
      if(_ccAccnumber){
      if (_secureCodeValid && _terms) {
        if (this.singletonServ.getStoreData(baseSite.reg)) {
            const billingAddress =  cardsList[index]['billingAddress'];
            const profileId = cardsList[index]['profileID'];
            const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
            const obj = {
              accountHolderName: _accountHolderName,
              cardNumber: _ccAccnumber,
              cardType: {
                code: cardsList[index]['cardType']
              },
              expiryMonth: cardsList[index]['expirationmonth'],
              expiryYear: cardsList[index]['expirationyear'],
              billingAddress: billingAddress,
              issueNumber: encryptedCard.secureCode
            };
            obj['newsletterOptIn']=(encryptedTerms.policy)?encryptedTerms.policy:false;
            this.loading = true;
            this.singletonServ.scrollToTarget("#mb_payment_header");
            if(baseSite.isoCode == "DE"){
              this.loadingText="Bitte warten Sie, während wir Ihre Bestellung abschicken...";  
            }
            else{
              this.loadingText="Please wait while we submit your order... ";
            }
            
            this.singletonServ.sendMessage({ toggleOverlay: { status: true } });
            this.expresspayment (user.token, user.email, user.code, obj, profileId);
          }
        } else {
          this.validateAllFormFields(this.checkoutForm);
          setTimeout(()=>{              
            this.setCheckFormFocus(this.checkoutForm);
          });
        }
      } else{
        this.validateAllFormFields(this.checkoutForm);
        setTimeout(()=>{              
          this.setCheckFormFocus(this.checkoutForm);
        });
      } 
    }else{
     this.onNonAsmPayment();
    }
  
}

  onNonAsmPayment() {  
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    const encryptedCard = this.checkoutForm.value.cardForm;
    const encryptedTerms = this.checkoutForm.value.terms;
    const cardsList = this.cardList;
    this.errorvalidationMsg=false;
    const index = _.findIndex(cardsList, (obj) => {
      return obj.isDefault
    });
    const _ccAccnumber=cardsList[index]['ccaccountnumber'];
    const _terms =this.checkoutForm['controls']['terms'].valid;
    const _accountHolderName = cardsList[index]['firstName'] + ' ' + cardsList[index]['lastName'];
    const _secureCodeValid=this.checkoutForm['controls']['cardForm']['controls']["secureCode"].valid;
    if(_ccAccnumber){
    if (_secureCodeValid && _terms) {
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const billingAddress =  cardsList[index]['billingAddress'];
        const profileId = cardsList[index]['profileID'];
        const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const obj = {
          accountHolderName:_accountHolderName,
          cardNumber: _ccAccnumber,
          cardType: {
            code: cardsList[index]['cardType']
          },
          expiryMonth: cardsList[index]['expirationmonth'],
          expiryYear: cardsList[index]['expirationyear'],
          billingAddress: billingAddress,
          issueNumber: encryptedCard.secureCode
        };
        obj['newsletterOptIn']=(encryptedTerms.policy)?encryptedTerms.policy:false;
        this.loading = true;
        this.singletonServ.scrollToTarget("#mb_payment_header");
        if(baseSite.isoCode == "DE"){
          this.loadingText="Bitte warten Sie, während wir Ihre Bestellung abschicken...";  
        }
        else{
          this.loadingText="Please wait while we submit your order... ";
        }
        this.singletonServ.sendMessage({ toggleOverlay: { status: true } });
        if(baseSite.isoCode=="US"){
          this.expresspayment (user.token, user.email, user.code, obj, profileId);
        } else if(cardsList[index]['cardType']=='vpay'){
          this.expresspayment (user.token, user.email, user.code, obj, profileId);
        } else {
          const jwt = this.jwtToken;
          if ('Cardinal' in window) {
            Cardinal.configure({ logging: { level: 'verbose' } });
            Cardinal.on("payments.setupComplete", function(setupCompleteData){
               if(setupCompleteData){
                 that.sessionID=setupCompleteData.sessionId;
                 const _encryptcardsList = that.cardList;
                 const _encryptindex = _.findIndex(_encryptcardsList, (obj) => {
                   return obj.isDefault
                 });
                 const _encryCardNumber=_encryptcardsList[_encryptindex]['ccaccountnumber'];
                 if(_encryCardNumber){
                    const _cardNumber= _encryCardNumber.toUpperCase();
                     const _binNumber=  _cardNumber.substring(0,_cardNumber.indexOf('X'));
                     Cardinal.trigger("bin.process", _binNumber);
                     that.expressPayAuthentication(user.token,user.email,user.code,obj,profileId, setupCompleteData.sessionId);  
                }
              }
            });        
            Cardinal.setup('init', {
              jwt: jwt
            });
          }
        }
      }
    } else {
      this.validateAllFormFields(this.checkoutForm);
    }
} else{
  this.validateAllFormFields(this.checkoutForm);
} 
}

  
  expresspayment(token,email,code,obj,profileID){
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.csAgent){
      obj['isAsm']=true;
    }
    obj['systemIP']=this.systemIp;
  this.expressPaySubscription=this.cyberService.expressPayment(baseSite,token,email, code, obj, profileID).subscribe((response:any) => {
      Cardinal.off("payments.setupComplete");
      if(response.outOfStock || response.insufficientStock){
        if(response.outOfStock.outOfStockFlag){
          this.ngZone.run(() =>{ 
            this.outofStock=true;
            this.outofStockList=response.outOfStock.products;
            this.loading = false;
            this.loadingText="loading";
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
        } else if(response.insufficientStock){
          if(response.insufficientStock.insufficientStockFlag){
            this.ngZone.run(() =>{ 
              this.outofStock=true;
              this.outofStockList=response.insufficientStock.products;
              this.loading = false;
              this.loadingText="loading";
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            });
          }
        }
      }else if(response.errorCode){
            if(response.errorCode=="231"||response.errorCode=="400"||response.errorCode== "476"){
            }
          this.ngZone.run(() =>{ 
            this.loading = false;
            this.errorvalidationMsg=true;
            this.loadingText="loading";
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
      }else{
        if(response.code){
        this.errorvalidationMsg=false;
        response['reg'] = true;
        response['email'] = email;
        response['token'] = token;
        this.singletonServ.setStoreData("order", JSON.stringify(response));
        this.ngZone.run(() => {
          this.loading = false;
          this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
          this.router.navigate(['/checkout','mbOrderConfirmResponse']);
        });
       }else{
        this.ngZone.run(() =>{ 
          this.loading = false;
          this.loadingText="loading";
          this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
       }
      }

    }, err => {
      this.ngZone.run(() =>{ 
        this.loadingText="loading";
       this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
       this.loading = false;
       if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                      const _reg=(email!='anonymous')?true:false;
                      if(_reg){
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this. expresspayment(resp["access_token"],email,code,obj,profileID);
                      }else{
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this. expresspayment(resp["access_token"],email,code,obj,profileID);
                      }
                    });
            }
          }
          }
         }
      });
    });
}
  
  expressPayAuthentication(token, email, code, obj,profileID, sessionID){
  const that=this;
  const baseSite = this.singletonServ.catalogVersion;
  obj['systemIP']=this.systemIp;
  this.expressPaySubscription=this.cyberService.expressPaymentAuthentication(baseSite,token,email,code,obj,profileID,sessionID).pipe(takeUntil(this.unsubscribe$)).subscribe((resp:any)=>{
     Cardinal.off("payments.setupComplete");
    if (resp) {
      if(resp.errorCode){
          if(resp.errorCode=="231" || resp.errorCode=="400" || resp.errorCode== "476"){
          }
          this.ngZone.run(() =>{ 
            this.loading = false;
            this.errorvalidationMsg=true;
            this.loadingText="loading";
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
      }  else  if(!resp.isenabledforSecurePayment){
        this.errorvalidationMsg=false;
        this.expresspayment(token,email,code,obj,profileID);
      } else {
      this.errorvalidationMsg=false;
      const _acsUrl = resp['ACSUrl'];
      const _payload = resp['payReq'];
      const _transactionID = resp['transactionID'];
      Cardinal.continue('cca',
        {
          AcsUrl: _acsUrl,
          Payload: _payload
        },
        {
          OrderDetails:
          {
            TransactionId: _transactionID
          }
        });
       Cardinal.on('payments.validated', function(decodedResponseData, responseJWT){          
             if(decodedResponseData.Payment){
              const _transactionID= decodedResponseData.Payment.ProcessorTransactionId;
              that.validateExpressPayMode(token, email, code, obj,responseJWT,_transactionID,profileID);
            } else{
              this.ngZone.run(() =>{ 
                this.loadingText="loading";
                this.loading = false;
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                });
            }
      }); 
     }
   }  
 },err=>{
  Cardinal.off("payments.setupComplete");
  this.ngZone.run(() =>{ 
    this.loadingText="loading";
    this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
    this.loading = false;
    if(err.error){
      if(err.error["errors"]){
        if(err.error["errors"][0]){
          if(err.error["errors"][0]['type']== "InvalidTokenError") {
            this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
              (resp:any) => {
                    const _reg=(email!='anonymous')?true:false;
                    if(_reg){
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.expressPayAuthentication(resp["access_token"], email, code, obj,profileID, sessionID);
                    }else{
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                      this.expressPayAuthentication(resp["access_token"], email, code, obj,profileID, sessionID);
                    }
                  });
          }
        }
        }
       }
    });
 });
}
validateExpressPayMode(token, email, code, obj,responseJWT,_transactionID,profileID){
  const baseSite = this.singletonServ.catalogVersion;
  obj['systemIP']=this.systemIp;
 this.validateExpresPaySubscription= this.cyberService.validateExpressPayMode(baseSite,token, email, code, obj,responseJWT,_transactionID,profileID).pipe(takeUntil(this.validUnsubscribe$)).subscribe((response:any)=>{
    Cardinal.off('payments.validated');
    if(response){   
          if(response.errorCode){
            this.ngZone.run(() =>{ 
              this.loading = false;
              this.errorvalidationMsg=true;
              this.loadingText="loading";
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            });
              if(response.errorCode=="231"||response.errorCode=="400"||response.errorCode== "476"){
              }
          }else{
            if(response.code){
            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
            response['reg'] = true;
            response['email']=user.email;
            response['token']=user.token;
            this.singletonServ.setStoreData("order", JSON.stringify(response));
            this.ngZone.run(() => {
              this.loading = false;
              this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
              this.router.navigate(['/checkout','mbOrderConfirmResponse'])
            });
           }else{
            this.ngZone.run(() =>{ 
              this.loading = false;
              this.loadingText="loading";
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
           }
          }
    } else {
      this.ngZone.run(() =>{ 
        this.loadingText="loading";
        this.loading = false;
        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
        });
    }
  },err=>{
    Cardinal.off('payments.validated');
    this.ngZone.run(() =>{ 
      this.loadingText="loading";
    this.loading = false;
    this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
    });
  });
}
  /** End of Encrypted pay */



    /*Normal Form Checkout */
    keyDownFunction(event){
      if(event.keyCode==13){
        event.target.blur();
        this.oncheckoutContinue(event);
        return false;
      }
  }
oncheckoutContinue(event) {
      event.stopPropagation();
      event.preventDefault();
      const baseSite = this.singletonServ.catalogVersion;
      if (!this.checkoutForm.valid) {
        const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
        if(formGroupInvalid.length !=0){
          (<HTMLInputElement>formGroupInvalid[0]).focus();
        }
    }
    const cardForm = this.cardDetailForm.value.paymentCard;
    if(baseSite.csAgent){
        this.paymentContinue(); 
    }else{
        this.onNonASMPaymode();
    }
}
    onNonASMPaymode(){
      const that = this;
      const baseSite = this.singletonServ.catalogVersion;
      const cardForm = this.cardDetailForm.value.paymentCard;
      this.errorvalidationMsg=false;
      let _raiseCardMonthValidatn = false;
      const date = new Date();
      if (parseInt(cardForm.year) == date.getFullYear()) {
        if (parseInt(cardForm.month) <= date.getMonth()) {
          _raiseCardMonthValidatn = true;
        }
      }
      // this.cardDetailForm.controls['paymentCard']['controls'].month.setErrors(null);
      if (this.cardDetailForm.valid) {
          conv_placeOrder = 1;
        _conv_q = _conv_q || [];
        _conv_q.push(["run","true"]);
          if (!_raiseCardMonthValidatn) {
            this.errorvalidationMsg=false;
            this.singletonServ.scrollToTarget("#mb_payment_header");
            if(baseSite.isoCode=="DE"){
              this.loadingText="Bitte warten Sie, während wir Ihre Bestellung abschicken...";
            }
            else{
              this.loadingText="Please wait while we submit your order... ";
            }
            
            this.loading=true;
            this.singletonServ.sendMessage({ toggleOverlay: { status: true } });
            if(baseSite.isoCode=="US"){
                this.paymentContinue(); 
            }else if(cardForm.cardType=='vpay'){
              this.paymentContinue(); 
            }else{
              const jwt = this.jwtToken;
              if ('Cardinal' in window) {
                Cardinal.configure({ logging: { level: 'verbose' } });
                Cardinal.on("payments.setupComplete", function(setupCompleteData){
                  if(setupCompleteData){
                    that.sessionID=setupCompleteData.sessionId;
                    that.setPay(setupCompleteData.sessionId);
                  }
                });        
                Cardinal.setup('init', {
                  jwt: jwt
                });
              }
            }
          } else{
            // this.errorvalidationMsg=true;
            this.cardDetailForm.controls['paymentCard']['controls'].month.setErrors({ 'required': {raiseValidate:true} });
            
            if(this.paymentCardEl){
            if(this.paymentCardEl['monthEl'].nativeElement){
              this.paymentCardEl['monthEl'].nativeElement.focus();
              this.singletonServ.scrollToTarget('#molthElement');
              this.validateAllFormFields(this.cardDetailForm);
            }
           } 
          }
        }else {
            this.validateAllFormFields(this.cardDetailForm);
            setTimeout(()=>{              
              this.setFormFocus();
            });
          }
    }
    setFormFocus(){
      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
      if(formGroupInvalid.length !=0){
        (<HTMLInputElement>formGroupInvalid[0]).focus();
           this.validateAllFormFields(this.cardDetailForm);
         }
    }
    setPay(sessionID) {
      const cardForm = this.cardDetailForm.value.paymentCard;
      const _terms = this.cardDetailForm.value.terms;
      Cardinal.trigger("bin.process", cardForm.cardNumber);
      this.loading = true;
      let state = '';
      const shipAddress = this.shippingAddress.customerAddress;
      const _accontHoldername=cardForm.firstName + "  " + cardForm.lastName;
      if (shipAddress.district) {
         if (typeof shipAddress.district == "object") {
              state = shipAddress.district.name;
          } else {
            state = shipAddress.district;
          }
        }
          shipAddress['firstName']=(shipAddress['firstName'])?shipAddress['firstName']:cardForm.firstName;
          shipAddress['lastName']=(shipAddress['lastName'])?shipAddress['lastName']:cardForm.lastName; 
          const obj = {
            accountHolderName:_accontHoldername,
            cardNumber: cardForm.cardNumber,
            cardType: {
              code: cardForm.cardType
            },
            expiryMonth: cardForm.month,
            expiryYear: cardForm.year,
            issueNumber: cardForm.cvv,
            defaultPayment: true,
            billingAddress: shipAddress
            
          };
          obj['newsletterOptIn']=(_terms.policy)?_terms.policy:false;
          obj['billingAddress']['district'] = state;
          this.dosecurePayMode(obj, sessionID);
 
  }
  
    dosecurePayMode(obj, sessionID) {
      const baseSite = this.singletonServ.catalogVersion;
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        this.payAuthentication(_user.token, _user.email, _user.code, obj, sessionID);
      } else {
        if (this.singletonServ.getStoreData(baseSite.guest)) {
          const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          this.payAuthentication(_guest.token, 'anonymous', _guest.guid, obj, sessionID);
        }
      }
    }
   payAuthentication(token, email, code, obj, sessionID){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    obj['systemIP']=this.systemIp;
   this.payAuthSubscription= this.cyberService.paymentAuthentication(baseSite,token, email, code, obj, sessionID).pipe(takeUntil(this.unsubscribe$)).subscribe((resp:any) => {
      Cardinal.off("payments.setupComplete");
      if (resp) {
        if(resp.errorCode){
          this.ngZone.run(() =>{ 
            this.loading = false;
            this.errorvalidationMsg=true;
            this.loadingText="loading";
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
            if(resp.errorCode=="231"||resp.errorCode=="400"||resp.errorCode== "476"){
            }

        }else if(!resp.isenabledforSecurePayment){
          this.errorvalidationMsg=false;
          this.paymentContinue(); 
         } else {
          this.errorvalidationMsg=false;
          const _acsUrl = resp['ACSUrl'];
          const _payload = resp['payReq'];
          const _transactionID = resp['transactionID'];
          Cardinal.continue('cca',
            {
              AcsUrl: _acsUrl,
              Payload: _payload
            },
            {
              OrderDetails:
              {
                TransactionId: _transactionID
              }
            });
            Cardinal.on('payments.validated', function(decodedResponseData, responseJWT){         
               if(decodedResponseData.Payment){
                const _transactionID= decodedResponseData.Payment.ProcessorTransactionId;
                that.validatePayMode(token, email, code, obj,responseJWT,_transactionID);
              }else{
                this.ngZone.run(() =>{ 
                  this.loadingText="loading";
                  this.loading = false;
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                  });
              }
         }); 
    }
  }
    }, err => {
      Cardinal.off("payments.setupComplete");
      this.ngZone.run(() =>{ 
        this.loadingText="loading";
        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
        this.loading = false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                        const _reg=(email!='anonymous')?true:false;
                        if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.payAuthentication(resp["access_token"], email, code, obj, sessionID);
                        }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.payAuthentication(resp["access_token"], email, code, obj, sessionID);
                        }
                      });
              }
            }
            }
           }
        });

    });
   }
    validatePayMode(token, email, code, obj,responseJWT,transactionID){
      const baseSite=this.singletonServ.catalogVersion;
      const cardForm = this.cardDetailForm.value.paymentCard;
      obj['systemIP']=this.systemIp;
     this.validPayModeSubscription= this.cyberService.validatePayMode(baseSite,token, email, code, obj,responseJWT,transactionID).pipe(takeUntil(this.validUnsubscribe$)).subscribe((resp:any)=>{
        Cardinal.off('payments.validated');
        if(resp){   
          if(resp.errorCode){
            this.ngZone.run(() =>{ 
              this.loading = false;
              this.errorvalidationMsg=true;
              this.loadingText="loading";
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            });
            if(resp.errorCode=="231"||resp.errorCode=="400"||resp.errorCode== "476"){

            }
          }else{

            this.singletonServ.confirmOrderObj = resp;
            resp['reg'] = (email !="anonymous")? true:false;
            if(!resp['reg']){
              resp['emmbededNumber']=  cardForm.cardNumber;  
            }
            resp['token'] = token;
            this.singletonServ.setStoreData("order", JSON.stringify(resp));
            this.savecard(token, email,obj);   
          } 
        }else{
          this.ngZone.run(() =>{ 
            this.loadingText="loading";
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            this.loading=false;
            });  
        }
      },err=>{
        Cardinal.off('payments.validated');
        this.ngZone.run(() =>{ 
          this.loadingText="loading";
        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
        this.loading=false;
        });
      });
    }

    savecard(token, email,obj:any){
      const baseSite=this.singletonServ.catalogVersion;
      const _form = this.cardDetailForm.value;
      if (_form.saveCard) {
        obj['firstName'] = obj['billingAddress']['firstName'];
        obj['lastName'] = obj['billingAddress']['lastName'];
        this.postCardSubscription=this.cyberService.postCardDetails(baseSite,token, email, obj).subscribe((saveCard:any) => {
           this.ngZone.run(() =>{ 
            this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
            this.loading=false;
            this.router.navigate(['/checkout','mbOrderConfirmResponse']);
        });
          
        }, err => {

          this.ngZone.run(() =>{ 
            this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
            this.loading=false;
            this.router.navigate(['/checkout','mbOrderConfirmResponse']);
            });
        });
        
      } else {

        this.ngZone.run(() => {
        this.loading = false;
        this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
        this.router.navigate(['/checkout','mbOrderConfirmResponse']);
      });
      }
    }
    paymentContinue() {
      event.stopPropagation();
      const cardForm = this.cardDetailForm.value.paymentCard;
      const _terms = this.cardDetailForm.value.terms;
      this.loading = true;
      const _accontHoldername=cardForm.firstName + " " + cardForm.lastName;
          let state = '';
          const shipAddress = this.shippingAddress.customerAddress;
          if (shipAddress.district) {
            if (typeof shipAddress.district == "object") {
              state = shipAddress.district.name;
            } else {
              state = shipAddress.district;
            }
          }
          shipAddress['firstName']=(shipAddress['firstName'])?shipAddress['firstName']:cardForm.firstName;
          shipAddress['lastName']=(shipAddress['lastName'])?shipAddress['lastName']:cardForm.lastName; 
          const obj = {
            accountHolderName:_accontHoldername,
            cardNumber: cardForm.cardNumber,
            cardType: {
              code: cardForm.cardType
            },
            expiryMonth: cardForm.month,
            expiryYear: cardForm.year,
            issueNumber: cardForm.cvv,
            defaultPayment: true,
            billingAddress: shipAddress
          };
          obj['billingAddress']['district'] = state;
          obj['newsletterOptIn']=(_terms.policy)?_terms.policy:false;
          this.secureDBCPayment(obj, cardForm);
  }
  
    secureDBCPayment(obj, cardForm) {
      Cardinal.off("payments.setupComplete");
      const baseSite = this.singletonServ.catalogVersion;
      this.singletonServ.sendMessage({ toggleOverlay: { status: true } });
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const data = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const code = data["code"];
        const _email = data["email"];
        this.confirmOrder(data.token, obj, _email, code);
      } else {
        if (this.singletonServ.getStoreData(baseSite.guest)) {
          const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          this.guestOrder(_user.token, obj, _user['guid']);
        }
      }
    }
  

  /**Order calls */

  guestOrder(tokenId, obj, cartGUID) {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.csAgent){
      obj['isAsm']=true;
     }
     const cardForm = this.cardDetailForm.value.paymentCard;
     obj['systemIP']=this.systemIp;
  this.confirmOrderSubscription=  this.cyberService
      .confirmOrder(baseSite,tokenId, obj, 'anonymous', cartGUID)
      .subscribe(
        (resp:any) => {
          if(resp){
            if(resp.outOfStock||resp.insufficientStock){
              if(resp.outOfStock.outOfStockFlag){
                this.ngZone.run(() =>{ 
                  this.outofStock=true;
                  this.outofStockList=resp.outOfStock.products;
                  this.loading = false;
                  this.loadingText="loading";
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                });
              } else if(resp.insufficientStock){
                if(resp.insufficientStock.insufficientStockFlag){
                  this.ngZone.run(() =>{ 
                    this.outofStock=true;
                    this.outofStockList=resp.insufficientStock.products;
                    this.loading = false;
                    this.loadingText="loading";
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                  });
                }
              }

            }else
            if(resp.errorCode){
              this.ngZone.run(() =>{ 
                this.loading = false;
                this.errorvalidationMsg=true;
                this.loadingText="loading";
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
            if(resp.errorCode=="231"||resp.errorCode=="400"||resp.errorCode== "476"){
            }
          }else
            if(resp.code){
            this.errorvalidationMsg=false;
            this.singletonServ.confirmOrderObj = resp;
            resp['reg'] = false;
            resp['token'] = tokenId;       
            resp['emmbededNumber']=  cardForm.cardNumber;  
            const _order = {
              interactionType: "SALES_ORDER",
              marketingLocationId: baseSite.store,
              sourceObjectId: resp['code'],
              sourceSystemId: "ATGWEB",
              marketingArea: "MB",
              setSourceObjectType: "ORDER"
            };
            this.singletonServ.setStoreData("order", JSON.stringify(resp));
            this.ngZone.run(() =>{ 
              this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
              this.loading=false;
              this.router.navigate(['/checkout','mbOrderConfirmResponse']);
              });
            }else{
              this.ngZone.run(() =>{ 
                this.loading = false;
                this.loadingText="loading";
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                });
            }
           
        } 
        },
        (err:any) => {
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=that.cyberService.generateCartToken(baseSite).subscribe((resp:any)=>{
                    const _user:any=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    _user.token= resp["access_token"];
                    that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
                    that.guestOrder(resp["access_token"], obj, cartGUID);
                  });
                } 
              }
              }
             }
          Cardinal.off('payments.validated');
          this.ngZone.run(() =>{ 
          this.loading = false;
          this.loadingText="loading";
          this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
        }
      );
  }
  confirmOrder(token, body, _email, code) {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.csAgent){
      body['isAsm']=true;
     }
    body['systemIP']=this.systemIp;
    this.confirmOrderSubscription=  this.cyberService
      .confirmOrder(baseSite,token, body, _email, code)
      .subscribe(
        (resp:any) => {
          if(resp){
            if(resp.outOfStock || resp.insufficientStock){
              if(resp.outOfStock.outOfStockFlag){     
                this.ngZone.run(() =>{ 
                  this.outofStock=true;
                  this.outofStockList=resp.outOfStock.products;
                  this.loading = false;
                  this.loadingText="loading";
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                });
              } else if(resp.insufficientStock){
                if(resp.insufficientStock.insufficientStockFlag){
                  this.ngZone.run(() =>{ 
                    this.outofStock=true;
                    this.outofStockList=resp.insufficientStock.products;
                    this.loading = false;
                    this.loadingText="loading";
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                  });
                }
              }
            }else
            if(resp.errorCode){
              this.ngZone.run(() =>{ 
                this.loading = false;
                this.errorvalidationMsg=true;
                this.loadingText="loading";
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
              if(resp.errorCode=="231"||resp.errorCode=="400"||resp.errorCode== "476"){
              }
            }else{
              if(resp.code){
                  this.errorvalidationMsg=false;
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                  this.singletonServ.confirmOrderObj = resp;
                  resp['reg'] = (_email !="anonymous")? true:false;
                  resp['email'] = _email;
                  resp['token'] = token;
                  this.singletonServ.setStoreData("order", JSON.stringify(resp));
                  const _form = this.cardDetailForm.value;
                  if (_form.saveCard) {
                    body['firstName'] = body['billingAddress']['firstName'];
                    body['lastName'] = body['billingAddress']['lastName'];
                   this.postCardSubscription= this.cyberService.postCardDetails(baseSite,token, _email, body).subscribe((saveCard:any) => {
                          this.ngZone.run(() =>{ 
                            this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                            this.loading=false;
                            this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                        });
                    }, err => {
                      this.ngZone.run(() =>{ 
                        this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                        this.loading=false;
                        this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                        });
                    });
                    
                  } else {

                    this.ngZone.run(() => {
                    this.loading = false;
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                    this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                  });
                  }
          }else{
            this.ngZone.run(() =>{ 
              this.loading = false;
              this.loadingText="loading";
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
          }
        }
      }
        },
        err => {
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=that.cyberService.generateCartToken(baseSite).subscribe((resp:any)=>{
                   const _usertype=  (_email !="anonymous")? true:false;
                   if(_usertype){
                     const _user:any=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    _user.token= resp["access_token"];
                    that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
                    that.confirmOrder(resp["access_token"], body, _email, code) 
                    }else{
                      const _user:any=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      _user.token= resp["access_token"];
                      that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user)); 
                      that.confirmOrder(resp["access_token"], body, _email, code) 
                    }
                  });
                }
              }
              }
             }
          Cardinal.off('payments.validated');
          this.ngZone.run(() =>{ 
          this.loading = false;
          this.loadingText="loading";
          this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
       
        }
      );
  }


  
    checkCardNumberLog(number){
      return this.singletonServ.checkCardNumber(number);
    }
  ngOnDestroy(){
    if(this.systemIPsubscription){
      this.systemIPsubscription.unsubscribe();
     }
     if( this.cartTokenSubscription){
       this.cartTokenSubscription.unsubscribe();
     }
     if(this.generateJWTSubscription){
      this.generateJWTSubscription.unsubscribe();
     }
     if(this.shippinngSubscription){
       this.shippinngSubscription.unsubscribe();
     }
     if(this.expressPaySubscription){
      this.expressPaySubscription.unsubscribe();
     }
     if(this.validateExpresPaySubscription){
       this.validateExpresPaySubscription.unsubscribe();
     }
     if(this.payAuthSubscription){
       this.payAuthSubscription.unsubscribe();
     }
     if(this.confirmOrderSubscription){
       this.confirmOrderSubscription.unsubscribe();
     }
     if(this.postCardSubscription){
       this.postCardSubscription.unsubscribe();
     }
     if(this.validPayModeSubscription){
       this.validPayModeSubscription.unsubscribe();
     }
  }

  setCheckFormFocus(form){
    const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
    if(formGroupInvalid.length !=0){
      (<HTMLInputElement>formGroupInvalid[0]).focus();
         this.validateAllFormFields(form);
       }
  }
    /*End of Normal Form Checkout */

    validateAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
        }
      });
    }
}

