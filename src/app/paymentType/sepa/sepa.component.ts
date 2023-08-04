import {
  Component,
  OnInit,
  OnChanges,
  SimpleChange,
  Input
} from "@angular/core";
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import { cardFormComponentService } from "../card-form/card-form.service";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { SingletonService } from "../../services/singleton.service";
import { Location } from "@angular/common";

import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-sepa",
  templateUrl: "./sepa.component.html",
  styleUrls: ["./sepa.component.scss"]
})
export class SepaComponent implements OnInit, OnChanges {
  @Input() cartData: any;
  @Input() deliveryInfo: any;
  billingAddress: boolean;
  shippingAddress: any;
  loading: boolean;
  payType: boolean;
  sepaDetailForm: FormGroup;
  isValidFormSubmitted:any;
  jwtToken:string;
  sessionID:any;
  errorvalidationMsg:boolean;
  csServiceContact:string;

  outofStock:boolean;
  outofStockList:Array<any>;
  constructor(
    private fb: FormBuilder,
    public location: Location,
    public router: Router,
    private translate: TranslateServiceSubService,
    public singletonServ: SingletonService,
    public route: ActivatedRoute,
    public _checkOutForm: PaymentGateWayForm,
    public cyberService: cardFormComponentService
  ) {
    const _sepaForm=this._checkOutForm.getSepaForm();
    _sepaForm['terms']=this.fb.group({
      terms:['',[Validators.required]],
      policy:['']
    });
    _sepaForm['billingForm']=['',[Validators.required]]
    this.sepaDetailForm = this.fb.group(_sepaForm);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
        let _dt = changes["deliveryInfo"]["currentValue"];
        that.shippingAddress = _dt;
        that.payType =true;
        if (_dt.geoPoint) {
          that.billingAddress = false;
        } else {
          that.billingAddress = true;
        }
      }
    }
  }
  onChangeBLAddress(event){
    if (event.target.checked) {
      this.sepaDetailForm['controls']['billingForm'].setValue(true);
    } else {
      this.sepaDetailForm['controls']['billingForm'].setValue(false);
      this.sepaDetailForm['controls']['billingForm'].setErrors({'incorrect': true});
    }
  }
  getTypeOf(val){
    if((typeof(val)=='boolean')&&!val){
      return true
    }
    return false
  }
  ngOnInit() {
    const baseSite:any = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="US"){
      this.csServiceContact="uscustomerservice@moltonbrown.com"
    }else{
      this.csServiceContact="customerservice@moltonbrown.com"
    }
    if(this.singletonServ.getStoreData('paypalGuest')){
      this.singletonServ.removeItem('paypalGuest');
    }    
    if(this.singletonServ.getStoreData('order')){
      this.singletonServ.removeItem('order');
    }
    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
  }
  
  


  onChangeBillingAddress() {
    this.billingAddress = false;
  }
  onSetBillingAddress(data) {
    this.billingAddress = true;
    this.shippingAddress.customerAddress=data.address;
  }
  onEnterSepaDetailSubmit(event){
    if(event.keyCode==13){
      event.target.blur();
      this.onSepaDetailSubmit(event);
      return false;
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  onSepaDetailSubmit(event) {
    const that=this;
    const _val = this.sepaDetailForm.value;
    const baseSite = this.singletonServ.catalogVersion;
    const date =new Date();
    const _obj = {
      accountHolderName: _val.firstName + " " + _val.lastName,
      paymentType: "sepa",
      iban: _val.iban,
      bic: _val.bic,
      bankName: _val.bankName,
      cardType: {
        code: "sepa"
      },
      defaultPayment: true,
      billingAddress: this.shippingAddress.customerAddress
    };
    
    if(this.sepaDetailForm.valid){
      this.loading=true;
      this.singletonServ.sendMessage({ toggleOverlay: { status: true }});
      this.singletonServ.scrollToTarget("#mb_payment_header");
      this.cyberService.getSystemIp().subscribe((resp:any)=>{
        _obj['systemIP']=resp.ip;
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        if(baseSite.csAgent){
          _obj['isAsm']=true;
         }
     

        this.cyberService
          .confirmOrder(baseSite,_user.token, _obj, _user.email, _user.code)
          .subscribe(
            (resp:any) => {
              if(resp){
               if(resp.outOfStock || resp.insufficientStock){
                  if(resp.outOfStock.outOfStockFlag){
                    this.outofStock=true;
                    this.outofStockList=resp.outOfStock.products;
                  } else if(resp.insufficientStock){
                    if(resp.insufficientStock.insufficientStockFlag){
                      this.outofStock=true;
                      this.outofStockList=resp.insufficientStock.products;
                    } 
                  }
                }else  if(resp.errorCode){
                    this.errorvalidationMsg=true;
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false }});
                    this.loading=false;
                }else{
                    this.singletonServ.confirmOrderObj = resp;
                    resp["reg"] = true;
                    resp["email"] = _user.email;
                    resp["token"] = _user.token;
                    this.singletonServ.setStoreData("order", JSON.stringify(resp));
                    this.loading = false;
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false }});
                    this.router.navigate(["/checkout", "mbOrderConfirmResponse"]);
                }
            }
            },
            err => {
              if(err.error){
                if(err.error["errors"]){
                  if(err.error["errors"][0]){
                    if(err.error["errors"][0]['type']== "InvalidTokenError") {
                      that.cyberService.generateCartToken(baseSite).subscribe((resp:any)=>{
                        _user.token= resp["access_token"];
                        that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user)); 
                        that.onSepaDetailSubmit(event);
                      });
           
                    }
                  }
                  }
                 }

            }
          );
      } else {
        if (this.singletonServ.getStoreData(baseSite.guest)) {
          const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          if(baseSite.csAgent){
             _obj['isAsm']=true;
           }
          this.cyberService
            .confirmOrder(baseSite,_user.token, _obj, "anonymous", _user.guid)
            .subscribe(
              (response:any) => {
                
                if(response){
                  if(response.errorCode){
                  this.errorvalidationMsg=true;
                  this.singletonServ.sendMessage({ toggleOverlay: { status: false }});
                  this.loading=false;
                  }else{
                    this.singletonServ.confirmOrderObj = response;
                    response["reg"] = false;
                    response["token"] = _user.token;
                    this.singletonServ.sendMessage({ toggleOverlay: { status: false }});
                    this.singletonServ.setStoreData("order", JSON.stringify(response));
                    this.router.navigate(["/checkout", "mbOrderConfirmResponse"]);
                }
              }
              },
              err => {
                if(err.error){
                  if(err.error["errors"]){
                    if(err.error["errors"][0]){
                      if(err.error["errors"][0]['type']== "InvalidTokenError") {
                        that.cyberService.generateCartToken(baseSite).subscribe((resp:any)=>{
                          _user.token= resp["access_token"];
                          that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user)); 
                          that.onSepaDetailSubmit(event);
                        });
                      }
                    }
                    }
                   }
              }
            );
        }
      }
      
    });

   }else{
    this.validateAllFormFields(this.sepaDetailForm);  
   }
  }

   
  validateAllFormFields(formGroup: FormGroup) {        
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {      
        this.validateAllFormFields(control);            
      }
    });
  }
  onResetAddress() {
    this.billingAddress = true;
  }
  onSetTerms(data){
    if(data.check){
      this.sepaDetailForm['controls']['terms']['controls']['terms'].setValue(true);
    }else{
      this.sepaDetailForm['controls']['terms']['controls']['terms'].setValue(false);
      this.sepaDetailForm['controls']['terms']['controls']['terms'].setErrors({'incorrect': true});
    }
}
onSetPolicyTerms(data){
  if(data.check){
    this.sepaDetailForm['controls']['terms']['controls']['policy'].setValue(true);
  }else{
    this.sepaDetailForm['controls']['terms']['controls']['policy'].setValue('');
  }
}
}
