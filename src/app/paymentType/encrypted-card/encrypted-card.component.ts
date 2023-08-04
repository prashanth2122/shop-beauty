import { Component, OnInit,ViewChild,ElementRef, Input, OnChanges,SimpleChange,Output,EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import { cardFormComponentService } from "../card-form/card-form.service";
import { SingletonService } from "../../services/singleton.service";
import * as _ from "lodash";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {EncryptComponentService} from './encrypted-card.service';
import { countries,EUROPEAN_COUNTRIES,DE_COUNTRIES,US_COUNTRIES  } from "../../app.constant";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { patternValidator } from '../../forms/pattern-validator';
import { Subscription, Subject } from "rxjs";
declare var $:any;
@Component({
  selector: 'app-encrypted-card',
  templateUrl: './encrypted-card.component.html',
  styleUrls: ['./encrypted-card.component.scss']
})
export class EncryptedCardComponent implements OnInit,OnChanges,OnDestroy {
@Input() expressForm:any;
@Input() cards:Array<any>;
@Input() group: FormGroup;
@Output() changeCardType: EventEmitter<any> = new EventEmitter<any>();
@Output() addNewCard: EventEmitter<any> = new EventEmitter<any>();
@Output() cancelEMit: EventEmitter<any> = new EventEmitter<any>();
@Output() editCardDetail: EventEmitter<any> = new EventEmitter<any>();
@ViewChild("paymentCardMonthEl") paymentCardMonthEl: ElementRef;
@ViewChild("myInput") myInput: ElementRef;

subscription: Subscription;
systemIPsubscription:Subscription;
cartTokenSubscription:Subscription;
createAddressSubscription:Subscription;
postcardSubscription:Subscription;
retrieveCardSubscription:Subscription;
updateCardSubscription:Subscription;


errorvalidationMsg:boolean;
switchMode:string;
editCard:boolean;
addressId:any;
newAddress:boolean;
cardDetailForm:FormGroup;
updateCardForm:FormGroup;
checkAddressId:any;
addressList:Array<any>;
newCard:boolean;
cardList:any;
cardForm:FormGroup;
_value = '';
billingAddress:boolean;
addressData:any;
expireMonth:Array<any>;
expireYear:Array<any>;
cardData:any;
savedBillingForm:boolean;
loading:boolean;
editAddressList:boolean;
addAddress:boolean;
maxLength:any;
countries:any;
stateList:any;
cardId:any;
newCardOption:boolean=true;
switchBillingAddresType:string;
editAddresData:any;
csServiceContact:string;
editAddressId:any;
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
propagateChange:any = () => {};
@Input() label: string;
writeValue(value: any) {
  if( value ){
   this._value = value;  
  }
}
registerOnChange(fn) {
  this.propagateChange = fn;
}
registerOnTouched(fn: () => void): void { }

onChange(event){
  this.propagateChange(event.target.value);
}
  constructor(
    public location: Location,
    public router: Router,
    public singletonServ: SingletonService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public _checkOutForm: PaymentGateWayForm,
    public cyberService: cardFormComponentService,
    public encryptCardServ:EncryptComponentService,
    public translate: TranslateServiceSubService,
    public el:ElementRef
  ) { 
    this.maxLength=3;
    this.savedBillingForm=true;
    this. switchMode='encryptCard';
    this.newCard=false;
    this.cardDetailForm = this.fb.group({paymentCard:this.fb.group(this._checkOutForm.getCardForm())});
    this.updateCardForm=this.fb.group(this._checkOutForm.getSavedCard());
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

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="US"){
      this.csServiceContact="uscustomerservice@moltonbrown.com"
    }else{
      this.csServiceContact="customerservice@moltonbrown.com"
    }
    this.setCountry();
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.getUserAddressList(baseSite,user.email, user.token);
    }
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }


