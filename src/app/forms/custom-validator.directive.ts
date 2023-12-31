import { Directive, Input } from '@angular/core';
import { Validator,AbstractControl, ValidationErrors, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
export function compareValidator(controlNameToCompare: string): ValidatorFn{
  return(c: AbstractControl): ValidationErrors | null =>{
    if(c.value === null || c.value.length === 0){
      return null ;
    }
    const controlToCompare = c.root.get(controlNameToCompare);
    if(controlToCompare){
      const subscription : Subscription = controlToCompare.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return controlToCompare && controlToCompare.value !== c.value ? {'appCustomValidator': true}: null;
  }
}
@Directive({
  selector: '[appCustomValidator]',
  providers:[{provide:NG_VALIDATORS, useExisting: CustomValidatorDirective , multi:true}]
})
export class CustomValidatorDirective implements Validator {
@Input('appCustomValidator') controlNameToCompare: string;
  constructor() { }
validate(c: AbstractControl): ValidationErrors | null{
  const controlToCompare = c.root.get(this.controlNameToCompare);
if(controlToCompare){
  const subscription : Subscription = controlToCompare.valueChanges.subscribe(()=>{
    c.updateValueAndValidity();
    subscription.unsubscribe();
  });
  }
  return controlToCompare && controlToCompare.value !== c. value ? {'appCustomValidator': true}: null;
}
}
