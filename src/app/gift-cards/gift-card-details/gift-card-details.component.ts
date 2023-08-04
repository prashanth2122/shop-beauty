import { Component, OnInit, AfterViewInit } from '@angular/core';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
import {GiftCardComponentService} from '../gift-cards.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-gift-card-details',
  templateUrl: './gift-card-details.component.html',
  styleUrls: ['./gift-card-details.component.scss']
})
export class GiftCardDetailsComponent implements OnInit,AfterViewInit {
  givexForm:FormGroup;
  showBalance:boolean;
  givexInfo:any;
  errorMessage:any;
  capchavalid:boolean;
  captchaerror:boolean;
  constructor(
    public customerForm:PaymentGateWayForm,
    public cardService:GiftCardComponentService,
    private fb: FormBuilder,
    public singletonServ:SingletonService,
    public location: Location, 
    public router: Router,
    public route :ActivatedRoute
    ) { 
    this.givexForm= this.fb.group(customerForm.giftBalance());
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
    this.createCaptch();
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
    const that =this;    
    const baseSite = this.singletonServ.catalogVersion;
    const card=this.givexForm.value;
    this.showBalance=false;  
    this.validateCaptcha();
    const _body={
            "giftcardnumber":card.GivexCardNumber,
            "giftcardpin":card.GivexPinNumber
          }
        if(this.singletonServ.getStoreData(baseSite.reg)){
          const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if(_user.token && this.capchavalid){
            this.checkBalance(_user.token,_body);
          }else{
            if(this.capchavalid){
              that.cardService.generateToken(baseSite).subscribe((token)=>{ 
              const _token=token['access_token'];
              this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
              this.checkBalance(_token,_body);
            },(error)=>{

            });}
          }
        }else if(this.singletonServ.getStoreData(baseSite.guest) ){
          const _guest =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          if(_guest.token && this.capchavalid){
            this.checkBalance(_guest.token,_body);
          }else if(this.capchavalid){
            that.cardService.generateToken(baseSite).subscribe((token)=>{ 
              const _token=token['access_token'];
              this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
              this.checkBalance(_token,_body);
            },(error)=>{

            });
          }
       }else if(this.capchavalid){
        const _guest ={token:''};
        that.cardService.generateToken(baseSite).subscribe((token)=>{ 
          const _token=token['access_token'];
          this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
          this.checkBalance(_token,_body);
        },(error)=>{
        });
       }
  }
  createCaptch(){
    //clear the contents of captcha div first 
  this.singletonServ.createCaptcha("giftDetailCaptcha");
}
validateCaptcha() {
  event.preventDefault();
  const _form =this.givexForm.value;
  if (_form.captcha == this.singletonServ.captchaCode) {
    this.capchavalid=true;
    

  }else{
    this.createCaptch();
    this.captchaerror=true;

  }
}
  checkBalance(token,_body){
    const baseSite = this.singletonServ.catalogVersion;
    const baseSiteid = baseSite.catalogversionId;
    // this.cardService.givexLogin(baseSite,_token,email,_body).subscribe((reg)=>{
    this.cardService.checkBalance(baseSite,token,_body).subscribe((response)=>{
      this.showBalance=true;
      this.errorMessage=undefined;
      let givexInfo=JSON.parse(JSON.stringify(response));
      this.givexInfo=JSON.parse(givexInfo);
      this.singletonServ.giftObj=this.givexInfo;
      let baseSiteidGift=baseSiteid+'-Giftcard';
      this.singletonServ.setStoreData(baseSiteidGift,JSON.stringify(this.givexInfo));
      this.router.navigate(['store','gift-cards','balanceStatement'],{ queryParams: { _requestid: 188}, queryParamsHandling: 'merge' });
   },(error)=>{
     if(error.error.errors)
     this.errorMessage=error.error.errors[0]['message'];

   });
 
  }
}
