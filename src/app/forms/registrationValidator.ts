import { AbstractControl, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(control: AbstractControl):{[key: string]: boolean }| null{
   const password = control.get('password');
   const confirmPassword = control.get('confirmPassword');
   return password && confirmPassword && password.value !== confirmPassword.value ? {'misMatch' : true}:null;
}
export function confirmEmailValidator(control: AbstractControl):{[key: string]: boolean }| null{
   const uid = control.get('uid');
   const confirmemail = control.get('confirmemail');
   return uid && confirmemail && uid.value !== confirmemail.value ? {'misMatchEmail' : true}:null;
}
export function patternValidator(regexp: RegExp): ValidatorFn {
   return (control: AbstractControl): { [key: string]: any } => {
     const value = control.value;
     if (value === '') {
       return null;
     }
     return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
   };
 }