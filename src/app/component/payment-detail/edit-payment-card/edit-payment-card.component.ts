import { Component, OnInit,NgZone, ElementRef,ViewChild } from '@angular/core';
import { PaymentGateWayForm } from '../../../forms/paymentCard.form';
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { SingletonService } from "../../../services/singleton.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { PaymentService } from "../payment.service";
import * as _ from "lodash";
import { countries,EUROPEAN_COUNTRIES,DE_COUNTRIES,US_COUNTRIES  } from "../../../app.constant";
import { patternValidator } from '../../../forms/pattern-validator';
@Component({
  selector: 'app-edit-payment-card',
  templateUrl: './edit-payment-card.component.html',
  styleUrls: ['./edit-payment-card.component.scss']
})
export class EditPaymentCardComponent implements OnInit {
  @ViewChild("monthEl") monthEl: ElementRef;
  @ViewChild("myInput") myInput: ElementRef;
  breadcrumb: Array<any>;
  orgMenu:boolean;
  addressList: Array<any>;
  updateSaveCard:FormGroup;
  defaultCard:boolean;
  cards:any;
  updatePayment:boolean;
  public paymentDetailsList: boolean;
  ukSpecificForm:boolean;
  cardDetail:any;
  countries:Array<any>;
  manualAdress:boolean;
  usSpecificForm:boolean;
  submitted:boolean;
  stateList:Array<any>;
  expireMonth:Array<any>;
  expireYear:Array<any>;
  postCodeError:boolean;
  postCodeStatus:boolean;
  expiredYear:Array<any>;
  postalAddresses:any;
  postalAddressEnable:boolean;
  searchTerm:string;
  defaultCardDetail:any;
  ukLoopBtnStatus:boolean;
  recaptchaErr:boolean;
  isocode:string;
  enableAction:boolean;
  overlayLoad:boolean;
  constructor(
    private zone: NgZone,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private _paymentService: PaymentService,
    public singletonServ: SingletonService,
    public _updatePaymentDetails:PaymentGateWayForm,
    private fb: FormBuilder
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.isocode=baseSite.isoCode;
    this.postCodeStatus=true;
    this.paymentDetailsList = true;
    this.updatePayment =true;
    this.updateSaveCard=this.fb.group(this._updatePaymentDetails.payCardForm());
    const _location= this.location['_platformStrategy']._platformLocation.location;
    if(_location.hostname== "10.22.63.60" ||_location.port =="4200"){
      this.updateSaveCard.controls['recaptcha'].setValidators(null);
      this.updateSaveCard.controls['recaptcha'].updateValueAndValidity();
    }
    this.updateSaveCard.controls["cvv"].setValidators(null);
    this.updateSaveCard.controls['cvv'].updateValueAndValidity();
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
    const expireYearBox = [];
    for (let k = 0; k <= 10; k++) {
      const obj = { year: date.getFullYear() - k };
      expireYearBox.push(obj);
    }
    this.expiredYear = expireYearBox;
  }


  onChangeCountry(event) {
    const baseSite = this.singletonServ.catalogVersion;
    const _index = event.target.selectedIndex - 1;
    const country = this.countries[_index];
    if(_index !=-1){
    if (this.countries[_index].isocode === "US" || baseSite.isoCode=="US") {
      const _usCode=this.countries[_index].isocode;
      const _pattern =(_usCode=="US")?  [
        Validators.required,
        patternValidator(/^[0-9space ]{5,7}$/)
      ]: [
        Validators.required,
        patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
      ];
      this.updateSaveCard.controls["postCode"].setValidators(_pattern);
      this.updateSaveCard.controls["postCode"].updateValueAndValidity();
      this.updateSaveCard.controls["district"].setValidators([
        Validators.required
      ]);
      this.updateSaveCard.controls["district"].updateValueAndValidity(); 
      this.usSpecificForm = true;
      this.ukSpecificForm = false;
    
    }else{
      this.usSpecificForm = false;
      this.updateSaveCard.controls["district"].setValidators(null);
      this.updateSaveCard.controls["district"].updateValueAndValidity();
      this.updateSaveCard.controls["postCode"].setValidators([
        Validators.required,
        patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
      ]);
      this.updateSaveCard.controls["postCode"].updateValueAndValidity();
      this.updateSaveCard.controls["district"].setValidators(null);
      this.updateSaveCard.controls["district"].updateValueAndValidity();
    }
    if (country.states) {
        this.stateList = country.states;
        this.usSpecificForm = true;        
        this.updateSaveCard.controls['district'].patchValue(this.stateList[0]);
      } else {
        this.stateList = undefined;
        this.updateSaveCard.controls['district'].patchValue('');
      }
    if (this.countries[_index]["isocode"] == "GB") {
      this.ukSpecificForm = true;
      this.ukLoopBtnStatus=true;
      this.usSpecificForm = false;
    } else {
      this.ukSpecificForm = false;
      this.ukLoopBtnStatus=false;
      this.postalAddresses=undefined;
      this.updateSaveCard.controls["address"].setValidators(null);
      this.updateSaveCard.controls["address"].updateValueAndValidity();
    }
  }else{

  }
  
  }  
  resetAddressFields(data){
    data.map((obj)=>{
      this.updateSaveCard.controls[obj.name].reset();
    });
    this.updateSaveCard.controls['district'].setValue('');
  }

