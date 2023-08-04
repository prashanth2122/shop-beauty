import { 
  Inject,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Renderer2
 } from "@angular/core";
 import { DOCUMENT } from '@angular/common';
import { BasketPageComponentService } from "./basketpage.service";
import { SingletonService } from "../../services/singleton.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute} from "@angular/router";
import { GuestForm } from "../../forms/guestForm.form";
import { DeviceDetectorService } from "ngx-device-detector";
import { Subscription } from "rxjs";
import { Title } from '@angular/platform-browser';
import {GiftwrapComponent} from "../giftwrap/giftwrap.component";
import { GtmMethodService } from '../../services/gtmmethods.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import * as _ from "lodash";
// declare var $TB:any;
declare var AmpCa:any;
declare const $: any;
@Component({
 selector: "app-basketpage",
 templateUrl: "./basketpage.component.html",
 styleUrls: ["./basketpage.component.scss"]
})
export class BasketpageComponent implements OnInit, AfterViewInit,OnDestroy {
 @ViewChild("lastMinutTreats") lastMinutTreats: ElementRef;
 @ViewChild("customeAlsoBought") customeAlsoBought: ElementRef;
 @ViewChild("giftWrapEl") giftWrapEl:GiftwrapComponent;
 @ViewChild("productModal") productModal: ElementRef;
 @ViewChild("promotionalElement") promotionalElement:ElementRef;
 isPromoCodeError: boolean;
 basketForm: FormGroup;
 toggle: boolean;
 popupblock:boolean;
 dePriceBlock:boolean;
 subscription: Subscription;
 createBundleSubscription:Subscription;
 updateBundleSubscription:Subscription;
 cartSubscription:Subscription;
 createCartSubscription:Subscription;
 entryCartSubscription:Subscription;
 generateCartSubscription:Subscription;
 expressChcSubscription:Subscription;
 deviceInfo: any;
 promotextcoupon:any;
 appliedtext:any;
 mobileDevice: boolean;
 showMentionme:boolean;
 entries: boolean;
 submitted: boolean;
 cart: any;
 cartCode: any;
 slideConfig: any;
 slideConfig2: any;
 cartTitle: "LAST MINUTE TREAT?";
 promoSuccesMsg: string;
 promocodeSuccess: boolean;
 refreshBasket:boolean;
 outStockEntries:Array<any>;
 localData:any;
 pageLoad:boolean;
 basketPageLoad:boolean;
 couponRedeemed:boolean;
 giftMessageForm:FormGroup;
 display:string='none';
 pageModalLoad:boolean;
 slides:Array<any>;
 gwpModal:boolean;
 quantityRestriction:any;
 showExpress:boolean;
 allowedQuantity:any={allowedQuantity:4};
 localGiftData:any;
 isocode:string;
 picknmix3:string;
 picknmix6:string;
 hazardousEntries:boolean;
 outofstockentryMsg:string;
 freeMsg:string;
 hazardousData: any = {
  description: `<p class="redstar">Cannot continue using express checkout option as the following hazardous products present in the basket cannot be shipped using the default shipping option that has been set. Please use the normal checkout process. </p>`,
  list: []
};
countrySite:string;
 constructor(
   @Inject(DOCUMENT) public dom,
   public basketServ: BasketPageComponentService,
   public singletonServ: SingletonService,
   public location: Location,
   public _promocodeDetails: GuestForm,
   private fb: FormBuilder,
   public router: Router,
   public route: ActivatedRoute,
   private title: Title,
   public deviceService: DeviceDetectorService,
   public gtmServ:GtmMethodService,
   private renderer2: Renderer2,
   @Inject(DOCUMENT) private _document
 ) {
  const baseSite = this.singletonServ.catalogVersion;
   this.gwpModal=true;
   this.basketPageLoad=true;
   this.pageLoad=true;
   this.entries = false;
   this.basketForm = this.fb.group(_promocodeDetails.getPromoCodeForm());
   if(this.singletonServ.giftBoxWithMessageForm){
    this.giftMessageForm =this.singletonServ.giftBoxWithMessageForm;
   }else{
      this.giftMessageForm = this.fb.group({
        giftCard:this.fb.group(_promocodeDetails.getGiftMessageForm())
      });
      this.singletonServ.giftBoxWithMessageForm=this.giftMessageForm;
  }  
  this.cart=this.singletonServ.cartObj;
  this.countrySite=(baseSite.isoCode=="GB")?"Molton Brown UK":"Molton Brown "+baseSite.isoCode;
 }
 getHidden(entry){
    if(entry.pickAgain){
        if(entry.product.isSample){
          return false
        }
    }else{
     if(entry.product.isSample){
       return true
     }
    }
    return false
 }
 ngOnInit() {

   this.basketPageLoad=true;
   const baseSite = this.singletonServ.catalogVersion;
  
   if(baseSite.isoCode=="DE" ){
    this.dePriceBlock=true;
    this.freeMsg = "GRATIS"
   }
   else{
    this.dePriceBlock=false;
    this.freeMsg = "FREE"
   }
   if(baseSite.isoCode=="GB" ){
     this.showMentionme=true;
   }
   else if(baseSite.isoCode=="US"){
    this.showMentionme=true;
   }
   else{
     this.showMentionme=false;
   }
   this.localData=this.singletonServ.appLocaleData;

   this.isocode=baseSite.lngCode;
   this.setLang(baseSite.lngCode);
   this.wrapFRslots();
   this.refreshBasket=false;
   this.slideConfig = {
     slidesToShow: 4,
     slidesToScroll: 1,
     dots: false,
     infinite: true,
     cssEase: 'linear',
     variableWidth: true,
     variableHeight: true,
     mobileFirst: true
   };    


   var scriptags=document.getElementsByTagName('script');
   let tagcount:number=scriptags.length;
   for(let tags in scriptags){
     let noOftags=Number(tags);
     if(noOftags < tagcount){
       let mmcheckout=scriptags[tags]['src'].split("?");
       if(mmcheckout[1]=="situation=checkout"){
         scriptags[tags].remove();
       }
   
     }
    }

   
 }
 ngAfterViewInit() {
   this.fetchCartInfo();
   const _baseSite = this.singletonServ;  
   const baseSite = this.singletonServ.catalogVersion;
 if(baseSite.isoCode=="DE"){
  this.title.setTitle('Molton Brown – Warenkorb');
} else if(baseSite.isoCode=="US"){
  this.title.setTitle('Molton Brown - Shopping Cart & Gift Options');
} else {
 this.title.setTitle('Molton Brown - Shopping Basket & Gift Options');
}
   const pageType = 'Basket Page';
   this.gtmServ.gtmPageCategorisation(_baseSite,pageType);
   this.subscription = this.singletonServ.getMessage().subscribe(message => {
       if (message.refreshBasket) {
         this.fetchCartInfo();
       }else if(message.updateBasketEntry){
         this.setCartDetail(message.cartObj);
       }
    });

 }



setLang(lang: string) {
  const that=this;
 this.basketServ.getStaticContent(lang).subscribe(response => {
  that.singletonServ.appLocaleData = response;
  that.localData=response;
 });
 this.basketServ.getStaticGiftContent(lang).subscribe(response => {
  that.localGiftData=response;
  that.setPromotionalAmpContent(response);
});

}
wrapFRslots(){
 const that=this;
 const baseSite = this.singletonServ.catalogVersion;
//  let _FR=$TB;
 this.basketServ.getFRContent(baseSite.lngCode).subscribe((response:any)=>{
   if(response){
     that.customeAlsoBought.nativeElement.innerHTML = response.basketPage.customerAlsoBought.slotId;      
     that.lastMinutTreats.nativeElement.innerHTML = response.basketPage.lastMinuteTreats.slotId;      
    // if(_FR){  
    //   _FR.loadPageSlots();     
    // }
  }
 },err=>{

 });
}
setPromotionalAmpContent(obj:any){
  const that=this;
  const baseSite:any = this.singletonServ.catalogVersion;
  AmpCa.utils = new AmpCa.Utils();
  AmpCa.utils.getHtmlServiceData({
    auth: {
      baseUrl: 'https://c1.adis.ws',
      id: obj.pickagainpromotionalText.content.templateId,
      store: 'moltonbrown',
      templateName: obj.pickagainpromotionalText.content.templateName,
      locale: baseSite.locale
    },
    callback: function (htm) {
      that.localGiftData.pickagainpromotionalText.content.html=htm;
    }
  });
}
fetchCartInfo() {
 const baseSite:any = this.singletonServ.catalogVersion;
 if (this.singletonServ.getStoreData(baseSite.reg)) {
   const _user:any = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
   if(_user.code){
     this.fetchBasket(baseSite,_user.token, _user.email, _user.code);
   }else{
     this.cart=undefined;
     this.basketPageLoad=false;
   }
 } else {
   if (this.singletonServ.getStoreData(baseSite.guest)) {
      const _user:any = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      if(_user.guid){
       this.fetchBasket(baseSite,_user.token, "anonymous", _user.guid);
      }else{
       this.cart=undefined;
       this.basketPageLoad=false;
      }
  }else{
   this.cart=undefined;
   this.basketPageLoad=false;
  }
 }
}
fetchBasket(baseSite,token, email, code) {
this.cartSubscription= this.basketServ.retrieveCartDetails(baseSite,token, email, code).subscribe(
   response => {
     this.setCartDetail(response);
   },
   err => {
     if(err.error){
       if(err.error["errors"]){
         if(err.error["errors"][0]){
           if(err.error["errors"][0]['type']== "InvalidTokenError") {
             this.basketServ.generateCartToken(baseSite).subscribe(
               (resp:any) => {
                 const _reg=(email!='anonymous')?true:false;
                 if(_reg){
                   const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                   this.fetchBasket(baseSite,resp["access_token"], email, code);
                 }else{
                   const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                   this.fetchBasket(baseSite,resp["access_token"], email, code);
                 }
               });
           }else{
             this.basketPageLoad=false;
           }
         }
         }
        }
   }
 );
}

nestedCopy(array) {
 return JSON.parse(JSON.stringify(array));
}
setCartDetail(data) {
  const that=this;
 const baseSite:any = this.singletonServ.catalogVersion;
  const cart=this.singletonServ.setupEntryStream(data);
  if( cart.entries ){
     this.outStockEntries=_.filter(cart.entries,(entry)=>{
       if(!entry['product'].length){
         if(entry['product'].stock){
           return entry['product'].stock.stockLevelStatus !='inStock'
         }
       }else{
         return entry.stock.stockLevelStatus !='inStock'
       }
   });
   // if(cart.appliedProductPromotions){
   //   if(cart.appliedProductPromotions.length !=0){
   //     cart.appliedProductPromotions.map((promotion)=>{
   //       if(promotion.promotion['code']=="GIFTWITHP") {
   //           promotion['consumedEntries'].map((obj)=>{
   //             const _index= _.findIndex(cart.entries,(entry)=>{
   //               return entry.entryNumber===obj.orderEntryNumber   
   //             });  
   //           if(_index !=-1){
   //             cart.entries[_index]['disableCounterAction']=true;  
   //           }
   //         });
   //       }

   //   });
   //   }
   // }

   if(cart.appliedProductPromotions){
     if(cart.appliedProductPromotions.length !=0){
       cart.appliedProductPromotions.map((promotion)=>{
         promotion.consumedEntries.map((obj)=>{
               const _index= _.findIndex(cart.entries,(entry:any)=>{
                 return entry.entryNumber===obj.orderEntryNumber   
               });  
               if(_index !=-1){
                 cart.entries[_index]['promoMessage']=promotion.promotion['description'];  
               }
         });          
     });
     }
   }
 }
 if(cart['appliedVouchers']){
       if(cart['appliedVouchers'].length !=0){
         this.promocodeSuccess=true;
         this.couponRedeemed = false;
         if(baseSite.isoCode=="DE"){
          this.promotextcoupon="Werbe-Code ";
          this.appliedtext="angewendet.";
         }
         else{
          this.promotextcoupon="Promo code ";
          this.appliedtext="applied.";

         }
         this.promoSuccesMsg=this.promotextcoupon+cart['appliedVouchers'][0]['code']+"</b>&nbsp;"+this.appliedtext;
         this.basketForm.controls.promoCode.patchValue(cart['appliedVouchers'][0]['code']);
       }else{

   }
 }
  const _pickAgain= _.filter(cart.entries,(entry)=>{
    if(!entry['product'].length){
        return entry.pickAgain
    }
  });
if(cart.showPopUp){
  if(_pickAgain.length ===0){
     that.quantityRestriction={allowedQuantity:cart.allowedQuantity
    };
           that.getSampleProducts();
          that.refreshBasket=true;
          that.promocodeSuccess = true;
          that.isPromoCodeError = false;          
          that.singletonServ.scrollToTarget('#headTopPromotionalText');
          that.dom.querySelector('body').style.overflowY="hidden";
          that.pageModalLoad=true;            
          that.display='block';
          that.singletonServ.scrollToElWithinC(".orders-container","#pick-header");
  }
}
if(_pickAgain.length !=0){
    if (this.singletonServ.getStoreData(baseSite.reg)) {
        const _user:any = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        this.showExpress=(_user.isExpressCheckout)?true:false;
    }
}
 this.contructGiftPayForm(cart);
 this.cart = cart;
 this.singletonServ.cartObj = cart;
 this.basketPageLoad=false;
 const obj = { updateBasketCount: true,cart:cart };
 this.singletonServ.sendMessage(obj);
 this.cartCode = cart["code"];
 this.entries = true;
 this.refreshBasket=false;
}
contructGiftPayForm(_cartObj){
      const that=this;
      if(!this.checkControlsAsTouched()){
          if (_cartObj) {
                if(_cartObj.disableGiftBox){
                    this.giftMessageForm.controls.giftCard['controls']['preferGift'].disable();
                  }else{
                    this.giftMessageForm.controls.giftCard['controls']['preferGift'].enable();
                  }
                if(_cartObj.isGiftBox){
                  this.giftMessageForm.controls.giftCard['controls']['preferGift'].patchValue('yesgiftwrap');
                }else{
                  this.giftMessageForm.controls.giftCard['controls']['giftMsg'].patchValue(false);
                   this.giftMessageForm.controls.giftCard['controls']['giftMessage'].reset();
                  this.giftMessageForm.controls.giftCard['controls']['giftMsg'].setValidators(null);
                  this.giftMessageForm.controls.giftCard['controls']['giftMessage'].setValidators(null);
                  this.giftMessageForm.controls.giftCard['controls']['giftMessage'].updateValueAndValidity();
                  this.giftMessageForm.controls.giftCard['controls']['giftMsg'].updateValueAndValidity();
                }

                if(_cartObj.isGiftBoxMessage){
                    if(_cartObj.isGiftBox){
                      this.giftMessageForm.controls.giftCard['controls']['preferGift'].patchValue('yesgiftwrap');
                    }
                  this.giftMessageForm.controls.giftCard['controls']['giftMsg'].setValidators([Validators.required]);
                  this.giftMessageForm.controls.giftCard['controls']['giftMessage'].setValidators([Validators.required]);
                  this.giftMessageForm.controls.giftCard['controls']['giftMessage'].updateValueAndValidity();
                  this.giftMessageForm.controls.giftCard['controls']['giftMsg'].updateValueAndValidity();
                  if(_cartObj.giftBoxMessage){               
                       this.giftMessageForm.controls.giftCard['controls']['giftMsg'].patchValue(true);
                       this.giftMessageForm.controls.giftCard['controls']['giftMessage'].patchValue(_cartObj.giftBoxMessage);
                   }
                }
          }
    }else{
    }
}
checkControlsAsTouched(){
  const _group=this.giftMessageForm.controls.giftCard['controls'];
  for(let key in _group){
    if(_group[key].touched){
    return true;
   }
  }
  return null;
}
onOpenPopup(){
  const that=this;
  const baseSite = this.singletonServ.catalogVersion;
  that.singletonServ.scrollToTarget('#headTopPromotionalText');
  that.getSampleProducts();
  that.dom.querySelector('body').style.overflowY="hidden";
  that.pageModalLoad=true;            
  that.display='block';
  that.refreshBasket=true;
}
enableEntryBlock(cart:any){
  if(cart.entries.length !=0){
        const _pickAgain= _.filter(cart.entries,(entry)=>{
          if(!entry['product'].length){
               if(!entry.pickAgain){
                   if(entry['product'].isSample){
                     return entry;
                   }
              }else if(entry['product'].isSample){
                return entry;
              }
          }else{
            return entry;
          }
        });
        if(_pickAgain.length !=0){
           return false;
        }else{
          return true;
        }
  }else{
    return false;
  }
}