getUserAddressList(baseSite,email, token) {
  this.addressData = undefined;
 this.subscription= this.encryptCardServ.getUserAddress(baseSite,token, email).subscribe(
    resp => {
      if (resp) {
        if (resp["addresses"]) {
          this.addressList = resp["addresses"];
          this.addressList.map(obj => {
            if (obj.defaultAddress) {
              this.addressData = obj;
            }
            if (this.checkAddressId) {
              if (obj.id == this.checkAddressId) {
                obj.defaultAddress = true;
                this.addressData = obj;
              } else {
                obj.defaultAddress = false;
              }
            }
          });
        }
      }
    },
    error => {
    }
  );
}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(changes['cards']){
      if (changes["cards"]["currentValue"] != undefined) {
        this.cardList=changes["cards"]["currentValue"];
        if(this.switchMode=='encryptCard'){
       
        }
        this.newCard=false;
      }
    }
    if (changes["group"]) {
      if (changes["group"]["currentValue"] != undefined) {                  
        this.cardForm=changes["group"]["currentValue"];
      }
    }
    if(changes['expressForm']){
      if (changes["expressForm"]["currentValue"] != undefined) {
        this.billingAddress=changes["expressForm"]["currentValue"];
      }
    }
  }
  onAddressChange(address) {
    this.addressList.map(obj => {
      if (obj.id == address.id) {
        obj["defaultAddress"] = true;
      } else {
        obj["defaultAddress"] = false;
      }
    });
    this.addressData = address;
  }

