import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { profileComponentService } from "../profile-form/profile.service";
import { GuestForm } from "../../forms/guestForm.form";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { SingletonService } from "../../services/singleton.service";
import { AuthenticationService } from "../../services/authentication.service";
import { TranslateService } from "../../translate.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { Title } from "@angular/platform-browser";
@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {
  breadcrumb: Array<any>;
  authForm: FormGroup;
  loading: boolean;
  deviceInfo: any;
  mobileDevice: boolean;
  desktopDevice: boolean;
  showCrentialError: boolean;
  disableAction:boolean;
  constructor(
    public router: Router,
    public customerForm: GuestForm,
    private fb: FormBuilder,
    public titleService: Title,
    public profileServ: profileComponentService,
    public singletonServ: SingletonService,
    private _authService: AuthenticationService,
    private translate: TranslateService,
    public deviceService: DeviceDetectorService
  ) {
    this.authForm = this.fb.group(customerForm.authenticationForm());
    this.showCrentialError = false;
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
  ngOnInit() {
    const baseSite =this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="DE"){
      this.breadcrumb=[{name:'Mein Konto',route:'/store/myacc/mbLogin'},{name:'MEIN PROFIL'}]
    }
    else{
      this.breadcrumb=[{name:'MY ACCOUNT',route:'/store/myacc/mbLogin'},{name:'MY PROFILE'}]
    }
    
    
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }

    this.getDeviceInfo();
  }

  ngAfterViewInit() {
    const baseSite =this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="DE"){
   this.titleService.setTitle('Anmelden | Molton Brown');
   }
   else{
    this.titleService.setTitle('Login | Molton Brown');
   }
   }

  setLang(lang: string) {
    this.translate.use(lang);
  }

  onShowRegisterForm() {
    this.router.navigate(["store", "myacc", "mbRegister"]);
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
    const that=this;
    if (this.authForm.valid) {
    this.disableAction=true;
    const baseSite = this.singletonServ.catalogVersion;
    const _userForm = this.authForm.value;
    this.loading = true;
    const queryStatus=window
    .location.search.replace('?','');
    const options={
      username:_userForm.email,
      password:_userForm.password,
      siteID:baseSite.catalogversionId
    }   
    const params = new URLSearchParams();
    for (let key in options) {
      params.set(key, options[key]);
    }
    const body = params.toString();
    this.profileServ.siteAuthentication(baseSite, body).subscribe(
      (resp:any) => {
        this.showCrentialError = false;
        const obj :any= {
          access_token: resp["access_token"],
          email: _userForm.email
        };
        this.singletonServ.sendMessage(obj);
        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(obj));
        this.fetchRelavantBasket(obj);
      },
      (error:any) => {
         if (error.error.error == "invalid_grant"){
          that.showCrentialError = true;
          that.disableAction=false;
        }
        else if (error.error["errors"][0]['type']=="ValidationError"){
          that.showCrentialError = true;
          that.disableAction=false;
        }else if(error.error["errors"][0]['type']=="AccessDeniedError"){
          that.showCrentialError = true;
          that.disableAction=false;
        } else if (error.error.error == "invalid_grant"){
          that.showCrentialError = true;
          that.disableAction=false;
        }      
      });    
}else {
  this.validateAllFormFields(this.authForm); 
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


  getFavourites(token, email) {
    const baseSite=this.singletonServ.catalogVersion;
    this.profileServ.getFavourites(baseSite,token, email).subscribe(
      response => {
        this.singletonServ.favourites = response["products"];
      },
      error => {}
    );
  }
  fetchRelavantBasket(data) {
    const baseSite = this.singletonServ.catalogVersion;
    const _emptyObj = {};
    if (this.singletonServ.getStoreData(baseSite.guest)) {
      const user =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.mergeCart(user.token, _emptyObj, data.email,data);
    } else {
      this.relevantCart(data);
    }
  }
  onRetrivePassword() {
    this.router.navigate(["store", "myaccount", "profile", "passwordReset"]);
  }
  relevantCart(data){
    const baseSite = this.singletonServ.catalogVersion;
    this.profileServ.generateToken(baseSite).subscribe(
      resp => {
       const token=resp["access_token"];
       data['token']=token;
       this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(data));
       this.profileServ
    .getCurrentUserRelevantCart(baseSite, token, data.email)
    .subscribe(
      resp => {
        if (resp["carts"]) {
          if (resp["carts"][0]) {
            const code = resp["carts"][0]["code"];
            data["code"] = code;
            data["guid"] = resp["carts"][0]["guid"];
            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(data));
            this.singletonServ.removeItem(baseSite.guest);
            const obj = { updateCart: true };
            this.singletonServ.sendMessage(obj);
          }
        }
        this.loading = false;
        if (this.singletonServ.redirectUrl) {
          this.router.navigate([this.singletonServ.redirectUrl]);
            this.singletonServ.redirectUrl = null;
        } else {
          this.router.navigate(["store", "myaccount", "profile", "detail"]);
        }
      },
      error => {
        this.loading = false;
        if (this.singletonServ.redirectUrl) {
          this.router.navigate([this.singletonServ.redirectUrl]);
            this.singletonServ.redirectUrl = null;
        } else {
          this.router.navigate(["store", "myaccount", "profile", "detail"]);
        }
      }
    );
           },
      error => {
        this.loading = false;
      }
    );
  }
  mergeCart(token,_emptyObj,email,data){
     const baseSite = this.singletonServ.catalogVersion;
    const user =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
    this.profileServ
    .creatEmptyCart(baseSite,token, _emptyObj,email)
    .subscribe(
      emptyCart => {
        this.profileServ
          .mergeCart(
            baseSite,
            _emptyObj,
            data.email,
            user.token,
            user["guid"],
            emptyCart["guid"]
          )
          .subscribe(resp => {
            const _obj= JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
            _obj['code']=resp['code'];
            _obj['guid']=resp['guid'];
            _obj['token']=user.token;
            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_obj));
            this.singletonServ.removeItem(baseSite.guest);
            this.loading = false;
            this.showCrentialError = false;                
            if (this.singletonServ.redirectUrl) {
              this.router.navigate([this.singletonServ.redirectUrl]);
                this.singletonServ.redirectUrl = null;
            } else {
              this.router.navigate(["store", "myaccount", "profile", "detail"]);
            }
          },error=>{
            this.loading = false;
            this.singletonServ.removeItem(baseSite.guest);  
            const obj = { updateCart: true };
            this.singletonServ.sendMessage(obj);     
            if (this.singletonServ.redirectUrl) {
              this.router.navigate([this.singletonServ.redirectUrl]);
                this.singletonServ.redirectUrl = null;
            } else {
              this.router.navigate(["store", "myaccount", "profile", "detail"]);
            }
          });
      },
      error => {
        this.loading = false;
        this.singletonServ.removeItem(baseSite.guest);        
        if (this.singletonServ.redirectUrl) {
          this.router.navigate([this.singletonServ.redirectUrl]);
            this.singletonServ.redirectUrl = null;
        } else {
          this.router.navigate(["store", "myaccount", "profile", "detail"]);
        }

      }
    );
  }
  onSubmitField(event){
    this.showCrentialError=false;
    if (event.key == "Enter" || event.keyCode==13) {
      event.target.blur();
      this.onSubmitForm(event);
    }
  } 
  onKeydown(event){
    const that=this;
    if (event.key == "Enter" || event.keyCode==13) {
      event.target.blur();
    if (this.authForm.valid) {
      this.disableAction=true;
      const baseSite = this.singletonServ.catalogVersion;
      const _userForm = this.authForm.value;
      this.loading = true;
      let queryStatus=window
      .location.search.replace('?','');

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
      this.profileServ.siteAuthentication(baseSite,body).subscribe(
        resp => {
          this.showCrentialError = false;
          const obj = {
            access_token: resp["access_token"],
            email: _userForm.email
          };
          this.singletonServ.sendMessage(obj);
          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(obj));
          this.fetchRelavantBasket(obj);
        },
        error => {
          if (error.error.error == "invalid_grant"){
            that.showCrentialError = true;
            that.disableAction=false;
          }
          else if (error.error["errors"][0]['type']=="ValidationError"){
            that.showCrentialError = true;
            that.disableAction=false;
          }else if(error.error["errors"][0]['type']=="AccessDeniedError"){
            that.showCrentialError = true;
            that.disableAction=false;
          } else if (error.error.error == "invalid_grant"){
            that.showCrentialError = true;
            that.disableAction=false;
          } 
        }
      );    
  }else {
    this.validateAllFormFields(this.authForm); 
  }
  }
}
onInputChange(event){
  this.showCrentialError=false;
}

}