 getPixMixImage(entry) {
   if (entry.bundleTemplateId) {
     if (entry.bundleTemplateId.indexOf("6") != -1) {
       return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel6_uk_pick-mix-travel-6_image_01?$smallImg$&amp;fmt=webp";
     } else if (entry.bundleTemplateId.indexOf("3") != -1)  {
       return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=webp";
     }else{
       return "https://media.moltonbrown.co.uk/i/moltonbrown/FFDummySKU_uk_Fragrance-Finder-Samples_image_01?$thImg$&fmt=webp"
     }
   }
   return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=webp";
 }
 getPixMixImageJpg(entry){
   if(entry.bundleTemplateId){
     if(entry.bundleTemplateId.indexOf('6') !=-1 ){
       return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel6_uk_pick-mix-travel-6_image_01?$smallImg$&amp;fmt=jpg"
     }else if(entry.bundleTemplateId.indexOf('3') !=-1 ){
       return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=jpg"
     }else{
       return "https://media.moltonbrown.co.uk/i/moltonbrown/FFDummySKU_uk_Fragrance-Finder-Samples_image_01?$thImg$&fmt=jpg"
     }
   }
     return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=jpg"
   
  }
 onDecreaseCount(data, k) {
   const baseSite = this.singletonServ.catalogVersion;
   let _count = this.cart["entries"][k]["quantity"] - 1;
   this.refreshBasket=true;
   if (this.singletonServ.getStoreData(baseSite.reg)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
     if (!user.code) {
     } else {
       if (this.cart["entries"][k]["quantity"] == 1) {
         this.onDeleteEntry(data);
       } else {
         if(data.isBundle){
           this.decreasebundleItem(baseSite,user.token,user.email, user.code, data);
          }else{
           this.updateBasket(baseSite,user.token, user.email, user.code, data, _count);
          }
       }
     }
   } else if (this.singletonServ.getStoreData(baseSite.guest)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
     if (this.cart["entries"][k]["quantity"] == 1) {
       this.onDeleteEntry(data);
     } else {
          if(data.isBundle){
           this.decreasebundleItem(baseSite,user.token, "anonymous", user.guid, data);
          }else{
           this.updateBasket(baseSite,user.token, "anonymous", user.guid, data, _count);
          }
     
     }
   }
   
// start ---gtm remove product to cart
const pageUrlCat = this.pageUrl1(data);
const pageUrlMainCat= pageUrlCat[1].split('-').join('');
const pageUrlSubCat= pageUrlCat[2].split('-').join('');
const cartDetails = {
 'currencyCode': data.product.price.currencyIso,
 'categoryList': pageUrlMainCat+ '-'+ pageUrlSubCat,       
 'productName': data.product.productDisplayName,      
 'productID': data.product.code,
 'productPrice': '',
 'productBrand': "Molton Brown",
 'productCategory': pageUrlSubCat,
 'productVariant': (data.product.productVariant)? data.product.productVariant : '', 
 'productQuantity':data.quantity-1,
 'size': data.product.size,
 'reviewRating': (data.product.productAverageRating)?data.product.productAverageRating:'0',
 'reviewsCount': (data.product.reviewCount)?data.product.reviewCount:'0',
 'saleStatus': (data.product.originalPrice)?'True':'False',
 'stockLevel': (data.product.stock.stockLevelStatus == "inStock")?"True":"False",   
 'productStockLevelNumber':(data.product.stock.stockLevel)?data.product.stock.stockLevel:'', 
 'deleveryType':(data.product.productEdition)?data.product.productEdition:'',
 'salePrice':(data.product.originalPrice)?data.product.price.value:''
  


}
if(data.product.originalPrice){
 const originalPrice= data.product.originalPrice;
 const _originalPrice = originalPrice.match(/[\d\.]+/);
 if(_originalPrice){
   cartDetails['productPrice']=_originalPrice[0];
 }else{
   cartDetails['productPrice']=originalPrice;
 }
 }else{
   cartDetails['productPrice']=data.product.price.value;
 }
this.gtmServ.gtmRemoveFromCart(cartDetails);
// end gtm remove product to cart
 }
 onAddItem(data, k) {
   this.refreshBasket=true;
   const baseSite = this.singletonServ.catalogVersion;
   const _count = this.cart["entries"][k]["quantity"] + 1;
   if (this.singletonServ.getStoreData(baseSite.reg)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
     if (!user.code) {
     } else {
       if(data.isBundle){
         this.updatebundleItem(baseSite,user.token, user.email, user.code, data);
       }else{
         this.updateBasket(baseSite,user.token, user.email, user.code, data, _count);
       }

     }
   } else if (this.singletonServ.getStoreData(baseSite.guest)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
     if(data.isBundle){
       this.updatebundleItem(baseSite,user.token, "anonymous", user.guid, data);
     }else{
       this.updateBasket(baseSite,user.token, "anonymous", user.guid, data, _count);
     }
   }

// start ---gtm Add product to cart
const pageUrlCat = this.pageUrl1(data);
const pageUrlMainCat= pageUrlCat[1].split('-').join('');
const pageUrlSubCat= pageUrlCat[2].split('-').join('');
const cartDetails = {
 'currencyCode': data.product.price.currencyIso,
'categoryList': pageUrlMainCat+ '-'+ pageUrlSubCat,       
     'productName': data.product.productDisplayName,      
 'productID': data.product.code,
 'productPrice': '',
 'productBrand': "Molton Brown",
'productCategory': pageUrlSubCat,
 'productVariant': (data.product.productVariant)? data.product.productVariant : '', 
'productQuantity':data.quantity+1,
 'size': data.product.size,
 'reviewRating': (data.product.productAverageRating)?data.product.productAverageRating:'0',
 'reviewsCount': (data.product.reviewCount)?data.product.reviewCount:'0',
 'saleStatus': (data.product.originalPrice)?'True':'False',
 'stockLevel': (data.product.stock.stockLevelStatus == "inStock")?"True":"False",   
 'productStockLevelNumber':(data.product.stock.stockLevel)?data.product.stock.stockLevel:'',
  'deleveryType':(data.productEdition)?data.productEdition:'',
   'salePrice':(data.product.originalPrice)?data.product.price.value:''
}

if(data.product.price['formattedValue']){
  cartDetails['productPrice']=data.product.price.value;
}
else{
  if(data.product.originalPrice){
    const originalPrice= data.product.originalPrice;
  const _originalPrice = originalPrice.match(/[\d\.]+/);
  if(_originalPrice){
    cartDetails['productPrice']=_originalPrice[0];
  }else{
    cartDetails['productPrice']=originalPrice;
  }
  }
}

// if(data.product.originalPrice){
//  const originalPrice= data.product.originalPrice;
//  const _originalPrice = originalPrice.match(/[\d\.]+/);
//  if(_originalPrice){
//    cartDetails['productPrice']=_originalPrice[0];
//  }else{
//    cartDetails['productPrice']=originalPrice;
//  }
//  }else{
//    cartDetails['productPrice']=data.product.price.value;
//  }
 

this.gtmServ.gtmAddToCart(cartDetails);
// end gtm add product to cart
 }
 pageUrl1(dataurl){
   if(dataurl.product.length){
     const pageUrl = dataurl.product[0]['product'].url;
     if(pageUrl.indexOf("/c/") != -1) {
         const _replaceUrl = pageUrl.replace("/c/", "/");
       if(_replaceUrl.indexOf("/p/") !=-1){
         const _replaceProductUrl = pageUrl.replace("/p/", "/");
         return _replaceProductUrl.split("/");
       }else{
         return _replaceUrl.split("/");
       }
     } else if(pageUrl.indexOf("/p/") !=-1){
       const _replaceProductUrl = pageUrl.replace("/p/", "/");
       return _replaceProductUrl.split("/");
     }

   }else{
     const pageUrl = dataurl.product.url;
     return pageUrl.split("/");
   }

   
   }
 decreasebundleItem(baseSite,token, email, code, item){
   let bundleNo=item.bundleNo;
   let qty=this.getBundleQuantity(item);
   let quantity=qty-1;
   let _codes=[];
   item.product.map(bundle => {
     let qty=bundle.quantity/item.quantity;        
       for(let k=0;k<qty;k++){
         _codes.push(bundle.product.code); 
        }     
   });
   const body={
     "productcodes":_codes
   }
   this.createBundleSubscription= this.basketServ.updateBundleItem(baseSite,token,email,code,body, bundleNo,quantity).subscribe((response)=>{
     this.fetchCartInfo();
   },err=>{
    this.refreshBasket=false;
   });
 }
 updatebundleItem(baseSite,token, email, code, item){
   let bundleNo=item.bundleNo;
   let qty=this.getBundleQuantity(item);
   let quantity=qty+1;
   let _codes=[];
   item.product.map(bundle => {
     let qty=bundle.quantity/item.quantity;        
       for(let k=0;k<qty;k++){
         _codes.push(bundle.product.code); 
        }     
   });
   const body={
     "productcodes":_codes
    }
   this.updateBundleItem(baseSite,token,email,code,body, bundleNo,quantity);
 }
 updateBundleItem(baseSite,token,email,code,body, bundleNo,quantity){
   this.updateBundleSubscription = this.basketServ.updateBundleItem(baseSite,token,email,code,body, bundleNo,quantity).subscribe((response)=>{
     this.fetchCartInfo();
  
   },err=>{
    if(err.error){
     if(err.error["errors"]){
       if(err.error["errors"][0]){
         if(err.error["errors"][0]['type']== "InvalidTokenError") {
           this.basketServ.generateCartToken(baseSite).subscribe(
             (resp:any) => {
               const _reg=(email!='anonymous')?true:false;
               if(_reg){
                 const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                 user.token= resp["access_token"];
                 this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                 this.updateBundleItem(baseSite,resp["access_token"],email,code,body, bundleNo,quantity); 
               }else{
                 const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                 user.token= resp["access_token"];
                 this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                 this.updateBundleItem(baseSite,resp["access_token"],email,code,body, bundleNo,quantity); 
               }
                  
             });
         }else{
           this.refreshBasket=false;
         }
       }
       }
      }
   });
 }
 getBundleProductQuntity(entry,bottle){
   return  bottle.quantity/entry.quantity;   
 }
 getBundleStock(entry){

   let i;
   for (i = 0; i < entry["product"].length; i++) {
     if(entry["product"][i]['product'].stock){
     if (
       entry["product"][i]['product'].stock.stockLevelStatus !='inStock'
     ) {
           return entry["product"][i]['product'].stock
       break;
     }
   }
   }
 }
 getBundleQuantity(entry){
   let p=0;
   let i;
   for( i=0;i<entry.product.length;i++){
     if(!entry.product[i]['product']['isSample']){
      let qty=entry.product[i].quantity;
        p = p + qty ;
     }
   }

   if(entry.bundleTemplateId){
     if (entry.bundleTemplateId.indexOf("6") != -1) {
        p=p/6
     } else {
       p=p/3
     }
   }
   return p;
 }
 updateBasket(baseSite,token, email, code, item, count) {
   const entry = item["entryNumber"];
   const productObj = {
     product: { code: item["product"]["code"] },
     quantity: parseInt(count)
   };
this.updateCartEntry(baseSite,token, email, code, productObj, entry);
 }
updateCartEntry(baseSite,token, email, code, productObj, entry){
 this.basketServ
 .updateEntry(baseSite,token, email, code, productObj, entry)
 .subscribe((response:any) => {
     if(response.errorMsg){
       this.outofstockentryMsg=response.errorMsg;
       this.refreshBasket=false;
     }else{
      this.fetchCartInfo();
     }
   },
   err => { 
     if(err.error){
       if(err.error["errors"]){
         if(err.error["errors"][0]){
           if(err.error["errors"][0]['type']== "InvalidTokenError") {
             this.basketServ.generateCartToken(baseSite).subscribe(
               (resp:any) => {
                 const _reg=(email!='anonymous')?true:false;
                 if(_reg){
                   const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                   this.updateCartEntry(baseSite,resp["access_token"], email, code, productObj, entry); 
                 }else{
                   const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                   this.updateCartEntry(baseSite,resp["access_token"], email, code, productObj, entry); 
                 }
                     
               });
           }else{
             this.refreshBasket=false;
           }
         }
         }
        }
   }
 );
}
 onChangeQuant(event,data) {
   this.refreshBasket=true;
   const baseSite = this.singletonServ.catalogVersion;
   let _count = event.target.value;
   if (this.singletonServ.getStoreData(baseSite.reg)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
     if (!user.code) {
     } else {
       if(data.isBundle){
         this.updatebundleItem(baseSite,user.token, user.email, user.code, data);
       }else{
         this.updateBasket(baseSite,user.token, user.email, user.code, data, _count);
       }

     }
   } else if (this.singletonServ.getStoreData(baseSite.guest)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
     if(data.isBundle){
       this.updatebundleItem(baseSite,user.token, "anonymous", user.guid, data);
     }else{
       this.updateBasket(baseSite,user.token, "anonymous", user.guid, data, _count);
     }
   }
 }