nestedCopy(array) {
  return JSON.parse(JSON.stringify(array));
}

  onChangeCardtypo(card){
    this.updateCardForm.reset();
    const _chectypeIndex=_.findIndex(this.cardType,(card)=>{
      return  card.cardType==card.value;
    });
    if(_chectypeIndex !=-1){
      this.updateCardForm.controls.cvv.setValidators(this.cardType[_chectypeIndex].cvvValidation);
      this.maxLength=this.cardType[_chectypeIndex].secureCode;
    }
    this.updateCardForm.controls.cvv.setErrors({ 'incorrect': false });
    this.cardList.map((obj) => {
      if (obj.profileID == card.profileID) {
        obj['isDefault'] = true;
      } else {
        obj['isDefault'] = false;
      }
    });
    this.updateCardForm.controls.cvv.updateValueAndValidity(); 
    this.changeCardType.emit({cardList:this.cardList,cardId:card.profileID,type:card.cardType});
  }

  /**Start Add New card=> Add Address=> Add masked card => masked card list */
  onAddNewCard(){
    this.loading = true;
    this.errorvalidationMsg=false;
    setTimeout(()=>{
      this.loading = false;
    },200)
    this.switchMode="updateCard";
    this.switchBillingAddresType="retrieveAddress";
    this.newCard=true;
    const _cardForm ={
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cardNumber:new FormControl('',[Validators.required,Validators.minLength(16),Validators.maxLength(16),patternValidator(/[0-9\+\-\ ]/)]),
      firstName:new FormControl('', {
                                       validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      lastName:new FormControl('', {
                                       validators:[
                                          Validators.required,
                                          patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                       updateOn: 'blur'}), 
      month:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      year:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cvv:new FormControl('')
    };
      if(this.cardDetailForm.controls.paymentCard){
        const _val=this.cardDetailForm.controls.paymentCard.value;
        this.cardDetailForm = this.fb.group({paymentCard:this.fb.group(_cardForm)});
        this.cardDetailForm.controls.paymentCard.patchValue(_val);
      }else{
        this.cardDetailForm = this.fb.group({paymentCard:this.fb.group(_cardForm)});
      }
    this.addNewCard.emit();
  }

  onAddNewBlAddess(event){
    const _cardForm ={
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cardNumber:new FormControl('',[Validators.required,Validators.minLength(16),Validators.maxLength(16),patternValidator(/[0-9\+\-\ ]/)]),
      firstName:new FormControl('', {
                                       validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      lastName:new FormControl('', {
                                       validators:[
                                          Validators.required,
                                          patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                       updateOn: 'blur'}), 
      month:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      year:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cvv:new FormControl('')
    };
    const _val=this.cardDetailForm.controls.paymentCard.value;
    this.cardDetailForm = this.fb.group({
      paymentCard:this.fb.group(_cardForm),
      billingForm:this.fb.group(this._checkOutForm.getCCForm())
   });
   const _checkType=_.findIndex(this.cardType,(data)=>{
     return data.value ===_val.cardType;
   });
   if(_checkType !=-1){
      this.cardDetailForm.controls.paymentCard['controls']["cardNumber"].setValidators(this.cardType[_checkType].validators);
    }
   this.cardDetailForm.controls.paymentCard.patchValue(_val);
   this.addAddress=true;
   this.newAddress=true;
   this.switchBillingAddresType="newAddress";
   this.validateSwitchingFormFields(this.cardDetailForm.controls.paymentCard);
  //  setTimeout(()=>{              
  //    this.setSwitchingFormFocus(this.cardDetailForm.controls.paymentCard);
  //  });
   }
   discardNewCCAddressForm(event){
    this.switchBillingAddresType="retrieveAddress";
    this.addAddress=false;
    this.newAddress=false;  
    this.onAddNewCard();

  }
  submitNewAddressForm(data){
    this.addNewAddress(data);
  }
  addNewAddress(data){
    const baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const _address =data;
        _address['firstName']= this.addressList[0]['firstName'];
        _address['lastName']= this.addressList[0]['lastName'];
     this.createUserAddresses(baseSite,_address,user.token,user.email);
    }
  }
  createUserAddresses(baseSite,_address,token,email){
    this.createAddressSubscription=this.cyberService.createUserAddress(baseSite,_address,token,email).subscribe((resp:any)=>{
      this.addressId = resp.id;
     this. getAddress();
    },err=>{
      if(err.error){
        if(err.error.errors){
          if(err.error.errors[0]['type']== "InvalidTokenError"){
           this.cartTokenSubscription= this.cyberService.generateCartToken(baseSite).subscribe(
              (resp:any) => {       
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.createUserAddresses(baseSite,_address,resp["access_token"],email);
               });
          }
        }
      }
    });
  }
/** End Add New card=> Add Address=>masked card */

/**Start Add new card => edit billing address=>new card =>masked list  */


discardEditCCAddressForm(data){
  this.switchBillingAddresType="retrieveAddress";
  this.addAddress=false;
  this.newAddress=false; 
  this.editAddressList=false; 
  this.onAddNewCard();
}
submitEditCCAddressForm(data){
  this.submitEditaddress(data);
}
  submitEditaddress(data){
    const baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const _address =data;
      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.updateUserAddress(baseSite,_address,user.token,user.email,this.addressId)
    }
  } 
  updateUserAddress(baseSite,_address,token,email,addressId){
  this.createAddressSubscription=  this.cyberService.updateUserAddress(baseSite,_address,token,email,addressId).subscribe((resp)=>{
      this. getAddress();
   },err=>{
     if(err.error){
       if(err.error.errors){
         if(err.error.errors[0]['type']== "InvalidTokenError"){
          this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
             (resp:any) => {       
                     const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                     user.token= resp["access_token"];
                     this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                     this.updateUserAddress(baseSite,_address,resp["access_token"],email,addressId);
              });
         } else {
           this. getAddress();
         }
       }
     }

   });
  }
/**End Add new card => edit billing address=>new card =>masked list  */

  getAddress(){
    const baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
       this.retrieveAddress(baseSite,user.token,user.email);
  }
  }
retrieveAddress(baseSite,token,email){
  this.subscription= this.cyberService.getUserAddress(baseSite,token,email).subscribe((address)=>{
    if(address){
       this.addressList=address['addresses'];
       if(this.addressId){
          this.addressList.map((obj)=>{
              if (obj.id ==  this.addressId) {
                obj.defaultAddress = true;
              }else{
                obj.defaultAddress = false;
              }
          });
          this.switchBillingAddresType="retrieveAddress";
          this.newAddress=false;
          this.editAddressList=false;
          this.addAddress=false;
      }
  }    
},err=>{
if(err.error){
  if(err.error.errors){
    if(err.error.errors[0]['type']== "InvalidTokenError"){
      this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
        (resp:any) => {       
                const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                user.token= resp["access_token"];
                this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                this.retrieveAddress(baseSite, resp["access_token"],email);
         });
    }
  }
}
});
}


  onSubmitUpdateDetails(event){
    event.preventDefault();
     const baseSite = this.singletonServ.catalogVersion;
     const cardForm=this.cardDetailForm.controls.paymentCard.value;
     let _raiseCardMonthValidatn = false;
     const date = new Date();
     if (parseInt(cardForm['year']) == date.getFullYear()) {
       if (parseInt(cardForm['month']) <= date.getMonth()) {
         _raiseCardMonthValidatn = true;
       }
     }

     if( this.cardDetailForm.controls.paymentCard.valid){
      if (!_raiseCardMonthValidatn) {
      this.singletonServ.scrollToTarget("#mb_payment_header");
        if(this.singletonServ.getStoreData(baseSite.reg)){
            this.singletonServ.sendMessage({setLoading:{status:true}});
            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));        
            const _default=_.find(this.addressList,(def)=>{
              return def.defaultAddress
            });  
            const _accountHolderName=cardForm['firstName'] + " " + cardForm['lastName'];
            const obj = {
                accountHolderName:_accountHolderName ,
                cardNumber: cardForm['cardNumber'],
                cardType: {
                  code: cardForm['cardType']
                },
                firstName:cardForm['firstName'],
                lastName:cardForm['lastName'],
                expiryMonth: cardForm['month'],
                expiryYear: cardForm['year'],
                issueNumber:cardForm['cvv'],
                defaultPayment: true,
                billingAddress:_default
            }
          if(this.cardDetailForm.controls.paymentCard.valid || this.cardDetailForm.controls.billingForm.valid){
            if(baseSite.csAgent){
              obj['isAsm']=true;
             }
           this.postcardSubscription= this.cyberService.postCardDetails(baseSite,user.token,user.email,obj).subscribe((cardId:any)=>{
               
              if(cardId.subscripotionID){
                this.getSavedCards(baseSite,user.token,user.email,cardId.subscripotionID);
              }else if(cardId.errorCode){
                this.errorvalidationMsg=true;
                this.singletonServ.sendMessage({setLoading:{status:false}});
              }
          },err=>{
            this.singletonServ.sendMessage({setLoading:{status:false}});
          });
        }
        }else{
          const formControls = this.cardDetailForm.controls;
          for (let k in formControls) {
            if ( k=="paymentCard" || k=="billingForm") {
              this.validateAllFormFields(formControls[k]);
              setTimeout(()=>{              
                this.setFormFocus(formControls[k]);
              });
          
            }
          }
        }
      }else{
        this.cardDetailForm.controls.paymentCard['controls'].month.setErrors({ 'required': {raiseValidate:true} });    
          const formControls = this.cardDetailForm.controls;
          for (let k in formControls) {
            if ( k=="paymentCard") {
              this.validateAllFormFields(formControls[k]);
              setTimeout(()=>{              
                this.setFormFocus(formControls[k]);
              });
            }
          }
          if(this.el.nativeElement.querySelector('.has-error')){
            (<HTMLInputElement>this.el.nativeElement.querySelector('.has-error')).focus();
        }
      }

    }else{
      const formControls = this.cardDetailForm.controls;
      for (let k in formControls) {
        if ( k=="paymentCard") {
          this.validateAllFormFields(formControls[k]);
          setTimeout(()=>{              
            this.setFormFocus(formControls[k]);
          });
        }
      }
      if(this.el.nativeElement.querySelector('.has-error')){
        (<HTMLInputElement>this.el.nativeElement.querySelector('.has-error')).focus();
    }
    }
  }

  getSavedCards(baseSite,token,email,id){
   this.retrieveCardSubscription= this.cyberService.getUserSavedCards(baseSite,token, email).subscribe((response:any) => {
      if (response) {
          response.map((obj)=>{
            if(obj.profileID == id){
              obj['isDefault']=true;
            }else{
              obj['isDefault']=false;
            }
          });
        this.singletonServ.sendMessage({payTypeCardDetails:true,cardList:response,setLoading:{status:false}});  
        this.cardList = response;
        this.newCard=false;
        this.switchMode="encryptCard";
        this.cancelEMit.emit({cardList:response});
        this.loading = false;
        this.singletonServ.sendMessage({setLoading:{status:false}});
     }
    }, err => {          
      this.loading = false;
      this.singletonServ.sendMessage({setLoading:{status:false}});
      if(err.error){
        if(err.error.errors){
          if(err.error.errors[0]['type']== "InvalidTokenError"){
            this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
              (resp:any) => {       
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.getSavedCards(baseSite,resp["access_token"],email,id);
               });
          }
        }
      }
    });
  }
  validateAllFormFields(formGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


  getSecureLength(val){
    if(val =="amex"){
      return 4;
    }else{
      return 3;
    }
  }
  changeCard(data){
      if(data.val =="amex"){
        this.cardDetailForm.controls.paymentCard['controls']["cardNumber"].setValidators([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15)
      ]);
    }else{
      this.cardDetailForm.controls.paymentCard['controls']["cardNumber"].setValidators([
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16)
      ]);
    }
    this.cardDetailForm.controls.paymentCard['controls']["cvv"].setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]);
      this.cardDetailForm.controls.paymentCard['controls']["cardNumber"].updateValueAndValidity();
      this.cardDetailForm.controls.paymentCard['controls']["cvv"].updateValueAndValidity();
    
  }

 


  setCountry(){
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite){
    if(baseSite.isoCode ==='GB'){
      this.countries= this.nestedCopy(countries);
    }else if(baseSite.isoCode ==='EU'){
      this.countries=this.nestedCopy(EUROPEAN_COUNTRIES);
    }else if(baseSite.isoCode ==='DE'){
      this.countries=this.nestedCopy(DE_COUNTRIES);
    }else if(baseSite.isoCode=="US"){
      this.countries=this.nestedCopy(US_COUNTRIES);
    }
    }
  }
  onCancel(event){
    event.preventDefault();
    if(this.editAddressList){
       this.newAddress=false;
       this.editAddressList=false;
    }else
    //  if(this.billingAddress){
    //   this.billingAddress=false;
    //   this.newAddress=false;
    // } else if(!this.billingAddress)
    {
      this.newCard=false;
      this.newAddress=false;
      this.singletonServ.scrollToTarget("#mb_payment_header");
      this. switchMode='encryptCard';
      this.cancelEMit.emit({getCard:false});
      this.cardDetailForm = this.fb.group(this._checkOutForm.getCardForm());
    }
}



