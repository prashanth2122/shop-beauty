import { Component, OnInit,Input , EventEmitter, SimpleChange,ViewChild,ElementRef, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SingletonService } from "../../services/singleton.service";
import {bottomErrorTransistion} from "../../services/animation";
import { TranslateServiceSubService } from '../../pipe/translate-service-sub.service';
declare var $: any;
declare var AmpCa: any;

@Component({
  selector: 'app-mb-terms',
  animations: [
    bottomErrorTransistion
  ],
  templateUrl: './mb-terms.component.html',
  styleUrls: ['./mb-terms.component.scss']
})
export class MbTermsComponent implements OnInit {
  @ViewChild("termEl") termEl: ElementRef;
  @Input() formType:FormGroup;
  @Output() setTerms: EventEmitter<any> = new EventEmitter<any>();
  @Output() setPolicyTerms: EventEmitter<any> = new EventEmitter<any>();
  @Input() paypal:boolean;
  reg:boolean;
  termsForm:any;
  termsCondition:boolean;
  termsPolicy:boolean;
  termsMoltonbrown:boolean;
  deBtn:boolean;
  modalTitle:string;
  ordertotal:string;
  isocode:string;
  osDetail:any;
  constructor(
    public singletonServ:SingletonService,
    private translate: TranslateServiceSubService,
  ) { 
    this.termsPolicy=false;
    this.termsMoltonbrown=false;
    if(this.singletonServ.cartObj){
      this.osDetail=this.singletonServ.cartObj;
      if(this.singletonServ.cartObj.totalPriceWithTax){
        this.ordertotal=this.singletonServ.cartObj.totalPriceWithTax.formattedValue;
      }
    }

  }

  ngOnInit() {
    const basesite=this.singletonServ.catalogVersion;
    this.isocode=basesite.isoCode;
    if(basesite.isoCode=="DE"){
      this.deBtn=true;
    }
    else{
      this.deBtn=false;
    }
    if (basesite) {
      this.setLang(basesite.lngCode);
    }
    if(this.singletonServ.getStoreData(basesite.reg)){
       this.reg=true;
    }else{
       this.reg=false;
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  onCheckMBTerms(event){
   this.termsCondition=event.target.checked;
  }
  checkValid(){
  if(!this.termsForm.valid){
      if(this.termsForm.controls['terms'].value==null || this.termsForm.controls['terms'].value==false){
        return true
      }
  }else if((this.termsForm.valid)){
    if(this.termsForm.controls['terms'].value==null || this.termsForm.controls['terms'].value==false){
      return true
    }else {
      return false 
    }
  }
  return true
  }
  getTypeOf(val){
    if((typeof(val)=='boolean')&&!val){
      return true
    }
    return false
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    
    
    if (changes['formType']){
      if (changes['formType']['currentValue'] != undefined){
        this.termsForm=changes['formType']['currentValue'];
      }
    }
  }
  onCheckTerms(event,status){
    if(event.target.checked){
   if(status){    
       this.termsPolicy=true;
     }else{
      this.termsMoltonbrown=true;
     }
   }else{
    if(status){    
      this.termsPolicy=false;
    }else{
     this.termsMoltonbrown=false;
    }
   }
  }
  onClickPrivacy(event){    
    const that = this;    
    that.modalTitle = "Privacy & Cookie Policy";
      const baseSite = this.singletonServ.catalogVersion;
      AmpCa.utils = new AmpCa.Utils(); 
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: "https://c1.adis.ws",
          id: 'f4e22cd7-8cb7-4d19-b063-5b2a7dde5b8d',
          store: "moltonbrown",
          templateName: "acc-template-homepage",
          locale: baseSite.locale
        },
        callback: function(htm) {
          that.termEl.nativeElement.innerHTML = htm;
        }
      });
  }
  onClickTerms(event){
    // event.stopPropagation();
    const that = this;
    that.modalTitle = "Terms & Conditions";
      const baseSite = this.singletonServ.catalogVersion;
      AmpCa.utils = new AmpCa.Utils(); 
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: "https://c1.adis.ws",
          id: 'b3b8c0d7-6131-4594-9ae9-50564435d349',
          store: "moltonbrown",
          templateName: "acc-template-homepage",
          locale: baseSite.locale
        },
        callback: function(htm) {
     
          that.termEl.nativeElement.innerHTML = htm;
        }
      });
  }
  onChangeTerms(event){
    if(event.target.checked){
    this.setTerms.emit({check:true});
    }else{
      this.setTerms.emit({check:false});
    }
  }
  onChangePolicy(event){
    if(event.target.checked){
      this.setPolicyTerms.emit({check:true});
      }else{
        this.setPolicyTerms.emit({check:false});
      }
  }
  viewOrder(){
    this.singletonServ.scrollToTarget("#mbChckLogo");
    this.singletonServ.sendMessage({viewOrdersummary:{status:true}});
  }
// onFormSubmit() {
//   const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
//   if (invalidElements.length > 0) {
//     invalidElements[0].focus();
//   }
// }
}