 onDeleteEntry(item) {
   this.refreshBasket=true;
   const baseSite = this.singletonServ.catalogVersion;
   const entry = item["entryNumber"];
   if (this.singletonServ.getStoreData(baseSite.reg)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
     if (item.isBundle) {
       this.removeBundleEntry(
         baseSite,
         user.token,
         user.email,
         user.code,
         item["bundleNo"]
       );
     } else {
       this.removeCartEntry(baseSite,user.token, user.email, user.code, entry);
     }
   } else {
     if (this.singletonServ.getStoreData(baseSite.guest)) {
       const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
       if (item.isBundle) {
         this.removeBundleEntry(
           baseSite,
           user.token,
           "anonymous",
           user.guid,
           item["bundleNo"]
         );
       } else {
         this.removeCartEntry(baseSite,user.token, "anonymous", user.guid, entry);
       }
     }
   }
  this.setGtmOnRemoveProduct(item);
 }
 setGtmOnRemoveProduct(resp){
   const pageUrlCat = this.pageUrl1(resp);
const pageUrlMainCat= pageUrlCat[1].split('-').join('');
const pageUrlSubCat= pageUrlCat[2].split('-').join('');
 const productdetails={
   'currencyCode': resp.product.price.currencyIso,
   'categoryList': pageUrlMainCat+ '-'+ pageUrlSubCat,       
         'productName': resp.product.productDisplayName,      
     'productID': resp.product.code,
     'productPrice': (resp.product.originalPrice)?resp.product.originalPrice:resp.product.price.value,
     'productBrand': "Molton Brown",
   'productCategory': pageUrlSubCat,
     'productVariant': (resp.product.productVariant)? resp.product.productVariant : '', 
   'productQuantity':resp.quantity,
     'size': resp.product.size,
     'reviewRating': (resp.product.productAverageRating)?resp.product.productAverageRating:'0',
     'reviewsCount': (resp.product.reviewCount)?resp.product.reviewCount:'0',
     'saleStatus': (resp.product.originalPrice)?'True':'False',
     'stockLevel': (resp.product.stock.stockLevelStatus == "inStock")?"True":"False",   
     'productStockLevelNumber':(resp.product.stock.stockLevel)?resp.product.stock.stockLevel:'', 
      'deleveryType':(resp.product.productEdition)?resp.product.productEdition:'',
       'salePrice':(resp.product.originalPrice)?resp.product.price.value:''
 
  
 };
this.gtmServ.gtmRemoveFromCart(productdetails);
 }
 removeCartEntry(baseSite,token, email, cartCode, entry) {
   this.basketServ.removeEntry(baseSite,token, email, cartCode, entry).subscribe(
     response => {
       this.fetchCartInfo();
     },
     err => {
       if(err.error){
         if(err.error["errors"]){
           if(err.error["errors"][0]){
             if(err.error["errors"][0]['type']== "InvalidTokenError") {
               this.basketServ.generateCartToken(baseSite).subscribe(
                 (resp:any) => {
                   const _reg=(email!='anonymous')?true:false;
                   if(_reg){
                     const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                     user.token= resp["access_token"];
                     this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                     this.  removeCartEntry(baseSite,resp["access_token"], email, cartCode, entry); 
                   }else{
                     const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                     user.token= resp["access_token"];
                     this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                     this.  removeCartEntry(baseSite,resp["access_token"], email, cartCode, entry); 
                   }
                     
                 });
             }else{
               this.refreshBasket=false;
             }
           }
           }
          }
     }
   );
 }

