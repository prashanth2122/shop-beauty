import { 
  Inject,
  Component,
  ViewEncapsulation, 
  OnInit,  
  ViewChild,
  ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from "@angular/forms";
import {RegistrationForm} from '../../forms/registration.form';
import { Router,ActivatedRoute } from '@angular/router';
import { SingletonService } from "../../services/singleton.service";
import {NewsLetterComponentService} from '../../newsletter-signup/newsletter.service';
import { MetaService } from "../../services/meta.service";
import {
  Validators
} from "@angular/forms";
import {
  countries,
  EUROPEAN_COUNTRIES,
  DE_COUNTRIES,
  US_COUNTRIES
} from "../../app.constant";
import * as _ from "lodash";
@Component({
  selector: 'appNewsletterUpdate',
  templateUrl: './newsletter-update.component.html',
  styleUrls: ['./newsletter-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsletterUpdateComponent implements OnInit {
  @ViewChild('sapWrapper')sapWrapper:ElementRef;
  newsLetterForm:FormGroup;
  confirmation:boolean;
  recipientName:string;
  countries:Array<any>;
  ukSpecificForm:boolean;
  usSpecificForm:boolean;
  days:Array<any>;
  months:Array<any>;
  years:Array<any>;
  preference:boolean;
  updateDetails:boolean;
  updatUserstatus:boolean;
  constructor(
     @Inject(DOCUMENT) public dom,
     public router: Router,
     public route: ActivatedRoute,
     public customerForm: RegistrationForm,
     private fb: FormBuilder,
     public ymarketingServ:NewsLetterComponentService,
     public singletonServ: SingletonService,
     public metaService: MetaService
  ) { 
    this.updateDetails=true;
    this.updatUserstatus=true;
    this.newsLetterForm = this.fb.group(customerForm.ymarketingUnsubscribeForm());
    const days=[]
    for(let i=1;i<=31;i++){
      let count='';
      if(i>=10){
        const obj ={day:''+i}
        days.push(obj);
      }else{
        const obj ={day:'0'+i}
        days.push(obj); 
      }
    }
    this.days=days;
    const monthBox=[];
    const yearBox=[];
    for(let i=1;i<=12;i++){
      if(i>=10){
        const obj ={month:''+i}
        monthBox.push(obj);
      }else{
        const obj ={month:'0'+i}
        monthBox.push(obj); 
      }
    }
    this.months=monthBox;
    const date=new Date();
    let birthYear=date.getFullYear()-14;
    let _year=birthYear;
    for(let k=1;k<=65;k++){
        _year=_year-1;
        const obj ={year:_year}
        yearBox.push(obj); 
    }
    this.years=yearBox; 
  }
  ngOnInit() {
    this.metaService.createCanonicalURL();
    const b64 = btoa('SUBSCRIPTION_USER:M0lt0n!1');
    this. setCountry();
  }

  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  setCountry() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode === "GB") {
      this.ukSpecificForm = true;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(countries);
      const _isoCode = baseSite.isoCode;
        const _index = _.findIndex(this.countries, function(o) {          
          return o.isocode == _isoCode;
        });
        if (_index != -1) {
        this.newsLetterForm.controls["country"].patchValue(
          this.countries[_index]
        );
   
      }
    } else if (baseSite.isoCode === "EU") {
      this.ukSpecificForm = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
    } else if (baseSite.isoCode === "DE") {
      this.ukSpecificForm = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(DE_COUNTRIES);
      this.newsLetterForm.controls["country"].patchValue(this.countries[0]);
    } else if (baseSite.isoCode === "US") {
      this.ukSpecificForm = false;
      this.usSpecificForm = true;
      this.countries = this.nestedCopy(US_COUNTRIES);
      const _isoCode = baseSite.isoCode;     
      const _index = _.findIndex(this.countries, function(o) {
          return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.newsLetterForm.controls["country"].patchValue(this.countries[_index]);    
      }
      this.newsLetterForm.controls["district"].setValidators([Validators.required]);
      this.newsLetterForm.controls['district'].updateValueAndValidity();
  

    }
    this.constructYmarketingForm();
  }
  onSubmitForm(event) { 
    const that=this; 
    const baseSite=this.singletonServ.catalogVersion;
    const _form=this.newsLetterForm.value;
    let _gender;
    if(_form.gender=="0"){
     _gender="F"
    }else if(_form.gender=="1"){
     _gender="M"
    }else{
     _gender="NM"
    }
    const _obj={
      id:this.newsLetterForm.controls.emailAddress.value,
      firstName:_form.firstName,
      lastName:_form.lastName,
      emailAddress:this.newsLetterForm.controls.emailAddress.value,
      dob: _form.day+'/'+_form.month+'/'+_form.year,
      gender:_gender,
      "address":{
        "line1":_form.line1,
        "line2":_form.line2,
        "postalCode":_form.postalCode,
        "town":_form.town,
        "district" : _form.district,
        "country":{
        "isocode":_form.country.isocode
        }
        }
    };
    this.ymarketingServ.generateToken(baseSite).subscribe((tokenId)=>{
        const token = tokenId["access_token"];
        that.ymarketingServ.updateSubscriber(baseSite,token,_obj).subscribe((resp)=>{
          that.router.navigate(["store", "update-your-preferences","confirmation"]);
        });
    })  
  }
  appendScript(url){
    let googleMapsScript = this.dom.createElement('script')
     googleMapsScript.setAttribute('src', url)
     this.dom.body.appendChild(googleMapsScript)
  }


  constructYmarketingForm(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    this.route.params.subscribe((params:any) => {
      const queryStatus = this.route.snapshot.queryParamMap.get("sap-outbound-id");
      that.ymarketingServ.generateToken(baseSite).subscribe((tokenizer:any)=>{
        that.ymarketingServ.communicateSAPOutboundID(baseSite,tokenizer.access_token,queryStatus).subscribe((response)=>{
  
  const _data=[
            {"widgetKeyHash":"07A6380E9563AC2E7A5B985014382F321421E617","value":"Abhilash","propertyName":"firstName"},
            {"widgetKeyHash":"96EEE092B9443B820F5C90D8AC72A1F8C04A219F","value":"Manupati","propertyName":"lastName"},
            {"widgetKeyHash":"4FD620200D98AA6FDEA6AA00F142626A983B8342","value":"abhilash.m@1digitals.com","propertyName":"emailAddress"},
            {"widgetKeyHash":"3EB8D8F89104A919845C295ADF3AA87F955E3677","value":"20040101","propertyName":"dob"},
            {"widgetKeyHash":"8EB389BF324B97B8B54B84097AE358D200104E85","value":"1","propertyName":"gender"},
            {"widgetKeyHash":"8BA6F0958D426153D6E950DE9A67F389FA91AE22","value":"","propertyName":"line1"},
            {"widgetKeyHash":"E2389A67C02219B3681B8E14DC25A142C8E20E4F","value":"","propertyName":"line2"},
            {"widgetKeyHash":"544E72C3146B2C0F1C6E6A1DBF44E9E58D700E74","value":"LONDON","propertyName":"town"},
            {"widgetKeyHash":"1CA50E660F81D90C73F8B0E5900E6C6BCE6DD61F","value":"","propertyName":"district"},
            {"widgetKeyHash":"EB141EF7BB22E25A496F57913F900602187A04AA","value":"GB","propertyName":"postalCode"},
            {"widgetKeyHash":"AC685C1766B7BA3510732ED1D006468EDDD96287","value":"","propertyName":"country"},
            {"widgetKeyHash":"BD959C658C66E28AEAC5C701A8BB4F687C45258E","value":"","propertyName":"unsubscribe"}]
          const  _form:any={};
         const _widgetKeys=response;
         _data.map((item,i)=>{
        const _index=  _widgetKeys.findIndex((val)=>{
            return item.widgetKeyHash==val.widgetKeyHash;
          });
           if(_index !=-1 ){
             if(_data[_index]['propertyName'] =="dob" ){
              _form['day']=_widgetKeys[_index].value.slice(6,8);
              _form['month']=_widgetKeys[_index].value.slice(4,6);
              _form['year']=_widgetKeys[_index].value.slice(0,4);
             } else if (_data[_index]['propertyName'] =="unsubscribe" ){
              _form[_data[_index]['propertyName']]=_widgetKeys[_index].widgetKeyHash;;
             } else {
              _form[_data[_index]['propertyName']]=_widgetKeys[_index].value;
             }
        
           }
         });
         this.newsLetterForm.patchValue(_form);
         this.patchCountry(_form.country);
        },error=>{

        });
      });  
    });
  }
  patchCountry(value) {
      const _index = _.findIndex(this.countries, function(o) {
        return o.isocode == value;
      });
      if (_index != -1) {
        this.newsLetterForm.controls["country"].patchValue(
          this.countries[_index]
        );
      }
    }
    onUnsubsribe(){
      const that=this;
      const baseSite=this.singletonServ.catalogVersion;
      const _form=this.newsLetterForm.value;
      const queryStatus = this.route.snapshot.queryParamMap.get("sap-outbound-id");
      const _obj={
      "widgetKeyHash":this.newsLetterForm.controls.unsubscribe.value,
      "value":"X"
      };
        this.ymarketingServ.generateToken(baseSite).subscribe((tokenId)=>{
            const token = tokenId["access_token"];
            this.ymarketingServ.unSubscribeNewsletter(baseSite,token,queryStatus,_obj).subscribe((resposne)=>{
              that.router.navigate(["store", "update-your-preferences","unsubscribe"]);
            },err=>{
    
          });
        });
    }
}
