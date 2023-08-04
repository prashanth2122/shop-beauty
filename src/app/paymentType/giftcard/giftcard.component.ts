import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChange,
  OnDestroy,
  NgZone,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Location } from "@angular/common";
import { 
  Router, 
  ActivatedRoute 
} from "@angular/router";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import { cardFormComponentService } from "../card-form/card-form.service";
import { SingletonService } from "../../services/singleton.service";
import { GiftCardService } from "./giftcard.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { patternValidator } from '../../forms/pattern-validator';
import { GtmMethodService } from '../../services/gtmmethods.service';
import { Subscription, Subject } from "rxjs";
import * as _ from "lodash";
declare var Cardinal: any;
declare var window: any;
declare var $:any;
declare var _conv_q:any;
declare var conv_billing_giftcardSplit:number;
@Component({
  selector: "app-giftcard",
  templateUrl: "./giftcard.component.html",
  styleUrls: ["./giftcard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GiftcardComponent implements OnInit, OnChanges,OnDestroy {
  @Input() cartData: any;
  @Input() deliveryInfo: any;
  @ViewChild("paymentCardEl") paymentCardEl: ElementRef;
  subscription: Subscription;
  postcardSubscription:Subscription;
  systemIPsubscription:Subscription;
  cartTokenSubscription:Subscription;
  addpaySubscription:Subscription;
  generateCartSubscription:Subscription;
  expresSubscruption:Subscription;
  generateJWTSubscription:Subscription;
  splitPaySubscription:Subscription;
  giftCardSubscription:Subscription;

  expressCard: boolean;
  splitPaymentText:boolean;
  cardDetailForm: FormGroup;
  newCardDetailForm: FormGroup;
  expireMonth: Array<any>;
  expireYear: Array<any>;
  paymentGiftSouce: string;
  showCard: boolean;
  shippingAddress: any;
  loading: boolean;
  deviceInfo: any;
  mobileDevice: boolean;
  desktopDevice: boolean;
  billingAddress: boolean;
  submitted: boolean;
  customerBillingAddreess: any;
  storeAddress: any;
  payType: boolean;
  newCard: boolean;
  errorCodesDisplay:boolean;
  expressForm: any;
  cardList: Array<any> = [];
  isValidFormSubmitted: boolean;
  errorMessage:any;
  erroeMsgDetail:any;
  requestErrMsg:boolean;
  invalidErrorCode:any;
  securitycode:boolean;
  jwtToken:string;
  sessionID:any;
  errorvalidationMsg:boolean;
  csServiceContact:string;
  currentUser:boolean;
  systemIp:string;

  outofStock:boolean;
  outofStockList:Array<any>;

  constructor(
    public location: Location,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public singletonServ: SingletonService,
    public giftServ: GiftCardService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public gtmServ:GtmMethodService,
    public _checkOutForm: PaymentGateWayForm,
    public cyberService: cardFormComponentService,
    private translate: TranslateServiceSubService,
    public ngZone:NgZone,
    private el: ElementRef
  ) {
    const monthBox = [];
    const yearBox = [];
    for (let i =1 ; i <= 12; i++) {
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
  getSystemIp(){
    this.systemIPsubscription=this.cyberService.getSystemIp().subscribe((resp:any)=>{
      this.systemIp=resp.ip;
    },err=>{
      
    })
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const baseSite = this.singletonServ.catalogVersion;
    if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
        const _dt = changes["deliveryInfo"]["currentValue"];
        this.newCard = false;
        this.expressForm = _dt;
        this.shippingAddress = _dt;
        if (_dt["storeType"]) {
            this.storeAddress =_dt["customerAddress"];
            this.shippingAddress['customerAddress']=_dt["customerAddress"];
        }
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          if (_dt["cardForm"]) {
            if (_dt["cardForm"]["listOfCards"]) {
              if (_dt["cardForm"]["listOfCards"].length != 0) {
                this.cardList = _dt["cardForm"]["listOfCards"];
                const index = _.findIndex(this.cardList, obj => {
                  return obj.isDefault;
                });
              }
            }
          }
        } else {
          if (_dt.geoPoint) {
            this.billingAddress = (this.shippingAddress.customerAddress)?true:false;
            this.payType = false;
          } else {
            this.billingAddress = true;
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
    if (this.singletonServ.getStoreData("paypalGuest")) {
      this.singletonServ.removeItem("paypalGuest");
    }
    if (this.singletonServ.getStoreData("order")) {
      this.singletonServ.removeItem("order");
    }
    if(this.singletonServ.getStoreData('accCreationDtl')){
      this.singletonServ.removeItem('accCreationDtl');
    }
    this.getDeviceInfo();
    this.paymentGiftSouce = "";
    if (baseSite) {
      this.setLang(baseSite.lngCode);
      if(!baseSite.csAgent){
        this. generateJWT();
      }
    }
    this.getSystemIp();

  }
  onSetTerms(data) {
    if (data.check) {
      this.cardDetailForm["controls"]["terms"]["controls"]["terms"].setValue(
        true
      );
    } else {
      this.cardDetailForm["controls"]["terms"]["controls"]["terms"].setValue(
     false
      );
      this.cardDetailForm["controls"]["terms"]["controls"]["terms"].setErrors({'incorrect': true});
    }
  }
  onSetPolicyTerms(data){
    if (data.check) {
      this.cardDetailForm['controls']['terms']['controls']['policy'].setValue(true);
    } else {
      this.cardDetailForm['controls']['terms']['controls']['policy'].setValue('');
    }
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
      this.cartTokenSubscription=  this.cyberService.generateCartToken(baseSite).subscribe((resp) => {
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
          this.cartTokenSubscription=  this.cyberService.generateCartToken(baseSite).subscribe((resp) => {
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
    this.generateJWTSubscription=this.cyberService.generateJWT(baseSite,token, email, code).subscribe((response: any) => {
      if (response) {
        this.jwtToken = response.jwtToken;
      }
    }, error => {

    });
  }
  onChangeBLAddress(event){
    if (event.target.checked) {
      this.cardDetailForm['controls']['billingForm'].setValue(true);
      this.cardDetailForm['controls']['billingForm'].setErrors(null);
    } else {
      this.cardDetailForm['controls']['billingForm'].setValue(false);
      this.cardDetailForm['controls']['billingForm'].setErrors({'required': true});
      this.cardDetailForm['controls']['billingForm'].setValidators([
        Validators.required
      ]);
      this.cardDetailForm['controls']['billingForm'].updateValueAndValidity(); 
    }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  onChangePaymentType(bol) {
    this.errorMessage=undefined;
   if (bol) {
     this.payOnlyWithGiftCard()
    } else {
      conv_billing_giftcardSplit = 1;
     _conv_q = _conv_q || [];
     _conv_q.push(["run","true"]);
     this.payWithSplit();
     
    }
    let cart =this.singletonServ.cartObj;
    // this.gtmServ.gtmSetFeed(cart,"4");
    
  }
  payWithSplit(){
    const baseSite = this.singletonServ.catalogVersion;
    this.singletonServ.scrollToTarget("#splitCard");
    this.paymentGiftSouce = "gift";
    this.showCard = true;
    this.splitPaymentText=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      if (this.shippingAddress) {
        if(this.shippingAddress.cardForm){
            if (this.shippingAddress.cardForm.listOfCards) {
              if (this.shippingAddress.cardForm.listOfCards.length != 0) {
                  this.splitPayWithMaskedCard();
              } else {
                  this.currentUser=true;
                  this.splitFormConstruct();
              }
            } else {
                  this.currentUser=true;
                  this.splitFormConstruct();
            }
        }else{
                  this.currentUser=true;
                  this.splitFormConstruct();
        }
    }

      if (this.shippingAddress.geoPoint) {
          if(this.cardList.length !=0){
            this.billingAddress=true;
            this.newCard=false;
          } else{
            this.billingAddress = (this.shippingAddress.customerAddress)?true:false;
            this.newCard= (this.shippingAddress.customerAddress)?false:true;
          }
          this.payType = false;
      } else {
        this.billingAddress = (this.shippingAddress.customerAddress)?true:false;
        this.payType = true;
        this.newCard=false;
      }
    } else {
      this.splitFormConstruct();
      if (this.shippingAddress.geoPoint) {
        this.billingAddress = (this.shippingAddress.customerAddress)?true:false;
        this.newCard=(this.shippingAddress.customerAddress)?false:true;
        this.payType = false;
      } else {
        this.billingAddress = (this.shippingAddress.customerAddress)?true:false;
        this.payType = true;
        this.newCard=false;
      }
    }
  } 

  payOnlyWithGiftCard(){
    this.paymentGiftSouce = "gift";
    if(this.singletonServ.giftcardForm){
      if(this.singletonServ.giftcardForm.controls){
      const _giftcard= this.singletonServ.giftcardForm.controls.giftcard.value;
      this.cardDetailForm = this.fb.group({
        giftcard: this.fb.group(this._checkOutForm.getGiftForm()),
        terms: this.fb.group({
          terms: ["", [Validators.required]],
          policy: [""]
        })
      });
        this.cardDetailForm.controls.giftcard.patchValue(_giftcard);
        if(this.singletonServ.giftcardForm){
          if(this.singletonServ.giftcardForm.controls.terms){
            const _termForm=this.singletonServ.giftcardForm.controls.terms.value;
            this.cardDetailForm.controls.terms.patchValue(_termForm);
          }
        }
        const formControls = this.cardDetailForm.controls;
        for (let k in formControls) {
            this.validateSwitchingFormFields(this.cardDetailForm.controls[k]);
            setTimeout(()=>{              
              this.setSwitchingFormFocus(this.cardDetailForm.controls[k]);
            });
          
        }  
      }
        this.singletonServ.giftcardForm=this.cardDetailForm;    
    }else{
        this.cardDetailForm = this.fb.group({
          giftcard: this.fb.group(this._checkOutForm.getGiftForm()),
          terms: this.fb.group({
            terms: ["", [Validators.required]],
            policy: [""]
          })
        });
        this.singletonServ.giftcardForm=this.cardDetailForm;
  }
    this.newCard = false;
    this.showCard = false;
  }
  splitFormConstruct() {
    this.billingAddress = true;
    const obj={
      giftcard: this.fb.group(this._checkOutForm.getGiftForm()),
      paymentCard: this.fb.group(this._checkOutForm.getCardForm()),
      billingForm:["", [Validators.required]],
      saveCard:[''],
      terms: this.fb.group({
        terms: ["", [Validators.required]],
        policy: [""]
      })
    };
    if(this.cardDetailForm){
      const _giftcard= this.cardDetailForm.controls.giftcard.value;
      this.cardDetailForm = this.fb.group(obj);
      this.cardDetailForm.controls.giftcard.patchValue(_giftcard);
      if(this.singletonServ.giftWithcardForm){

         if(this.singletonServ.giftWithcardForm.controls.paymentCard){
           const _paymentCard=this.singletonServ.giftWithcardForm.controls.paymentCard.value;
           this.cardDetailForm.controls.paymentCard.patchValue(_paymentCard);
         }
         if(this.singletonServ.giftWithcardForm.controls.saveCard){
           const _saveCard=this.singletonServ.giftWithcardForm.controls.saveCard.value;
           this.cardDetailForm.controls.saveCard.patchValue(_saveCard);
        }
        if(this.singletonServ.giftWithcardForm.controls.billingForm){
          const _billingForm=this.singletonServ.giftWithcardForm.controls.billingForm.value;
          if(_billingForm){
            this.cardDetailForm['controls']['billingForm'].setValue(true);
          }
       }
        if(this.singletonServ.giftWithcardForm.controls.terms){
          const _termForm=this.singletonServ.giftWithcardForm.controls.terms.value;
          this.cardDetailForm.controls.terms.patchValue(_termForm);
        }
        
      }
      const formControls = this.cardDetailForm.controls;
      for (let k in formControls) {

              this.validateSwitchingFormFields(this.cardDetailForm.controls[k]);
              setTimeout(()=>{              
                this.setSwitchingFormFocus(this.cardDetailForm.controls[k]);
              });
      }
      this.singletonServ.giftWithcardForm=this.cardDetailForm;
    }else{
      this.cardDetailForm = this.fb.group(obj); 
      this.singletonServ.giftWithcardForm=this.cardDetailForm;
    }
  }
  splitPayWithMaskedCard(){
    this.expressCard = true;
    if(this.cardDetailForm){
      const _giftcard= this.cardDetailForm.controls.giftcard.value;
        this.cardDetailForm = this.fb.group({
              giftcard: this.fb.group(this._checkOutForm.getGiftForm()),
              paymentCard: this.fb.group(this._checkOutForm.getExpressCheckoutForm()),
              billingForm:[""],
              terms: this.fb.group({
                terms: ["", [Validators.required]],
                policy: [""]
              })
        });
        this.cardDetailForm.controls.giftcard.patchValue(_giftcard);
        if(this.singletonServ.giftWithcardForm){

          // if(this.singletonServ.giftWithcardForm.controls.paymentCard){
          //   const _paymentCard=this.singletonServ.giftWithcardForm.controls.paymentCard.value;
          //   this.cardDetailForm.controls.paymentCard.patchValue(_paymentCard);
          // }
     
         if(this.singletonServ.giftWithcardForm.controls.billingForm){
           const _billingForm=this.singletonServ.giftWithcardForm.controls.billingForm.value;
           this.cardDetailForm.controls.saveCard.patchValue(_billingForm);
        }
         if(this.singletonServ.giftWithcardForm.controls.terms){
           const _termForm=this.singletonServ.giftWithcardForm.controls.terms.value;
           this.cardDetailForm.controls.terms.patchValue(_termForm);
         }
         
       }
        const formControls = this.cardDetailForm.controls;
        for (let k in formControls) {
          if ( k == "giftcard") {
            this.validateSwitchingFormFields(this.cardDetailForm.controls[k]);
            setTimeout(()=>{              
              this.setSwitchingFormFocus(this.cardDetailForm.controls[k]);
            });
          }
        }
  }else{
    this.cardDetailForm = this.fb.group({
      giftcard: this.fb.group(this._checkOutForm.getGiftForm()),
      paymentCard: this.fb.group(
        this._checkOutForm.getExpressCheckoutForm()
      ),
      billingForm:[""],
      terms: this.fb.group({
        terms: ["", [Validators.required]],
        policy: [""]
      })
    });
  }
    const cards = this.cardList;
    const index = _.findIndex(cards, obj => {
      return obj.isDefault;
    });
    if (index != -1) {
      this.cardDetailForm.controls.paymentCard["controls"][
        "cardType"
      ].patchValue(cards[index]);
      this.singletonServ.giftWithcardForm=this.cardDetailForm;
    }else{
      this.singletonServ.giftWithcardForm=this.cardDetailForm;
    }
  }
  getTypeOf(val) {
    if ((typeof (val) == 'boolean') && !val) {
      return true
    }
    return false
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
  /* Split pay flow*/ 
  onEnterFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onGiftDetailSubmit(event);
      return false;
    }
  }
  onGiftDetailSubmit(event) { 
     event.preventDefault();
     event.stopPropagation();
    const cardForm = this.cardDetailForm.value.giftcard;
    const date =new Date();
    const _accountHolderName=cardForm.FirstName+' '+cardForm.LastName;

    const giftCard = {
      accountHolderName: _accountHolderName,
      cardNumber: cardForm.GivexCardNumber.trim(),
      cardType: {
        code: "mbGiftCard"
      },
      expiryMonth: "09",
      expiryYear: date.getFullYear()+1,
      defaultPayment: false,
    };  
    if (!this.showCard) {
      this.giftCardFormSubmit(cardForm,giftCard);
    } else {
      this.splitFormSubmit(giftCard,cardForm);
   }
  }

  //start only With Gift card payment
  giftCardFormSubmit(cardForm,giftCard){
    const baseSite = this.singletonServ.catalogVersion;
    if (this.cardDetailForm.valid) {
        if(this.shippingAddress.address){
              giftCard.billingAddress =this.shippingAddress.address;
              giftCard.billingAddress['firstName'] = cardForm.FirstName;
              giftCard.billingAddress['lastName'] = cardForm.LastName;
              giftCard.billingAddress["titleCode"] = (this.shippingAddress.address.titleCode)?this.shippingAddress.address.titleCode:"mr";
        }else{
             giftCard.billingAddress =this.shippingAddress.customerAddress;
        } 
          this.loading = true;
          this.singletonServ.scrollToTarget("#mb_payment_header");
          if (this.singletonServ.getStoreData(baseSite.reg)) {
            const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
            this.addGiftcardPayMentDetails(cardForm,giftCard,user.token,user.code,user.email,true);
      } else {
        if (this.singletonServ.getStoreData(baseSite.guest)) {
             const guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
             this.addGiftcardPayMentDetails(cardForm,giftCard,guest.token,guest.guid,"anonymous",false);
        }
      }
    } else {
      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
      if(formGroupInvalid.length !=0){
        (<HTMLInputElement>formGroupInvalid[0]).focus();
      }
      const formControls = this.cardDetailForm.controls;
      for (let k in formControls) {
        if (k == "terms" || k == "giftcard") {
          this.validateAllFormFields(this.cardDetailForm.controls[k]);
          setTimeout(()=>{              
            this.setFormFocus(this.cardDetailForm.controls[k]);
          });
        }
      }
    }
  }
  addGiftcardPayMentDetails(cardForm, giftCard, token, code, email, status) {
    const baseSite=this.singletonServ.catalogVersion;
    if(baseSite.csAgent){
      giftCard['isAsm']=true;
    }
    this.addpaySubscription= this.giftServ.addPaymentDetails(baseSite,giftCard, token, code, email).subscribe((payment:any) => {
        const _body = {
          firstName: cardForm.FirstName,
          lastName: cardForm.LastName,
          giftcardnumber: cardForm.GivexCardNumber,
          giftcardpin: cardForm.GivexPinNumber,
          giftcardamount: cardForm.Amount
        };
        if (status) {
          this.payWithgiftCardService(_body, token, email, code);
        } else {
          this.payWithgiftCardService(_body, token, "anonymous", code);
        }
      },
      err => {
        this.loading = false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription= this.giftServ.generateCartToken(baseSite).subscribe(
                  (tokenizer:any) => {
                        const _reg=(email!='anonymous')?true:false;
                        if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= tokenizer.access_token;
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.addGiftcardPayMentDetails(cardForm, giftCard, tokenizer.access_token, code, email, status);
                        }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token=tokenizer.access_token;
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.addGiftcardPayMentDetails(cardForm, giftCard, tokenizer.access_token, code, email, status);
                        }
                      });
              }
            }
            }
           }
      }
    );
  }
  payWithgiftCardService(body, token, email, code) {
    const baseSite=this.singletonServ.catalogVersion;
    if(baseSite.csAgent){
      body['isAsm']=true;
    }
   this.giftCardSubscription= this.giftServ.giftCardService(baseSite,body, token, email, code).subscribe(
      (resp:any) => {
        if (resp) {
          if(resp.outOfStock || resp.insufficientStock){
            if(resp.outOfStock.outOfStockFlag){
              this.ngZone.run(() =>{ 
                this.outofStock=true;
                this.outofStockList=resp.outOfStock.products;
                this.loading = false;
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
            } else if(resp.insufficientStock){
              if(resp.insufficientStock.insufficientStockFlag){
                this.ngZone.run(() =>{ 
                  this.outofStock=true;
                  this.outofStockList=resp.insufficientStock.products;
                  this.loading = false;
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                });
              }
            }

            this.errorCodesDisplay=false;
          }else if(resp['errorCode']){
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            this.loading=false;
            this.securitycode=false;
            this.errorMessage=resp['errorCode']; 
            this.errorCodesDisplay=true;
          }
          else if(resp['errorMessage'] == "41:Invalid security code"){
            this.loading=false;
            this.securitycode=true;
            this.errorCodesDisplay=false;
          }
          else{
            if(resp.code){
                resp["email"] = email;
                resp["reg"] = (email == "anonymous" )? false : true;
                resp["token"] = token;
                this.singletonServ.setStoreData("order", JSON.stringify(resp));
                this.ngZone.run(() =>{ 
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                  this.loading=false;
                  this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                  });
          }else{
            this.ngZone.run(() =>{ 
              this.singletonServ.sendMessage({ toggleOverlay: { status: false} });
              this.loading=false;
              });
          }
        }
        }
      },
      err => {
        if(err.error){
          this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          this.loading=false;
          this.securitycode=false;
          this.errorCodesDisplay=false;
          if(err.error.errorCode){
            this.errorMessage=err.error.errorCode;
            this.errorCodesDisplay=true;
         } else if(err.error.errors){
            this.errorMessage=err.error.errors[0]['message'];
            this.errorCodesDisplay=true;
         }
       }
      }
    );
  }
//End of only with gift card 


//start of pay with split
splitFormSubmit(giftCard,cardForm:any){
  if(!this.cardDetailForm.valid){
    this.validateAllFormFields(this.cardDetailForm);
    const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
    if(formGroupInvalid.length !=0){
      (<HTMLInputElement>formGroupInvalid[0]).focus();
    }
    setTimeout(()=>{              
      this.setFormFocus(this.cardDetailForm);
    });
  }else{
    this.enablePaySplitwithGiftcard(giftCard,cardForm);
  }
}
enablePaySplitwithGiftcard(giftCard,cardForm:any){
  const that = this;
  const baseSite = this.singletonServ.catalogVersion;
  if (this.singletonServ.getStoreData(baseSite.reg)) {
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    if (!this.expressCard) {
      const cardDCForm = this.cardDetailForm.value.paymentCard;
      const _accountHolderName=cardDCForm.firstName+'  '+cardDCForm.lastName;
        this.loading = true;
        this.singletonServ.scrollToTarget("#mb_payment_header");
        const obj = {
        accountHolderName: _accountHolderName,
        cardNumber: cardDCForm.cardNumber,
        cardType: {
          code: cardDCForm.cardType
        },
        expiryMonth: cardDCForm.month,
        expiryYear: cardDCForm.year,
        issueNumber: cardDCForm.cvv,
        defaultPayment: true,
        billingAddress: that.shippingAddress.customerAddress
      };
      giftCard['billingAddress']=that.shippingAddress.customerAddress;
      giftCard['billingAddress']['firstName']=(giftCard['billingAddress']['firstName'])?giftCard['billingAddress']['firstName']:cardDCForm.firstName;
      giftCard['billingAddress']['lastName']=(giftCard['billingAddress']['lastName'])?giftCard['billingAddress']['lastName']:cardDCForm.lastName;
      giftCard['billingAddress']['titleCode']=(giftCard['billingAddress']['titleCode'])?giftCard['billingAddress']['titleCode']:'mr';
      obj['billingAddress']['firstName']=(obj['billingAddress']['firstName'])?obj['billingAddress']['firstName']:cardDCForm.firstName;
      obj['billingAddress']['lastName']=(obj['billingAddress']['lastName'])?obj['billingAddress']['lastName']:cardDCForm.lastName;
      obj['billingAddress']['titleCode']=(obj['billingAddress']['titleCode'])?obj['billingAddress']['titleCode']:'mr';
      this.loading = true;
      this.singletonServ.scrollToTarget("#mb_payment_header"); 
      this.splitPaymentMethod(obj,giftCard,user.token,user.code,user.email,cardForm);
    } else {
        this.loading = true;
        this.singletonServ.scrollToTarget("#mb_payment_header");
        this.payWithMakedCard(giftCard,cardForm);
    }
  } else {
    if (this.singletonServ.getStoreData(baseSite.guest)) {
        const cardDCForm = this.cardDetailForm.value.paymentCard;
        this.loading = true;
       this.singletonServ.scrollToTarget("#mb_payment_header");
          const guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          const _accountHolderName=cardDCForm.firstName+'  '+cardDCForm.lastName;
          const obj = {
            accountHolderName: _accountHolderName,
            cardNumber: cardDCForm.cardNumber.trim(),
            cardType: {
              code: cardDCForm.cardType
            },
            expiryMonth: cardDCForm.month,
            expiryYear: cardDCForm.year,
            issueNumber: cardDCForm.cvv,
            defaultPayment: true,
            billingAddress: that.shippingAddress.customerAddress
          };
          obj['billingAddress']['firstName']=(obj['billingAddress']['firstName'])?obj['billingAddress']['firstName']:cardDCForm.firstName;
          obj['billingAddress']['lastName']=(obj['billingAddress']['lastName'])?obj['billingAddress']['lastName']:cardDCForm.lastName;
          obj['billingAddress']['titleCode']=(obj['billingAddress']['titleCode'])?obj['billingAddress']['titleCode']:'mr';   
          giftCard['billingAddress']=that.shippingAddress.customerAddress;
          giftCard['billingAddress']['firstName']=(giftCard['billingAddress']['firstName'])?giftCard['billingAddress']['firstName']:cardDCForm.firstName;
          giftCard['billingAddress']['lastName']=(giftCard['billingAddress']['lastName'])?giftCard['billingAddress']['lastName']:cardDCForm.lastName;
          giftCard['billingAddress']['titleCode']=(giftCard['billingAddress']['titleCode'])?giftCard['billingAddress']['titleCode']:'mr';
          this.splitPaymentMethod(obj,giftCard,guest.token,guest.guid,"anonymous",cardForm);
    }
}
}
//start of pay with split with out a masked card
splitPaymentMethod(obj, giftCard, _token, _code, email, cardForm) {
  const that = this;
  giftCard['billingAddress']=that.shippingAddress.customerAddress;
  giftCard['billingAddress']['firstName']=(giftCard['billingAddress']['firstName'])?giftCard['billingAddress']['firstName']:cardForm.firstName;
  giftCard['billingAddress']['lastName']=(giftCard['billingAddress']['lastName'])?giftCard['billingAddress']['lastName']:cardForm.lastName;
  giftCard['billingAddress']['titleCode']=(giftCard['billingAddress']['titleCode'])?giftCard['billingAddress']['titleCode']:'mr';
  this.cardDetailForm['controls']['billingForm'].setValidators([Validators.required]);
  this.cardDetailForm['controls']['billingForm'].updateValueAndValidity(); 
  if(!this.cardDetailForm['controls']['billingForm'].value){
    this.cardDetailForm['controls']['billingForm'].setErrors({'incorrect': true});
  }
 if (this.cardDetailForm.valid) { 
  const _raisePayCard=this.cardDetailForm.value.paymentCard;
  let _raiseCardMonthValidatn = false;
  const date = new Date();
  if (parseInt(_raisePayCard.year) == date.getFullYear()) {
    if (parseInt(_raisePayCard['month']) <= date.getMonth()) {
      _raiseCardMonthValidatn = true;
    }
  }
   if(!_raiseCardMonthValidatn){
    this.excuteToAddToPayer(obj, giftCard, _token, _code, email, cardForm)
    }else{
      this.loading = false;
      this.cardDetailForm.controls['paymentCard']['controls'].month.setErrors({ 'required': {raiseValidate:true} });
      if(this.paymentCardEl){
        if(this.paymentCardEl['monthEl'].nativeElement){
          this.paymentCardEl['monthEl'].nativeElement.focus();
          this.singletonServ.scrollToTarget('#molthElement');
          this.validateAllFormFields(this.cardDetailForm);
        }
      } 
    } 
  }else{
        this.loading = false;
        const formControls = this.cardDetailForm.controls;
        for (let k in formControls) {
          this.validateAllFormFields(this.cardDetailForm.controls[k]);
          setTimeout(()=>{              
            this.setFormFocus(this.cardDetailForm.controls[k]);
          });
        }
  }
}
excuteToAddToPayer(obj, giftCard, _token, _code, email, cardForm){
  const that = this;
  const baseSite = this.singletonServ.catalogVersion;
  this.addpaySubscription= this.giftServ.addPaymentDetails(baseSite,giftCard, _token, _code, email).subscribe((payment:any) => {
      if( baseSite.isoCode=="US" ){
         this.excuteSplitPay(obj, _token, _code, email, cardForm);
      } else if(baseSite.csAgent){
        this.excuteSplitPay(obj, _token, _code, email, cardForm);
      }else {
        const jwt = this.jwtToken;
        if ('Cardinal' in window) {
          Cardinal.configure({ logging: { level: 'verbose' } });
          Cardinal.on("payments.setupComplete", function(setupCompleteData){
            if( setupCompleteData ){
               if( setupCompleteData.sessionId ){
                 that.sessionID=setupCompleteData.sessionId;
                 that.setPaywithSplit(obj, _token, _code, email, cardForm,setupCompleteData.sessionId);
              }else{
              }
             }
          });        
          Cardinal.setup('init', {
            jwt: jwt
          });
          
        }
      }
    },
    error => {
      this.loading = false;
      this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
    }
  );
}
setPaywithSplit(obj, _token, _code, email, cardForm,sessionId){
  const that=this;
  const baseSite = this.singletonServ.catalogVersion;
  const _form = this.cardDetailForm.value
  if(baseSite.csAgent){
    obj['isAsm']=true;
  }
    Cardinal.trigger("bin.process", obj.cardNumber);
    obj['sessionID']=sessionId;
    obj['sysytemIP']=this.systemIp;
    this.giftServ.splitPayment(baseSite,obj, _token, _code, email, cardForm).subscribe((response:any) => {
        Cardinal.off("payments.setupComplete");
    if(response) {
      if(response.errorCode){
        if(response.errorCode=="110"){
          this.errorvalidationMsg=false;
          this.errorMessage = response.errorCode;
          this.errorCodesDisplay=true;
          this.ngZone.run(() =>{ 
            this.loading = false;
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
        } else {
          this.ngZone.run(() =>{ 
            this.loading = false;
            this.errorvalidationMsg=true;
            this.errorCodesDisplay=false;
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          }
          );
        }
        if(response.errorCode=="231"||response.errorCode=="400"||response.errorCode== "476"){ }
      } else if(response.ACSUrl){        
        that.payWithCardinal(response,obj, _token, _code, email, cardForm);
      }else{
   if(response.code){
            response["email"] = email;
            response["reg"] = (email == "anonymous") ? false : true;
            response["token"] = _token;
            this.singletonServ.setStoreData("order", JSON.stringify(response));
            if (_form.saveCard) {
                    this.postcardSubscription= this.cyberService.postCardDetails(baseSite,_token, email, obj).subscribe((saveCard:any) => {
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
                  }else{
                      this.ngZone.run(() =>{ 
                        this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                        this.loading=false;
                        this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                        });
                  }
     }else{
      this.ngZone.run(() =>{ 
        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
        this.loading=false;
        });
     }
  }
 }    
      },err=>{
        Cardinal.off("payments.setupComplete");
        this.ngZone.run(() =>{ 
          this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          this.loading=false;
          if(err.error){
            if(err.error.errorCode){
              this.errorMessage=err.error.errorCode;
              this.errorCodesDisplay=true;
            }
            this.securitycode=false;
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
                            this.setPaywithSplit(obj, resp["access_token"], _code, email, cardForm,sessionId);
                          }else{
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            this.setPaywithSplit(obj, resp["access_token"], _code, email, cardForm,sessionId);
                          }
                        });
                }
              }
              }
              else if(err.error.errorMessage){
                this.errorMessage=err.error.errorMessage;
                this.errorCodesDisplay=true;
              }
             }
          });
      });
}

payWithCardinal(response:any,obj, _token, _code, email, cardForm){
  const that=this;
  const _acsUrl = response.ACSUrl;
  if(response.payReq && response.transactionID){
      const _payload = response.payReq;
      const _transactionID = response.transactionID;  
      Cardinal.continue('cca',{
        AcsUrl: _acsUrl,
        Payload: _payload
      },
       {
        OrderDetails:{
          TransactionId: _transactionID
        }
      });
    Cardinal.on('payments.validated', function(decodedResponseData, responseJWT){
          delete  obj['sessionID'];   
          if(decodedResponseData.Payment){
              const _decodedtransactionID= decodedResponseData.Payment.ProcessorTransactionId;
              if(_decodedtransactionID){
                obj['responseJWT'] = responseJWT;
                obj['transactionID'] = _decodedtransactionID;
                that.excuteSplitPay(obj, _token, _code, email, cardForm);
              }else{
                  this.ngZone.run(() =>{ 
                   this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                    this.loading=false;
                  });
              }
          }else{
             this.ngZone.run(() =>{ 
                 this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                 this.loading=false;
              });
          }
    });
}
}
excuteSplitPay(obj, _token, _code, email, cardForm){
  const baseSite = this.singletonServ.catalogVersion;
  const _form = this.cardDetailForm.value
  if(baseSite.csAgent){
    obj['isAsm']=true;
  }
  obj['sysytemIP']=this.systemIp;
  this.splitPaySubscription=this.giftServ.splitPayment(baseSite,obj, _token, _code, email, cardForm).subscribe((response:any) => {
    if(response){    
        if(response.errorCode){
              this.ngZone.run(() =>{ 
                this.loading = false;
                this.errorvalidationMsg=true;
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
              if(response.errorCode=="231"||response.errorCode=="400"||response.errorCode== "476"){}
        }else{
          if(response.code){
              response["email"] = email;
              response["reg"] = (email == "anonymous") ? false : true;
              response["token"] = _token;
              this.singletonServ.setStoreData("order", JSON.stringify(response));
              if (_form.saveCard) {
               this.postcardSubscription= this.cyberService.postCardDetails(baseSite,_token, email, obj).subscribe((saveCard:any) => {
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
              
            }else{         
              this.ngZone.run(() =>{ 
                this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                this.loading=false;
                this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                });
              }
      }else{
        this.ngZone.run(() =>{ 
          this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          this.loading=false;
          });
      }
    }
    }
    },(error:any) => {
      this.requestErrMsg=true;
      this.ngZone.run(() =>{ 
        this.requestErrMsg=true;
        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
        this.loading=false;
        this.securitycode=false;
        this.errorCodesDisplay=false;
        });
      if(error.error){
        if(error.error["errors"]){
          this.errorMessage=error.error["errors"][0]['message'];
          this.errorCodesDisplay=true;
        }
      } else {
        if(error.errorCode) {
          this.errorMessage = error.errorCode;
          this.errorCodesDisplay=true;
        }
      }    
    });
}
//end of pay with split with out a masked card



//start of pay with masked card


payWithMakedCard(giftCard,cardForm){
    const cardsList = this.expressForm.cardForm.listOfCards;
    const index = _.findIndex(cardsList, (obj:any) => {
      return obj.isDefault;
    });
    const profileId = cardsList[index]["profileID"];
    const _accountHolderName = cardsList[index]['firstName']+" "+cardsList[index]['lastName'];
    const card = {
      accountHolderName: _accountHolderName,
      cardNumber: cardsList[index]["ccaccountnumber"],
      cardType: {
        code: cardsList[index]["cardType"]
      },
      expiryMonth: cardsList[index]["expirationmonth"],
      expiryYear: cardsList[index]["expirationyear"],
      issueNumber: this.cardDetailForm.value.paymentCard.secureCode,
      defaultPayment: true
    };
      card['billingAddress']=cardsList[index]['billingAddress'];
      giftCard['billingAddress']=cardsList[index]['billingAddress'];
      if (this.cardDetailForm.valid) { 
          this.expressSplitCard(card,giftCard,cardForm,profileId);
    }else{
      this.loading = false;
      const formControls = this.cardDetailForm.controls;
      for (let k in formControls) {
        this.validateAllFormFields(this.cardDetailForm.controls[k]);
        setTimeout(()=>{              
          this.setFormFocus(this.cardDetailForm.controls[k]);
        });
      }
}

  }

  expressSplitCard(obj, giftCard,cardForm, id) {
    const that = this;
    const baseSite = this.singletonServ.catalogVersion;
    const _user=JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
    this.addpaySubscription=  this.giftServ.addPaymentDetails(baseSite,giftCard, _user.token, _user.code, _user.email).subscribe((response:any) => {
        if( baseSite.isoCode=="US" ){
          this.excuteExpressSplitPay(obj,cardForm, id);
       } else if(baseSite.csAgent){
          this.excuteExpressSplitPay(obj,cardForm, id);
       }else {
        const jwt = this.jwtToken;
        if ('Cardinal' in window) {
          Cardinal.configure({ logging: { level: 'verbose' } });
          Cardinal.on("payments.setupComplete", function(setupCompleteData){
            if(setupCompleteData){
              if(setupCompleteData.sessionId){
               that.sessionID=setupCompleteData.sessionId;
               that.setEncryptPay(obj, cardForm, id,setupCompleteData.sessionId);
             }
            }
          });        
          Cardinal.setup('init', {
            jwt: jwt
          });          
        }
       }

      },
      err => {
        this.loading = false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription=this.giftServ.generateCartToken(baseSite).subscribe(
                  (tokenizer:any) => {
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= tokenizer.access_token;
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.expressSplitCard(obj, giftCard,cardForm, id);
                      });
              }
            }
            }
           }
        });
  }

  setEncryptPay(card,cardForm,id,sessionId){
      const baseSite = this.singletonServ.catalogVersion;
      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if(baseSite.csAgent){
        card['isAsm']=true;
      }
      const _encryCardNumber=card.cardNumber;
      if(_encryCardNumber){
        const _cardNumber= _encryCardNumber.toUpperCase();
        const _binNumber=  _cardNumber.substring(0,_cardNumber.indexOf('X'));
        Cardinal.trigger("bin.process", _binNumber);
      }
      card['sessionID']=sessionId;
      card['sysytemIP']=this.systemIp;
      const _code=(this.deliveryInfo.cartObj)?this.deliveryInfo.cartObj.code:user.code;
      this.expresSubscruption= this.giftServ.expressSplitCard(baseSite,card, user.token, _code, user.email, cardForm, id).subscribe((split:any) => {
        Cardinal.off("payments.setupComplete");
        if(split) {
            if(split.outOfStock || split.insufficientStock){
              if(split.outOfStock.outOfStockFlag){
                this.ngZone.run(() =>{ 
                  this.outofStock=true;
                  this.outofStockList=split.outOfStock.products;
                  this.loading = false;
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                });
              } else if(split.insufficientStock){
                if(split.insufficientStock.insufficientStockFlag){
                  this.ngZone.run(() =>{ 
                    this.outofStock=true;
                    this.outofStockList=split.insufficientStock.products;
                    this.loading = false;
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                  });
                }
              }

            } else if(split.errorCode){
                  this.errorCodesDisplay=false;
                  if(split.errorCode=="231"||split.errorCode=="400"||split.errorCode== "476"){
                  }
                  if(split.errorCode=="110"||split.errorCode=="105"||split.errorCode== "422"||split.errorCode=="112"||split.errorCode== "111"||split.errorCode== "122"||split.errorCode== "121"){
                    this.errorMessage = split.errorCode;
                    this.errorCodesDisplay=true;
                  }
                  this.ngZone.run(() =>{ 
                    this.loading = false;
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                  });
            } else {
                if(split.ACSUrl){
                  this.payCardinalwithEncryptData(split,card,cardForm,id);   
                }else{
                delete  card['sessionID'];
                if(split.code){
                      split["email"] = user.email;
                      split["reg"] =  true;
                      split["token"] = user.token;
                      this.singletonServ.setStoreData("order", JSON.stringify(split));
                      this.ngZone.run(() =>{ 
                        this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
                        this.loading=false;
                        this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                        });
                  }else{
                      this.ngZone.run(() =>{ 
                        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                        this.loading=false;
                      });
                  }
                }
          }
        }
        },err=>{
          this.ngZone.run(() =>{ 
      
            this.errorCodesDisplay=false;
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            this.loading=false;
            if(err.error){
              if(err.error.errorCode){
                Cardinal.off("payments.setupComplete");
                this.errorMessage=err.error.errorCode;
                this.errorCodesDisplay=true;
                
              }
              if(err.error["errors"]){
                if(err.error["errors"][0]){
                  if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    this.cartTokenSubscription=this.giftServ.generateCartToken(baseSite).subscribe(
                      (tokenizer:any) => {
                              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                              user.token= tokenizer.access_token;
                              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                              this.  setEncryptPay(card,cardForm,id,sessionId);
                          });
                  } else{
                    Cardinal.off("payments.setupComplete");
                  }
                }
                }
               }
            });
        });

  }

  payCardinalwithEncryptData(split:any,card,cardForm,id){
  const that=this;
  const _acsUrl = split.ACSUrl;
  if(split.payReq && split.transactionID){
      const _payload = split.payReq;
      const _transactionID = split.transactionID;               
      Cardinal.continue('cca',{
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
          delete  card['sessionID'];              
          if(decodedResponseData.Payment){
              const _decodetransactionID= decodedResponseData.Payment.ProcessorTransactionId;
              if(_decodetransactionID){
              card['responseJWT'] = responseJWT;
              card['transactionID'] = _decodetransactionID;
              that.excuteExpressSplitPay(card,cardForm,id);
            }else{
              this.ngZone.run(() =>{ 
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
                this.loading=false;
              });
            }
          }else{
            this.ngZone.run(() =>{ 
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              this.loading=false;
            });
          }
    });
}
}
excuteExpressSplitPay(obj,cardForm,id){
  const baseSite = this.singletonServ.catalogVersion;
  if(baseSite.csAgent){
      obj['isAsm']=true;
  }
  obj['sysytemIP']=this.systemIp;
  const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
 this.expresSubscruption= this.giftServ.expressSplitCard(baseSite,obj, _user.token, _user.code, _user.email, cardForm, id).subscribe((split:any) => {
      Cardinal.off('payments.validated');
      if (split) {
        if(split.outOfStock || split.insufficientStock){
          if(split.outOfStock.outOfStockFlag){
            this.ngZone.run(() =>{ 
              this.outofStock=true;
              this.outofStockList=split.outOfStock.products;
              this.loading = false;
              this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
            });
          } else if(split.insufficientStock){
            if(split.insufficientStock.insufficientStockFlag) {
              this.ngZone.run(() =>{ 
                this.outofStock=true;
                this.outofStockList=split.outOfStock.products;
                this.loading = false;
                this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
              });
            }
          }
        } else if(split.errorCode){
          this.ngZone.run(() =>{ 
            this.loading = false;
            this.errorvalidationMsg=true;
            this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
          });
          if(split.errorCode=="231"||split.errorCode=="400"||split.errorCode== "476"){ }
       }else{           
          if(split.code){
              split["email"] = _user.email;
              split["reg"] =  true;
              split["token"] = _user.token;
              this.singletonServ.setStoreData("order", JSON.stringify(split));
              this.ngZone.run(() =>{ 
                this.singletonServ.sendMessage({ toggleOverlay: { status: false ,orderConfirmation:true} });
                this.loading=false;
                this.router.navigate(['/checkout','mbOrderConfirmResponse']);
                });
          }else{
            this.ngZone.run(() =>{ 
              this.singletonServ.sendMessage({ toggleOverlay: { status: false}});
              this.loading=false;
            });
         }
      }
    }
    },(err:any)=> {
      Cardinal.off("payments.setupComplete");
      Cardinal.off('payments.validated');
      this.ngZone.run(() =>{ 
        this.singletonServ.sendMessage({ toggleOverlay: { status: false } });
        this.loading=false;
        this.securitycode=false;
        this.errorCodesDisplay=false;
        });
      this.requestErrMsg=true;
      if(err.error){
      if(err.error["errors"]){
        this.errorMessage=err.error["errors"][0]['message'];
        this.errorCodesDisplay=true;
      }
     }  
    });
}


  onSetBillingAddress(data) {
    this.billingAddress = true;
    this.newCard = false;
    this.shippingAddress["customerAddress"] = data.address;
    this.cardDetailForm['controls']['billingForm'].setValue(true);
    const _expireMonthId=_.findIndex(this.expireMonth,(obj)=>{
      return obj.month ==data.expirationmonth
    });
  }
  onChangeBillingAddress() {
    this.billingAddress = false;
    this.newCard = true;
  }

  onResetAddress() {
    this.billingAddress = true;
    this.newCard=false;
  }
  onChangeCardType(event) {
    if (event.val == "amex") {
      this.cardDetailForm["controls"]["paymentCard"]["controls"][ "cardNumber"].setValidators([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15)
      ]);
    } else {
      this.cardDetailForm["controls"]["paymentCard"]["controls"]["cardNumber"].setValidators([
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16)
      ]);
    }
    this.cardDetailForm["controls"]["paymentCard"]["controls"]["cvv"].setValidators([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ]);
    this.cardDetailForm["controls"]["paymentCard"]["controls"]["cardNumber"].updateValueAndValidity();
    this.cardDetailForm["controls"]["paymentCard"]["controls"]["cvv"].updateValueAndValidity();
  }
  onChangeEncryptCard(card) {
    this.cardList=card.cardList;
    this.cardDetailForm.controls.paymentCard['controls'].secureCode.reset();
    if(card.type == "amex" ){
      this.cardDetailForm.controls.paymentCard['controls'].secureCode.setValidators([Validators.required,patternValidator(/^[0-9]{4,4}$/)]);
      this.cardDetailForm.controls.paymentCard['controls'].secureCode.updateValueAndValidity(); 
    }else{
      this.cardDetailForm.controls.paymentCard['controls'].secureCode.setValidators([Validators.required,patternValidator(/^[0-9]{3,3}$/)]);
      this.cardDetailForm.controls.paymentCard['controls'].secureCode.updateValueAndValidity(); 
    }
  }
  onAddNewCard() {
    this.newCard = true;
    this.newCardDetailForm = this.fb.group(this._checkOutForm.getCardForm());
  }
  cancelEMit(bol) {
    this.newCard = false;
  }
    
  checkCardNumberLog(number){
    return this.singletonServ.checkCardNumber(number);
  }
  giftCheckBalance(){
    this.router.navigate(['/store','gift-cards','check-balance']);
  }

  onEditCard() {
    this.newCard = true;
  }

  setFormFocus(form){
    const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
    if(formGroupInvalid.length !=0){
      (<HTMLInputElement>formGroupInvalid[0]).focus();
         this.validateAllFormFields(form);
       }
  }
  setSwitchingFormFocus(form){
    const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
    if(formGroupInvalid.length !=0){
      (<HTMLInputElement>formGroupInvalid[0]).focus();
         this.validateSwitchingFormFields(form);
       }
  }

  validateSwitchingFormFields(formGroup) {
    if(formGroup){
    if(formGroup.controls){
      Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
          if(control.value){
              if(control.value !=''){
              control.markAsTouched({ onlySelf: true });
              }
        }
      } else if (control instanceof FormGroup) {
        this.validateSwitchingFormFields(control);
      }
    });
  }
  }
}

  validateAllFormFields(formGroup) {
    if(formGroup){
    if(formGroup.controls){
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
}
ngOnDestroy(){
  if(this.systemIPsubscription){
    this.systemIPsubscription.unsubscribe();
  }
  if(this.cartTokenSubscription){
    this.cartTokenSubscription.unsubscribe();
  }
  if(this.expresSubscruption){
    this.expresSubscruption.unsubscribe();
  }
  if(this.generateJWTSubscription){
    this.generateJWTSubscription.unsubscribe();
  }
  if(this.splitPaySubscription){
    this.splitPaySubscription.unsubscribe();
  }
  if(this.giftCardSubscription){
    this.giftCardSubscription.unsubscribe();
  }
}
}
