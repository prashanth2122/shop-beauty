import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChange,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer
} from "@angular/core";
import { Location } from "@angular/common";
import { PaymentGateWayForm } from "./../../forms/paymentCard.form";
import { SingletonService } from "../../services/singleton.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { PaymentService } from "../payment-detail/payment.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  countries,
  EUROPEAN_COUNTRIES,
  DE_COUNTRIES,
  US_COUNTRIES
} from "../../app.constant";
import * as _ from "lodash";
import { patternValidator } from "../../forms/pattern-validator";
import { DeviceDetectorService } from "ngx-device-detector";
@Component({
  selector: "app-payment-new-saved-card",
  templateUrl: "./payment-new-saved-card.component.html",
  styleUrls: ["./payment-new-saved-card.component.scss"]
})
export class PaymentNewSavedCardComponent implements OnInit, OnChanges{
  @ViewChild("myInput") myInput: ElementRef;molthEl
  @ViewChild("monthEl") monthEl: ElementRef;
  @Input() addresses: Array<any>;
  @Output() updateCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSubmitRecapchaDtl:EventEmitter<any>=new EventEmitter<any>();
  addressList:Array<any>;
  updateSaveCard: FormGroup;
  expireMonth: Array<any>;
  expireYear: Array<any>;
  expiredYear: Array<any>;
  submitted: boolean;
  ukLoopBtnStatus: boolean;
  postCodeError: boolean;
  searchTerm: string;
  countries: Array<any>;
  ukSpecificForm: boolean;
  manualAdress: boolean;
  usSpecificForm: boolean;
  stateList: Array<any>;
  isValidFormSubmitted: boolean;
  postCodeStatus: boolean;
  postalAddresses: Array<any>;
  errorvalidationMsg:boolean;
  csServicecommunication:string;
  mobileDevice:boolean;
  enableAction:boolean;
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
        patternValidator(/^4[0-9]{12}(?:[0-9]{3})?$/)
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
        patternValidator(/^4[0-9]{12}(?:[0-9]{3})?$/)
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
        patternValidator(/^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/)
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
        patternValidator(/^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/)
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
  usSpecific:boolean;
  isocode:string;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _updatePaymentDetails: PaymentGateWayForm,
    private fb: FormBuilder,
    private translate: TranslateServiceSubService,
    public singletonServ: SingletonService,
    public payService: PaymentService,
    public renderer: Renderer,
    public deviceService: DeviceDetectorService,
    public location:Location
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.isocode=baseSite.isoCode;
    this.postCodeStatus = true;
    this.updateSaveCard = this.fb.group(
      _updatePaymentDetails.getPaymentSavedCard()
    );