 onContinueShoppingEvent() {
   this.router.navigate(["store"]);
 }

 onSecureCheckout(bol) {
   const _outofstock=_.find(this.cart.entries,(obj)=>{
     if(!obj.product.length){
       return obj.product.stock.stockLevelStatus != "inStock"
      }
   });
  if(!_outofstock){
      if(bol){
       this.checkHazardouswithExpressPay(bol)
      }else{
        this.onDispatchBasket(bol);
      }
   
 }
}
checkHazardouswithExpressPay(bol){
  const that=this;
  const baseSite = this.singletonServ.catalogVersion;
  if(this.singletonServ.getStoreData(baseSite.reg)){
    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
this.expressChcSubscription=   this.basketServ.expressCheckout(baseSite,user.token,user.email,user.code).subscribe((response:any)=>{
      if(response.hazardousProducts){
        that.hazardousEntries=true;
        that.hazardousData.list=response.hazardousProducts.products;
      }else{
         that.hazardousEntries=false;
         that.onDispatchBasket(bol);
       }
   });
  }
}
onDispatchBasket(bol) {
  const that=this;
 const _val= this.giftMessageForm.value;
 const _giftForm=this.giftMessageForm.controls["giftCard"];
  if(_giftForm.valid){
       const _giftBox=_giftForm["controls"]["preferGift"]["value"];              
       const body = {
         isGiftBox: (_giftBox=="yesgiftwrap")?true:false,
         isGiftBoxMessage: false,
         giftBoxMessage: ''
       };

       if (_val.giftCard.giftMsg) {
             if(this.giftMessageForm.valid){
               body['isGiftBoxMessage']=(body.isGiftBox)?true:false;
               body['giftBoxMessage']=_val.giftCard.giftMessage;
               this.setShipping(body,bol);
             }else{
               this.validateGiftWrapFields(this.giftMessageForm);
             }
       }else{  
         this.setShipping(body,bol);
       }
 }else{
  that.giftWrapEl.giftMsgEl.nativeElement.focus();
  that.validateGiftWrapFields(that.giftMessageForm);
}

 
}
setShipping(body,bol){
  const that=this;
 const baseSite = this.singletonServ.catalogVersion;
 if (this.singletonServ.getStoreData(baseSite.reg)) {
   const isExpressObj={status:bol}
   const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
   this.basketServ
   .giftMessage(baseSite,user.token, body, user.email, user.code)
   .subscribe(
     response => {
       this.setShippingPage(isExpressObj);
     },
     error => {
       if(error.error){
         if(error.error["errors"]){
           if(error.error["errors"][0]){
             const err = error.error["errors"][0];
         if(err.type== "InvalidTokenError") {
          that.basketServ.generateCartToken(baseSite).subscribe(
            (resp:any) => {
              if(this.singletonServ.getStoreData(baseSite.reg)){
                const user=JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
                user.token= resp["access_token"];
                that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                that.setShipping(body,bol);
              }else{
                const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                user.token= resp["access_token"];
                that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                that.setShipping(body,bol);
              }
       
            });
         }
       }
     }
   }
     }
   );
 } else {
   if (this.singletonServ.getStoreData(baseSite.guest)) {
     const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
     this.basketServ
     .giftMessage(baseSite,user.token, body, 'anonymous', user.guid)
     .subscribe(
       response => {
         this.setShippingPage(false);
       },
       (error:any) => {
        if(error.error){
          if(error.error["errors"]){
            if(error.error["errors"][0]){
              const err = error.error["errors"][0];
          if(err.type== "InvalidTokenError") {
           that.basketServ.generateCartToken(baseSite).subscribe(
             (resp:any) => {
               if(this.singletonServ.getStoreData(baseSite.reg)){
                 const user=JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
                 user.token= resp["access_token"];
                 that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                 that.setShipping(body,bol);
               }else{
                 const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                 user.token= resp["access_token"];
                 that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                 that.setShipping(body,bol);
               }
        
             });
          }
        }
      }
    }
       }
     );
   }
 }
}


setShippingPage(data){
 const baseSite = this.singletonServ.catalogVersion;      
 this.singletonServ.checkoutStatus = true;
 const obj = { checkoutStatus: true, store: false };
 this.singletonServ.sendMessage(obj);
 if (this.singletonServ.getStoreData(baseSite.reg)) {
   if(data.status){
     this.singletonServ.giftBoxWithMessageForm.reset();
     this.router.navigate(["checkout", "shipping"], {
       queryParams: { expressCheckout: true, express: true },
       queryParamsHandling: "merge"
     });
   }else{
      const _gwpstock=_.find(this.cart.entries,(obj)=>{
         if(!obj.product.length){
           return obj.pickAgain
         }
       });
       if(_gwpstock){
        this.singletonServ.giftBoxWithMessageForm.reset();
         this.router.navigate(["/checkout", "shipping"]);
       } else{
        this.singletonServ.giftBoxWithMessageForm.reset();
           this.router.navigate(["store", "mbcart", "mbSamples"]);
       }
   }
 }else{
       const _gwpstock=_.find(this.cart.entries,(obj)=>{
         if(!obj.product.length){
           return obj.pickAgain
         }
       });
       if(_gwpstock){
        this.singletonServ.giftBoxWithMessageForm.reset();
         this.router.navigate(["/checkout", "login"]);
       } else{
        this.singletonServ.giftBoxWithMessageForm.reset();
       this.router.navigate(["store", "mbcart", "mbSamples"]);
       }
 }
}

getRouterPath(data){
 if(!data.isBundle){
 if (data.product.url.indexOf("/c/") != -1) {
   if (data.category) {
     const _constructUrl = data.product.category.url.slice(1).split("/");
     _constructUrl.splice(-2, 2);
     const _produrl = _constructUrl.join("/");
     const _url = "/store/" + _produrl + "/" + data.name + "/" + data.code;
     return _url;
   }
 } else {
   const _url = "/store" + data.product.url.replace("/p/", "/");
   return _url;
 }
}
return "" 
}
 onShowProductDtls(event,searchItem) {
   event.preventDefault();
   let url = "/store" + searchItem.url.replace("/p/", "/");
   if(event.ctrlKey && event.which === 1){
     window.open(url); 
  } else {
    this.router.navigate([url]);
  }
 }

