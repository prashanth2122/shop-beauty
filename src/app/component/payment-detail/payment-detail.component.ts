import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { PaymentService } from "./payment.service";
import { SingletonService } from "../../services/singleton.service";
import * as _ from "lodash";
import { DeviceDetectorService } from "ngx-device-detector";
@Component({
  selector: "app-payment-detail",
  templateUrl: "./payment-detail.component.html",
  styleUrls: ["./payment-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PaymentDetailComponent implements OnInit {
  addressList: Array<any>;
  overlayLoad:boolean;
  defaultCard:boolean;
  cards:any;
  updatePayment:boolean;
  paymentDetailsList: boolean;  
  recaptchaErr:boolean;
  deviceInfo: any;
  mobileDevice: boolean;
  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private _paymentService: PaymentService,
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService
  ) {
    this.paymentDetailsList = true;
    this.updatePayment =true;
    this.overlayLoad=true;
  }

  ngOnInit() {
    if(this.singletonServ.cardList){
      this.cards=this.singletonServ.cardList;
    }
    this.getPaymentDetails();
    this.getSavedCards();
    this.getDeviceInfo();
  }
  getSavedCards(){
    const baseSite = this.singletonServ.catalogVersion;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if(user.token){
           this.retrieveSaveCards(user.token,user.email);
          }else{
         this._paymentService.generateToken(baseSite).subscribe((token)=>{
              const tokenId = token["access_token"];
              user['token']=tokenId;
              this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
              this.retrieveSaveCards(user.token,user.email);
           });
          }

        }
  }
  retrieveSaveCards(token,email){
    const baseSite = this.singletonServ.catalogVersion;
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this._paymentService.getUserSavedCards(baseSite,token,email).subscribe((response)=>{
      if(response){
        response.sort((a,b)=>{
          return b.isDefault - a.isDefault;
        });
        const _default=_.find(response,(def)=>{
          return def
        });
        if(_default){
        this.defaultCard=true;
        }else{
          this.defaultCard=false;
        }
        this._paymentService.getUserData(baseSite,user.token,user.email).subscribe((checkUser)=>{
          user['isExpressCheckout']=(checkUser['isExpressCheckout'])?true:false;
          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
        },err=>{
        });
      this.cards=response;
      this.singletonServ.cardList= response; 
      this.overlayLoad=false;      
      }
 },err=>{
  if(err.error){
    if(err.error["errors"]){
      if(err.error["errors"][0]){
        if(err.error["errors"][0]['type']== "InvalidTokenError") {
          this._paymentService.generateToken(baseSite).subscribe((token)=>{
            const tokenId = token["access_token"];
            user['token']=tokenId;
            this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
            this.retrieveSaveCards(tokenId,user.email);
         });
        }else{ 
         this.overlayLoad=false;
        }
      }
      }
     }
    });
  }
  getPaymentDetails() {
    const baseSite = this.singletonServ.catalogVersion;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if(user.token){
            this.getAddresss(user.token,user.email);
           }else{
          this._paymentService.generateToken(baseSite).subscribe((token)=>{
               const tokenId = token["access_token"];
               user['token']=tokenId;
               this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
               this.getAddresss(user.token,user.email);
            });
           }


        }
  }
  getAddresss(token,email){
    const baseSite=this.singletonServ.catalogVersion;
    this._paymentService
    .getUserAddress(baseSite,token, email)
    .subscribe(resp => {
      this.addressList = resp["addresses"];
    },err=>{
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this._paymentService.generateToken(baseSite).subscribe((token)=>{
                const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                const tokenId = token["access_token"];
                user['token']=tokenId;
                this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                this.getAddresss(token["access_token"],user.email);
             });
            }
          }
          }
         }
    });
  }
  onEditPayment(data,i){
   this.updatePayment =false;
   this.singletonServ.cardData=data;
   this.router.navigate(['store','myaccount','accountCardEdit'], {
    queryParams: { referenceId: data.profileID },
    queryParamsHandling: "merge"
  });
  }
  onMakeDefaultCard(payt){
    const baseSite = this.singletonServ.catalogVersion;
    this.overlayLoad=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if(user.token){
            this._paymentService.setDefaultCard(baseSite,user.token,user.email,payt.profileID,payt).subscribe((resp)=>{
              this.getSavedCards();
        },err=>{
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this._paymentService.generateToken(baseSite).subscribe((token)=>{
                    const tokenId = token["access_token"];
                    user['token']=tokenId;
                    this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                    this.onMakeDefaultCard(payt);
                 });
                }else{
                   this.overlayLoad=false;
                }
              }
              }
             }
        });  
      }
    }
  }
  onUpdateCards(){
    this.getSavedCards();
    this.getPaymentDetails()
  }
  onRemoveCard(payt,i){
    const baseSite = this.singletonServ.catalogVersion;
    this.overlayLoad=true;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if(user.token){
             this._paymentService.removeCard(baseSite,user.token,user.email,payt.profileID).subscribe((resp)=>{
              this.getSavedCards();
        },err=>{
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this._paymentService.generateToken(baseSite).subscribe((token)=>{
                    const tokenId = token["access_token"];
                    user['token']=tokenId;
                    this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                    this. onRemoveCard(payt,i);
                 });
                }
              }
              }
             }
        });  
      }
    }
  }
  onSubmitRecapchaDtl(data){
    this.recaptchaErr=data.status;
    if(data.status){
    this.singletonServ.scrollToTarget("#myaccPaymentDtls");
  }
}
  replaceEncryptNumber(data){
    if(data){
      const _cardNumber ="X&nbsp;"+data.substr(data.length-4, 4);
      return _cardNumber;
     }
     return 'xxxx xxxx xxxx xxxx'
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
  }
}