editBlAddress(data) {
  const baseSite = this.singletonServ.catalogVersion;
  this.addressId = data.id;
  this.editAddresData=data;
  this.newAddress=true;
  this.switchBillingAddresType="editAddress";
  this.editAddressList=true;
  this.cardDetailForm = this.fb.group({
    paymentCard:this.fb.group(this._checkOutForm.getCardForm()),
    billingForm:this.fb.group(this._checkOutForm.getCCForm())
 });
  this.cardDetailForm.controls['billingForm'].patchValue(data);

if(baseSite.isoCode=="US"){
   if(data.country.isocode !="US"  || data.country.isocode !="CA"|| data.country.isocode !="UM" || data.country.isocode !="VI"){
    this.cardDetailForm.controls['billingForm']['controls']['country'].patchValue({
      errMSG:'Please select a country',
      option:'Choose Country *'
    });
    this.cardDetailForm.controls['billingForm']['controls']['country'].setErrors({required:true});
   }
}
  this.validateAllFormFields(this.cardDetailForm);
  setTimeout(()=>{              
    this.setFormFocus(this.cardDetailForm);
  });
}



/*Source of Edit Credit/Debit card */
onEditCardForm(data){
  this.cardData=data;  
  const creditCardinfo=data;
  creditCardinfo['month']=data.expirationmonth;
  creditCardinfo['year']=data.expirationyear;
  this.editCardDetail.emit();
  this.updateCardForm.patchValue(creditCardinfo);
    const _expireMonthId=_.findIndex(this.expireMonth,(obj)=>{
          return obj.month ==data.expirationmonth
    });
    if(_expireMonthId !=-1){
      this.updateCardForm.controls.month.patchValue(this.expireMonth[_expireMonthId]);
    }
    const _expireYearId=_.findIndex(this.expireYear,(obj)=>{
      return obj.year ==data.expirationyear
   });
    if(_expireYearId !=-1){
      this.updateCardForm.controls.year.patchValue(this.expireYear[_expireYearId]);
    }
  

  this.updateCardForm.controls['cardType'].setValue(data);
  this.updateCardForm.controls["cvv"].setValidators(null);
  this.updateCardForm.controls["country"].setValidators(null);
  this.updateCardForm.controls["postCode"].setValidators(null);
  this.updateCardForm.controls["line1"].setValidators(null);
  this.updateCardForm.controls["town"].setValidators(null);
  this.updateCardForm.controls["phonenumber"].setValidators(null);
  this.updateCardForm.controls["address"].setValidators(null);
  this.updateCardForm.controls["address"].updateValueAndValidity();
  this.updateCardForm.controls["country"].updateValueAndValidity();
  this.updateCardForm.controls["postCode"].updateValueAndValidity();
  this.updateCardForm.controls["line1"].updateValueAndValidity();
  this.updateCardForm.controls["town"].updateValueAndValidity();
  this.updateCardForm.controls["phonenumber"].updateValueAndValidity();
  this.updateCardForm.controls["cvv"].updateValueAndValidity();
  this.switchMode='editCard';
 }

