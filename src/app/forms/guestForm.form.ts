import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';
import { compareValidator } from './custom-validator.directive';
@Injectable({
  providedIn: 'root'
})
export class GuestForm {
  getForm() {
    return {
        email: new FormControl('', {validators:[Validators.required,
          patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
          updateOn: 'blur'}),
          saveGuest:[''],
         password:new FormControl('',{
           validators:[
             Validators.required, 
             Validators.minLength(6),Validators.maxLength(20)],
             updateOn: 'blur'
          })
    };
  }
  authenticationForm(){
    return {
      email: new FormControl('', {validators:[Validators.required,
         patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
         updateOn: 'blur'}),
      password:new FormControl('',{validators:[
        Validators.required,Validators.minLength(6),Validators.maxLength(20)]})
    }
  }

  orderRegisterForm(){
    return {
      password: new FormControl('',{
        validators:[
          Validators.required,
          patternValidator(/^.{6,20}$/)],
          updateOn: 'blur'}),
          saveCard: new FormControl(''),
       confirmPassword: new FormControl('',{
         validators:[ 
           Validators.required,
           compareValidator('password')
          ],
          updateOn: 'blur'})
       }
  }
  getPromoCodeForm(){
  
    return{
      promoCode: new FormControl('',{validators:[Validators.required],updateOn: 'blur'})
    }
    
  }
  getGiftMessageForm(){
      return{
        preferGift:new FormControl({value: 'nogiftwrap', disabled: false}),
        giftBox:new FormControl({value: 'nogiftwrap', disabled: false}),
        giftMsg:[''], 
        giftMessage:['']
      }
    }
}
