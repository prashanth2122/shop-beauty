import { Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SingletonService } from "../../services/singleton.service";
import { GiftCardComponentService } from "../gift-cards.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-cardregistration",
  templateUrl: "./cardregistration.component.html",
  styleUrls: ["./cardregistration.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CardregistrationComponent implements OnInit,AfterViewInit {
  givexForm: FormGroup;
  code:any;
  constructor(
    public customerForm: PaymentGateWayForm,
    public cardService: GiftCardComponentService,
    private fb: FormBuilder,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.givexForm = this.fb.group(customerForm.giftBalance());
  }
  ngOnInit() {

  }
  ngAfterViewInit(){
    this.createCaptch();
  }
  createCaptch(){
      //clear the contents of captcha div first 
    this.singletonServ.createCaptcha("cardRegistrationCaptcha");
  }
  validateCaptcha() {
    event.preventDefault();
    const _form =this.givexForm.value;
    if (_form.captcha == this.singletonServ.captchaCode) {

    }else{

      this.createCaptch();
    }
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSubmitForm(event);
      return false;
    }
} 
  onSubmitForm(event) {
    event.preventDefault(); 
    const _val=this.givexForm.value
    const baseSite = this.singletonServ.catalogVersion;
    const cardDetail={
      "name": "Aditya Chada",
      "uid": "aditya.chada@1digitals.com",
      "customerId": "ffe32eca-ee38-46f4-b22b-82d1f988b459",
      "defaultAddress": {
          "country": {
              "isocode": "GB",
              "name": "United Kingdom"
          },
          "defaultAddress": false,
          "firstName": "Aditya",
          "lastName": "Chada",
          "line1": "BII",
          "line2": "15717 57TH PL N",
          "postalCode": "55446-3739",
          "title": "Mr.",
          "titleCode": "mr",
          "town": "MINNEAPOLIS"
      },
      "firstName": "Aditya",
      "lastName": "Chada",
      "title": "Mr."   
   }
   if(this.singletonServ.getStoreData(baseSite.reg)){
     const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
     const _token=_user.token;
     const _body={
      giftcardnumber:_val.GivexCardNumber,
      giftcardpin:_val.GivexPinNumber
      }
     this.cardService.givexLogin(baseSite,_token,_user.email,_body).subscribe((reg)=>{
        this.cardService.registerGivexCard(baseSite,_token,_user.email,cardDetail).subscribe((response)=>{

        },err=>{

        });
     },err=>{

     });
   }
  }
  resolved(captchaResponse: string) {

}
}
