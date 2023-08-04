import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormControl,Validators } from "@angular/forms";
import { GuestForm } from "../../forms/guestForm.form";
import { SingletonService } from "../../services/singleton.service";
import { TranslateServiceSubService } from '../../pipe/translate-service-sub.service';
import { Title } from '@angular/platform-browser';
import {CheckoutRegComponentService} from './checkout-registration.service';
import { GtmMethodService } from '../../services/gtmmethods.service';
import { Subscription } from "rxjs";
declare var $: any;
@Component({
  selector: "app-checkout-regitstration",
  templateUrl: "./checkout-regitstration.component.html",
  styleUrls: ["./checkout-regitstration.component.scss"]
})
export class CheckoutRegitstrationComponent implements OnInit,AfterViewInit,OnDestroy {
  guestForm: FormGroup;
  emailPattern: "^w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$";
  showCredenialError: boolean;
  errMsg:string;
  pageLoad:boolean;
  subscription: Subscription;
  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    private title: Title,
    public customerForm: GuestForm,
    private fb: FormBuilder, 
    private translate: TranslateServiceSubService,
    public checkoutRegService: CheckoutRegComponentService,
    public gtmServe: GtmMethodService
  ) {
    this.pageLoad=false;
    this.showCredenialError = false;
    this.guestForm = this.fb.group(customerForm.getForm());
    this.guestForm.controls["password"].setValidators([Validators.required]);
    this.guestForm.controls['password'].updateValueAndValidity()
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  retireveCatpath(dataurl){

      const _url= dataurl.url;
      return _url.split("/");
     
    }
  ngOnInit() {
    this.title.setTitle('Molton Brown - Checkout Login - Molton Brown');
    const baseSite=this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.guest)) {   
     this.retrieveCartDetail();
    }
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }
    if (this.singletonServ.getStoreData(baseSite.guest)) {   
         const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
         if(_guest.email){
          this.guestForm.controls["email"].patchValue(_guest.email);
         }
    }
    this.pageLoad=true;

  }
  retrieveCartDetail(){
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.guest)) {   
      const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      if(_guest.token){
        this.fetchBasket(_guest.token,'anonymous',_guest.guid);
      }else{
        this.checkoutRegService.generateCartToken(baseSite).subscribe(
          (resp:any) => {
            const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            user.token= resp["access_token"];
            this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
            this.fetchBasket(resp["access_token"],'anonymous',_guest.guid);
          });
      }
    }
  }
  fetchBasket(token,email,code){
    const baseSite=this.singletonServ.catalogVersion;
        this.subscription= this.checkoutRegService.retrieveCartDetails(baseSite,token,email,code).subscribe((response)=>{
        const cart=this.singletonServ.setupEntryStream(response);

        this.gtmServe.gtmSetFeed(cart,"1");


        },(err:any)=>{
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.checkoutRegService.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.fetchBasket(resp["access_token"],email,code); 
                    });
                }
              }
              }
             }
        });
      }

  ngAfterViewInit(){
    const _baseSite = this.singletonServ;
    const pageType = 'Checkout Login Page';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
    setTimeout(()=>{
      this.pageLoad=false;
      },200);
  }
  onChangePreference(status) {
    if (status.target.value == "guest") {
      this.guestForm.controls["password"].setValidators(null);
      this.guestForm.controls["password"].updateValueAndValidity();
      this.guestForm.controls["password"].reset();
    } else {
      this.guestForm.controls["password"].setValidators([Validators.required,Validators.minLength(6),
        Validators.maxLength(20)]);
      this.guestForm.controls["password"].updateValueAndValidity();
    }
  }
  emailKeyDown(event){
    this.showCredenialError=false;
    if (event.key === "Enter") {
        event.target.blur();
        this.guestForm.controls['email'].patchValue(event.target.value);  
        this.onSubmitForm(event);
    }
  }
  submitPasswordEnter(event){
    if (event.key === "Enter") {
      event.target.blur();
      this.guestForm.controls['password'].patchValue(event.target.value);  
      this.onSubmitForm(event);
  }
  }

  onSubmitForm(event) {  
    const baseSite = this.singletonServ.catalogVersion;
    const _form = this.guestForm.value;
    const _userForm = {
      email: _form.email,
      password: _form.password
    };
       if(this.guestForm.valid){ 
          this.pageLoad=true;
          if (_form.saveGuest == "guest") { 
            if (this.singletonServ.getStoreData(baseSite.guest)) {   
                const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                this.signInAsAnonymous(_guest.token,_guest.guid,_form.email);
              } 
          } else{
              this.signInAsReg(_userForm);          
          }
      } else{
        this.validateAllFormFields(this.guestForm);
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
signInAsAnonymous(token,guid,email){
  const that=this;
  const baseSite=this.singletonServ.catalogVersion;
  this.checkoutRegService.siteanonymousAuth(baseSite,token,guid,email).subscribe(
    (response:any) => {
      const _guest = JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
      const _form = that.guestForm.value;
      _guest["email"] = _form["email"];
      _guest['token']=_guest.token;
      that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_guest));
      that.router.navigate(["checkout", "shipping"]);
    },
    (err:any) => {
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.checkoutRegService.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                        const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        that.signInAsAnonymous(resp["access_token"],guid,email);
                    });
            }else if(err.error["errors"][0]['type']== "AccessDeniedError"){
                    that.setGuestUserSetUp();
            } else if(err.error["errors"][0]['type']=="ValidationError"){
                    that.pageLoad=false;
                    that.showCredenialError = true;
            }
          }
          }
         }
      });
}

