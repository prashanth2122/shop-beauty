import { Directive, ElementRef, HostListener, Input, Inject } from '@angular/core';
declare var window:any;
@Directive({ 
    selector: '[olinknewTab]',
    host: {
        '(window:keydown)': 'findKey($event)',
        '(window:mousedown)': 'findKey($event)'
    }
 })
export class OpenLinkInNewWindowDirective {
    //@Input('olinwLink') link: string; //intro a new attribute, if independent from routerLink
    @Input('routerLink') link: string;
    constructor(private el: ElementRef) {
    }
    // @HostListener('mousedown') onMouseEnter() {
    //     window.open(this.link || 'store/index');
    // }
    findKey(event) {

        if(event.ctrlKey && event.which === 1){
              window.open(this.link);
       }
   }
}


