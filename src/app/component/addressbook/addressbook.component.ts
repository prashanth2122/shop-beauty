import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { profileComponentService } from "../profile-form/profile.service";
import { RegistrationForm } from "../../forms/registration.form";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SingletonService } from "../../services/singleton.service";
import {
  countries,
  EUROPEAN_COUNTRIES,
  DE_COUNTRIES,
  US_COUNTRIES
} from "../../app.constant";
import { Subscription, Subject } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import * as _ from "lodash";
@Component({
  selector: "app-addressbook",
  templateUrl: "./addressbook.component.html",
  styleUrls: ["./addressbook.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddressbookComponent implements OnInit,OnDestroy {
  updateProfile: boolean;
  addressList: Array<any>;
  registrationForm: FormGroup;
  customerId: string;
  countries: Array<any>;
  deviceInfo: any;
  mobileDevice: boolean;
  desktopDevice: boolean;
  customerData: any;
  customerUpdate: boolean;
  subscription: Subscription;
  addressSubscription:Subscription;
  updateUserAddressSubscription:Subscription;
  generateToken:Subscription;
  spliceUseraddrssSubsciption:Subscription;
  overlayLoad:boolean;
  constructor(
    public profileServ: profileComponentService,
    private fb: FormBuilder,
    public customerForm: RegistrationForm,
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService,
    public location: Location,
    public router: Router
  ) {
    this.registrationForm = this.fb.group(customerForm.addressForm());
    this.updateProfile = true;
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.overlayLoad=true;
    this.getUserAddresses();
    if (baseSite.isoCode === "GB") {
      this.countries = this.nestedCopy(countries);
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == baseSite.isoCode;
      });
      if (_index != -1) {
        this.registrationForm.controls["country"].patchValue(
          this.countries[_index]
        );
      }
    } else if (baseSite.isoCode === "EU") {
      this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
    } else if (baseSite.isoCode === "DE") {
      this.countries = this.nestedCopy(DE_COUNTRIES);
    } else if (baseSite.isoCode === "US") {
      this.countries = this.nestedCopy(US_COUNTRIES);
      const _isoCode = baseSite.isoCode;
      if (_isoCode != -1) {
        const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
        });
        this.registrationForm.controls["country"].patchValue(
          this.countries[_index]
        );
      }
    }
    this.getDeviceInfo();
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
  getUserAddresses() {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const data = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if (data.token) {
     this.addressSubscription=   this.profileServ
          .getUserAddress(baseSite,data.token, data.email)
          .subscribe(resp => {
            this.addressList = resp["addresses"];
            this.addressList .sort(function(x, y) {
              // true values first
              return (x.defaultAddress === y.defaultAddress)? 0 : x.defaultAddress? -1 : 1;
              // false values first
              // return (x === y)? 0 : x? 1 : -1;
          });
         this. overlayLoad=false;
          },err=>{
            if(err.error){
              if(err.error["errors"]){
                if(err.error["errors"][0]){
                  if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    this.profileServ.generateToken(baseSite).subscribe((token)=>{
                      const tokenId = token["access_token"];
                      data['token']=tokenId;
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(data));
                      this.getUserAddresses();
                   });
                  }
                }
                }
               }
          });
      } else {
       this.generateToken= this.profileServ.generateToken(baseSite).subscribe(token => {
          data["token"] = token["access_token"];
          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(data));
          this.profileServ
            .getUserAddress(baseSite,data.token, data.email)
            .subscribe(resp => {
              this.addressList = resp["addresses"];
            });
        });
      }
    } else {
      this.router.navigate(["store", "myacc"]);
    }
  }
  onRemoveAddress(data) {
    const baseSite = this.singletonServ.catalogVersion;
    this. overlayLoad=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      const email = user.email;
    this.spliceUseraddrssSubsciption=  this.profileServ
        .spliceUserAddress(baseSite, user.token, email, data.id)
        .subscribe(
          response => {
            this.getUserAddresses();
          },
          (err:any) => {
            if(err.error){
              if(err.error["errors"]){
                if(err.error["errors"][0]){
                  if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    this.generateToken= this.profileServ.generateToken(baseSite).subscribe((token)=>{
                      const tokenId = token["access_token"];
                      data['token']=tokenId;
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(data));
                      this.onRemoveAddress(data);
                   });
                  }else{
                    this. overlayLoad=false;
                  }
                }
                }else{
                  this. overlayLoad=false;
                }
               }
          }
        );
    }
  }
  onSetDefaultAddress(data) {
    const baseSite = this.singletonServ.catalogVersion;
    this. overlayLoad=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      const email = user.email;
      data["defaultAddress"] = true;
      this.addressList .sort(function(x, y) {
        // true values first
        return (x.defaultAddress === y.defaultAddress)? 0 : x.defaultAddress? -1 : 1;
        // false values first
        // return (x === y)? 0 : x? 1 : -1;
    });
     this.updateUserAddressSubscription= this.profileServ
        .updateUserAddress(baseSite, data, user.token, email, data.id)
        .subscribe(
          response => {
            this.getUserAddresses();
          },
          (err:any) => {
            if(err.error){
              if(err.error["errors"]){
                if(err.error["errors"][0]){
                  if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    this.generateToken=  this.profileServ.generateToken(baseSite).subscribe((token)=>{
                      const tokenId = token["access_token"];
                      data['token']=tokenId;
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(data));
                      this.onSetDefaultAddress(data);
                   });
                  }else{
                    this. overlayLoad=false;
                  }
                }
                }else{
                  this. overlayLoad=false;
                }
               }
          }
        );
    }
  }
  onEditAddress(data) {
    const baseSite = this.singletonServ.catalogVersion;
    // if(baseSite.isoCode="DE"){
    //     if(data.titleCode=='Frau'){
    //       data.titleCode='mrs';
    //       this.customerData = data;
    //     }else if(data.titleCode=='Herr'){
    //       data.titleCode='mr';
    //       this.customerData = data;
    //     }     
    // }else{
    //   this.customerData = data;
    // }
    this.customerData = data;
    this.customerId = data.id;
    this.updateProfile = false;
    this.customerUpdate = true;
  }
  cancelUpdate(bol) {
    this.registrationForm.reset();
    this.updateProfile = true;
    this.overlayLoad=true;
    this.getUserAddresses();
    if (bol) {
      this.singletonServ.scrollToTarget("#addressBookTitle");      
    }
  }
  ngOnDestroy(){
     if(this.addressSubscription){
        this.addressSubscription.unsubscribe();
     }
     if(this.updateUserAddressSubscription){
       this.updateUserAddressSubscription.unsubscribe();
     }
     if(this.generateToken){
       this.generateToken.unsubscribe();
     }
     if(this.spliceUseraddrssSubsciption){
       this.spliceUseraddrssSubsciption.unsubscribe();
     }
  }
}
