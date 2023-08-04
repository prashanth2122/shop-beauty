import {
  Inject,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import {
  countries,
  EUROPEAN_COUNTRIES,
  DE_COUNTRIES,
  US_COUNTRIES
} from "../../../app.constant";
import { ShipmentForm } from "../../../forms/shipmentForm.form";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DeliveryComponentService } from "../delivery.service";
import { profileComponentService } from "../../../component/profile-form/profile.service";
import { SingletonService } from "../../../services/singleton.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { TranslateServiceSubService } from "../../../pipe/translate-service-sub.service";
import { patternValidator } from "../../../forms/pattern-validator";
import * as _ from "lodash";
import { Subscription, Subject } from "rxjs";
import { DOCUMENT } from '@angular/common';
declare var conv_confirmShipping_Addr:number;
declare var conv_postcodelookup:number;
declare var conv_addAddressManual:number;
declare var _conv_q:any;
declare var $:any;
@Component({
  selector: "app-delivery-form",
  templateUrl: "./delivery-form.component.html",
  styleUrls: ["./delivery-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryFormComponent implements OnInit, OnChanges,AfterViewInit,OnDestroy {
  @ViewChild("myInput") myInput: ElementRef;
  @Output() onValueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() showOverLay :  EventEmitter<any> = new EventEmitter<any>();
  @Input() customerInfoUpdate: any;
  loading: boolean;
  switchAddressMode: boolean;
  regAddNewAddrsHead: boolean;
  countries: Array<any>;
  shipmentForm: FormGroup;
  manualAdress: boolean;
  deviceInfo: any;
  mobileDevice: boolean;
  desktopDevice: boolean;
  showDeliveryForm: boolean;
  showEditForm: boolean;
  addressList: Array<any>;
  updateAddress: boolean;
  addressId: string;
  addressData: any;
  shippingInfo: any;
  userInfo: any;
  postalAddresses: Array<any>;
  guestUser: boolean;
  currentUser: boolean;
  allItems: any;
  checkAddressId: any;
  postCodeStatus: boolean;
  ukSpecificForm: boolean;
  hazardous: boolean;
  ukSpecificPostCode: boolean;
  usSpecificForm: boolean;
  stateList: Array<any>;
  findAddressLoad:boolean;
  usSpecific:boolean;
  hazardousData: any = {
    description: "",
    list: []
  };
  shipmentFormInvalid: boolean;
  postCodeError: boolean;
  btnForDe:boolean;
  guestData: any;
  reguser:boolean;
  currentSelection:any;
  countryMsgDtls:any={
    errMSG:'Please select a country',
    option:'Choose Country *'
  };
  singletonServSubscription:Subscription;
  subscription: Subscription;
  confirmAddrSubscription:Subscription;
  cartTokenSubscription:Subscription;
  retrieveUsrSubscription:Subscription;
  postCodeSubscrption:Subscription;
  setdlMthdTocartSubscriptn:Subscription;
  setIntDlSubscription:Subscription;
  setDlNamedDaySubscription:Subscription;
  outofStock:boolean;
  outofStockList:Array<any>;
  constructFormLoader:boolean;
  isocode:string;
  enableAction:boolean;

  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ: SingletonService,
    public customerForm: ShipmentForm,
    private fb: FormBuilder,
    public deviceService: DeviceDetectorService,
    public profileServ: profileComponentService,
    public deliveryServ: DeliveryComponentService,
    private translate: TranslateServiceSubService,
    public router: Router,
    public route: ActivatedRoute,
    public el: ElementRef
  ) {
    this.constructFormLoader=false;
    const baseSite = this.singletonServ.catalogVersion;
    this.postCodeStatus = true;
    this.guestUser = false;
    this.manualAdress = true;
    this.showDeliveryForm = false;
    this.updateAddress = false;
    this.shipmentForm = this.fb.group(customerForm.getForm());
    this.loading = false;
    if(this.singletonServ.getStoreData(baseSite.reg)){
       this.reguser=true;
    }else {
      this.reguser=false;
    }

  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["customerInfoUpdate"]) {
      if (changes["customerInfoUpdate"]["currentValue"] != undefined) {
        const _data = changes["customerInfoUpdate"]["currentValue"];
        if (_data.guest) {
          this.guestData = _data.form;
          if(_data.form.titleCode=='Frau'){
            _data.form['titleCode']='mrs';
            this.shipmentForm.patchValue(_data.form);
          }else if(_data.form.titleCode=='Herr'){
            _data.form['titleCode']='mr';
            this.shipmentForm.patchValue(_data.form);
          }else{
            this.shipmentForm.patchValue(_data.form);
          }
          this.setCustomerForm(_data.form);
          this.manualAdress = false;
          this.checkHazardousInfo(_data);
        } else {
          this.checkAddressId = _data.form.id;
          this.checkHazardousInfo(_data);
        }
      }
    }
  }
  checkHazardousInfo(data:any){
   if(data.hazardous){
     this.hazardous=true;
     this.hazardousData={
       list:data.hazardousProducts
     }
   }
  }
  ngOnInit() {
    this.loading=true;
    const baseSite = this.singletonServ.catalogVersion; 
    this.getDeviceInfo();
    this.isocode=baseSite.isoCode;
    if(baseSite.isoCode=="DE"){
      this.btnForDe=true;
    }
    else{
      this.btnForDe=false;
    }
    if(baseSite.isoCode=="US"){
      this.usSpecific=true;
    }
    else{
      this.usSpecific=false;
    }
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
      this.setCountrySet();
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        this.currentUser = true;
        this.switchAddressMode = true;
        const data = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const emailid = data.email;
        this.getUserAddressList(emailid, data.token);
      } else {
        this.currentUser = false;
        this.switchAddressMode = false;
        this.showDeliveryForm = true;
        if(this.singletonServ.getStoreData(baseSite.guest)){
          const guidData = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          if(guidData.address){
            this.manualAdress = false;
            this.guestData=guidData.address;
            if(guidData.address.titleCode=='Frau'){
              guidData.address['titleCode']='mrs';
              this.shipmentForm.patchValue(guidData.address);
            }else if(guidData.address.titleCode=='Herr'){
              guidData.address['titleCode']='mr';
              this.shipmentForm.patchValue(guidData.address);
            }else{
              this.shipmentForm.patchValue(guidData.address);
            }
            this.patchCountry();
            this.setCustomerForm(guidData.address);
          }
        }
        this.loading=false;
      }
      
    }
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
  setCountrySet() {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode === "GB") {
      this.ukSpecificForm = true;
      this.countries = this.nestedCopy(countries);
      const _isoCode = baseSite.isoCode;
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.shipmentForm.controls["country"].patchValue(
          that.countries[_index]
        );
      }
      this.patchCountry();
    } else if (baseSite.isoCode === "EU") {
      this.ukSpecificForm = false;
      this.manualAdress = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
      this.patchCountry();
    } else if (baseSite.isoCode === "DE") {
      this.ukSpecificForm = false;
      this.manualAdress = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(DE_COUNTRIES);
      const _isoCode = baseSite.isoCode;
      if (_isoCode != -1) {
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        this.shipmentForm.controls["country"].patchValue(
          this.countries[_index]
        );
      }
      this.patchCountry();
      this.shipmentForm.controls["phone"].setValidators([
        Validators.required,
        patternValidator(/^[0-9 ]{8,14}$/)
      ]);
      this.shipmentForm.controls["phone"].updateValueAndValidity();
    } else if (baseSite.isoCode == "US") {
      this.ukSpecificForm = false;
      this.manualAdress = false;
      this.countries = this.nestedCopy(US_COUNTRIES);
      this.usSpecificForm = true;
      const _isoCode = baseSite.isoCode;
      const id = _.findIndex(this.countries, function(o) {
        return o.isocode == _isoCode;
      });
      if (id != -1) {
        if (this.countries[id].isocode === "US") {
          this.shipmentForm.controls["postalCode"].setValidators([
            Validators.required,
            patternValidator(/^[0-9space ]{5,7}$/)
          ]);
          this.shipmentForm.controls["postalCode"].updateValueAndValidity();
        } else {
          this.shipmentForm.controls["postalCode"].setValidators([
            Validators.required,
            patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
          ]);
          this.shipmentForm.controls["postalCode"].updateValueAndValidity();
        }
      } else {
        this.shipmentForm.controls["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
        ]);
        this.shipmentForm.controls["postalCode"].updateValueAndValidity();
      }
      if (this.guestData) {
        const _isoCode = this.guestData["country"]["isocode"];
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        if (_index != -1) {
          this.shipmentForm.controls["country"].patchValue(
            this.countries[_index]
          );
        }
        if (_isoCode == "US" || _isoCode == "CA") {
          this.stateList = this.guestData["country"]["states"];
          const _stateIndex = _.findIndex(this.stateList, function(o) {
            return o.name == that.guestData.district;
          });
          if (_stateIndex != -1) {
            this.shipmentForm.controls["district"].patchValue(
              this.stateList[_stateIndex]
            );
          }
        }
      } else {
        if (_isoCode == "US" || _isoCode == "CA") {
          const _index = _.findIndex(this.countries, function(o) {
            return o.isocode == _isoCode;
          });
          if (_index != -1) {
            this.shipmentForm.controls["country"].patchValue(
              this.countries[_index]
            );
            if (this.countries[_index].states) {
              this.stateList = this.countries[_index].states;
              this.shipmentForm.controls["district"].patchValue("");
            }
          }
        }
      }

      this.shipmentForm.controls["district"].setValidators([
        Validators.required
      ]);
      this.shipmentForm.controls["district"].updateValueAndValidity(); 
    }
  }

  patchCountry() {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.guestData) {
      const _isoCode = this.guestData.country.isocode;
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.shipmentForm.controls["country"].patchValue(
          this.countries[_index]
        );
      }
      if(baseSite.isoCode=="US"){

      if (this.guestData.country.isocode == "US") {
        this.shipmentForm.controls["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^[0-9space ]{5,7}$/)
        ]);
        this.shipmentForm.controls["postalCode"].updateValueAndValidity();
      } else {
        this.shipmentForm.controls["postalCode"].setValidators([
          Validators.required,
           patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
        ]);
        this.shipmentForm.controls["postalCode"].updateValueAndValidity();
      }
    }else{
         this.shipmentForm.controls["postalCode"].setValidators([
          Validators.required,
          patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]);
        this.shipmentForm.controls["postalCode"].updateValueAndValidity(); 
    }
    }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  onAddressChange(address, k) {
    this.addressList.map(obj => {
      if (obj == k) {
        obj["defaultAddress"] = true;
      } else {
        obj["defaultAddress"] = false;
      }
    });
    this.addressData = address;
  }
  onSelectAddress() {
    if (this.addressData) {
      this.showOverLay.emit({load:true});
      this.addressData["deliveryType"] = "UK & International delivery";
      const data = this.addressData;
      const baseSite = this.singletonServ.catalogVersion;
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        data["defaultAddress"] = true;
     this.confirmAddrSubscription=   this.deliveryServ
          .confirmAddress(baseSite,user.token, user.email, user.code, data.id)
          .subscribe(
            (resp:any) => {
              if(resp.outOfStock){
                if(resp.outOfStock.outOfStockFlag){
                  this.outofStock=true;
                  this.outofStockList=resp.outOfStock.products;
                  this.loading = false;
                  this.singletonServ.scrollToTarget('#dl-header');
                  this.showOverLay.emit({load:false});
                }else{
                  this.loading = false;
                  this.singletonServ.scrollToTarget('#dl-header');
                  data['hazardous']=(resp.hazardousProducts)?true:false;
                  this.onValueChanged.emit(data);
                }
              }else{
                this.loading = false;
                this.singletonServ.scrollToTarget('#dl-header');
                data['hazardous']=(resp.hazardousProducts)?true:false;
                this.onValueChanged.emit(data);
              }
            },
            (err:any) => {
              this.singletonServ.scrollToTarget('#dlInfoBlock');
              this.showOverLay.emit({load:false});
              if(err.error){
                if(err.error["errors"]){
                  if(err.error["errors"][0]){
                    if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=this.deliveryServ.generateCartToken(baseSite).subscribe(
                        (resp:any) => {
                                const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                                user.token= resp["access_token"];
                                this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                                this.onSelectAddress();
                            });
                    }
                  }
                  }
                 }
            }
          );
      }
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }

  editAddress(data,k) {
    const baseSite = this.singletonServ.catalogVersion;
    this.constructFormLoader=true;
    this.addressId = data.id;
    this.showDeliveryForm = true;
    this.updateAddress = true;
    this.showEditForm = true;    
    if(baseSite.isoCode =="DE"){
      if(data.titleCode=='Frau'){
        data.titleCode='mrs';
        this.shipmentForm.patchValue(data);
        this.setCustomerForm(data);
      }else if(data.titleCode=='Herr'){
        data.titleCode='mr';
        this.shipmentForm.patchValue(data);
        this.setCustomerForm(data);
      }     
  }else{
    this.shipmentForm.patchValue(data);
    this.setCustomerForm(data);
  }
   
    this.singletonServ.scrollToTarget('#dlInfoBlock');
    this.manualAdress = false;
    this.switchAddressMode = false;
    setTimeout(()=>{
      this.constructSiteSpecifiFields();
    },1000);
  
  }
  setCustomerForm(data){
    const baseSite = this.singletonServ.catalogVersion;
    const _isoCode = data["country"]["isocode"];
    const _index = _.findIndex(this.countries, function(o) {
      return o.isocode == _isoCode;
    });
    if (_index != -1) {
      this.shipmentForm.controls["country"].patchValue(this.countries[_index]);
      if(baseSite.isoCode=="US"){

          if (this.countries[_index]["isocode"] == "US") {

                  this.shipmentForm.controls["postalCode"].setValidators([
                    Validators.required,
                    patternValidator(/^[0-9space ]{5,7}$/)
                  ]);
                  this.shipmentForm.controls["postalCode"].updateValueAndValidity();
                  this.shipmentForm.controls["district"].setValidators([
                    Validators.required
                  ]);
                  this.shipmentForm.controls["district"].updateValueAndValidity(); 

          } else {
            this.shipmentForm.controls["postalCode"].setValidators([
              Validators.required,
              patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
            ]);
            this.shipmentForm.controls["postalCode"].updateValueAndValidity();
          }
         
          if(this.countries[_index].states){
            this.stateList=this.countries[_index].states;
          }else{
            this.stateList=undefined;
          }
          
    }else{
      this.shipmentForm.controls["postalCode"].setValidators([
        Validators.required,
        patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
      ]);
      this.shipmentForm.controls["postalCode"].updateValueAndValidity(); 
    }
      if (this.countries[_index].states) {
        this.stateList = this.countries[_index].states;
        const _stateindex = _.findIndex(this.stateList, function(o) {
          return o.name == data.district;
        });
        if (_stateindex != -1) {
          this.shipmentForm.controls["district"].patchValue(
            this.stateList[_stateindex]
          );
        } else {
          this.shipmentForm.controls["district"].patchValue("");
        }
      }
    } else {
      this.shipmentForm.controls["country"].patchValue("");
    }
  }
  getUserAddressList(email, token) {
    this.addressData = undefined;
    const baseSite = this.singletonServ.catalogVersion;
    this.switchAddressMode = false;
   this.retrieveUsrSubscription= this.deliveryServ.getUserAddress(baseSite,token, email).subscribe(
      resp => {
        if (resp) {
          if (resp["addresses"]) {
            this.addressList = resp["addresses"];
            this.addressList.map(obj => {
              if (obj.defaultAddress) {
                this.addressData = obj;
              }
              if (this.checkAddressId || this.addressId) {
                if (obj.id == this.checkAddressId || obj.id ==  this.addressId) {
                  obj.defaultAddress = true;
                  this.addressData = obj;
                } else {
                  obj.defaultAddress = false;
                }
              }
            });
            this.showDeliveryForm = false;
            this.switchAddressMode = true;
            this.loading = false;
          } else {
            this.showDeliveryForm = true;
            this.switchAddressMode = false;
            this.loading = false;
          }
        }
        this.loading = false;
        this.enableAction=false;
      },
      err => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription=this.deliveryServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                        const _reg=(email!='anonymous')?true:false;
                        if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.getUserAddressList(email,  resp["access_token"]);
                        }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.getUserAddressList(email,  resp["access_token"]);
                        }
                      });
              }
            }
            }
           }
        this.loading = false;
      }
    );
  }
  onSearchByPostal() {
    this.shipmentForm.controls["line1"].setValue("");
    this.shipmentForm.controls["line2"].setValue("");
    this.shipmentForm.controls["district"].setValue("");
    this.shipmentForm.controls["town"].setValue("");
    this.manualAdress = true;
  }
  addressManual() {
    this.postalAddresses=undefined;
    this.shipmentForm.controls["address"].setValidators(null);
    this.shipmentForm.controls["address"].updateValueAndValidity();
    this.manualAdress = false;
  }
  addAddress() { 
    const baseSite = this.singletonServ.catalogVersion;
    this.constructFormLoader=true;
    this.showDeliveryForm = true;
    conv_addAddressManual = 1;    
    _conv_q = _conv_q || [];
    _conv_q.push(["run","true"]); 
    this.shipmentForm.reset();
    this.shipmentForm.controls["titleCode"].patchValue("");  
    if (baseSite.isoCode === "EU") {
      this.shipmentForm.controls["country"].patchValue("");
    } else if (baseSite.isoCode === "DE") {
      this.shipmentForm.controls["country"].patchValue("");
    }else if (baseSite.isoCode === "GB") {
         this.manualAdress=true;
    }    
    this.setCountrySet();
    this.updateAddress = false;
    this.switchAddressMode = false;  
    this.regAddNewAddrsHead = true;
    setTimeout(()=>{
      this.constructSiteSpecifiFields();
      this.constructFormLoader=false;
    },1000);
  }
  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  keyDownFunction(event){
    if(event.keyCode==13){
     if (!this.manualAdress){
        event.target.blur();
        this.onSubmitForm(event);
      return false;
    }
    }
} 
 onSubmitForm(event) {
  event.stopPropagation();
  event.preventDefault();
   const that=this;
  conv_confirmShipping_Addr =1;
  _conv_q = _conv_q || []; 
  _conv_q.push(["run","true"]);
    let state = "";
    const baseSite = this.singletonServ.catalogVersion;
    if (this.shipmentForm.valid) {
      this.enableAction=true;
      this.loading = true;
      const _address = this.shipmentForm.value;
      if (_address.district) {
        if (typeof _address.district == "object") {
          state = _address.district.name;
        } else {
          state = _address.district;
        }
      }
      _address['type']= "Home";
      _address['district']= state;
      this.userInfo = _address;
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const userData = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        const email = userData.email;
        if (this.updateAddress) {
          this.singletonServ.scrollToTarget('#dlInfoBlock');
          this.updateAddressForm(_address, userData.token, email);
        } else {
          this.singletonServ.scrollToTarget('#dl-header');
          this.addUserAddress(
            userData.token,
            userData.email,
            userData.code,
            _address
          );
        }
      } else {
        if (this.singletonServ.getStoreData(baseSite.guest)) {
          const guidData = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          let cartId = guidData["guid"];
          this.singletonServ.scrollToDeliverytarget('#dl-header');
          this.addAnnonymousAddress(guidData.token, cartId, _address);
        }
      }
    } else {
         this.validateAllFormFields(this.shipmentForm);
         setTimeout(()=>{              
           this.setCheckFormFocus(this.shipmentForm);
         });
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
    const that=this;
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
         control.markAsTouched({ onlySelf: true });      
      } else if (control instanceof FormGroup) {
        that.validateAllFormFields(control);
      }
    });

  }
  onChangeCountry(event) {
    const baseSite = this.singletonServ.catalogVersion;
    if(event.id !=0){
        const _index = event.id-1;
        const country = this.countries[_index];
        const _currentVal=this.shipmentForm.controls["country"].value;
        if(baseSite.isoCode !="DE"){
          if(country.isocode !=_currentVal.isocode){
            const _obj=[
              {name:'line1',validator:null},
              {name:'line2',validator:null},
              {name:'postalCode',validator:null},
              {name:'town',validator:null},
              {name:'district',validator:null}
            ];
            this.resetAddressFields(_obj);
          }
        }
        if(_index !=-1){
        if (this.countries[_index].isocode == "US" || baseSite.isoCode=="US") {
          const _usCode=this.countries[_index].isocode;
          this.shipmentForm.controls["district"].setValidators([
            Validators.required
          ]);
          
          if(_usCode=="US"){
            this.shipmentForm.controls["postalCode"].setValidators( [
              Validators.required,
              patternValidator(/^[0-9space ]{5,7}$/)
            ]);
          } else{
            this.shipmentForm.controls["postalCode"].setValidators([
              Validators.required,
              patternValidator(/^[a-zA-Z0-9space ]{5,7}$/)
            ]);
          }
          this.shipmentForm.controls["postalCode"].updateValueAndValidity();
      
          this.shipmentForm.controls["district"].updateValueAndValidity(); 
          this.usSpecificForm = true;
          this.ukSpecificForm = false;   
        }else{
          this.usSpecificForm = false;
          this.shipmentForm.controls["postalCode"].setValidators([
            Validators.required,
            patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
          ]);
          this.shipmentForm.controls["postalCode"].updateValueAndValidity();
          this.shipmentForm.controls["district"].setValidators(null);
          this.shipmentForm.controls["district"].updateValueAndValidity();
        }
        if (country.states) {
          this.stateList = country.states;
          this.usSpecificForm = true;
        } else {
          this.stateList = undefined;
        }
      if (this.countries[_index]["isocode"] == "GB") {
            if(_currentVal.isocode !="GB"){
              this.ukSpecificPostCode = true;
              this.ukSpecificForm = true;
              this.manualAdress=true;
              this.usSpecificForm = false;
          }
      } else {
        this.ukSpecificForm = false;
        this.manualAdress=false;
        this.postalAddresses=undefined;
        this.shipmentForm.controls["address"].setValidators(null);
        this.shipmentForm.controls["address"].updateValueAndValidity();
      }
     }      
      this.shipmentForm.controls["country"].patchValue(country);
 }else{
      this.shipmentForm.controls["country"].patchValue(this.countryMsgDtls);
      this.shipmentForm.controls["country"].setErrors({required:true});
 }
  }
  resetAddressFields(data){
    data.map((obj)=>{
      this.shipmentForm.controls[obj.name].reset();
    });
    this.shipmentForm.controls['district'].setValue('');
  }
  onUpdatePostCode(event){
    if (event.key === "Enter") {
      this.shipmentForm.controls['postalCode'].patchValue(event.target.value);
    }
    if (!event || !event.target.value) return;
  }
  onPostcodeChange(event){
    this.postCodeStatus=true;
  }
  onPostCodeKeyDown(event) {
    if (event.key === "Enter") {
        this.shipmentForm.controls['postalCode'].patchValue(event.target.value);
        this.findAddress(event);
     }
     if (!event || !event.target.value) return;
    this.postCodeStatus = true;
    this.postCodeError=false;

  }
  findAddress(event) {
    event.preventDefault();
    const val = this.shipmentForm.value;
    this.myInput.nativeElement.blur();
    if (this.shipmentForm.controls["postalCode"].valid) {
      this.findAddressLoad=true;
      this.postCodeError = false;
      const postcode = val["postalCode"];
      this.postalAddresses=undefined;
      this.postCodeSubscrption=this.deliveryServ.getPostCode(postcode).subscribe(
        response => {
   
          if (response["Items"][0]) {
            this.shipmentForm.controls["address"].setValue("");
            if (response["Items"][0]["Error"]) {
              this.postCodeStatus = false;
              this.postalAddresses=undefined;
              this.myInput.nativeElement.focus();
            } else {
              conv_postcodelookup=1;
              _conv_q = _conv_q || [];
              _conv_q.push(["run","true"]);
              this.postCodeStatus = true;
              this.postalAddresses = response["Items"];
              this.singletonServ.scrollToTarget('#dlFormPostAddress');
              if(val["line1"]){
              if(val["line1"] !=""){
              for (let i = 0; i < response["Items"].length; i++) {
                const _streetAddress =response["Items"][i]["StreetAddress"].toLowerCase();
                const _line1=val["line1"].toLowerCase();
                if (_streetAddress.indexOf(_line1) != -1) {
                     this.onSelectPlace(response["Items"][i]['Id']);       
                     break;
                }
              }
            }
          }else{
            setTimeout(()=>{
              this.findAddressLoad=false;
            })
          
          }
            }
          }else{
            this.myInput.nativeElement.focus();
            this.postCodeError = true;
            this.postCodeStatus = false;
         }
         setTimeout(()=>{
          this.findAddressLoad=false;
        });
        },
        error => {
          this.findAddressLoad=false;
          this.postCodeError = true;
          this.myInput.nativeElement.focus();
        }
      );
    } else {
      this.findAddressLoad=false;
      this.postCodeError = true;
    }
  }
  onSelectPlace(val) {
    const id = val;
    this.deliveryServ.retrievePostalAddress(id).subscribe(
      resp => {
        this.findAddressLoad=false;
        const _postAddress = resp["Items"];
        if (!_postAddress[0].Error) {
          this.postalAddresses = resp["Items"];
          this.postalAddresses = undefined;
          this.manualAdress = false;
          let _addresses = resp["Items"][0];
          this.shipmentForm.controls["town"].setValue(_addresses["PostTown"]);
          if (_addresses["Company"].length == 0) {
            this.shipmentForm.controls["line1"].setValue(_addresses["Line1"]);
            this.shipmentForm.controls["line2"].setValue(_addresses["Line2"]);
          } else {
            this.shipmentForm.controls["line1"].setValue(_addresses["Company"]);
            this.shipmentForm.controls["line2"].setValue(_addresses["Line1"]);
          }
          this.shipmentForm.controls["postalCode"].setValue(
            _addresses["Postcode"]
          );

          this.shipmentForm.controls["district"].setValue(_addresses["County"]);
        } else {
          
        }
      },
      err => {
        this.findAddressLoad=false;
      }
    );
  }

  addAnnonymousAddress(tokenId, cartId, body:any) {
    this.showOverLay.emit({load:true});
    const baseSite = this.singletonServ.catalogVersion;
    this.deliveryServ.createAnnonymousAddress(baseSite,tokenId, cartId, body).subscribe(
      (resp:any) => {
        this.singletonServ.scrollToDeliverytarget('#dl-header');
         if(resp.outOfStock){
          if(resp.outOfStock.outOfStockFlag){
            this.outofStock=true;
            this.outofStockList=resp.outOfStock.products;
            this.loading = false;
            this.showOverLay.emit({load:false});
          } else{
            resp['hazardous']=(resp.hazardousProducts)?true:false;
            resp['country']=body.country;
            this.onValueChanged.emit(resp);
            const guidData = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            guidData['address'] = resp;
            this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(guidData));
            this.loading = false;
            this.showOverLay.emit({load:false});
          }
        } else {
          resp['hazardous']=(resp.hazardousProducts)?true:false;
          resp['country']=body.country;
          this.onValueChanged.emit(resp);
          const guidData = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          guidData['address'] = resp;
          this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(guidData));
          this.loading = false;
          this.showOverLay.emit({load:false});

        }
        this.enableAction=false;
      },
      (err:any) => {
           if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription= this.deliveryServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.addAnnonymousAddress(resp["access_token"], cartId, body);                        
                      });
              }else{
                this.loading = false;
                this.enableAction=false;
                this.showOverLay.emit({load:false});
              }
            }
            }else{
              this.loading = false;
              this.enableAction=false;
              this.showOverLay.emit({load:false});
            }
           }
      }
    );
  }
  addUserAddress(tokenId, email, code, address) {
    this.loading = true;
    const baseSite = this.singletonServ.catalogVersion;
    this.deliveryServ
      .addShippingAddress(baseSite,tokenId, email, code, address)
      .subscribe(
        response => {
          this.checkAddressId = response["id"];
          this.getUserAddressList(email, tokenId);
        },
        (err:any) => {
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.cartTokenSubscription=this.deliveryServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.  addUserAddress( resp["access_token"], email, code, address);                        
                        });
                }else{
                  this.loading = false;
                  this.enableAction=false;
                }
              }
              }else{
                this.loading = false;
                this.enableAction=false;
              }
             }
        }
      );
  }
  updateAddressForm( _address, tokenId, email) {
    const id = this.addressId;
    this.loading = true;
    const baseSite = this.singletonServ.catalogVersion;
    this.profileServ.updateUserAddress(baseSite,_address, tokenId, email, id).subscribe(
      response => {
        this.getUserAddressList(email, tokenId);
        this.showDeliveryForm = false;
      },
      (err:any) => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.cartTokenSubscription=this.deliveryServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this. updateAddressForm( _address, resp["access_token"], email);                        
                      });
              }else{
                this.loading = false;
                this.enableAction=false;
              }
            }
            }else{
              this.loading = false;
              this.enableAction=false;
            }
           }
      }
    );
  }
  onResetForm() {
    this.showDeliveryForm = false;
    this.updateAddress = false;
    this.manualAdress = false;
    this.switchAddressMode = true;
  }
  ngAfterViewInit(){   
    this.currentSelection =this.shipmentForm.controls["country"].value;
    this.constructSiteSpecifiFields();
    this.singletonServ.scrollToTarget('#dl-header');
  }
  constructSiteSpecifiFields(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion; 
    if(baseSite.isoCode === "DE"){
        let _shortFields=that.dom.querySelector("#dlFormFieldset");
        let _fields = that.dom.querySelectorAll('#dlFormFieldset .sort-field');
        let _sortparaArr = [].slice.call(_fields).sort(function (a, b) {
          const _aEl=parseInt(a.dataset.sortindex);
          const _bEl=parseInt(b.dataset.sortindex);
          return _aEl > _bEl ? 1 : -1;
        });
        _sortparaArr.forEach(function (p) {
          _shortFields.appendChild(p);
        });        
      that.constructFormLoader=false;
    }else{
      that.constructFormLoader=false;
    }
  }
  onSelectState(event){
    $('.dlformstateDropdown').selectpicker({'refresh':true,render:true});
  }
  ngOnDestroy(){
    if(this.confirmAddrSubscription){
      this.confirmAddrSubscription.unsubscribe();
    }
    if(this.cartTokenSubscription){
      this.cartTokenSubscription.unsubscribe();
    }
    if(this.retrieveUsrSubscription){
      this.retrieveUsrSubscription.unsubscribe();
    }
    if(this.postCodeSubscrption){
       this.postCodeSubscrption.unsubscribe();
    }
  }
}
