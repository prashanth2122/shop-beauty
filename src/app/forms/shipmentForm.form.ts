import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';

@Injectable({
  providedIn: 'root'
})
export class ShipmentForm {
  numberPattern:'^(0|[1-9][0-9]*)$';
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
  getForm() {
    return {
        titleCode:new FormControl('',{validators:Validators.required,updateOn: 'blur'}),
        firstName:new FormControl('', {
                                       validators:[
                                          Validators.required,
                                          patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                       updateOn: 'blur'
                                      }),
        lastName:new FormControl('', {
                                       validators:[
                                         Validators.required,
                                         patternValidator(/^([a-zA-Z0-9?]{1,}\s?([a-zA-Z0-9!@&()+-.,space/?:;' ]{1,68})?)$/)
                                        ],
                                       updateOn: 'blur'}), 
        phone:new FormControl('', {
                                    validators:[
                                      Validators.required,
                                      patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/)
                                    ],
                                    updateOn: 'blur'
                                  }
                                  ),
        country:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
         line1 :new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
        line2:[''],
        town:new FormControl('',{validators:[Validators.required],updateOn: 'blur'}),
        address:[''],
        district:[''],
        postalCode: new FormControl('',{validators:[Validators.required,patternValidator(/^(([a-zA-Z0-9!@#$&()+-.,space/?:;' ]{1,68})?)$/)],updateOn: 'blur'})
    };
  }
  addressData(){
    return{
      address:new FormControl('',{validators:Validators.required,updateOn: 'blur'})
    }
  }

  storePoint(){
    return{
      zipcode:['',[Validators.required]]
    }
  }
}