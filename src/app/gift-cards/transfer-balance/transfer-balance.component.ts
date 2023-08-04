import { Component, OnInit } from '@angular/core';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
import {GiftCardComponentService} from '../gift-cards.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-transfer-balance',
  templateUrl: './transfer-balance.component.html',
  styleUrls: ['./transfer-balance.component.scss']
})
export class TransferBalanceComponent implements OnInit {
  transferForm:FormGroup;
  constructor(
     public customerForm:PaymentGateWayForm,
     public cardService:GiftCardComponentService,
     private fb: FormBuilder,
     public singletonServ:SingletonService,
     public location: Location,
     public router: Router,
     public route :ActivatedRoute) { 
      this.transferForm= this.fb.group(customerForm.transferBalance());
    }

  ngOnInit() {
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmitForm(event);
      return false;
    }
}
  onSubmitForm(event){
    event.preventDefault();
    const that =this;    
    const baseSite = this.singletonServ.catalogVersion;
    const card=this.transferForm.value;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if(_user.token){
        this.swapAmount(_user.token,_user.email,card);
      }else{
        this.cardService.generateToken(baseSite).subscribe((token)=>{ 
          const _token=token['access_token'];
          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
          this.swapAmount(_token,_user.email,card);
        },(error)=>{

        });
      }
    }else if(this.singletonServ.getStoreData(baseSite.guest)){
      const _guest =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      if(_guest.token){
        this.swapAmount(_guest.token,'anonymous',card);
      }else{
        this.cardService.generateToken(baseSite).subscribe((token)=>{ 
          const _token=token['access_token'];
          this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
          this.swapAmount(_token,'anonymous',card);
        },(error)=>{

        });
      }
   }else{
    const _guest ={token:''};
    this.cardService.generateToken(baseSite).subscribe((token)=>{ 
      const _token=token['access_token'];
      this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
      this.swapAmount(_token,'anonymous',card);
    },(error)=>{

    });
   }
  }
  swapAmount(token,email,card){
    const baseSite=this.singletonServ.catalogVersion;
    this.cardService.transferbalance(baseSite,token,email,card).subscribe((response)=>{

    },err=>{

    });
  }
}
