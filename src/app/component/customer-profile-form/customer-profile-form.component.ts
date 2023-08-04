import {
  Component,
  NgZone,
  OnInit,
  Output,
  Input,
  OnChanges,
  SimpleChange,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { countries,EUROPEAN_COUNTRIES,DE_COUNTRIES,US_COUNTRIES  } from "../../app.constant";
import { patternValidator } from '../../forms/pattern-validator';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { RegistrationForm } from "../../forms/registration.form";
import { profileComponentService } from "../profile-form/profile.service";
import * as _ from "lodash";
import { SingletonService } from "../../services/singleton.service";
import { TranslateService } from "../../translate.service";
import { DeviceDetectorService } from "ngx-device-detector";
declare var conv_RU_addAddress:number;
declare var conv_RU_editAddress:number;
declare var _conv_q:any; 
declare var google:any;
@Component({
  selector: "app-customer-profile-form",
  templateUrl: "./customer-profile-form.component.html",
  styleUrls: ["./customer-profile-form.component.scss"]
})
export class CustomerProfileFormComponent implements OnInit, OnChanges,AfterViewInit {
  @ViewChild('myInput') myInput: ElementRef; 
  registrationForm: FormGroup;
  @Input() customerData:any;
  @Input() customerId: string;
  @Input() updateAddress: boolean;
  @Output() cancelUpdate: EventEmitter<any> = new EventEmitter<any>();
  breadcrumb: Array<any>;
  countries: Array<any> ;
  addressId: string;
  postalAddresses: Array<any>;
  postCodeStatus: boolean;
  postCodeError:boolean;
  searchTerm: string;
  ukSpecificForm:boolean;
  deviceInfo: any;
  mobileDevice: boolean;
  ukLoopBtnStatus:boolean;
  deContent:boolean;
  usLoopBtnStatus:boolean;
  desktopDevice: boolean;
  usSpecificForm:boolean;
  stateList:Array<any>;
  registrationFormInvalid:boolean;
  isValidFormSubmitted:boolean;
  userData:any;
  usSpecific:boolean;
  constructor(
    private zone: NgZone,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public customerForm: RegistrationForm,
    private fb: FormBuilder,
    public profileServ: profileComponentService,
    private translate: TranslateService,
    public deviceService: DeviceDetectorService
  ) {
    this.registrationForm = this.fb.group(customerForm.addressForm());
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.lngCode=='de'){
      this.deContent=true;
      this.registrationForm.controls["phone"].setValidators([
        Validators.required,
        patternValidator(/^[0-9 ]{8,14}$/)
      ]);
      this.registrationForm.controls["phone"].updateValueAndValidity();
    }else{
      this.deContent=false;
    }
    this.postCodeStatus = true;
  }

  ngOnInit() {
    this.breadcrumb = ["MY ACCOUNT", " MY PROFILE"];
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="US"){
      this.usSpecific=true;
    }
    else{
      this.usSpecific=false;
    }

    if(baseSite){
      this.setLang(baseSite.lngCode);
    }
    this.getDeviceInfo();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["updateAddress"]) {
      if (changes["updateAddress"]["currentValue"]) {
        if (changes["customerData"]) {
          if (changes["customerData"]["currentValue"]) {
            const _data = changes["customerData"]["currentValue"];
            if(_data.titleCode=='Frau'){
              _data['titleCode']='mrs';
              this.registrationForm.patchValue(_data);
            }else if(_data.titleCode=='Herr'){
              _data['titleCode']='mr';
              this.registrationForm.patchValue(_data);
            }else{
              this.registrationForm.patchValue(_data);
            }
            this.userData=_data;
            const _isoCode =_data["country"]["isocode"];
            const _index = _.findIndex(this.countries, function(o) {
              return o.isocode == _isoCode;
            });
            if (_index != -1) {
              this.registrationForm.controls["country"].patchValue(
                this.countries[_index]
              );
              if(this.countries[_index].states){
                this.stateList=this.countries[_index].states;            
                const _stateIndex = _.findIndex(this.stateList, function(o) {
                  return o.name == _data.district;
                });
                if(_stateIndex !=-1){
                  this.registrationForm.controls["district"].patchValue(
                    this.stateList[_stateIndex]
                  );
                }else{
                  this.registrationForm.controls["district"].patchValue('');
                }
              }else{
                this.stateList=undefined;
              }
              }
        if (changes["customerId"]) {
          if (changes["customerId"]["currentValue"] != undefined) {
            this.addressId = changes["customerId"]["currentValue"];
          }
        }
      }
      
    }
      }
    }
    this.setCountry();
  }

  setCountry(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode ==='GB'){
      this.countries= this.nestedCopy(countries);
      if ( this.userData) {
        const _isoCode =  this.userData.country.isocode;
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        if (_index != -1) {
          this.registrationForm.controls["country"].patchValue(
            this.countries[_index]
          );
         if(this.countries[_index].isocode === "GB"){
          this.ukLoopBtnStatus=true;
          this.usLoopBtnStatus=true;
          this.ukSpecificForm=true;
          this.usSpecificForm=false;
         } else{
          this.ukLoopBtnStatus=false;
          this.ukSpecificForm=false;
          this.usSpecificForm=false;
         }
        }else{
          this.ukLoopBtnStatus=true;
          this.usLoopBtnStatus=true;
          this.ukSpecificForm=true;
          this.usSpecificForm=false;
          const _isoCode=baseSite.isoCode;
          const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
          this.registrationForm.controls["country"].patchValue(this.countries[_index]);
        }
      }else{
        this.ukLoopBtnStatus=true;
        this.usLoopBtnStatus=true;
        this.ukSpecificForm=true;
        this.usSpecificForm=false;
         const _isoCode=baseSite.isoCode;
         const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
         this.registrationForm.controls["country"].patchValue(this.countries[_index]);
      }

    }else if(baseSite.isoCode ==='EU'){
      this.ukLoopBtnStatus=false;
      this.ukSpecificForm=false;
      this.usSpecificForm=false;
      this.countries=this.nestedCopy(EUROPEAN_COUNTRIES);
      if ( this.userData) {
        const _isoCode =  this.userData.country.isocode;
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        if (_index != -1) {
          this.registrationForm.controls["country"].patchValue(
            this.countries[_index]
          );
        }else{
          this.registrationForm.controls["country"].patchValue(this.countries[0]);
        }
      }else{
        this.registrationForm.controls["country"].patchValue(this.countries[0]);
      }

    
    }else if(baseSite.isoCode ==='DE'){
      this.ukLoopBtnStatus=false;
      this.ukSpecificForm=false;
      this.usSpecificForm=false;
      this.countries=this.nestedCopy(DE_COUNTRIES);
      if ( this.userData) {
        const _isoCode =  this.userData.country.isocode;
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        if (_index != -1) {
          this.registrationForm.controls["country"].patchValue(
            this.countries[_index]
          );
        }else{
          this.registrationForm.controls["country"].patchValue(this.countries[0]);  
        }
      }else{
        this.registrationForm.controls["country"].patchValue(this.countries[0]);
      }
      this.registrationForm.controls["phone"].setValidators([
        Validators.required,
        patternValidator(/^[0-9 ]{8,14}$/)
      ]);
      this.registrationForm.controls["phone"].updateValueAndValidity();
    }else if(baseSite.isoCode ==='US'){
      this.ukLoopBtnStatus=true;
      this.usLoopBtnStatus=false;
      this.ukSpecificForm=false;
      this.usSpecificForm=true;
      this.countries= this.nestedCopy(US_COUNTRIES);
      if ( this.userData) {
        const _isoCode =  this.userData.country.isocode;
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        if (_index != -1) {
          this.registrationForm.controls["country"].patchValue(
            this.countries[_index]
          );
        }
        if(_index !=-1){
        if( this.countries[_index].states){
          const _stateID = _.findIndex(this.countries[_index].states, function(o) {
            return o.name == that.userData.district;
          });
          if(_stateID !=-1){

            this.registrationForm.controls['district'].patchValue(this.stateList[_stateID]);
          }else{

            this.registrationForm.controls['district'].patchValue(this.stateList[0]);
          }
        }
      }
        if ( this.userData.country.isocode == "US") {
          this.registrationForm.controls["postalCode"].setValidators([
            Validators.required,
            patternValidator(/^[0-9space ]{5,7}$/)
          ]);
          this.registrationForm.controls["postalCode"].updateValueAndValidity();
        } 
        else {
          this.registrationForm.controls["postalCode"].setValidators([
            Validators.required,
            patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
          ]);
          this.registrationForm.controls["postalCode"].updateValueAndValidity();
        }

      } else{

        const _isoCode=baseSite.isoCode;
        const _index=_.findIndex(this.countries, function(o) { return o.isocode == _isoCode; });
        this.registrationForm.controls["country"].patchValue(this.countries[_index]);
        const _states=_.find(this.countries, function(o) { return o.isocode == _isoCode; });
        this.stateList=(_states.states)?_states.states:undefined;
         if (this.countries[_index].isocode === "US") {
           this.registrationForm.controls["district"].setValidators([Validators.required]);
           this.registrationForm.controls["postalCode"].setValidators([Validators.required,patternValidator(/^[0-9space ]{5,7}$/)]);
           this.registrationForm.controls['postalCode'].updateValueAndValidity();
           this.registrationForm.controls['district'].updateValueAndValidity();
         }else{
           this.registrationForm.controls["postalCode"].setValidators([Validators.required,patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)]);
           this.registrationForm.controls['postalCode'].updateValueAndValidity();
         }
         this.registrationForm.controls['district'].patchValue('');
         if( this.countries[_index].states){           
          this.registrationForm.controls['district'].patchValue(this.stateList[0]);
         }
      }
    }
  }
  patchCountry() {
    if ( this.userData) {
      const _isoCode =  this.userData.country.isocode;
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.registrationForm.controls["country"].patchValue(
          this.countries[_index]
        );
      }
      if ( this.userData.country.isocode == "US") {

        this.registrationForm.controls["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^[0-9space ]{5,7}$/)
        ]);
        this.registrationForm.controls["postalCode"].updateValueAndValidity();
      } else {
        this.registrationForm.controls["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
        ]);
        this.registrationForm.controls["postalCode"].updateValueAndValidity();
      }
    }
  }
  onChangeCountry(event) {
    const baseSite = this.singletonServ.catalogVersion;
    const _index = event.target.selectedIndex - 1;
    const country = this.countries[_index];
    if(_index !=-1){
    if (this.countries[_index].isocode === "US" || baseSite.isoCode=="US" ) {
      const _usCode=this.countries[_index].isocode;
      const _pattern =(_usCode=="US")?  [
        Validators.required,
        patternValidator(/^[0-9space ]{5,7}$/)
      ]: [
        Validators.required,
        patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
      ];
      this.registrationForm.controls["postalCode"].setValidators(_pattern);
      this.registrationForm.controls["postalCode"].updateValueAndValidity();
      this.registrationForm.controls["district"].setValidators([
        Validators.required
      ]);
      this.registrationForm.controls["district"].updateValueAndValidity(); 
      this.usSpecificForm = true;
      this.ukSpecificForm = false;
    
    }else{
      this.usSpecificForm = false;
      this.registrationForm.controls["district"].setValidators(null);
      this.registrationForm.controls["district"].updateValueAndValidity();
      this.registrationForm.controls["postalCode"].setValidators([
        Validators.required,
        patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
      ]);
      this.registrationForm.controls["postalCode"].updateValueAndValidity();
      this.registrationForm.controls["district"].setValidators(null);
      this.registrationForm.controls["district"].updateValueAndValidity();
    }
    if (country.states) {
        this.stateList = country.states;
        this.usSpecificForm = true;        
        this.registrationForm.controls['district'].patchValue(this.stateList[0]);
      } else {
        this.stateList = undefined;
        this.registrationForm.controls['district'].patchValue('');
      }
    if (this.countries[_index]["isocode"] == "GB") {
      this.ukSpecificForm = true;
      this.ukLoopBtnStatus=true;
      this.usLoopBtnStatus=true;
      this.usSpecificForm = false;
    } else {
      this.ukSpecificForm = false;
      this.ukLoopBtnStatus=false;
      this.postalAddresses=undefined;
      this.registrationForm.controls["address"].setValidators(null);
      this.registrationForm.controls["address"].updateValueAndValidity();
    }

  }
  }  
  resetAddressFields(data){
    data.map((obj)=>{
      this.registrationForm.controls[obj.name].reset();
    });
    this.registrationForm.controls['district'].setValue('');
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
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  
  setAddress(addrObj) {
    const that = this;
    this.zone.run(() => {
      const _obj={
        postCode:addrObj.postal_code,
        latitude:addrObj.latitude,
        longitude:addrObj.longitude
     } 
     if(_obj.postCode){
      that.registrationForm.controls["postalCode"].setValue(
        addrObj.postal_code
      );
      } else  {
        that.registrationForm.controls["postalCode"].setValue(
          addrObj.postal_code
        );
      }
    });
  }
  
  setLang(lang: string) {
    this.translate.use(lang);
  }

  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmitForm(event,true);
      return false;
    }
} 
  onSubmitForm(event, boolean) {
    event.stopPropagation();
    event.preventDefault();
    let _address = this.registrationForm.value;
    let state='';
    if (_address.district) {
      if (typeof _address.district == "object") {
        state = _address.district.name;
      } else {
        state = _address.district;
      }
    }
    _address['district']=state;
    if (boolean) {
      if (this.registrationForm.valid) { 
        const baseSite = this.singletonServ.catalogVersion;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          const email = user.email;
          if (!this.updateAddress) {
              conv_RU_addAddress=1;
              _conv_q = _conv_q || [];
              _conv_q.push(["run","true"]);
                const _address = this.registrationForm.value;  
                this.profileServ
                  .createUserAddress(baseSite,_address, user.token, email)
                  .subscribe(
                    response => {
                      this.cancelUpdate.emit(true);
                      this.registrationForm.reset();
                      this.setCountry();
                    },
                    error => {}
                  );
              } 
              else if(this.updateAddress){
                 conv_RU_editAddress = 1;
                _conv_q = _conv_q || [];
                _conv_q.push(["run","true"]);
                const id = this.customerId;
                // _address["titleCode"] = "mrs";
                delete _address["defaultAddress"];
                this.profileServ
                  .updateUserAddress(baseSite, _address, user.token, email, id)
                  .subscribe(
                    response => {
                      this.cancelUpdate.emit(true);
                      this.registrationForm.reset();
                      this.setCountry();
                    },
                    error => {}
                  );
              } 
        }
      }else{
        this.validateAllFormFields(this.registrationForm); 
      }
    } else {
      this.registrationForm.controls["line1"].patchValue([""]);
      this.registrationForm.controls["city"].setValue("");
      this.findAddress(event);
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

  onSearchKeyUp(event) {
     const baseSite=this.singletonServ.catalogVersion;
     if (event.key === "Enter") {
           event.preventDefault();
           event.stopPropagation();
           if(baseSite.isoCode=="GB"){
           this.registrationForm.controls['postalCode'].patchValue(event.target.value);
           this.myInput.nativeElement.focus(); 
           this.onLookupAddress(event);
       }
    }
  }
  
  onLookupAddress(event) {
    this.findAddress(event);
  }
  findAddress(event) {
    event.preventDefault();
     const val = this.registrationForm.value;
     this.myInput.nativeElement.focus();    
    if(this.registrationForm.controls['postalCode'].valid){  
      this.postCodeError=false; 
    const postcode = val["postalCode"];
    this.profileServ.getPostCode(postcode).subscribe(
      response => {
        if (response["Items"][0]){
        if (response["Items"][0]["Error"]) {
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
                this.registrationForm.controls["address"].setValue("");
                this.registrationForm.controls["line1"].setValue("");
                break;
            }
          }
        }
      } else {
        this.myInput.nativeElement.focus();
        this.postCodeError = true;
        this.postCodeStatus = false;
      }
      },
      error => {}
    );
    }
    else{
      this.postCodeError=true;
       this.myInput.nativeElement.focus();
          }
  }
  onChange(data) {}
  onUpdate() {
    if (this.updateAddress) {
      this.cancelUpdate.emit(false);
    } else {
      this.registrationForm.reset();
    }
  }
  onSelectPlace(val) {
    const id = val;
    this.profileServ.retrievePostalAddress(id).subscribe(
      resp => {
        this.postalAddresses = undefined;
        let _addresses = resp["Items"][0];
        if (_addresses["Company"].length == 0) {
          this.registrationForm.controls["line1"].setValue(_addresses["Line1"]);
          this.registrationForm.controls["line2"].setValue(_addresses["Line2"]);
        } else {
          this.registrationForm.controls["line1"].setValue(
            _addresses["Company"]
          );
          this.registrationForm.controls["line2"].setValue(_addresses["Line1"]);
        }
        this.registrationForm.controls["postalCode"].setValue(_addresses["Postcode"]);
        this.registrationForm.controls["district"].setValue(_addresses["County"]);
        this.registrationForm.controls["town"].setValue(_addresses["PostTown"]);
      },
      err => {}
    );
  }
  ngAfterViewInit(){

}
}