 onSpliceBundleItem(product) {
   const baseSite = this.singletonServ.catalogVersion;
   this.generateCartSubscription =this.basketServ.generateCartToken(baseSite).subscribe(
     res => {
       const tokenId = res["access_token"];
       if (this.singletonServ.getStoreData(baseSite.reg)) {
         const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
         _user['token']=res["access_token"];
         this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
         this.removeBundleEntry(
           baseSite,
           tokenId,
           _user.email,
           _user.code,
           product["bundleNo"]
         );
       } else {
         const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
         _guest['token']=res["access_token"];
         this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
         this.removeBundleEntry(
           baseSite,
           tokenId,
           "anonymous",
           _guest.guid,
           product["bundleNo"]
         );
       }
     },
     err => {
       this.refreshBasket=false;
     }
   );
 }

 getBundleContent(text) {
   const baseSite=this.singletonServ.catalogVersion;
   if(baseSite.isoCode == "DE"){
    this.picknmix6="Pick & Mix für die Reise x 6";
    this.picknmix3="Pick & Mix für die Reise x 3";

   }
   else{
    this.picknmix6="Pick & Mix Travel x 6";
    this.picknmix3="Pick & Mix Travel x 3";
   }
   if (text.bundleTemplateId.indexOf("6") != -1) {
     return this.picknmix6;
   } else   if (text.bundleTemplateId.indexOf("3") != -1) {
     return this.picknmix3;
   } else {
     return "Fragrance Finder Samples";
   }
   return this.picknmix3;
 }
 removeBundleEntry(baseSite,token, email, code, bundleNo) {
   this.basketServ.removeBundle(baseSite,token, email, code, bundleNo).subscribe(
     response => {
       this.fetchCartInfo();
     },
     err => {
       this.refreshBasket=false;
     }
   );
 }
 getProdPrice(entry) {
     if(!entry.giveAway){
       if (entry.product.price){
         if (entry.product.price.value != 0) {
             if(entry.product.originalPrice){
               return ` <span class="price-format-discount">
               <del class="price-format-discount-retail-price" >${entry.product.originalPrice}</del> &nbsp;
               <span class="ds-price">${entry.product.price.formattedValue}</span>
           </span>`
             }
           return entry.product.price.formattedValue;
         } else {
           return this.freeMsg;
         }
     }
   }else{
     return this.freeMsg; 
   }
 }
 getTotalPrice(entry) {
      if(!entry.giveAway){
          if (entry.totalPrice.value != 0) {
            return entry.totalPrice.formattedValue;
          } else {
            return this.freeMsg;
          }
      }else {
        return this.freeMsg;
      }
}
 getBundlePrice(data) {
  const _bundlePrice= data.product.filter((obj)=>{
     return obj.product.isSample
   });
   if(_bundlePrice.length !=0){
     return _bundlePrice[0]['basePrice']['formattedValue'];
   }
  
 }
 getBundleTotalPrice(data) {
   const _bundlePrice= data.product.filter((obj)=>{
     return obj.product.isSample
   });
   if(_bundlePrice.length !=0){
     return _bundlePrice[0]['totalPrice']['formattedValue'];
   }
 }
setPromocode(baseSite,token,email,code,val){
 const that=this;
 this.basketServ
 .applyPromoCode(baseSite,token,email,code, val)
 .subscribe(
   (response:any) => {
     if(response){
       if(response.errorMessage){
         that.isPromoCodeError = true;
         that.promocodeSuccess = false;
         that.couponRedeemed = false;
       }else{
         that.refreshBasket=true;
         that.fetchCartInfo();
       }     
     }
   },
   (err:any) => {
     if (err.error.errors[0]["message"] == "coupon.already.redeemed") {
       that.isPromoCodeError = false;
       that.couponRedeemed = true;
     }      
     if(err.error){
       if(err.error["errors"]){
         if(err.error["errors"][0]){
           if(err.error["errors"][0]['type']== "InvalidTokenError") {
             that.basketServ.generateCartToken(baseSite).subscribe(
               (resp:any) => {
                 const _reg=(email!='anonymous')?true:false;
                 if(_reg){
                   const user=JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
                   user.token= resp["access_token"];
                   that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                   that.setPromocode(baseSite,resp["access_token"],email,code,val); 
                 }else{
                   const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                   user.token= resp["access_token"];
                   that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                   that.setPromocode(baseSite,resp["access_token"],email,code,val); 
                 }
               });
           }else if (err.error.errors[0]["type"] == "VoucherOperationError") {
             that.isPromoCodeError = true;
             that.couponRedeemed = false;
           }else{
             that.isPromoCodeError = true;
             that.promocodeSuccess = false;
             that.couponRedeemed = false;
           }
         }
         }
         that.refreshBasket=false;
         that.promocodeSuccess = false;
        }
   }
 )
}

closeModalDialog(){
 this.display='none'; 
}
 onApplyPromoCode(event){
   if(event.keyCode==13){
     event.target.blur();
     this.applyPromoCode();
     return false;
   }
 }
 onRemoveGFWSample(event){
  const that=this;  
  const baseSite = this.singletonServ.catalogVersion;
  this.dom.querySelector('body').style.overflowY="auto";
  this.display="none";
  const val = this.basketForm.value.promoCode;
  if (that.singletonServ.getStoreData(baseSite.reg)) {
    const user = JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
    that.removePickAgainPromo(baseSite,user.token,user.email,user.code,val);
  }else if (that.singletonServ.getStoreData(baseSite.guest)) {
    const _guestuser = JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
    that.removePickAgainPromo(baseSite,_guestuser.token,'anonymous',_guestuser.guid,val);
  }
}
onRemovePromo(event){
  event.preventDefault();
  const that=this;  
  const baseSite = this.singletonServ.catalogVersion;
  const val = this.basketForm.value.promoCode;
  if (that.singletonServ.getStoreData(baseSite.reg)) {
    const user = JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
    that.removePickAgainPromo(baseSite,user.token,user.email,user.code,val);
  }else if (that.singletonServ.getStoreData(baseSite.guest)) {
    const _guestuser = JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
    that.removePickAgainPromo(baseSite,_guestuser.token,'anonymous',_guestuser.guid,val);
  }
}
removePickAgainPromo(baseSite,token,email,code,val){
  const that=this;
  this.refreshBasket=true;
  this.basketServ.removePromoCode(baseSite,token,email,code,val).subscribe((response)=>{
    that.basketForm.reset();
    that.promocodeSuccess = false;
    that.isPromoCodeError = false;
    that.fetchCartInfo();
  },err=>{     
    if(err.error){
      if(err.error["errors"]){
        if(err.error["errors"][0]){
          if(err.error["errors"][0]['type']== "InvalidTokenError") {
            that.basketServ.generateCartToken(baseSite).subscribe(
              (resp:any) => {
                const _reg=(email!='anonymous')?true:false;
                if(_reg){
                  const user=JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
                  user.token= resp["access_token"];
                  that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                  that.  removePromo(baseSite,resp["access_token"],email,code,val); 
                }else{
                  const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                  user.token= resp["access_token"];
                  that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                  that.removePromo(baseSite,resp["access_token"],email,code,val);  
                }
         
              });
          }
        }
        }
       }
       that.refreshBasket=false;
  });
}
 applyPromoCode() {
   const baseSite = this.singletonServ.catalogVersion;
   if (this.basketForm.valid) {
     this.submitted = true;
     const val = this.basketForm.value.promoCode;
         if (this.singletonServ.getStoreData(baseSite.reg)) {
           const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
           if(user.token){
             this.setPromocode(baseSite,user.token,user.email,user.code,val);
          }else{
           this.generateCartSubscription=    this.basketServ.generateCartToken(baseSite,).subscribe((token)=>{
             const _token = token["access_token"];
             user.token=_token;
             this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
               this.setPromocode(baseSite,user.token,user.email,user.code,val);
          },err=>{

           });
         }
     
         } else {
           if (this.singletonServ.getStoreData(baseSite.guest)) {
             const guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
             if(guest.token){
                   this.setPromocode(baseSite,guest.token,'anonymous',guest.guid,val);

           }else{
             this.generateCartSubscription= this.basketServ.generateCartToken(baseSite).subscribe((token)=>{
               const _token = token["access_token"];
                 guest.token=_token;
                   this.setPromocode(baseSite,guest.token,'anonymous',guest.guid,val);
             },err=>{

             });
           }
           }
         }
     
   } else {
     this.validateAllFormFields(this.basketForm);
   }
 }

