import { Component, OnInit } from "@angular/core";
import { RegistrationForm } from "../../forms/registration.form";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { profileComponentService } from "../profile-form/profile.service";
import { CustomerAccountService } from "../customer-account/customer-account.service";
import { SingletonService } from "../../services/singleton.service";
import { Router, ActivatedRoute } from "@angular/router";
import {confirmPasswordValidator} from '../../forms/registrationValidator';
declare var conv_RU_updateShipping:number;
declare var _conv_q:any;

@Component({
  selector: "app-customer-detail",
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.scss"]
})
export class CustomerDetailComponent implements OnInit {
  updatePassword:boolean;
  updateForm: FormGroup;
  updateProfile: boolean;
  submitted: boolean;
  user: any;
  customerId: string;
  profileData: any;
  showCrentialError:boolean;
  passwordMismatch:boolean;
  overlayLoad:boolean;
  constructor(
    public singletonServ: SingletonService,
    public customerServ:CustomerAccountService,
    public customerForm: RegistrationForm,
    private fb: FormBuilder,
    public profileServ: profileComponentService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.updateProfile = true;
    this.updateForm = this.fb.group(customerForm.updatePassword(),{ validator: confirmPasswordValidator});
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.overlayLoad=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      const email = user.email;
      if(user.token){
       this.getUserData(user.token,email);
      }else{
        this.profileServ.generateToken(baseSite).subscribe((token)=>{
          const tokenId = token["access_token"];
          user['token']=tokenId;
          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
          this.getUserData(tokenId,email);
        },err=>{

        });
      }
   }
  }

  getUserData(tokenId, id) {
    const baseSite = this.singletonServ.catalogVersion;
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this.profileServ.getUserData(baseSite,tokenId, id).subscribe(
      (resp:any) => {
        user['customerId']=resp.customerId;
        user['isExpressCheckout']=(resp['isExpressCheckout'])?true:false;
        this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));       
        this.user = resp;
        this.singletonServ.userDetail=resp;
        this.overlayLoad=false;
      },
      (err:any) => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.profileServ.generateToken(baseSite).subscribe((token)=>{
                  const tokenId = token["access_token"];
                  user['token']=tokenId;
                  this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                  this.getUserData(token["access_token"], id);
               });
              }
            }
            }
           }
      }
    );
  }
  OnUpdateProfile(data) {
    conv_RU_updateShipping = 1;
    _conv_q = _conv_q || [];
    _conv_q.push(["run","true"]);
    const baseSite = this.singletonServ.catalogVersion;
    const _user = this.user;
    const defaultAddress = this.user.defaultAddress;
    let _address = undefined;
      delete defaultAddress["firstName"];
      delete defaultAddress["lastName"];
      delete defaultAddress["titleCode"];
      _address = Object.assign({}, _user, defaultAddress);
      _address["uid"] = _user.displayUid;
      this.profileData = _address;
      this.customerId = this.user.defaultAddress.id;
      this.singletonServ.scrollToTarget('#rich_cart');
      this.updateProfile = false;
  }
  
  

  OnUpdateCardDetails() {
    this.router.navigate(["store", "myaccount", "profile", "paymentInfo"]);
  }
  OnUpdateAddress() {
    this.router.navigate(["store", "myaccount", "profile", "addressBook"]);
  }
  cancelUpdate(bol) {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      const email = user.email;
      this.overlayLoad=true;
      this.getUserData(user.token,email);
    }
    this.updateProfile = true;
  }
  onSubmitField(event){
   this.showCrentialError=false;
  }
  onSubmitForm() {
    const that=this;
    const _form = this.updateForm.value;
    const baseSite = this.singletonServ.catalogVersion;
    if (this.updateForm.valid) {
    if(_form.oldPassword !== _form.password){  
        if(this.singletonServ.getStoreData(baseSite.reg)){ 
          const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg)); 
          this.customerServ.changePassword(baseSite,_user.token,_user.email,_form).subscribe((response)=>{
            that.passwordMismatch=false; 
            that.updateForm.reset();
            that.updatePassword=true;
            that.showCrentialError=false;
            that.singletonServ.scrollToTarget('#rich_cart');
            },(err:any)=>{
            
              if(err.error){
                if(err.error["errors"]){
                  if(err.error["errors"][0]){
                    if(err.error["errors"][0]['type']== "InvalidTokenError") {
                      this.profileServ.generateToken(baseSite).subscribe((token)=>{
                        const tokenId = token["access_token"];
                        const user =JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
                        user['token']=tokenId;
                        that.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                        that.onSubmitForm();
                     });
                    }else   if(err.error["errors"][0]['type'] == 'PasswordMismatchError'){
                      that.showCrentialError=true;
                      that.singletonServ.scrollToTarget('#updateProfilePassword');
                    }
                  }
                  }
                 }
            });
      }
     this.submitted = true; 
    }else{
      this.updateForm.reset();
      this.passwordMismatch=true;
      this.singletonServ.scrollToTarget('#rich_cart');
      
    }
    }else {
      this.validateAllFormFields(this.updateForm); 
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
  replaceEncryptNumber(data){
    if(data){
      const _number = new Array(data.accountnumber.length-3).join('x') + data.accountnumber.substr(data.accountnumber.length-4, 4);
      const _cardNumber =_number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      return _cardNumber;
     }else{
      return 'xxxx xxxx xxxx xxxx';
     }
     return 'xxxx xxxx xxxx xxxx';
  }
}