signInAsReg(_userForm){
  const baseSite=this.singletonServ.catalogVersion;
  const _form = this.guestForm.value;
  const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
  const options={
    username:_userForm.email,
    password:_userForm.password,
    siteID:baseSite.catalogversionId
  }   
  let params = new URLSearchParams();
  for (let key in options) {
   params.set(key, options[key]);
  }
  let body = params.toString();
  this.checkoutRegService.siteAuthentication(baseSite,body).subscribe(
    user => {
        this.showCredenialError = false;  
        const obj = {
          access_token: user["access_token"],
          email: _userForm.email
        };
         this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(obj));
         this.swapGuestToregCartCart(obj,_guest.token, _userForm);
   },(err:any)=>{
            this.pageLoad=false;
            if(err){
            if(err.error["errors"]){
            } else if(err.error["error"] == "invalid_grant"){
              this.showCredenialError = true;
            }
            }
   });
}
swapGuestToregCartCart(obj,token, _userForm){
  const baseSite=this.singletonServ.catalogVersion;
  const _form = this.guestForm.value;
  const data = {};
  const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
  this.checkoutRegService.getUserData(baseSite,token, _userForm.email).subscribe((response)=>{
    obj['isExpressCheckout']=(response['isExpressCheckout'])?true:false;
    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(obj));
     if(_guest["guid"]){
       this.mergeGuestToRegCart(_guest.token, data, _form.email,_guest["guid"])
     }else{
       this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(obj));
       this.router.navigate(["checkout", "shipping"]);
     }
},error => {
this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(obj));
if(error){
 if(error.error["errors"]){
 if(error.error["errors"][0]){
   if(error){
     if(error.error.errors){
       if(error.error.errors[0]['type']== "InvalidTokenError"){
        this.checkoutRegService.generateCartToken(baseSite).subscribe(
          (resp:any) => {
                  _guest.token= resp["access_token"];
                  this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_guest));
                  this.swapGuestToregCartCart(obj,resp["access_token"], _userForm);
              });
       }else{
          this.pageLoad=false;
       }
     }
     }
 }
 }else{
   
this.pageLoad=false;
 }
 }
});
}
setGuestUserSetUp() {
  const baseSite = this.singletonServ.catalogVersion;
  const _obj = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
  this.checkoutRegService.generateCartToken(baseSite).subscribe(
    token => {
      const tokenId = token["access_token"];
      this.checkoutRegService.generateCartId(baseSite,tokenId, 'anonymous').subscribe(
        response => {
          const guid = response["guid"];
          this.mergeGuestCart(tokenId, guid, _obj.guid);
        },
        error => { 

        }
      );
    },
    err => { }
  );
}

mergeGuestCart(token, code, oldCode) {
  const baseSite = this.singletonServ.catalogVersion;
  this.checkoutRegService.swapCart(baseSite,token, code, oldCode).subscribe((response) => {
    const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
    const _form = this.guestForm.value;
    _guest["email"] = _form["email"];
    _guest['token']=token;
    _guest['guid']=code;
    this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
    this.signInAsAnonymous(token, code,_form.email);
  }, err => {
    this.pageLoad=false;
    this.singletonServ.removeItem(baseSite.guest);

  });
}
  mergeGuestToRegCart(token,data,email,guest){
    const _form = this.guestForm.value;
    const baseSite = this.singletonServ.catalogVersion;
    this.checkoutRegService
    .creatEmptyCart(baseSite,token,data,email)
    .subscribe(
     res => {
       this.createCurrentUserCart(data, _form.email, token, guest, res);
  },
  error => {
   this.pageLoad=false;
   if(error){
    if(error.error.errors){
      if(error.error.errors[0]['type']== "InvalidTokenError"){
        this.checkoutRegService.generateCartToken(baseSite).subscribe(
          (resp:any) => {
            const _reg=(email!='anonymous')?true:false;
            if(_reg){
              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
              user.token= resp["access_token"];
              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
              this.mergeGuestToRegCart(resp["access_token"],data,email,guest);
            }else{
              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
              user.token= resp["access_token"];
              this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
              this.mergeGuestToRegCart(resp["access_token"],data,email,guest);
            }
          });
      }
    }
    }
  });
}
createCurrentUserCart(body, _email, token, oldCart, newCart) {
  const baseSite=this.singletonServ.catalogVersion;
  let _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
  _user["token"] = token;
  this.checkoutRegService
    .mergeCart(baseSite, body, _email, token, oldCart, newCart['guid'])
    .subscribe(
      resp => {
        _user["guid"] = resp["guid"];
        _user["code"] = resp["code"];
        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
        this.singletonServ.removeItem(baseSite.guest);
        // this.singletonServ.setCookie("user", JSON.stringify(_user));
        this.router.navigate(["checkout", "shipping"]);
      },
      err => {
        this.pageLoad=false;
      }
    );
}
  onHelpPasswordClick(){
    this.singletonServ.checkoutStatus = true;
    const obj = { checkoutStatus: true, store: true };
    this.singletonServ.sendMessage(obj);
    this.router.navigate(["store", "myaccount", "profile", "passwordReset"]);
  }

  onSubmitField(event){
    if (event.key === "Enter") {
      this.onSubmitForm(event);
    }
  } 
  enableBtn(){
    const _val=this.guestForm.controls;
    if(_val.email.status == "VALID"){
        if(_val.saveGuest.value == "guest" || _val.saveGuest.value == "register"){
          return false
        }else{
          return true
        }
     }else{
       return true
     }
    return true;
  }
  ngOnDestroy(){
    this.pageLoad=false;
  }
}
