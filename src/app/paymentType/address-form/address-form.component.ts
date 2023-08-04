import { 
  Inject,
   Component, 
   OnInit, 
   Input,
   OnChanges,
   SimpleChange,
   ViewChild,
   EventEmitter,
   ElementRef, 
   Output,
   AfterViewInit
  } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { SingletonService } from "../../services/singleton.service";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { countries,EUROPEAN_COUNTRIES,DE_COUNTRIES,US_COUNTRIES  } from "../../app.constant";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import * as _ from "lodash";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { DeliveryComponentService } from "../../checkout-cart/delivery/delivery.service";
import { patternValidator } from '../../forms/pattern-validator';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit,OnChanges,AfterViewInit {
  @Input() billingForm:FormGroup;
  @Input() detail:any;
  @ViewChild('myInput') myInput: ElementRef; 
  @Output() discardAddressForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitAddressForm: EventEmitter<any> = new EventEmitter<any>();
  ccForm:FormGroup;
  manualAdress:boolean;
  ukSpecificForm:boolean;
  usSpecificForm:boolean;
  deBtn:boolean;
  stateList:Array<any>;
  countries:Array<any>;
  deviceInfo:any;
  mobileDevice:boolean;
  desktopDevice:boolean;
  postCodeError:boolean;
  postCodeStatus:boolean;
  postalAddresses:any;
  editAddress:boolean;
  loading:boolean;
  countryMsgDtls:any={
    errMSG:'Please select a country',
    option:'Choose Country *'
  }
  constructor(
    @Inject(DOCUMENT) public dom,
    public location: Location,
    public router: Router,
    public translate: TranslateServiceSubService,
    public singletonServ: SingletonService,
    public route: ActivatedRoute,
    public deviceService: DeviceDetectorService,
    public deliveryServ: DeliveryComponentService,
    private fb: FormBuilder,
    public _checkOutForm: PaymentGateWayForm,
    private el: ElementRef
  ) {
    this.editAddress=false;
    this.postCodeStatus = true;
    this.manualAdress = true;
    this.ccForm =this.fb.group(this._checkOutForm.getCCForm());
    this.  setForm();
   }

  addressManual() {
    this.postalAddresses=undefined;
    this.ccForm.controls["address"].setValidators(null);
    this.ccForm.controls["address"].updateValueAndValidity();
    this.manualAdress = false;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(changes['detail']){
      if (changes["detail"]["currentValue"] != undefined) {
       let _dtl=changes["detail"]["currentValue"];
       this.manualAdress = false; 
       this.ccForm.patchValue(_dtl);
       this.  patchCountry(_dtl);
       this.editAddress=true;
      }
    }
  }

  setForm(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite){
    if(baseSite.isoCode ==='GB'){
        this.ukSpecificForm=true;
        this.countries= this.nestedCopy(countries);
        const _isoCode=baseSite.isoCode;
        if(_isoCode!=-1){
        const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
        this.ccForm.controls["country"].patchValue(this.countries[_index]);
        }
    }else if(baseSite.isoCode ==='EU'){
        this.ukSpecificForm=false;
        this.manualAdress=false;
        this.usSpecificForm=false;
        this.countries=this.nestedCopy(EUROPEAN_COUNTRIES);
    }else if(baseSite.isoCode ==='DE'){
        this.ukSpecificForm=false;
        this.manualAdress=false;
        this.usSpecificForm=false;
        this.countries=this.nestedCopy(DE_COUNTRIES);
        const _isoCode=baseSite.isoCode;
        if(_isoCode!=-1){
        const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
        this.ccForm.controls["country"].patchValue(this.countries[_index]);
        }
        this.ccForm.controls["phone"].setValidators([
          Validators.required,
          patternValidator(/^[0-9 ]{8,14}$/)
        ]);
        this.ccForm.controls["phone"].updateValueAndValidity();
    }else if(baseSite.isoCode=="US"){
          this.ukSpecificForm=false;
          this.manualAdress=false;
          this.countries=this.nestedCopy(US_COUNTRIES);
          this.usSpecificForm=true;
          const _isoCode=baseSite.isoCode;
          if(_isoCode!=-1){
              const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
              this.ccForm.controls["country"].patchValue(this.countries[_index]);
              const _states=_.find(this.countries, function(o) { return o.isocode == _isoCode; });
              this.stateList=_states.states;
              if (this.countries[_index].isocode === "US") {
                this.ccForm.controls["postalCode"].setValidators([Validators.required,patternValidator(/^[0-9space ]{5,7}$/)]);
                this.ccForm.controls['postalCode'].updateValueAndValidity();
              }else{
                this.ccForm.controls["postalCode"].setValidators([Validators.required,patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)]);
                this.ccForm.controls['postalCode'].updateValueAndValidity();
              }
              if(this.countries[_index].isocode === "US"||this.countries[_index].isocode == "CA"){
              if(this.detail){
                if(this.detail.district){
                  const _stateId=_.find(this.stateList, function(o) { return o.name ==  that.detail.district; });
                  this.ccForm.controls["district"].patchValue(that.stateList[_stateId]);
                }else{
                  this.ccForm.controls["district"].patchValue('');
                }
              }else{
                this.ccForm.controls["district"].patchValue('');
              }
              }
          }
          this.ccForm['controls']["district"].setValidators([
            Validators.required
          ]);
          this.ccForm['controls']["district"].updateValueAndValidity();
    }
  }

}

  onChangeCountry(event) {
    const baseSite = this.singletonServ.catalogVersion;
    if(event.id !=0){
    const _index = event.id-1;
    const country = this.countries[_index];
    const _currentVal=this.ccForm.controls["country"].value;
    if(baseSite.isoCode !="DE"){
      if(country.isocode !=_currentVal.isocode){
            const _obj=[
              {name:'line1',validator:null},
              {name:'line2',validator:null},
              {name:'postalCode',validator:null},
              {name:'town',validator:null},
              {name:'district',validator:null}
            ];
            this.resetControlAddressFields(_obj);
      }
    }

    if(_index !=-1){
        if (this.countries[_index].isocode == "US" || baseSite.isoCode=="US") {
              const _usCode=this.countries[_index].isocode;
              const _pattern =(_usCode=="US")?  [
                Validators.required,
                patternValidator(/^[0-9space ]{5,7}$/)
              ]: [
                Validators.required,
                patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
              ];
              this.ccForm.controls["postalCode"].setValidators(_pattern);
              this.ccForm.controls["postalCode"].updateValueAndValidity();
              this.ccForm.controls["district"].setValidators([
                Validators.required
              ]);
              this.ccForm.controls["district"].updateValueAndValidity(); 
              this.usSpecificForm = true;
              this.ukSpecificForm = false;   
        }else{
              this.usSpecificForm = false;
              this.ccForm.controls["postalCode"].setValidators([
                Validators.required,
                patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
              ]);
              this.ccForm.controls["postalCode"].updateValueAndValidity();
              this.ccForm.controls["district"].setValidators(null);
              this.ccForm.controls["district"].updateValueAndValidity();
       }
       if (country.states) {
          this.stateList = country.states;
          this.usSpecificForm = true;
        } else {
          this.stateList = undefined;
        }
        if (this.countries[_index]["isocode"] == "GB") {
            if(_currentVal.isocode !="GB"){
              this.ukSpecificForm = true;
              this.manualAdress=true;
              this.usSpecificForm = false;
          }
        } else {
          this.ukSpecificForm = false;
          this.manualAdress=false;
          this.postalAddresses=undefined;
          this.ccForm.controls["address"].setValidators(null);
          this.ccForm.controls["address"].updateValueAndValidity();
        }
      }
      this.ccForm.controls["country"].patchValue(country);
  } else{
    this.ccForm.controls["country"].patchValue(this.countryMsgDtls);
    this.ccForm.controls["country"].setErrors({required:true});

  } 
}
  resetControlAddressFields(data){
    data.map((obj)=>{
      this.ccForm.controls[obj.name].reset();
    });
    this.ccForm.controls['district'].setValue(null);
  }


  onSearchByPostal() {
    this.ccForm.controls["line1"].setValue("");
    this.ccForm.controls["line2"].setValue("");
    this.ccForm.controls["district"].setValue(null);
    this.ccForm.controls["town"].setValue("");
    this.manualAdress = true;
  }
  onPostCodeKeyUp(el) {
    if (!el || !el.target.value) return;
    el.target.value = el.target.value.toUpperCase();
  }
  onPostCodeKeyDown(event) {
    if (event.key === "Enter") {
        this.ccForm.controls['postalCode'].patchValue(event.target.value);
        this.findAddress(event);
     }
     if (!event || !event.target.value) return;
    this.postCodeStatus = true;
    this.postCodeError=false;

  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="DE"){
      this.deBtn=true;
    }
    else{
      this.deBtn=false;
    }
    this.singletonServ.scrollToTarget('#ccForm');
    this.getDeviceInfo();
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
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

  findAddress(event) {
    this.loading = true;
    event.preventDefault();
    const val = this.ccForm.value;
    this.myInput.nativeElement.blur();
    if(this.ccForm.controls['postalCode'].valid){  
      this.postCodeError=false; 
    const postcode = val["postalCode"];
    this.deliveryServ.getPostCode(postcode).subscribe(
      response => {
       if (response["Items"][0]) {
        this.ccForm.controls["address"].setValue("");
        if (response["Items"][0]["Error"]) {
          this.postCodeStatus = false;
          this.postalAddresses=undefined;          
          this.myInput.nativeElement.focus();
        } else {
          this.postCodeStatus = true;
          this.postalAddresses = response["Items"];
          if(val["line1"] !=""){
          for (let i = 0; i < response["Items"].length; i++) {
             const _streetAddress =response["Items"][i]["StreetAddress"].toLowerCase();
              if(val["line1"]){
              const _line1=val["line1"].toLowerCase();
              if (_streetAddress.indexOf(_line1) != -1) {
                  this.onSelectPlace(response["Items"][i]['Id']);       
                  break;
              }
            }
          }
        }else{
       
        }
        }
      }else{
        this.postCodeError = true;        
        this.myInput.nativeElement.focus();
        this.postCodeStatus = false;
     }
      },
      error => {}
    );
  }else{
      this.postCodeError=true;
       this.myInput.nativeElement.focus();
  }
          setTimeout(()=>{
            this.loading = false;
          },500)
  }
  onSelectPlace(val) {
    const id = val;
    this.deliveryServ.retrievePostalAddress(id).subscribe(
      resp => {
        const _postAddress = resp["Items"];
        if (!_postAddress[0].Error) {
          this.postalAddresses = resp["Items"];
          this.postalAddresses = undefined;
          this.manualAdress = false;
          let _addresses = resp["Items"][0];
          this.ccForm.controls["town"].setValue(_addresses["PostTown"]);
          if (_addresses["Company"].length == 0) {
            this.ccForm.controls["line1"].setValue(_addresses["Line1"]);
            this.ccForm.controls["line2"].setValue(_addresses["Line2"]);
          } else {
            this.ccForm.controls["line1"].setValue(_addresses["Company"]);
            this.ccForm.controls["line2"].setValue(_addresses["Line1"]);
          }
          this.ccForm.controls["postalCode"].setValue(_addresses["Postcode"]);
          this.ccForm.controls["district"].setValue(_addresses["County"]);
        } else {

        }
      },
      err => {}
    );
  }

  patchCountry(userData) {
    if (userData) {
      const _isoCode = userData.country.isocode;
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.ccForm['controls']["country"].patchValue(
          this.countries[_index]
        );
        this.stateList = this.countries[_index]["states"];
        if(this.stateList){
        const _stateIndex = _.findIndex(this.stateList, function(o) {
          return o.name == userData.district;
        });
        if (_stateIndex != -1) {
          this.ccForm['controls']["district"].patchValue(this.stateList[_stateIndex]);
        }
        else{
          this.ccForm['controls']["district"].patchValue('');
        }
       }
      }else{
        this.ccForm['controls']["country"].patchValue(this.countryMsgDtls);
      }
      if (userData.country.isocode == "US") {
        this.usSpecificForm=true;
        this.ccForm['controls']["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^[0-9space ]{5,7}$/)
        ]);
        this.ccForm['controls']["postalCode"].updateValueAndValidity();
      } else {
        this.ccForm['controls']["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
        ]);
        this.ccForm['controls']["postalCode"].updateValueAndValidity();
        
      }
    
    }
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      if (!this.manualAdress){
         event.target.blur();
         this.onSubmitAddresForm(event);
       return false;
     }
     }
  } 
  onPostcodeChange(event){
    this.postCodeStatus=true;
  }
  onSubmitAddresForm(event){
    event.stopPropagation();
    event.preventDefault();
    const that=this;
    const _billingForm=this.ccForm.value;
    let state='';
    if (_billingForm.district) {
      if (typeof _billingForm.district == "object") {
        state = _billingForm.district.name;
      } else {
        state = _billingForm.district;
      }
    }
    _billingForm['titleCode']="mr";
    _billingForm['district']=state;
    if(this.ccForm.valid){ 
    this.submitAddressForm.emit(_billingForm);
   }else{
    this.validateAllFormFields(this.ccForm);
    if(that.el.nativeElement.querySelector('.has-error')){        
      setTimeout(()=>{
      (<HTMLInputElement>that.el.nativeElement.querySelector('.has-error')).focus();
    });
    }
    setTimeout(()=>{              
      this.setCheckFormFocus(this.ccForm);
    });
   }
 }

  onResetForm(){
    this.discardAddressForm.emit();
  }
  ngAfterViewInit(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion; 
    if(baseSite.isoCode === "DE"){
        let _shortFields=that.dom.querySelector("#ccBlForm");
        let _fields = that.dom.querySelectorAll('#ccBlForm .sort-field');
        let _sortparaArr = [].slice.call(_fields).sort(function (a, b) {
          const _aEl=parseInt(a.dataset.sortindex);
          const _bEl=parseInt(b.dataset.sortindex);
          return _aEl > _bEl ? 1 : -1;
        });
        _sortparaArr.forEach(function (p) {
          _shortFields.appendChild(p);
        });
    }
    if (this.detail) {
      const _isoCode = this.detail.country.isocode;
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == _isoCode;
      });
      if (_index == -1) {
        this.ccForm['controls']["country"].patchValue(this.countryMsgDtls);
      }
  }
  }

   
 setCheckFormFocus(form){
  const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
  if(formGroupInvalid.length !=0){
    (<HTMLInputElement>formGroupInvalid[0]).focus();
       this.validateAllFormFields(form);
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
}
