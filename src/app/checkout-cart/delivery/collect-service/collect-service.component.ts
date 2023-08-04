import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { SingletonService } from "../../../services/singleton.service";
import {CollectComponentService} from './collect-service.service';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { patternValidator } from '../../../forms/pattern-validator';
import { TranslateServiceSubService } from "../../../pipe/translate-service-sub.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GtmMethodService } from '../../../services/gtmmethods.service';
declare var conv_clickCollect_addPhoneNo:number;
declare var _conv_q:any;
@Component({
  selector: "app-collect-service",
  templateUrl: "./collect-service.component.html",
  styleUrls: ["./collect-service.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CollectServiceComponent implements OnInit, OnChanges {
  @Input() deliveryInfo: any;
  @Output() onCollectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditClkCltInfo :EventEmitter<any> = new EventEmitter<any>();
  storeData: any;
  mobile: string;
  payment: boolean;
  submitted:boolean;
  totalToPay:boolean;  
  totalPriceData:any;
  communicateForm: FormGroup;
  isValidFormSubmitted:boolean;
  communicateFormInvalid:boolean;
  mobileDevice:boolean;
  usSpecificForm:boolean;
  constructor(
    public singletonServ: SingletonService,
    public collectServ:CollectComponentService,
    public deviceService: DeviceDetectorService,
    private fb: FormBuilder,
    public translate: TranslateServiceSubService,
    public router: Router,
    public route: ActivatedRoute,
    public gtmServe: GtmMethodService
    ) {
    this.payment = false;
    this.communicateForm=this.fb.group({
      
      phone:new FormControl('', {validators:[Validators.required,patternValidator(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4,5})(?: *[x/#]{1}(\d+))?\s*$/)],updateOn: 'blur'})
    });
    this.getDeviceInfo();
  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;

    const singletonVariable= this.singletonServ.cartObj.entries;
    const singletonVariableMain=this.singletonServ.cartObj;
    const item ={
    'currencyCode':singletonVariableMain.totalPrice.currencyIso,
    'stepNumber':"3",
    };
    const checkoutDetails=[];
    singletonVariable.map((obj)=>{
    const productUrl = obj.product;
    
    const pageUrlCat = this.retireveCatpath(productUrl);
    const _subCatg=pageUrlCat[2];
    
    const _obj={
    'name': obj.product.productDisplayName,     
              'id': obj.product.code,
              // 'price': (obj.product.originalPrice)?obj.product.originalPrice:obj.product.price.formattedValue,
              'price': (obj.product.price.formattedValue)?obj.product.price.formattedValue:obj.product.originalPrice,
              'brand': "Molton Brown",
              'category': _subCatg,
              'variant': (obj.product.productVariant)?obj.product.productVariant:'',
              'quantity':obj.quantity,
              'dimension3': (obj.product.size)?obj.product.size:"",
              'dimension4': (obj.product.productAverageRating)?obj.product.productAverageRating:'0',
              'dimension5': (obj.product.reviewsCount)?obj.product.reviewsCount:'0',
              'dimension6': (obj.product.productVariant)?'True':'False',
              'dimension7': obj.product.isSample,
              'dimension8': singletonVariableMain.isGiftBox,
              'dimension9': singletonVariableMain.isGiftBoxMessage,
              'dimension12': (obj.product.stock.stockLevelStatus == "inStock")? 'True' : 'False',    
              'dimension13': (obj.product.productStockLevelNumber)?'':'',
              'dimension14': (obj.productEdition)?obj.productEdition:'' ,
              'metric2': (obj.product.originalPrice)?obj.product.price.formattedValue:''
    }
    checkoutDetails.push(_obj);
    });
    this.gtmServe.gtmCheckoutSteps( checkoutDetails,item);

    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
    if (baseSite.isoCode == "US") {
     this.usSpecificForm = true;
    }else{
     this.usSpecificForm = false;
    }
  }
  getDeviceInfo() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
     this.mobileDevice=true;
    } 
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
        this.storeData = changes["deliveryInfo"]["currentValue"];
      }
    }
  }

onEditDeliveryType( type) {
  this.onEditClkCltInfo.emit();   
}
retireveCatpath(dataurl){
  const _url= dataurl.url;
  return _url.split("/");
 
}
onEditComminication(){
  this.payment=false;
  this.totalToPay=false;
  this.storeData.mobile=undefined;
  this.storeData["payment"] = this.payment;
  this.onCollectionChange.emit(this.storeData);
}
telePhoneKeyDown(event){
  if (event.key === "Enter") {
    this.communicateForm.controls['phone'].patchValue(event.target.value);
  this.onSubmitForm(event);
  }
}
onSubmitForm(event){  
    if (this.communicateForm.valid) {
      this.totalToPay=true; 
      this.totalPriceData=this.singletonServ.cartObj.totalPriceWithTax.formattedValue; 
      conv_clickCollect_addPhoneNo = 1;
      _conv_q = _conv_q || [];
      _conv_q.push(["run","true"]);
       this.singletonServ.sendMessage({overlay:true});
        this.onUpdateCollect();
        this.submitted = true;   
         // start of GTM call 
    const singletonVariable= this.singletonServ.cartObj.entries;
    const singletonVariableMain=this.singletonServ.cartObj;
    const item ={
    'currencyCode':singletonVariableMain.totalPrice.currencyIso,
    'stepNumber':"4",
    };
    const checkoutDetails=[];
    singletonVariable.map((obj)=>{
    const productUrl = obj.product;
    
    const pageUrlCat = this.retireveCatpath(productUrl);
    const _subCatg=pageUrlCat[2];
    
    const _obj={
    'name': obj.product.productDisplayName,     
              'id': obj.product.code,
              // 'price': (obj.product.originalPrice)?obj.product.originalPrice:obj.product.price.formattedValue,
              'price': (obj.product.price.formattedValue)?obj.product.price.formattedValue:obj.product.originalPrice,
              'brand': "Molton Brown",
              'category': _subCatg,
              'variant': (obj.product.productVariant)?obj.product.productVariant:'',
              'quantity':obj.quantity,
              'dimension3': (obj.product.size)?obj.product.size:"",
              'dimension4': (obj.product.productAverageRating)?obj.product.productAverageRating:'0',
              'dimension5': (obj.product.reviewsCount)?obj.product.reviewsCount:'0',
              'dimension6': (obj.product.productVariant)?'True':'False',
              'dimension7': obj.product.isSample,
              'dimension8': singletonVariableMain.isGiftBox,
              'dimension9': singletonVariableMain.isGiftBoxMessage,
              'dimension12': (obj.product.stock.stockLevelStatus == "inStock")? 'True' : 'False',    
              'dimension13': (obj.product.productStockLevelNumber)?'':'',
              'dimension14': (obj.productEdition)?obj.productEdition:'' ,
              'metric2': (obj.product.originalPrice)?obj.product.price.formattedValue:''
    }
    checkoutDetails.push(_obj);
    });
    this.gtmServe.gtmCheckoutSteps( checkoutDetails,item);
    
    
    //end checkout GTM servie call
    }else {
      this.validateAllFormFields(this.communicateForm); 
    }
}


onUpdateCollect() {
  const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.setClickCollectCommunication(baseSite,_user.token,_user.email,_user.code,this.communicateForm.value.phone);
    }else if(this.singletonServ.getStoreData(baseSite.guest)){
      const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.setClickCollectCommunication(baseSite,_user.token,'anonymous',_user.guid,this.communicateForm.value.phone);
    }
}
setClickCollectCommunication(baseSite,token,email,code,mobile){
this.collectServ.setRegCcCommunication(baseSite,token,email,code,mobile).subscribe((resp)=>{
  this.payment = true;
  this.storeData["mobile"] = this.communicateForm.value.phone;
  this.storeData["payment"] = this.payment;
  this.onCollectionChange.emit(this.storeData);
},err=>{
  if(err.error){
    if(err.error["errors"]){
      if(err.error["errors"][0]){
        if(err.error["errors"][0]['type']== "InvalidTokenError") {
            
          this.collectServ.generateCartToken(baseSite).subscribe(
            (resp:any) => {
                  const _reg=(email!='anonymous')?true:false;
                  if(_reg){
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                    this.setClickCollectCommunication(baseSite,resp["access_token"],email,code,mobile);
                  }else{
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                    this.setClickCollectCommunication(baseSite,resp["access_token"],email,code,mobile);
                  }
                });

        }
      }
      }
     }
  this.singletonServ.sendMessage({dismissOverlay:true});
});
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
}
