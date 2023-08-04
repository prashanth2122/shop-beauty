import {
  Inject,
  Component,
  OnInit,
  OnChanges,
  SimpleChange,
  Input,
  NgZone,
  OnDestroy
} from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup,FormControl, Validators } from "@angular/forms";
import { PaymentGateWayForm } from "../../forms/paymentCard.form";
import { cardFormComponentService } from "../card-form/card-form.service";
import { SingletonService } from "../../services/singleton.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {KlarnaService} from "./klarna.service";
declare var Klarna:any;
@Component({
  selector: 'app-klarna',
  templateUrl: './klarna.component.html',
  styleUrls: ['./klarna.component.scss']
})
export class KlarnaComponent implements OnInit,OnChanges,OnDestroy {
  @Input() cartData: any;
  @Input() deliveryInfo: any;
  billingAddress: boolean;
  shippingAddress: any;
  loading: boolean;
  payType:boolean;
  klarnaForm:FormGroup;
  errorMsg:boolean;
  klarnaStatus:boolean;
  systemIp:string;
  subscription: Subscription;
  systemIPsubscription:Subscription;
  createKlarnaSub:Subscription;
  outofStock:boolean;
  outofStockList:Array<any>;
  constructor(
    @Inject(DOCUMENT) public dom,
    public fb: FormBuilder,
    public location: Location,
    public router: Router,
    public singletonServ: SingletonService,
    public route: ActivatedRoute,
    public _checkOutForm: PaymentGateWayForm,
    public cyberService: cardFormComponentService,
    public KlarnaService:KlarnaService,
    public ngZone:NgZone
  ) { 
    this.klarnaStatus=false;
    this.klarnaForm =  this.fb.group({
      billingForm:["",[Validators.required]],
      terms: this.fb.group({
        terms: ["", [Validators.required]],
        policy: [""]
      })
    });
  }
  onSetTerms(data) {
    if (data.check) {
      this.klarnaForm["controls"]["terms"]["controls"]["terms"].setValue(
        true
      );
    } else {
      this.klarnaForm["controls"]["terms"]["controls"]["terms"].setValue(
        false
      );
      this.klarnaForm["controls"]["terms"]["controls"]["terms"].setErrors({'incorrect': true});
    }
  }
  onSetPolicyTerms(data){
    if (data.check) {
      this.klarnaForm['controls']['terms']['controls']['policy'].setValue(true);
    } else {
      this.klarnaForm['controls']['terms']['controls']['policy'].setValue('');
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that=this;
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
 ngOnInit() {
  this. getSystemIp();


}
appendScript(url){
  const klarnaScript = this.dom.createElement('script')
  klarnaScript.setAttribute('src', url)
   this.dom.head.appendChild(klarnaScript)
}
  onChangeBillingAddress() {
    this.billingAddress=false;
  }
  onSetBillingAddress(data){
    this. getSystemIp();
    this.billingAddress=true;
    this.shippingAddress.customerAddress=data.address;
    
   }
   onResetAddress(){
    this.billingAddress=true;
  }
  onChangeBLAddress(event){
    if (event.target.checked) {
      this.klarnaForm['controls']['billingForm'].setValue(true);
    } else {
      this.klarnaForm['controls']['billingForm'].setValue(false);
      this.klarnaForm['controls']['billingForm'].setErrors({'incorrect': true});
    }
  }
  getTypeOf(val){
    if((typeof(val)=='boolean')&&!val){
      return true
    }
    return false
  }
   onKlarnaDetailSubmit(event){
     const that =this;
    const baseSite = this.singletonServ.catalogVersion;
    const _body={
      cardType: {
        code: "klarna"
      },
      billingAddress:this.shippingAddress.customerAddress
    }
    if(this.klarnaForm.valid){
    this.loading=true;
    this.singletonServ.scrollToTarget("#mb_payment_header");
    this.singletonServ.sendMessage({ toggleOverlay: { status: true } });
    Klarna.Payments.authorize({payment_method_category: 'pay_later'}, function(res) {
      const auth_token = res["authorization_token"];
      const isApproved = res["approved"];
      const show_form = res["show_form"];
      if(that.singletonServ.getStoreData(baseSite.reg)){
        const reg = JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
        that.setKlarnaAuth(baseSite,reg.token,reg.email,reg.code,_body,auth_token);
      }else if(that.singletonServ.getStoreData(baseSite.guest)){
        const guest = JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
        that.setKlarnaAuth(baseSite,guest.token,'anonymous',guest.guid,_body,auth_token);
      }
      })
    }else{
      this.validateAllFormFields(this.klarnaForm);
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
   setKlarnaAuth(baseSite,token,email,code,_body,auth_token){
    _body['systemIP']=this.systemIp;
    this.subscription=this.KlarnaService.setKlarnaAuth(baseSite,token,email,code,_body,auth_token).subscribe((resp:any)=>{
      if(resp){
        this.singletonServ.confirmOrderObj = resp;
        resp['reg'] = (email !="anonymous")? true:false;
        resp['token'] = token;
        this.singletonServ.setStoreData("order", JSON.stringify(resp));
        this.ngZone.run(() =>{ 
          this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
          this.loading=false;
          this.router.navigate(['/checkout','mbOrderConfirmResponse']);
          });
      }
    },err=>{
      this.ngZone.run(() =>{ 
        this.singletonServ.sendMessage({ toggleOverlay: { status: false,orderConfirmation:true } });
        this.loading=false;
        });
    });
   }
   getSystemIp(){
     const baseSite = this.singletonServ.catalogVersion;
     const _body={
      billingAddress:this.shippingAddress.customerAddress
     }
     this.singletonServ.sendMessage({setLoading:{status:true}});
   this.systemIPsubscription= this.cyberService.getSystemIp().subscribe((resp:any)=>{
      this.systemIp=resp.ip;
      _body['systemIP']=resp.ip;
      if(this.singletonServ.getStoreData(baseSite.reg)){
        const reg = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        this.createKlarnaSession(reg.token,reg.email,reg.code,_body);
      }else if(this.singletonServ.getStoreData(baseSite.guest)){
        const guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.createKlarnaSession(guest.token,'anonymous',guest.guid,_body);
      }
    },err=>{
      
    })
  }
   createKlarnaSession(token,email,code,_body){
     const that=this;
     const baseSite = this.singletonServ.catalogVersion;
     if(baseSite.csAgent){
       _body['isAsm']=true;
     }
   this.createKlarnaSub= this.KlarnaService.creatKlarnaSession(baseSite,token,email,code,_body).subscribe((resp:any)=>{  
      that.klarnaStatus=true;    
        if(resp){
            if(resp.clientToken){
                Klarna.Payments.init({client_token:resp.clientToken}); 
                Klarna.Payments.load({
                  container: '#klarna-container',
                  payment_method_category: 'pay_later'
                }, function (res) {
                  that.singletonServ.sendMessage({setLoading:{status:false}});
              
              });
             that.klarnaStatus=true;
             that.singletonServ.sendMessage({setLoading:{status:false}});
        } else       if(resp.outOfStock || resp.insufficientStock){
          if(resp.outOfStock.outOfStockFlag){
            this.outofStock=true;
            this.outofStockList=resp.outOfStock.products;
          } else if(resp.insufficientStock){
            if(resp.insufficientStock.insufficientStockFlag){
              this.outofStock=true;
              this.outofStockList=resp.insufficientStock.products;
            } 
          }
        }
      }
    },err=>{
      that.singletonServ.sendMessage({setLoading:{status:false}});
      that.klarnaStatus=true;
    });
   }
   ngOnDestroy(){
     if(this.createKlarnaSub){
       this.createKlarnaSub.unsubscribe();
     }
     if(this.subscription){
       this.subscription.unsubscribe();
     }
     if(this.systemIPsubscription){
       this.systemIPsubscription.unsubscribe();
     }
   }
}
