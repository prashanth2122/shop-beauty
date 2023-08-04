import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';
@Injectable({
  providedIn: 'root'
})
export class PaymentGateWayForm {
  getCardForm(){
      return {
        cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
        cardNumber:new FormControl('',[Validators.required,Validators.minLength(16),Validators.maxLength(16),patternValidator(/[0-9\+\-\ ]/)]),
        firstName:new FormControl('', {
                                       validators:[
                                         Validators.required,
                                         patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                      updateOn: 'blur'}),
        lastName:new FormControl('', {
                                      validators:[
                                        Validators.required,
                                        patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                     updateOn: 'blur'}), 
        month:new FormControl('',{
                                  validators:[
                                    Validators.required
                                  ],
                                  updateOn: 'blur'}),
        year:new FormControl('',{
                                  validators:[
                                    Validators.required
                                  ],
                                  updateOn: 'blur'}),
        cvv:new FormControl('',{
                                 validators:[
                                   Validators.required,
                                   patternValidator(/^[0-9]{3,4}$/)
                                  ],updateOn: 'blur'})
      }
  }
  getGiftForm(){
    return {
      FirstName:new FormControl('', {
                                    validators:[
                                      Validators.required,
                                      patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                    ],
                                    updateOn: 'blur'
                                  }),
      LastName:new FormControl('', {
                                   validators:[
                                     Validators.required,
                                     patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                    ],
                                    updateOn: 'blur'}),
        GivexCardNumber:new FormControl('', {validators:[Validators.required,patternValidator(/^([0-9\+\-\ ]){19,21}$/)],
          updateOn: 'blur'}),
       
        GivexPinNumber:new FormControl('', {validators:[Validators.required,patternValidator(/^([0-9\+\-\ ]){6}$/)],
        updateOn: 'blur'}),
        Amount:new FormControl('', {validators:[Validators.required,patternValidator(/^[0-9.]+$/)],
        updateOn: 'blur'})
    }
  }
  getSpliForm(){
    return {
      FirstName:new FormControl('', {
                                     validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'
                                    }),
      LastName:new FormControl('', {
                                   validators:[
                                     Validators.required,
                                     patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                    ],
                                    updateOn: 'blur'
                                  }),
      GivexCardNumber:new FormControl('', {validators:[Validators.required,patternValidator(/^([0-9\+\-\ ]){19,21}$/)],
        updateOn: 'blur'}),
     
      GivexPinNumber:new FormControl('', {validators:[Validators.required,patternValidator(/^([0-9\+\-\ ]){4,6}$/)],
      updateOn: 'blur'}),
      Amount:new FormControl('', {validators:[Validators.required,patternValidator(/[0-9]/)],
      updateOn: 'blur'}),
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cardNumber:new FormControl('', {validators:[Validators.required,patternValidator(/^([0-9\+\-\ ]){16,16}$/)],
      updateOn: 'blur'}),
      firstName:new FormControl('', {
                                     validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      lastName:new FormControl('', {
                                    validators:[
                                      Validators.required,
                                      patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                      updateOn: 'blur'}),
      month:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      year:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cvv:new FormControl('',{validators:[Validators.required,
      patternValidator(/^[0-9]{3,4}$/)],updateOn: 'blur'}),
      communication:[''],
      terms:new FormControl('',{validators:Validators.required,updateOn: 'blur'})  
    }
  }
  giftBalance(){
    return{
      GivexCardNumber:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      GivexPinNumber:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      captcha:new FormControl('',{validators:Validators.required,updateOn: 'blur'})
    }
  }
  transferBalance(){
    return{
      depositor:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      creditor:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)])
    }
  }
  getPaymentDetails(){
    return{
      
    }
  }
  getPaymentSavedCard(){
    return{      
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cardNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      cardHolderFirstName:new FormControl('', {
                                              validators:[
                                                Validators.required,
                                                patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                              ],
                                              updateOn: 'blur'}),
      cardHolderLastName:new FormControl('', {
                                              validators:[
                                                Validators.required,
                                                patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                              ],
                                               updateOn: 'blur'}),
      startDateMonth:new FormControl(''),
      startDateYear:new FormControl(''),
      month:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      year:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      issueNumber:new FormControl(''),
      country :new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      postCode:new FormControl('',{
        validators:[
          Validators.required,
          patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]
      }),
      line1 :new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      line2 :new FormControl(''),
      town:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      district :new FormControl(''),
      phone:new FormControl('', {
                                 validators:[
                                   Validators.required,
                                   patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/)
                                  ],updateOn: 'blur'}),
      address:new FormControl(''),
      recaptcha:new FormControl('',{validators:Validators.required})
    }
  }

payCardForm(){
    return{      
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cardNumber:new FormControl(''),
      firstName:new FormControl('', {
                                     validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      lastName:new FormControl('', {
                                    validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      startDateMonth:new FormControl(''),
      startDateYear:new FormControl(''),
      month:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      year:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      cvv:new FormControl('',{validators:[Validators.required,
        patternValidator(/^[0-9]{3,4}$/)],updateOn: 'blur'}),
      country :new FormControl('',{validators:[Validators.required],updateOn: 'blur'}), 
      postCode:new FormControl('',{
        validators:[
          Validators.required,
          patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]
      }),
      line1 :new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      line2 :new FormControl(''),
      town:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      district :new FormControl(''),
      phonenumber:new FormControl('', {
                                       validators:[
                                         Validators.required,
                                         patternValidator(/^[\+\d]?(?:[\d-.\s()]*){10,14}$/)
                                        ],
                                        updateOn: 'blur'}),
      address:new FormControl(''),
      recaptcha:new FormControl('',{validators:Validators.required})
    }
  
}


  getSavedCard(){
    return{      
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      cardNumber:new FormControl(''),
      firstName:new FormControl('', {
                                     validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      lastName:new FormControl('', {
                                    validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'}),
      startDateMonth:new FormControl(''),
      startDateYear:new FormControl(''),
      month:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      year:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      cvv:new FormControl('',{validators:[Validators.required,
        patternValidator(/^[0-9]{3,4}$/)],updateOn: 'blur'}),
      country :new FormControl('',{validators:[Validators.required],updateOn: 'blur'}), 
      postCode:new FormControl('',{
         validators:[
           Validators.required, 
           patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
          ]
        }),
      line1 :new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      line2 :new FormControl(''),
      town:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
      district :new FormControl(''),
      phonenumber:new FormControl('', {
                                       validators:[
                                         Validators.required,
                                         patternValidator(/^[\+\d]?(?:[\d-.\s()]*){10,14}$/)
                                        ],
                                        updateOn: 'blur'}),
      address:new FormControl('')
    }
  }
  getCCForm(){
    return{
      phone:new FormControl('', {
                                 validators:[
                                   Validators.required,
                                   patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/)
                                  ],
                                  updateOn: 'blur'
                                }), 
      country:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      line1:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      line2:[''],
      town:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      address:[''],
      district:new FormControl(''),
      postalCode: new FormControl('',{
        validators:[
            Validators.required,
            patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]
    })
    }
  }


  getSepaForm(){
    return {
      iban:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      bic:[''], 
      bankName:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      firstName:new FormControl('', {
                                     validators:[
                                       Validators.required,
                                       patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                     updateOn: 'blur'}),
      lastName:new FormControl('', {
                                    validators:[
                                      Validators.required,
                                      patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                    ],
                                    updateOn: 'blur'})
    }
  }
  getExpressCheckoutForm(){
    return {
      cardType:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      secureCode:new FormControl('',{validators:[Validators.required,
        patternValidator(/^((\\+91-?)|0)?[0-9]{3,4}$/)],updateOn: 'blur'})

    }
  }


  getpaypal(){
    return{
      terms:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      policy:['']
    }
  }
}