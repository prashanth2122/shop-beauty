import { Component,
  ElementRef, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { SingletonService } from "../../../services/singleton.service";
import {CustomerAccountService} from '../../customer-account/customer-account.service';
import {FormControl, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { patternValidator } from '../../../forms/pattern-validator';
import { TranslateService } from "../../../translate.service";
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email:string;
  reset:boolean;
  resetForm:FormGroup;
  profileErrorStatus:boolean;
  inValidError:boolean;
  constructor(
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public customerServ:CustomerAccountService,
    public fb:FormBuilder,    
    private translate: TranslateService,
    private el: ElementRef
  ) { 
    this.reset=true;
    this.resetForm = this.fb.group({
      uid: new FormControl('', {validators:[Validators.required,
        patternValidator(/^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i)],
        updateOn: 'blur'})
    });
  }
  ngOnInit() {
    const baseSite =this.singletonServ.catalogVersion;
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }

  }
  
  setLang(lang: string) {
    this.translate.use(lang);
  }
  onContinueClick(){
    this.router.navigate(['store','myacc','mbLogin']);
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmit();
      return false;
    }

  
} 
  onSubmit(){
    const baseSite=this.singletonServ.catalogVersion;
     if(this.resetForm.valid){
        const _email=this.resetForm.value.uid;
        this.customerServ.generateCartToken(baseSite).subscribe((token)=>{
              const tokenId = token["access_token"];
              this.customerServ.retrievePassword(baseSite,tokenId,_email).subscribe((response)=>{
                  this.reset=false;
                  this.profileErrorStatus=false;
              },(err)=>{
                if(err.error.errors[0]["type"]=="UnknownIdentifierError"){
                  this.profileErrorStatus=true;
                }
              })
        },(err)=>{
        });
    }else{
      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.invalid');
  if(formGroupInvalid.length !=0){
     (<HTMLInputElement>formGroupInvalid[0]).focus();
  }
  }
    
  }
  onFocusUid(){
    this.profileErrorStatus=false;
  }
}
