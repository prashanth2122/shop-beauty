import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
@Directive({ selector: '[custom-focus]' })
export class checkoutPageCustomFocusDirective {

    @Input('form') form: NgForm;

    constructor(private el: ElementRef) {

    }

    @Input() formGroup: NgForm;

    @HostListener('submit', ['$event'])
    public onSubmit(event): void {
      if ('INVALID' === this.formGroup.status) {
        event.preventDefault();
  
        const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
        if(formGroupInvalid.length !=0){
          (<HTMLInputElement>formGroupInvalid[0]).focus();
        }
      }
    }

}