    const _location= this.location['_platformStrategy']._platformLocation.location;
    if(_location.hostname== "10.22.63.60" || _location.port== "4200"){
      this.updateSaveCard.controls['recaptcha'].setValidators(null);
      this.updateSaveCard.controls['recaptcha'].updateValueAndValidity();
    }
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
    this.getDeviceInfo();
  }
  setAddress(event){}
  ngOnInit() {
    this.setCountry();
    let _obj=[
      {name:'line1',validator:null},
      {name:'country',validator:null},
      {name:'postCode',validator:null},
      {name:'town',validator:null},
      {name:'phone',validator:null}
    ];
     this.setFormValidator(_obj);
     const baseSite = this.singletonServ.catalogVersion;
     if(baseSite.isoCode=="US"){
       this.usSpecific=true;
       this.csServicecommunication="uscustomerservice@moltonbrown.com";
     }else{
      this.usSpecific=false;
      this.csServicecommunication="customerservice@moltonbrown.com";
     }
     if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  getDeviceInfo() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
     this.mobileDevice=true;
    } 
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
setFormValidator(data){
    data.map((obj)=>{
      let _validate=obj.validator;
     if(_validate){
      this.updateSaveCard.controls[obj.name].setValidators(_validate);
      this.updateSaveCard.controls[obj.name].updateValueAndValidity();
     }else{
      this.updateSaveCard.controls[obj.name].setValidators(null);
      this.updateSaveCard.controls[obj.name].updateValueAndValidity();
     }
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["addresses"]) {
      if (changes["addresses"]["currentValue"] != undefined) {
            let _data = changes["addresses"]["currentValue"];
            this.addressList=_data;
            const _default=_.find(_data,(def)=>{
              return def.defaultAddress
            });
            if(!_default){
              this.addressList[0]['defaultAddress']=true;
            }
            this.resetBillForm();
         }
     }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  onEnterNewAddress(event) {
    const baseSite = this.singletonServ.catalogVersion;
    const _obj=[
      {name:'line1',validator:[Validators.required]},
      {name:'country',validator:[Validators.required]},
      {name:'postCode',validator:[Validators.required,patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)]},
      {name:'line1',validator:[Validators.required]},
      {name:'town',validator:[Validators.required]},
     
    ];
    if(baseSite.isoCode == "DE"){
       const _validator=   {name:'phone',validator:[Validators.required,
        patternValidator(/^[0-9 ]{8,14}$/)
      ]};
        _obj.push(_validator);
    }else{
      const _validator=   {name:'phone',validator:[Validators.required,
        patternValidator(/^((\\+91-?)|0)?[0-9]{10,14}$/)]};
        _obj.push(_validator);
    }

    if (baseSite.isoCode == "US") {
      _obj.push({name:'district',validator:[Validators.required]});
      const _id= _.findIndex(_obj,resp=>{
        return resp.name=='postCode'
      });  
      _obj[_id]= {name:'postCode',validator:[Validators.required,patternValidator(/^[0-9space ]{5,7}$/)]};
    }else{
      const index= _.findIndex(_obj,resp=>{
        return resp.name=='district'
      });   
       _obj.splice(index,1);
    }
     this.setFormValidator(_obj);
     this.addressList.map((obj) => {
        obj.defaultAddress = false;     
    });
    this.updateSaveCard.controls["phone"].setValidators([
      Validators.required,
      patternValidator(/^[0-9 ]{8,14}$/)
    ]);
    this.updateSaveCard.controls["phone"].updateValueAndValidity();
  }
  onSetaddress(index) {
    this.resetBillForm();
    this.addressList.map((obj, k) => {
      if (k == index) {
        obj.defaultAddress = true;
      } else {
        obj.defaultAddress = false;
      }
    });
  }
  resetBillForm(){
    const _obj=[
      {name:'country',validator:null},
      {name:'postCode',validator:null},
      {name:'line1',validator:null},
      {name:'town',validator:null},
      {name:'phone',validator:null},
      {name:'district',validator:null}
    ];
     this.setFormValidator(_obj);
  }
  onChangeCardType(event) {
    const _id=event.target.selectedIndex-1;
    const _cardType=this.cardType;
    this.updateSaveCard.controls["cardNumber"].setValidators(_cardType[_id].validators);
    this.updateSaveCard.controls["cardNumber"].updateValueAndValidity();
  }
  setCountry() {
    const that = this;
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      if (baseSite.isoCode == "GB") {
        this.ukLoopBtnStatus = true;
        this.ukSpecificForm = true;
        this.countries = this.nestedCopy(countries);
        const _isoCode = baseSite.isoCode;
          const _index = _.findIndex(this.countries, function(o) {
            return o.isocode == _isoCode;
          });
          this.updateSaveCard.controls["country"].patchValue(this.countries[_index]);
      } else if (baseSite.isoCode === "EU") {
        this.ukLoopBtnStatus = false;
        this.ukSpecificForm = false;
        this.manualAdress = false;
        this.usSpecificForm = false;
        this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
      } else if (baseSite.isoCode === "DE") {
        this.ukLoopBtnStatus = false;
        this.ukSpecificForm = false;
        this.manualAdress = false;
        this.usSpecificForm = false;
        this.countries = this.nestedCopy(DE_COUNTRIES);
        const _isoCode = baseSite.isoCode;
          const _index = _.findIndex(this.countries, function(o) {
            return o.isocode == _isoCode;
          });
        this.updateSaveCard.controls["country"].patchValue(this.countries[_index]);
        this.updateSaveCard.controls["phone"].setValidators([
          Validators.required,
          patternValidator(/^[0-9 ]{8,14}$/)
        ]);
        this.updateSaveCard.controls["phone"].updateValueAndValidity();
      } else if (baseSite.isoCode == "US") {
        this.ukLoopBtnStatus = false;
        this.ukSpecificForm = false;
        this.manualAdress = false;
        this.countries = this.nestedCopy(US_COUNTRIES);
        this.usSpecificForm = true;
        const _isoCode = baseSite.isoCode;
        const _index = _.findIndex(this.countries, function(o) {
            return o.isocode == _isoCode;
          });
          if(_index !=-1){
            this.updateSaveCard.controls["country"].patchValue(
              that.countries[_index]
            );
            const _states = _.find(this.countries, function(o) {
              return o.isocode == _isoCode;
            });
            this.stateList = _states.states;
            if(_states.states){
              this.updateSaveCard.controls['district'].patchValue(this.stateList[0]);
            }
            if (this.countries[_index].isocode === "US") {
              this.updateSaveCard.controls["postCode"].setValidators([Validators.required,patternValidator(/^[0-9space ]{5,7}$/)]);
              this.updateSaveCard.controls['postCode'].updateValueAndValidity();
            }else{
              this.updateSaveCard.controls["postCode"].setValidators([Validators.required,  patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)]);
              this.updateSaveCard.controls['postCode'].updateValueAndValidity();
            }
         }
      }
    }
  }

  /* *Setup the assosiated state and enabling lookup address . */
  onChangeCountry(event) {
    const baseSite = this.singletonServ.catalogVersion;
    const _index = event.target.selectedIndex - 1;
    const country = this.countries[_index];
    if(_index !=-1){
      // const _obj=[
      //   {name:'line1',validator:null},
      //   {name:'line2',validator:null},
      //   {name:'postCode',validator:null},
      //   {name:'town',validator:null},
      //   {name:'district',validator:null}
      // ];
      // this.resetControlAddressFields(_obj);
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

  }
  }  
  resetControlAddressFields(data){
    data.map((obj)=>{
      this.updateSaveCard.controls[obj.name].reset();
    });
    this.updateSaveCard.controls['district'].setValue('');
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmitForm(event);
      return false;
    }
} 
  onSubmitForm(event) {
    event.stopPropagation();
    event.preventDefault();
    const _form = this.updateSaveCard.value;
    this.submitted = true;
    const _default=_.find(this.addressList,(def)=>{
      return def.defaultAddress
    });
    let _raiseCardMonthValidatn=false;
    const date = new Date();
    if(parseInt(_form.year) == date.getFullYear() ){
      if(parseInt(_form.month) < date.getMonth()+1 ){
        _raiseCardMonthValidatn=true;        
      } 
    }
    if (this.updateSaveCard.valid) {
     if( !_raiseCardMonthValidatn){
       this.enableAction=true;
       const _obj={status:false};
       this.onSubmitRecapchaDtl.emit(_obj);
       if (!_default) {
         this.excuteCardWithBilingForm(); 
       } else {
         this.excuteCardWithoutBillingForm(_default);  
       }
     } else {
       this.updateSaveCard.controls['month'].setErrors({'incorrect': true});
        if(this.monthEl){
         if(this.monthEl.nativeElement){
          this.monthEl.nativeElement.focus();
          this.singletonServ.scrollToTarget('#monthExpire');
         }
     }     
     this.validateAllFormFields(this.updateSaveCard);
    }
  }else{
    this.validateAllFormFields(this.updateSaveCard); 
    const data=this.updateSaveCard.controls;
    const _filterData:Array<any>=Object.entries(data).filter((value)=>{
      return data[value[0]]['status']=="INVALID"
     });
    if(_filterData.length ==1){
       if(_filterData[0][0] == "recaptcha"){
         const _obj={status:true};
       this.onSubmitRecapchaDtl.emit(_obj);
     }
    }
  }
}
excuteCardWithoutBillingForm(_default){
  const _formControlName=[
    {name:'startDateMonth',reset:false},
    {name:'startDateYear',reset:false},
    {name:'month',reset:false},
    {name:'year',reset:false},
    {name:'cardType',reset:false},
    {name:'country',reset:false},
    {name:'district',reset:false},
  ];
  const baseSite = this.singletonServ.catalogVersion;
  const _form = this.updateSaveCard.value;
  const _accontHoldername=_form.cardHolderFirstName + " " + _form.cardHolderLastName;
  const _body = {
    accountHolderName:_accontHoldername,
    firstName: _form.cardHolderFirstName,
    lastName: _form.cardHolderLastName,
    cardNumber: _form.cardNumber,
    cardType: {
      code: _form.cardType
    },
    issueNumber:_form.issueNumber,
    expiryMonth: _form.month,
    expiryYear: _form.year,
    billingAddress: _default
  };
  if (this.singletonServ.getStoreData(baseSite.reg)) {
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    if(baseSite.csAgent){
      _body['isAsm']=true;
     }
    this.payService
      .postCardDetails(baseSite,user.token, user.email, _body)
      .subscribe(
        (response:any) => {
        if(response){
         if(response.errorCode ){
          this.singletonServ.scrollToTarget("#newsavecardForm");
          this.errorvalidationMsg=true;  
         }else{
          this.errorvalidationMsg=false;
          this.updateSaveCard.reset();
          this.resetAddressFields(_formControlName);
          const _isoCode = baseSite.isoCode;
          if (_isoCode != -1) {
            const _index = _.findIndex(this.countries, function(o) {
              return o.isocode == _isoCode;
            });
            this.updateSaveCard.controls["country"].patchValue(
              this.countries[_index]
            );
          }else{
            this.updateSaveCard.controls["country"].patchValue("");
          }
          this.updateSaveCard.controls["district"].patchValue("");
          this.updateCard.emit();
         }
        }
        
          this.enableAction=false;
          this.singletonServ.scrollToTarget('#myaccPaymentDtls');
        },
        err => {
          if(err.error){
            if(err.error["errors"]){
                  if(err.error["errors"][0]){
                    if(err.error["errors"][0]['type']== "InvalidTokenError") {
                          this.payService.generateToken(baseSite).subscribe((token)=>{
                            const tokenId = token["access_token"];
                            user['token']=tokenId;
                            this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                            this.  onSubmitForm(event);
                        });
                    } else{                        
                      this.enableAction=false;
                    }
                  };
              }else{                      
                this.enableAction=false;
              }
             }
        });
  }
    
this.submitted = true;
}
excuteCardWithBilingForm(){
  const _formControlName=[
    {name:'startDateMonth',reset:false},
    {name:'startDateYear',reset:false},
    {name:'month',reset:false},
    {name:'year',reset:false},
    {name:'cardType',reset:false},
    {name:'country',reset:false},
    {name:'district',reset:false},
  ];
  const baseSite = this.singletonServ.catalogVersion;
  const _form = this.updateSaveCard.value;
  const _accontHoldername=_form.cardHolderFirstName + " " + _form.cardHolderLastName;
  let state = "";
  if (_form.district) {
    if (typeof _form.district == "object") {
      state = _form.district.name;
    } else {
      state = _form.district;
    }
  }
  const _body = {
    accountHolderName: _accontHoldername,
    firstName: _form.cardHolderFirstName,
    lastName: _form.cardHolderLastName,
    cardNumber: _form.cardNumber,
    cardType: {
      code: _form.cardType
    },
    expiryMonth: _form.month,
    expiryYear: _form.year,
    issueNumber:_form.issueNumber,
    billingAddress: {
      firstName: _form.cardHolderFirstName,
      lastName: _form.cardHolderLastName,
      country: {
        isocode: _form.country.isocode,
        name:_form.country.name
      },
      postalCode: _form.postCode,
      town: _form.town,
      phone: _form.phone,
      line1: _form.line1,
      line2: _form.line2,
      titleCode: "miss",
      district: state,
      defaultAddress:true
    }
  };
   if (this.singletonServ.getStoreData(baseSite.reg)) {
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    if(baseSite.csAgent){
      _body['isAsm']=true;
     }
     this.payService
      .postCardDetails(baseSite,user.token, user.email, _body)
      .subscribe(
        (response:any) => {
          if(response){
            if(response.errorCode ){
            this.singletonServ.scrollToTarget("#newsavecardForm");
            this.errorvalidationMsg=true;  
          }else{
            this.errorvalidationMsg=false;
            this.updateSaveCard.reset(); 
            this.resetAddressFields(_formControlName);               
            const _isoCode = baseSite.isoCode;
          if (_isoCode != -1) {
            const _index = _.findIndex(this.countries, function(o) {
              return o.isocode == _isoCode;
            });
            this.updateSaveCard.controls["country"].patchValue(
              this.countries[_index]
            );
          }else{
            this.updateSaveCard.controls["country"].patchValue("");
          }
          this.updateSaveCard.controls["district"].patchValue("");
          this.updateCard.emit();
        }
      }
          this.enableAction=false;
          this.singletonServ.scrollToTarget('#myaccPaymentDtls');
        },
        (err:any) => {
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.payService.generateToken(baseSite).subscribe((token)=>{
                    const tokenId = token["access_token"];
                    user['token']=tokenId;
                    this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                    this.  onSubmitForm(event);
                 });
                } else{
                  this.enableAction=false;
                }
              }
              }else{
                this.enableAction=false;
              }
             }
        }
      );
    }
}
resetAddressFields(data){
  data.map((obj)=>{
    this.updateSaveCard.controls[obj.name].setValue('');
  });
  
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

  onLookupAddress(event) {
    this.findAddress(event);
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
  findAddress(event) {
    event.preventDefault();
    const val = this.updateSaveCard.value;
    this.myInput.nativeElement.focus();
    if (this.updateSaveCard.controls["postCode"].valid) {
      this.postCodeError = false;
      const postcode = val["postCode"];
      this.payService.getPostCode(postcode).subscribe(
        response => {
          if (response["Items"][0]){
          if (response["Items"][0]["Error"]) {
            this.updateSaveCard.controls["address"].setValue("");
            this.postCodeStatus = false;
          } else {
            this.postCodeStatus = true;
            this.postalAddresses = response["Items"];
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
        } else {
          this.postCodeError=true;
          this.myInput.nativeElement.focus();
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
    this.payService.retrievePostalAddress(id).subscribe(
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
}
