import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';
import * as _ from 'lodash';
import { compareValidator } from './custom-validator.directive';
@Injectable({
  providedIn: 'root'
})
export class ContactFeedbackEnquiry {
  enquiryForm() {
    return {   
      Title:['null'],
      First_Name: new FormControl('', {
        validators: [
          Validators.required,
          patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
        ],
        updateOn: 'blur'
      }),
      
      Last_Name: new FormControl('', {
        validators: [
          Validators.required,
          patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
        ], updateOn: 'blur'
      }),
      Job_Title:new FormControl(null),
     Company_name:new FormControl(null),
      Business_Type:new FormControl(null),
      
      Hotel_Name:new FormControl(null),
         Email_Address: new FormControl('', {
        validators: [Validators.required,
        patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
        updateOn: 'blur'
      }),

      Confirm_Email: new FormControl('', {
        validators: [Validators.required,
        compareValidator('Email_Address')], updateOn: 'blur'
      }),
      Order_Type:[''],
      Phone_Number: [''],
      Order_Number: [''],
      Country: [''], 
      Postcode:[''],
      Address: [''],
      line1: [''],
      line2: [''],
      line3: [''],
      Town: [''],
      State: [''],
      Fax_Number: [''],
      Website: [''],
      Budget:[''],
      Number_of_Gifts:[''],
      Message: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),  
      captcha:new FormControl('', { validators: Validators.required, updateOn: 'blur' })
    }
  }

}