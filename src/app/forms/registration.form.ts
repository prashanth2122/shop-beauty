import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';
import * as _ from 'lodash';
import { countries } from "../app.constant";
import { compareValidator } from './custom-validator.directive';
@Injectable({
  providedIn: 'root'
})
export class RegistrationForm {
  numberPattern:'^(0|[1-9][0-9]*)$';
  countryList:Array<any>=countries;
  activeCountry:Array<any>;
  counts:boolean;
  constructor(){

  }
  storesForm(){
    return{
       storeName:new FormControl('',{validators:Validators.required,updateOn: 'blur'})
    }
   
  }
  
 getForm() {
  return {
      uid: new FormControl('', {validators:[Validators.required,
      patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      updateOn: 'blur'}),
      confirmemail: new FormControl('',{validators:[Validators.required,
        compareValidator('uid')],updateOn: 'blur'}),
      password: new FormControl('',{validators:[Validators.required, patternValidator(/^.{6,20}$/)],updateOn: 'blur'}),
      confirmPassword: new FormControl('',{validators:[ Validators.required,compareValidator('password')],updateOn: 'blur'}),
      titleCode: new FormControl(null,{validators:Validators.required,updateOn: 'blur'}),
      //(/^([a-zA-Z]{2,}\s[a-zA-z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/)
      firstName:new FormControl('',{
                                     validators:[
                                        Validators.required,
                                        patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'
                                    }),
      lastName: new FormControl('',{
                          validators:[
                            Validators.required,
                            patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                          ],updateOn: 'blur'}),       
      country:new FormControl(null,{validators:Validators.required,updateOn: 'blur'}),
      postalCode:new FormControl ('',{
        validators:[
          Validators.required,
          patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]
      }),
      address:[''],
      line1:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),      
      line2:[''],
      town:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),  
      phone:new FormControl ('',{
                                 validators:[
                                   Validators.required,  
                                   patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/)
                                  ],
                                  updateOn: 'blur'
                                }),
      district:[''],
      terms:new FormControl('',{validators:Validators.requiredTrue, updateOn: 'blur'}),
      agegroup:[''],
      gender:[''],
      marketingOptIn:['']
  };  
 }
  addressForm() {
    return {
        titleCode:new FormControl('',{
                                      validators:[
                                        Validators.required
                                        ],
                                        updateOn: 'blur'
                                    }),
        firstName:new FormControl ('',{
                                     validators:[
                                        Validators.required, 
                                        patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                        updateOn: 'blur'
                                   }),
        lastName:new FormControl ('',{
                                      validators:[
                                        Validators.required,  
                                        patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                      ],
                                      updateOn: 'blur'
                                    }), 
        phone: new FormControl ('',{
                                   validators:[
                                      Validators.required,
                                      patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/)                                      
                                    ],
                                    updateOn: 'blur'
                                  }),
        country:new FormControl(null,{validators:Validators.required,updateOn: 'blur'}), 
        line1:new FormControl('',{validators:Validators.required,updateOn: 'blur'}), 
        line2:[''],
        city:[''],
        state:[''],
        address:[''],
        town:new FormControl('',{validators:Validators.required,updateOn: 'blur'}), 
        district:new FormControl(''), 
        postalCode: new FormControl('',{
          validators:[
            Validators.required,
            patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
          ]
        })
    };
  }
  updatePassword(){
    return {
      oldPassword:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      password:new FormControl ('',{validators:[Validators.required,  patternValidator(/^.{6,20}$/)],updateOn: 'blur'}),
      confirmPassword:new FormControl('',{
        validators:[ 
          Validators.required,
          compareValidator('password')],
          updateOn: 'blur'})
     
    }
  }
  profileForm(){
    return{
      titleCode:new FormControl(null,{validators:Validators.required,updateOn: 'blur'}),
      uid: new FormControl({value: '', disabled: true}),
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
      country:new FormControl(null,{validators:Validators.required,updateOn: 'blur'}),
      postalCode:new FormControl('',{
        validators:[
          Validators.required,
          patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)
        ]
        }),
      address:[''],
      line1:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      line2:[''],
      town:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
      district:[''],
      phone:new FormControl('', {
                                 validators:[
                                   Validators.required,
                                   patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/)
                                  ],
                                  updateOn: 'blur'}),
      agegroup:[''],
      gender:[''],
      dlMode:['']
    }
  }

  ymarketingForm(){
    return {
      emailAddress: new FormControl('', {validators:[Validators.required,
        patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
        updateOn: 'blur'}),
        firstName:[''],
       lastName:[''],
       day:[''],
       month:[''],
       year:[''],
      gender:['NM'],
      newsletterOptIn:['',Validators.requiredTrue],
      newsletterOptInTerms:['',Validators.requiredTrue]
   
    }
  }

  ymarketingUnsubscribeForm(){
    return {
      emailAddress: new FormControl({value:'',disabled:true}, {validators: [Validators.required,
        patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ],
        updateOn: 'blur'}),
          firstName: new FormControl(''),
        lastName: new FormControl(''), 
       day: new FormControl(''),
       month: new FormControl(null),
       year: new FormControl(null),
       postalCode:new FormControl(''),
       gender:['2'],
      newsletterOptIn:[''],
      line1:[],
      line2:[''],
      town:[''],
      district:[''],
      country:[''],
      unsubscribe:new FormControl('')
   
    }
  }
  ASMform(){
    return{
      username: new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
      password: new FormControl('', {validators: Validators.required, updateOn: 'blur'})
    }
  }
  ASMCustomerform(){
    return{
      customer: new FormControl(''),
      customerID: new FormControl(''),
      customerOrderId: new FormControl('', {
                                   validators:[
                                   Validators.required,
                                   patternValidator(/^[0-9]{8,9}$/)
                                  ]
                                })
    }
  }
  StorePortalAuthForm(){
    return {
      storeName:new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
      password:new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
    }
  }
}