/**Start Edit Card =>Edit billing Address=>update card=>masked card list */
onEditbillingAddress(data){
  const baseSite = this.singletonServ.catalogVersion;
  this.editAddressId=data.billingAddress.id;
  this.savedBillingForm=false;
  this.updateCardForm=this.fb.group({
    cardType:new FormControl('',{validators:Validators.required}),
    billingForm:this.fb.group(this._checkOutForm.getCCForm())
  });
  this.updateCardForm.controls["cardType"].patchValue(data);
  this.updateCardForm.controls['billingForm'].patchValue(data.billingAddress); 
  if(baseSite.isoCode=="US"){
    const _isocode=data.billingAddress.country.isocode;
     if(_isocode !="US"  ||_isocode!="CA"|| _isocode !="UM" || _isocode!="VI"){
    this.updateCardForm.controls['billingForm']['controls']['country'].patchValue({
        errMSG:'Please select a country',
        option:'Choose Country *'
      });
      this.updateCardForm.controls['billingForm']['controls']['country'].setErrors({required:true});
     }
  }
  this.validateAllFormFields(this.updateCardForm.controls['billingForm']);
  setTimeout(()=>{              
    this.setFormFocus(this.updateCardForm.controls['billingForm']);
  });
}
discardEditBlAddressForm(){
  this.savedBillingForm=true;
  this.updateCardForm=this.fb.group(this._checkOutForm.getSavedCard());
  this.onEditCardForm(this.cardData);
}
onCancelEditCard(event){
  event.preventDefault();
  this.singletonServ.scrollToTarget("#mb_payment_header");
  this.switchMode='encryptCard';
  this.cancelEMit.emit({getCard:false}); 
}
submitEditBlAddressForm(data){
  const baseSite = this.singletonServ.catalogVersion;
  const _id=this.cardData.profileID;
  const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
  this.cardData[ "billingAddress"]=data;
  this.loading=true;
  this.singletonServ.sendMessage({setLoading:{status:true}});
  this.updateMaskedCard(baseSite,_user.token,_user.email,_id,this.cardData);
}
updateMaskedCard(baseSite,token,email,_id,cardData:any){
const _accountHolderName=cardData.firstName+' '+cardData.lastName;
const _obj={
accountHolderName:_accountHolderName,
cardNumber:cardData.ccaccountnumber,
firstName :cardData.firstName,
lastName:cardData.lastName,
cardType:{
    code:cardData.cardType
},
expiryMonth:cardData.expirationmonth,
 expiryYear :cardData.expirationyear,   
 defaultPayment:true,
 billingAddress:cardData.billingAddress  
}
_obj['billingAddress']['id']=this.editAddressId;
_obj['billingAddress']['firstName'] =cardData.firstName;
_obj['billingAddress']['lastName'] =cardData.lastName;
this.updateCardSubscription=   this.encryptCardServ.updateCardData(baseSite,token,email,_id,_obj).subscribe((resp)=>{
      this.loading=false;
      this.singletonServ.sendMessage({
        setLoading:{
          status:false
        }
      });
      this.savedBillingForm=true;
      this.updateCardForm=this.fb.group(this._checkOutForm.getSavedCard());
      this.onEditCardForm(this.cardData);

  },err=>{
  this.singletonServ.sendMessage({setLoading:{status:false}});
  this.loading=false;
  if(err.error){
    if(err.error.errors){
      if(err.error.errors[0]['type']== "InvalidTokenError"){
        this.cartTokenSubscription= this.cyberService.generateCartToken(baseSite).subscribe(
          (resp:any) => {       
                  const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                  user.token= resp["access_token"];
                  this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                  this.updateMaskedCard(baseSite,resp["access_token"],email,_id,cardData);
          });
      }
    }else{
      this.savedBillingForm=true;
      this.updateCardForm=this.fb.group(this._checkOutForm.getSavedCard());
      this.onEditCardForm(this.cardData);
    }
  }
  });
}
onSubmitUpdateCdDetails(){
  const baseSite = this.singletonServ.catalogVersion;
  const _val=this.updateCardForm.value;
  const _accountHolderName=_val.firstName+' '+_val.lastName
  const _obj:any={
    accountHolderName:_accountHolderName,
    cardNumber:this.cardData.ccaccountnumber,
    firstName : _val.firstName,
    lastName:_val.lastName,
    cardType:{
        code:_val.cardType.cardType
    },  
    defaultPayment:true
  }
  
  _obj["expiryMonth"]=_val.month.month;
  _obj["expiryYear"]=_val.year.year;
  _obj[ "billingAddress"]=this.cardData.billingAddress;
  if(this.savedBillingForm){
  }else{
    _obj["expiryMonth"]=this.cardData.expirationmonth;
    _obj["expiryYear"]=this.cardData.expirationyear;
    _obj[ "billingAddress"]=this.updateCardForm.value.billingForm;
  }
  let _raiseCardMonthValidatn = false;
  const date = new Date();
  if (parseInt(_obj.expiryYear) == date.getFullYear()) {
    if (parseInt(_obj["expiryMonth"]) <= date.getMonth()) {
      _raiseCardMonthValidatn = true;
    }
  }
  if(this.updateCardForm.valid){
    if (!_raiseCardMonthValidatn) {
        this.singletonServ.sendMessage({setLoading:{status:true}});
        this.singletonServ.scrollToTarget("#mb_payment_header");
        this.loading=true;
      if(this.singletonServ.getStoreData(baseSite.reg)){
        const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const _id=this.cardData.profileID;
        this.updateEncryptCard(baseSite,_user.token,_user.email,_id,_obj)
      }
   }else{
        this.updateCardForm['controls'].month.setErrors({ 'required': {raiseValidate:true} });    
        this.validateAllFormFields(this.updateCardForm);
        setTimeout(()=>{              
          this.setFormFocus(this.updateCardForm);
        });
   }
  }else{
      this.validateAllFormFields(this.updateCardForm);
      setTimeout(()=>{              
        this.setFormFocus(this.updateCardForm);
      });
  }
}
onChangeMonthOpt(event){
  if(event){
  if(this.updateCardForm['controls'].month.value ==''){
    this.updateCardForm['controls'].month.setErrors({required:true});
  }
  }
}
onChangeOpt(event){
if(event){
   if(this.updateCardForm['controls'].year.valid){
        if(!this.updateCardForm['controls'].month.valid){
         if(this.updateCardForm['controls'].month.value.month !=''){
             this.updateCardForm['controls'].month.setErrors(null);
             this.updateCardForm['controls'].year.setErrors(null);
        }
       }
    }
    if(this.updateCardForm['controls'].month.value ==''){
      this.updateCardForm['controls'].month.setErrors({required:true});
   }
  }
}
setFormFocus(form){
  const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
  if(formGroupInvalid.length !=0){
    (<HTMLInputElement>formGroupInvalid[0]).focus();
       this.validateAllFormFields(form);
     }
}
updateEncryptCard(baseSite,token,email,_id,_obj){
  const that=this;
  const _val=this.updateCardForm.value;
  const _accountHolderName=_val.firstName+' '+_val.lastName
  const _body={
    accountHolderName: _accountHolderName,
    cardNumber: that.cardData.ccaccountnumber,
    firstName: _val.firstName,
    lastName: _val.lastName,
    cardType: {
      code: _val.cardType.cardType
    },
    defaultPayment: true,
      billingAddress: {
        country: {
          isocode: that.cardData.billingAddress.country.isocode,
          name:that.cardData.billingAddress.country.name
        },
        firstName: _val.firstName,
        lastName: _val.lastName,
        postalCode: that.cardData.billingAddress.postalCode,
        town: that.cardData.billingAddress.town,
        phone: that.cardData.billingAddress.phone,
        line1: that.cardData.billingAddress.line1,
        line2:that.cardData.billingAddress.line2,
        titleCode: "mr",
        district: that.cardData.billingAddress.district,
        id: that.cardData.billingAddress.id
      }
    }
    _body["expiryMonth"]=_val.month.month;
    _body["expiryYear"]=_val.year.year;

  this.updateCardSubscription= this.encryptCardServ.updateCardData(baseSite,token,email,_id,_body).subscribe((resp)=>{
        if(this.savedBillingForm){
            this.getSavedCards(baseSite,token,email,_id);
        }else{
          this.retrieveCardData(_obj);
        }  
    },err=>{
    this.singletonServ.sendMessage({setLoading:{status:false}});
    this.loading=false;
    if(err.error){
    if(err.error.errors){
      if(err.error.errors[0]['type']== "InvalidTokenError"){
        this.cartTokenSubscription=this.cyberService.generateCartToken(baseSite).subscribe(
          (resp:any) => {       
                  const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                  user.token= resp["access_token"];
                  this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                  this.updateEncryptCard(baseSite,resp["access_token"],email,_id,_obj);
          });
      }
    }
    }
    });
}
/**End Edit Card =>Edit billing Address=>update card=>masked card list */


  retrieveCardData(obj){
     this.cardData.billingAddress=obj[ "billingAddress"];
     this.cardData.billingAddress['firstName']=obj['firstName'];
     this.cardData.billingAddress['lastName']=obj['lastName'];
     this.savedBillingForm=true;
     this.updateCardForm=this.fb.group(this._checkOutForm.getSavedCard());
     this.onEditCardForm(this.cardData);
     this.cancelEMit.emit(); 
 }



 

  replaceEncryptNumber(data){
    if(data){
      const _number = new Array(data.length-3).join('x') + data.substr(data.length-4, 4);
      const _cardNumber =_number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      return _cardNumber;
    }else{
      return 'xxxx xxxx xxxx xxxx';
    }
    return 'xxxx xxxx xxxx xxxx'
  }
  checkCardNumberLog(number){
    return this.singletonServ.checkCardNumber(number);
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
  ngOnDestroy(){
     if(this.subscription){
      this.subscription.unsubscribe();
     }
     if(this.createAddressSubscription){
       this.createAddressSubscription.unsubscribe();
     }
     if(this.cartTokenSubscription){
      this.cartTokenSubscription.unsubscribe();
     }
     if(this.postcardSubscription){
       this.postcardSubscription.unsubscribe();
     }
     if(this.retrieveCardSubscription){
      this.retrieveCardSubscription.unsubscribe();
     }
     if(  this.updateCardSubscription){
      this.updateCardSubscription.unsubscribe();
     }
  }
}