 onFocusPromoCode() {
   this.isPromoCodeError = false;
 }
 removePromo(baseSite,token,email,code,val){
   const that=this;
   this.refreshBasket=true;
   this.basketServ.removePromoCode(baseSite,token,email,code,val).subscribe((response)=>{
     that.basketForm.reset();
     that.promocodeSuccess = false;
     that.isPromoCodeError = false;
     that.fetchCartInfo();
   },err=>{     
     if(err.error){
       if(err.error["errors"]){
         if(err.error["errors"][0]){
           if(err.error["errors"][0]['type']== "InvalidTokenError") {
             this.basketServ.generateCartToken(baseSite).subscribe(
               (resp:any) => {
                 const _reg=(email!='anonymous')?true:false;
                 if(_reg){
                   const user=JSON.parse(that.singletonServ.getStoreData(baseSite.reg));
                   user.token= resp["access_token"];
                   that.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                   that.  removePromo(baseSite,resp["access_token"],email,code,val); 
                 }else{
                   const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                   user.token= resp["access_token"];
                   that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                   that.removePromo(baseSite,resp["access_token"],email,code,val);  
                 }
          
               });
           }
         }
         }
        }
        that.refreshBasket=false;
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



 validateGiftWrapFields(formGroup) {
  if(formGroup){
  if(formGroup.controls){
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
}


  addToBasket(event) {
   const baseSite = this.singletonServ.catalogVersion;
   const productObj = event.detail;
       if (this.singletonServ.getStoreData(baseSite.reg)) {
         const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
         this.singletonServ.loggedIn = true;
         if (!user.code) {       
           this.createCart(user.email,productObj,true);
         } else {
           if(user["token"]){
             this.addToCart(baseSite,user["token"],user.email,user.code,productObj);
           }else{  
             this.generateCartSubscription= this.basketServ.generateCartToken(baseSite).subscribe(
               resp => {
                  const token = resp["access_token"];
                  user.token= resp["access_token"];
                  this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user)); 
                  this.addToCart(baseSite,token,user.email,user.code,productObj);
               },err=>{
 
               });
           }
         }
       } else {
         
         if (!this.singletonServ.getStoreData(baseSite.guest)) {
           this.createCart('anonymous',productObj,false);
         } else {
           const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
           const cartId =  _guest["guid"];
           const tokenId =_guest["token"];
           if(tokenId){
             this.addToCart(baseSite,tokenId,'anonymous',cartId,productObj);
           }else{
             this.createCart('anonymous',productObj,false);
           }
       }
       }
 
 }
 createCart(email,productObj,logged){
    const baseSite = this.singletonServ.catalogVersion;
  this.generateCartSubscription= this.basketServ.generateCartToken(baseSite).subscribe(
     resp => {
       const token = resp["access_token"];
 
       this.createCartSubscription= this.basketServ.generateCartId(baseSite,resp["access_token"],email).subscribe(
         data => {
           if(logged){
             const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
             user['code']=data['code'];
             user['guid']=data["guid"];
             user['token']=token;
             this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
             this.addToCart(baseSite,token,email,user['code'],productObj);
           }else{
             const _user = {token:'',guid:''};
             _user["guid"]=data["guid"];
             _user['code']=data['code'];
             _user['token']=resp["access_token"];
             this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
             this.addToCart(baseSite,resp["access_token"],email,data["guid"],productObj);
           }
          
         },err=>{
 
         });
       },
       error => {}
     );
 }

 addToCart(baseSite,token,email,code,productObj){
   this.createCartSubscription=  this.basketServ.addToBasket(baseSite,token,email,code,productObj).subscribe((response)=>{
     this.basketServ.retrieveCartDetails(baseSite,token, email, code).subscribe(
       response => {
         this.setCartDetail(response);
       },
       error => {}
     );
   },err=>{

  });
}




onAddSample(item){
 const baseSite = this.singletonServ.catalogVersion;
 this.slides.map(obj => {
   if (item["code"] == obj.code) {
     obj["status"] = "Added";
     obj["disabled"] = true;
   } else {
     obj["status"] = "";
     obj["disabled"] = false;
   }
 });
 const _dataIndex =_.findIndex((this.slides),(obj:any)=>{
   return obj["status"] == "Added"
 });
 if(_dataIndex != -1){
   this.slides[_dataIndex];
   const _body={
     "productList":[
       {
         "productCode":this.slides[_dataIndex].code,
         "quantity":1
       }
  ]
 }
   if (this.singletonServ.getStoreData(baseSite.reg)) {
          const _user:any = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
         this.createPicketCart(_user.email,_user.token,_user.code,_body)
   } else  {
     if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guestuser:any = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.createPicketCart('anonymous',_guestuser.token,_guestuser.guid,_body);
    }
 }
 }
}
createPicketCart(email,token,code,body){
 const that=this;
 const baseSite = this.singletonServ.catalogVersion;
 this.basketServ.addPickerSample(baseSite,token,body,email,code).subscribe((response:any)=>{
   that.fetchCartInfo();
   that.dom.querySelector('body').style.overflowY="auto";
   that.display="none";
 });
}
createGFWEntry(data){
 const _obj={
   "addable" : false,
   "isGWP":true,
   "disableCounterAction":true,
   "basePrice" : {
      "currencyIso" : "GBP",
      "formattedValue" : "£39.00",
      "priceType" : "BUY",
      "value" : 39.0
   },
   "bundleNo" : 0,
   "editable" : false,
   "entryNumber" : 10,
   "isTravelPouchSelected" : false,
   "product" : {
      "amplienceImageName" : "https://media.moltonbrown.co.uk/i/moltonbrown/NHB034_uk_Fiery-Pink-Pepper-Bath-Shower-Gel-300ml_image_01",
      "amplienceImageSet" : " ",
      "availableForPickup" : false,
      "baseOptions" : [ ],
      "benefits" : "<b>Why you'll love it</b></br>Pink pepper with floral jasmine and fruity tangerine leave skin cleansed and seductively scented.</br></br><b>Best for</b></br>Pour into the bath for a pampering soak&#59 a sultry indulgence in your bathing ritual.",
      "categories" : [  ],
      "code" : data.code,
      "description" : "<em>Formerly known as Pink Pepperpod.</em></br></br>Entice your senses with sweetly-spiced notes of pink pepper and warming ginger in this bath and shower gel.</br></br>Top notes: pink pepper&#44 tangerine and elemi.</br>Heart notes: nutmeg&#44 ginger and jasmine.</br>Base notes: patchouli&#44 cedarwood and oakmoss.</br></br><em>Vegan&#44 paraben-free&#44 gluten-free and cruelty-free.</em><br><br><a href=\"/store/features/behind-the-fragrance/pink-pepperpod/\" data-ajax=\"false\" style=\"text-decoration: underline&#59\">Find out more</a> about this fragrance.</br></br>Love this? Explore the rest of the <a href=\"/store/collections/fiery-pink-pepper/catUKFPinkPepper/\" data-ajax=\"false\" style=\"text-decoration: underline&#59\">Fiery Pink Pepper Collection.</a>",
      "disablePriceFeed" : false,
      "enableBackInStock" : false,
      "explore" : "<b>London via Reunion Island</b></br>A humid dusk on the descent of Cirque de Salazie. Jewelled birds of paradise flaunt across warm air. The scent of crushed sweet spices drift over colourful rooftops. Entice curiosity with aromatic adventure.</br></br>Smouldering. Sultry. Stirring.</br></br>Fragrance family: <a href=\"/store/fragrance/woody-fragrances/catUKHCFWoody/\"data-ajax=\"false\" style=\"text-decoration: underline&#59\">WOODY</a>",
      "isDummy" : false,
      "isGiftCard" : false,
      "isGiftWrapEligible" : true,
      "isHazardous" : false,
      "isSample" : false,
      "name" : data.name,
      "originalPrice" : "£91.00",
      "position" : 145,
      "price" : {
         "currencyIso" : "GBP",
         "formattedValue" : "£39.00",
         "priceType" : "BUY",
         "value" : 39.0
      },
      "productDisplayName" :( data.productDisplayName) ? data.productDisplayName: data.name,
      "seoTitle" : "Pink Pepperpod Bath & Shower Gel",
      "size" : "300ml",
      "stock" : {
         "stockLevelStatus" : "inStock"
      },
      "titleName" : "Molton Brown&reg&#59 Fiery Pink Pepperpod Bath & Shower Gel | Shop Online",
      "url" : "/bath-body/bath-shower-gel/fiery-pepper-bath-shower-gel/p/NHB034",
      "visibleInSuperViewAll" : false
   },
   "quantity" : 1,
   "totalPrice" : {
      "currencyIso" : "GBP",
      "formattedValue" : "£39.00",
      "priceType" : "BUY",
      "value" : 39.0
   },
   "updateable" : true,
   "valid" : false
}; 
this.cart.entries.push(_obj);
this.dom.querySelector('body').style.overflowY="auto";
this.display="none";
}
onAddMultiproducts(){
 this.fetchCartInfo();
 this.dom.querySelector('body').style.overflowY="auto";
 this.display="none";
}
onPickEntry(data){  
  this.singletonServ.scrollToTarget('#headTopPromotionalText');
  this.pageModalLoad=true;   
 this.display='block';
 this.dom.querySelector('body').style.overflowY="hidden";
 this. quantityRestriction={allowedQuantity:this.cart.allowedQuantity}
 this.getSampleProducts();
 this.singletonServ.scrollToElWithinC(".orders-container","#pick-header");
}
onRemoveSample(event){
 this.slides.map(obj => {
   obj["status"] = "";
   obj["disabled"] = false;
 });
}
getSampleProducts() {
 const baseSite=this.singletonServ.catalogVersion;
 this.basketServ.getBasketSampleProducts(baseSite).subscribe((resp:any) => {
     this.slides = resp["products"];
      this.slides.map((obj,k) => {
         obj["status"] ='';
      });
   
     this.pageModalLoad=false;
   },
   error => {
     this.pageLoad=false;
});
}

onPromotionalTerms(event){
  const that=this;
  this.gwpModal=false;
  setTimeout(()=>{
    that.promotionalElement.nativeElement.innerHTML = that.localGiftData.pickagainpromotionalText.content.html;   
  },200);
}
ngOnDestroy(){

  if(this.expressChcSubscription){
    this.expressChcSubscription.unsubscribe();
  }
     if(this.subscription){
     this.subscription.unsubscribe();
     }
     if(this.updateBundleSubscription){
       this.updateBundleSubscription.unsubscribe();
     } 
     if ( this.createBundleSubscription){
     this.createBundleSubscription.unsubscribe();
     }
     if(  this.cartSubscription){
     this.cartSubscription.unsubscribe();
   }
   if(  this.generateCartSubscription){
     this.generateCartSubscription.unsubscribe();
   }
   if( this.createCartSubscription){
     this.createCartSubscription.unsubscribe();
   }
   var scriptags=document.getElementsByTagName('script');
   console.log(scriptags);
   let tagcount:number=scriptags.length;
   for(let tags in scriptags){
     let noOftags=Number(tags);
     if(noOftags < tagcount){
       let mmcheckout=scriptags[tags]['src'].split("?");
       if(mmcheckout[1]=="situation=checkout"){
         scriptags[tags].remove();
       }
   
     }
    }
    console.log(scriptags);
}
onDismissPromotionalModal(event){
  this.gwpModal=true;
}

getCartCount(cart) {
  let sum = 0;
  if (cart) {
    if (cart.totalItems != 0) {
      for (let i = 0; i < cart["entries"].length; i++) {
        if(cart["entries"][i]['pickAgain']){
        if (cart["entries"][i]["product"]["isSample"]) {
          sum += cart["entries"][i]["quantity"];
         }
       }else{
        if (!cart["entries"][i]["product"]["isSample"]) {
          sum += cart["entries"][i]["quantity"];
         }
       }
      }
    }
  }
  return sum;
}
}