  onChangeMonthOpt(event){
    if(event){
    if(this.updateSaveCard['controls'].month.value ==''){
      this.updateSaveCard['controls'].month.setErrors({required:true});
    }
    }
  }
  onChangeYearOpt(event){
  if(event){
     if(this.updateSaveCard['controls'].year.valid){
          if(!this.updateSaveCard['controls'].month.valid){
           if(this.updateSaveCard['controls'].month.value.month !=''){
               this.updateSaveCard['controls'].month.setErrors(null);
               this.updateSaveCard['controls'].year.setErrors(null);
          }
         }
      }
      if(this.updateSaveCard['controls'].month.value ==''){
        this.updateSaveCard['controls'].month.setErrors({required:true});
     }
    }
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.overlayLoad=true;
    this. setCountry();
    if(baseSite.isoCode=="DE"){
      this.breadcrumb=[{name:'Mein Konto',route:'/store/myacc/mbLogin'},{name:'MEIN PROFIL'}];
    }
    else{
      this.breadcrumb=[{name:'MY ACCOUNT',route:'/store/myacc/mbLogin'},{name:'MY PROFILE'}];
    }
    if(this.singletonServ.getStoreData(baseSite.reg)){
      //    if(this.singletonServ.cardData){
      //   this.setSavedForm(this.singletonServ.cardData)
      // }else{
      //   this. getCardDetail();
      // }
      this. getCardDetail();
    }
  }
  getCardDetail(){
    const baseSite = this.singletonServ.catalogVersion;
    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this._paymentService.getUserSavedCards(baseSite,user.token,user.email).subscribe((resp)=>{
      if(resp){
        const queryStatus = this.route.snapshot.queryParamMap.get(
         "referenceId"
       );
       const _default=_.find(resp,(def)=>{
         return def.profileID==queryStatus
       });
       if(_default){
        this.cardDetail = _default;
         this.setSavedForm(_default);
       }
     }
   },(err:any)=>{
    if(err.error){
      if(err.error["errors"]){
        if(err.error["errors"][0]){
          if(err.error["errors"][0]['type']== "InvalidTokenError") {
            this._paymentService.generateToken(baseSite).subscribe((token)=>{
              const tokenId = token["access_token"];
              user['token']=tokenId;
              this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
              this.getCardDetail();
           });
            
          } 
        }
        }
       }

   });
  }
  setSavedForm(_default){
    const that=this;
    this.defaultCardDetail=_default;
    const _data={
     cardType:_default['cardType'],
     cardNumber:_default.ccaccountnumber,
     firstName:_default.firstName,
     lastName:_default.lastName,
     month:_default.expirationmonth,
     year:_default.expirationyear,
     issueNumber:_default.cvv,
     country :_default.billingAddress.country,
     postCode:_default.billingAddress.postalCode,
     line1 :_default.billingAddress.line1,
     line2 :_default.billingAddress.line2,
     town:_default.billingAddress.town, 
     district :_default.billingAddress.district,
     phonenumber:_default.billingAddress.phone,
     address:_default.billingAddress.address
    };
    this.updateSaveCard.patchValue(_data);
    const _monthIndex = _.findIndex(this.expireMonth, function(o) {
      return o.month == _default.expirationmonth;
    });
    if(_monthIndex !=-1){
      this.updateSaveCard.controls['month'].patchValue(this.expireMonth[_monthIndex]);
    }
    const _yearIndex = _.findIndex(that.expireYear, function(o) {
        const _year=parseInt(o.year);
        const _defutYear=parseInt(_default.expirationyear);
         return _year ==_defutYear
    });
    if(_yearIndex !=-1){
      this.updateSaveCard.controls['year'].patchValue(this.expireYear[_yearIndex]);
    }
   this.setCustomerForm(_data);
  }
  setCustomerForm(data){
    const _isoCode = data["country"]["isocode"];
    const baseSite = this.singletonServ.catalogVersion;
    const _index = _.findIndex(this.countries, function(o) {
      return o.isocode == _isoCode;
    });
    if (_index != -1) {
      this.updateSaveCard.controls["country"].patchValue(this.countries[_index]);
      if(baseSite.isoCode ==='US'){
              if (this.countries[_index]["isocode"] == "US") {
                this.updateSaveCard.controls["postCode"].setValidators([
                Validators.required,
                patternValidator(/^[0-9space ]{5,7}$/)
              ]);
              this.updateSaveCard.controls["postCode"].updateValueAndValidity();
              this.updateSaveCard.controls["district"].setValidators([
                Validators.required
              ]);
              this.updateSaveCard.controls["district"].updateValueAndValidity(); 
       
            }else{

              this.updateSaveCard.controls["postCode"].setValidators([Validators.required,patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)]);
              this.updateSaveCard.controls["postCode"].updateValueAndValidity();
              this.updateSaveCard.controls["district"].setValidators([Validators.required]);
              this.updateSaveCard.controls["district"].updateValueAndValidity(); 
            } 
            if(this.countries[_index].states){
              this.stateList=this.countries[_index].states;
            }else{
              this.stateList=undefined;
            }
     } else {
        this.updateSaveCard.controls["postCode"].setValidators([
          Validators.required,
          patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]);
        this.updateSaveCard.controls["postCode"].updateValueAndValidity();
    }

      if (this.countries[_index].states) {
        this.stateList = this.countries[_index].states;
        const _stateindex = _.findIndex(this.stateList, function(o) {
          return o.name == data.district;
        });
        if (_stateindex != -1) {
          this.updateSaveCard.controls["district"].patchValue(
            this.stateList[_stateindex]
          );
        } else {
          this.updateSaveCard.controls["district"].patchValue(this.stateList[0]);
        }
      }
    } else {
      this.updateSaveCard.controls["country"].patchValue("");
    }
    this.overlayLoad=false;
  }
  setCountry(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite){
        if(baseSite.isoCode ==='GB'){
          that.ukSpecificForm=true;
          that.countries= that.nestedCopy(countries);
          const _isoCode=baseSite.isoCode;
          const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
          this.updateSaveCard.controls["country"].patchValue(that.countries[_index]);
          
        }else if(baseSite.isoCode ==='EU'){
          that.ukSpecificForm=false;
          that.manualAdress=false;
          that.usSpecificForm=false;
          that.countries=that.nestedCopy(EUROPEAN_COUNTRIES);
        }else if(baseSite.isoCode ==='DE'){
          that.ukSpecificForm=false;
          that.manualAdress=false;
          that.usSpecificForm=false;
          that.countries=that.nestedCopy(DE_COUNTRIES);
          const _isoCode=baseSite.isoCode;
          const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
          this.updateSaveCard.controls["country"].patchValue(that.countries[_index]);
          this.updateSaveCard.controls["phonenumber"].setValidators([
            Validators.required,
            patternValidator(/^[0-9 ]{8,14}$/)
          ]);
          this.updateSaveCard.controls["phonenumber"].updateValueAndValidity();
        }else if(baseSite.isoCode=="US"){
          that.ukSpecificForm=false;
          that.manualAdress=false;
          that.countries=that.nestedCopy(US_COUNTRIES);
          that.usSpecificForm=true;
          const _isoCode=baseSite.isoCode;
          const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
          if(_index!=-1){
          this.updateSaveCard.controls["country"].patchValue(that.countries[_index]);
          this.updateSaveCard.controls["postCode"].setValidators([
            Validators.required,
            patternValidator(/^[0-9space ]{5,7}$/)
          ]);
          this.updateSaveCard.controls["postCode"].updateValueAndValidity();
          }else{
            this.updateSaveCard.controls["postCode"].setValidators([
              Validators.required,
              patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
            ]);
            this.updateSaveCard.controls["postCode"].updateValueAndValidity();
          }
          const _states=_.find(this.countries, function(o) { return o.isocode == _isoCode; });
          that.stateList=_states.states;
          
        }
    }

  }
  setAddress(addrObj) {
    const that = this;
    this.zone.run(() => {
      that.updateSaveCard.controls["postCode"].setValue(
        addrObj.postal_code
      );
    });
  }
  onSearchKeyUp(event) {
    const baseSite=this.singletonServ.catalogVersion;
    if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          if(baseSite.isoCode=="GB"){
          this.updateSaveCard.controls['postCode'].patchValue(event.target.value);
          this.myInput.nativeElement.focus(); 
          this.onLookupAddress(event);
      }
   }
  }
  onLookupAddress(event) {
    this.updateSaveCard.controls["address"].setValidators([
      Validators.required
    ]);
    this.updateSaveCard.controls["address"].updateValueAndValidity();
    this.findAddress(event);
  }
  findAddress(event) {
    event.preventDefault();
     const val = this.updateSaveCard.value;
    this.myInput.nativeElement.focus();
    if (this.updateSaveCard.controls["postCode"].valid) {
      this.postCodeError = false;
      const postcode = val["postCode"];
      this._paymentService.getPostCode(postcode).subscribe(
        response => {
          if (response["Items"][0]){
          if (response["Items"][0]["Error"]) {
            this.updateSaveCard.controls["address"].setValidators([]);
            this.updateSaveCard.controls["address"].updateValueAndValidity();
            this.postCodeStatus = false;
          } else {
            this.postCodeStatus = true;
            this.updateSaveCard.controls["address"].setValue(null);
           this.postalAddressEnable=true;
           this.postalAddresses = response["Items"];
            if (val["line1"].length != 0) {
              let i;
              for (i = 0; i < response["Items"].length; i++) {
                if (
                  response["Items"][i]["StreetAddress"].indexOf(val["line1"]) !=
                  -1
                ) {
                  this.updateSaveCard.controls["line1"].setValue("");
                  break;
                }
              }
            }
          }
        }
        },
        error => {}
      );
    } else {
      this.postCodeError = true;
      this.myInput.nativeElement.focus();
    }
  }

  onSelectPlace(val) {
    const id = val;
    this._paymentService.retrievePostalAddress(id).subscribe(
      resp => {
        this.postalAddresses = undefined;
        let _addresses = resp["Items"][0];

        this.updateSaveCard.controls["town"].setValue(
          _addresses["PostTown"]
        );
        if (_addresses["Company"].length == 0) {
          this.updateSaveCard.controls["line1"].setValue(
            _addresses["Line1"]
          );
          this.updateSaveCard.controls["line2"].setValue(
            _addresses["Line2"]
          );
        } else {
          this.updateSaveCard.controls["line1"].setValue(
            _addresses["Company"]
          );
          this.updateSaveCard.controls["line2"].setValue(
            _addresses["Line1"]
          );
        }
        this.updateSaveCard.controls["postCode"].setValue(
          _addresses["Postcode"]
        );
        this.updateSaveCard.controls["district"].setValue(
          _addresses["County"]
        );
      },
      err => {}
    );
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  onContentClick(data) {
    if (data == "profile") {
      this.router.navigate(["store", "myaccount", "profile"]);
    } else if (data == "address") {
      this.router.navigate(["store", "myaccount", "profile", "addressBook"]);
    } else if (data == "payment") {
      this.router.navigate(["store", "myaccount", "profile", "paymentInfo"]);
    } else if (data == "favourites") {
      this.router.navigate(["store", "myaccount", "profile", "myFavorites"]);
    } else if (data == "history") {
      this.router.navigate(["store", "myaccount", "profile", "mbOrderhistory"]);
    }
  }
  onCollapseMenu(){
    if(this.orgMenu){
      this.orgMenu=false;
    }else{
      this.orgMenu=true;
    }
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmitForm(event);
      return false;
    }
} 
  onSubmitForm(event){
    event.stopPropagation();
    const that=this;
    this.enableAction=true;
    const baseSite = this.singletonServ.catalogVersion;
   if(this.singletonServ.getStoreData(baseSite.reg)){
      let _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      const cartData=this.updateSaveCard.value;
      let state = "";
      if (cartData.district) {
        if (typeof cartData.district == "object") {
          state = cartData.district.name;
        } else {
          state = cartData.district;
        }
      }
      const _accountHolderName=cartData.firstName+' '+cartData.lastName;
      const _obj={
        accountHolderName:_accountHolderName,
        cardNumber:cartData.cardNumber,
        firstName :cartData.firstName,
        lastName:cartData.lastName,
        cardType:{
            code:cartData.cardType
        },
        expiryMonth:cartData.month.month,
         expiryYear :cartData.year.year,   
         defaultPayment:true,
         billingAddress:{
          country: {
            isocode: cartData.country.isocode,
            name:cartData.country.name
          },
          firstName: cartData.firstName,
          postalCode: cartData.postCode, //"55446-3739"
          town: cartData.town,
          lastName: cartData.lastName,
          phone: cartData.phonenumber,
          line1: cartData.line1,
          line2: cartData.line2,
          titleCode: "mr",
          district: state,
          id:that.defaultCardDetail.billingAddress.id
        }    
    }
    let _raiseCardMonthValidatn=false;
    const date = new Date();
    if(parseInt(_obj.expiryYear) == date.getFullYear() ){
        if(parseInt(_obj.expiryMonth) <= date.getMonth() ){
          _raiseCardMonthValidatn=true;
        } 
    }
    if (this.updateSaveCard.valid) {
      if( !_raiseCardMonthValidatn){

   
      that.recaptchaErr=false;
      const queryStatus = this.route.snapshot.queryParamMap.get(
        "referenceId"
      );
      this._paymentService.updateCard(baseSite,_user.token,_user.email,_obj,queryStatus).subscribe(resp=>{
        this.router.navigate(['store','myaccount','profile','paymentInfo']);
      },err=>{
        
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this._paymentService.generateToken(baseSite).subscribe((token)=>{
                  const tokenId = token["access_token"];
                  _user['token']=tokenId;
                  this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
                  this._paymentService.updateCard(baseSite,tokenId,_user.email,_obj,queryStatus).subscribe(resp=>{
                    this.router.navigate(['store','myaccount','profile','paymentInfo']);
                  },err=>{

                  });
               });
                
              } else{
                this.enableAction=false;
              }
            }
            }else{
              this.enableAction=false;
            }
           }
      });
    }else{
      this.enableAction=false;
      this.updateSaveCard.controls['month'].setErrors({'required': true});
      if(this.monthEl){
        if(this.monthEl.nativeElement){
          this.monthEl.nativeElement.focus();
          this.singletonServ.scrollToDeliverytarget('#editFormContainer');
        }
     }   
     this.validateAllFormFields(this.updateSaveCard);
      }
    this.submitted = true;
   } else {
    this.enableAction=false;
    this.validateAllFormFields(this.updateSaveCard);
    const data=this.updateSaveCard.controls;
    const _filterData:Array<any>=Object.entries(data).filter((value)=>{
      return data[value[0]]['status']=="INVALID"
     });
    if(_filterData.length ==1){
       if(_filterData[0][0] == "recaptcha"){
         that.recaptchaErr=true;
         that.singletonServ.scrollToTarget("#savedcardHeader");
     }else{
      that.recaptchaErr=false;
     }
    }
  }
   
  } 
  }
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
  onCancel(event){
    this.router.navigate(['store','myaccount','profile','paymentInfo']);
  }
  replaceEncryptNumber(data){
    if(data){
      const _cardNumber =data.cardType+"&nbsp;-X&nbsp;"+data.ccaccountnumber.substr(data.ccaccountnumber.length-4, 4);
      return _cardNumber;
     }
     return 'xxxx xxxx xxxx xxxx'
  }
}
