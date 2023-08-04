import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {RegistrationForm} from '../forms/registration.form';
import { SingletonService } from "../services/singleton.service";
import {NewsLetterComponentService} from './newsletter.service';
import { MetaService } from "../services/meta.service";
import { Router,ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GtmMethodService } from '../services/gtmmethods.service';

import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
declare var AmpCa: any;

@Component({
  selector: 'app-newsletter-signup',
  templateUrl: './newsletter-signup.component.html',
  styleUrls: ['./newsletter-signup.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class NewsletterSignupComponent implements OnInit {
  @ViewChild("newsLetterEl") newsLetterEl: ElementRef;
  breadcrumb:Array<any>;
  days:Array<any>;
  months:Array<any>;
  years:Array<any>;
  newsLetterForm:FormGroup;
  confirmation:boolean;
  germanuser:boolean;
  recipientName:string;
  userNameData:string;
  submitted:boolean;
  modalTitle:string;
  constructor(
    public customerForm: RegistrationForm,
    private fb: FormBuilder,
    public titleService: Title,
    public singletonServ: SingletonService,
    public ymarketingServ:NewsLetterComponentService,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public route: ActivatedRoute,
    public metaService: MetaService,
    public gtmServe: GtmMethodService
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };

      const baseSite = this.singletonServ.catalogVersion;
    this.newsLetterForm = this.fb.group(customerForm.ymarketingForm());
    if(baseSite.isoCode=="DE"){
      this.breadcrumb=[{name:'NEWSLETTER-ANMELDUNG'}];
       

    }
    else{
      this.breadcrumb=[{name:'NEWSLETTER SIGN UP'}];
    }
    
    const days=[]
    for(let i=1;i<=31;i++){
      let count='';
      if(i>=10){
        const obj ={day:''+i}
        days.push(obj);
      }else{
        const obj ={day:+i}
        days.push(obj); 
      }
    }
    this.days=days;   
    const monthBox=[];
    const yearBox=[];
    monthBox.push("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    this.months=monthBox;
    const date=new Date();
    let birthYear=date.getFullYear()-14;
    let _year=birthYear;
    for(let k=1;k<=102;k++){
        _year=_year-1;
        const obj ={year:_year}
        yearBox.push(obj); 
    }
    this.years=yearBox; 
   }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    const queryStatus = this.route.snapshot.queryParamMap.get(
      "recipientName"
    );
    if(baseSite.isoCode=="DE"){
      this.germanuser=true; 
    }
    else{
      this.germanuser=false; 
    }
    if (queryStatus) {
      if(queryStatus=="user"){
        this.userNameData=""
      }
      else{
        this.userNameData=queryStatus;
      }
     this.confirmation=true;
     this.recipientName=queryStatus;
     if(baseSite.isoCode=="DE"){
      this.titleService.setTitle('Molton Brown Deutschland – Offizieller Online-Handel');
    }
    else{
      this.titleService.setTitle('Newsletter Confirmation | Molton Brown');
    }

    }else{
      if(baseSite.isoCode=="DE"){
        this.titleService.setTitle('Molton Brown Deutschland – Offizieller Online-Handel');
      }
      else{
        this.titleService.setTitle('Newsletter | Molton Brown');
      }
 
    }
    this.metaService.createCanonicalURL();

  }
  ngAfterViewInit() {
    const _baseSite = this.singletonServ;
    const pageType = 'Newsletter Signup';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
  }
  getTypeOf(val) {
    if (typeof val == "boolean" && !val) {
      return true;
    }
    return false;
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmitForm(event);
      return false;
    }
}
  onSubmitForm(event) {  
    const baseSite=this.singletonServ.catalogVersion;
    this.submitted = true;
    if (this.newsLetterForm.valid) {
        const _form =this.newsLetterForm.value;
        const _obj={
          id:_form.emailAddress,
          firstName:_form.firstName,
          lastName:_form.lastName,
          emailAddress:_form.emailAddress,
          idOrigin:"ATGWEB",
          dob: _form.day+'/'+_form.month+'/'+_form.year,
          gender:_form.gender,
          marketingArea:"MB",
          newsletterOptIn:_form.newsletterOptIn    
        }
        if(_form.firstName==""){
          _form.firstName="user";
        }
        this.ymarketingServ.newsLetterSignUp(baseSite,_obj).subscribe((response)=>{
            this.router.navigate(["store", 'newsletter-sign-up', 'confirmation'], {
              queryParams: { recipientName: _form.firstName },
              queryParamsHandling: "merge"
            });
        },(err)=>{

        });  
    }
    else {
      this.getValidation(this.newsLetterForm); 
    }
  }
  getValidation(formGroup: FormGroup) {        
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {      
        this.getValidation(control);            
      }
    });
  }
    onClickPrivacy(){
    const that = this;    
    this.modalTitle = "Privacy & Cookie Policy";
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
          that.newsLetterEl.nativeElement.innerHTML = htm;
        }
      });
  }
  onClickTerms(){
    const that = this;
    this.modalTitle = "Terms & Conditions";
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
          that.newsLetterEl.nativeElement.innerHTML = htm;
        }
      });
  }
}
