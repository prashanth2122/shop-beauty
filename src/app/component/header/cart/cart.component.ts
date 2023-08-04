import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChange,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnDestroy
} from "@angular/core";
import { HeaderComponentService } from "../header.service";
import { SingletonService } from "../../../services/singleton.service";
import { BasketPageComponentService } from "../../../checkoutpage/basketpage/basketpage.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import * as moment from 'moment';
import * as _ from "lodash";
//  import {TranslatServicePipeModule} from '../../../pipe/transalte.module';
import { TranslateServiceSubService } from "../../../pipe/translate-service-sub.service";
import { GtmMethodService } from '../../../services/gtmmethods.service';
declare var $: any;
declare var window: any;
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent  implements OnInit, AfterViewInit,OnChanges,OnDestroy {
  @HostListener('document:click')
  onDiscardCart() {
    this.showCartBlock=false;
  }
  @Output() onDiscardSubscription: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("scrollContainer") scrollCartContainer: ElementRef;
  @ViewChild("storeCartCount") cartCountElement: ElementRef;
  @Input() renderCart:boolean;
  @Input() message:any;
  cartMessage:any;
  subscription: Subscription;
  cart: any;
  totalAmount: number;
  cartStatus: boolean;
  showCartBlock: boolean;
  picknmix6:string;
  picknmix3:string;
  toggleCartBox: boolean;
  productCode:string;
  refreshBasket:boolean;
  animate:boolean;
  basketEmptyContent:string;
  isocode:any;
  constructor(
    public headerServ: HeaderComponentService,
    public singletonServ: SingletonService,
    public location: Location,
    public gtmServ: GtmMethodService,
    public router: Router,
    public basketServ: BasketPageComponentService,
    private translate: TranslateServiceSubService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.cart=this.singletonServ.cartObj;
  }
  onViewBasket() {
    this.toggleCartBox = false;
    this.router.navigate(["store", "mbcart","mbBasket"]);
  }
 
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that=this;
    if (changes["message"]) {
      if (changes["message"]["currentValue"] != undefined) {
        that.cartMessage = changes["message"]["currentValue"];
      }
    }
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) { 
      if (baseSite.lngCode == "de"){
        this.basketEmptyContent="Der Warenkorb ist leer";
      } else if(baseSite.lngCode == "eu"){
        this.basketEmptyContent="Basket is empty";
      }else if(baseSite.lngCode == "us"){
        this.basketEmptyContent="Cart is empty";
      }else if(baseSite.lngCode == "en"){
        this.basketEmptyContent="Basket is empty";
      }
      const lngCode = baseSite.lngCode;
      this.isocode=lngCode;
      this.setLang(lngCode);
    }
  }
  getRouterPath(data){
  if(!data.isBundle){
    if (data.product.url.indexOf("/c/") != -1) {
      if (data.category) {
        let _constructUrl = data.product.category.url.slice(1).split("/");
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

  ngAfterViewInit() { 
    this.singletonServ.getMessage().subscribe(message => {
      if (message.refreshCartDetail) {
        this.retrieveCartDetails();
      }
    });
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  /* get user history cart to show previous cart */
  fetchRelavantBasket(token,email) {
    const baseSite = this.singletonServ.catalogVersion;
    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this.headerServ
      .getCurrentUserRelevantCart(baseSite,token,email)
      .subscribe(
        resp => {
          if (resp["carts"]) {
            if (resp["carts"][0]) {
              const code = resp["carts"][0]["code"];
              user["code"] = code;
              this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));  
              this.fetchBasket(token,email,resp["carts"][0]["code"]);
            }
          }
        },
        error => {}
      );
  }

  retrieveCartDetails() {
     const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if(user.token){
          if (user.code) {
            this.fetchBasket(user.token,user.email,user.code);
          } else {
            this.cart=undefined;
            this.singletonServ.cartObj=undefined;
          }
      }else{
        this.headerServ.generateCartToken(baseSite).subscribe(
          resp => {
             user.token= resp["access_token"];
             this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user)); 
             if (user.code) {
              this.fetchBasket(user.token,user.email,user.code);
            } else {
              this.cart=undefined;
              this.singletonServ.cartObj=undefined;
            }
          },err=>{

          });
      }
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
         if(user.token){
           this.fetchBasket(user.token,'anonymous',user.guid);
         }
       }else{
         this.cart=undefined;
         this.singletonServ.cartObj=undefined;
      }
    }
  }
fetchBasket(token,email,code){
  const _reg=(email!='anonymous')?true:false;
  const baseSite=this.singletonServ.catalogVersion;
      this.subscription= this.headerServ.retrieveCartDetails(baseSite,token,email,code).subscribe((response)=>{
          this.getCartDetail(response);
         },err=>{
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.headerServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                      if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.fetchBasket(resp["access_token"],email,code);
                      }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.fetchBasket(resp["access_token"],email,code);
                      }          
                    });
                }
              }
              }
             }
         });
}
IfZero(num) {
  return ((num <= 9) ? ("0" + num) : num);
}

  /*Remove Bundle */
  onSpliceBundleItem(event, entry, k, i) {
    const bundleNo = entry["products"][0]["bundleNo"];
    const baseSite = this.singletonServ.catalogVersion;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.removeBundle(_user.token, _user.email, _user.code, bundleNo);
        } else {
          if (this.singletonServ.getStoreData(baseSite.guest)) {
            const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            this.removeBundle(_user.token, "anonymous", _user.guid, bundleNo);
          }
        }
  }
  removeBundle(token, email, code, bundleNo) {
    const baseSite=this.singletonServ.catalogVersion;
    this.headerServ.removeBundle(baseSite,token, email, code, bundleNo).subscribe(
      response => {
        this.showCartBlock=false;
        this.fetchBasket(token,email,code);
      },
      err => {
        this.fetchBasket(token,email,code);
      }
    );
  }

  /* Remove Entry from cart */
  onSpliceItem(event, data,k) {
    event.stopPropagation();
    const baseSite = this.singletonServ.catalogVersion;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          let user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if(data.isBundle){
            this.removeBundle(            
            user.token,
            user.email,
            user.code,
            data.bundleNo
            )
          }else{    
            this.removeCartEntry(
            user.token,
            user.email,
            user.code,
            data.entryNumber
          );
         }
        } else {
          if (this.singletonServ.getStoreData(baseSite.guest)) {
            const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            if(data.isBundle){
              this.removeBundle(            
                user.token,
                "anonymous",
                user.guid,
                data.bundleNo
                )
            }else{  
              this.removeCartEntry(
              user.token,
              "anonymous",
              user.guid,
              data.entryNumber
            );
            }
          }
        }
        this.setGtmOnRemoveProduct(data)
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
    
  setGtmOnRemoveProduct(data){
    const pageUrlCat = this.pageUrl1(data);
    const pageUrlMainCat= pageUrlCat[1].split('-').join('');
    const pageUrlSubCat= pageUrlCat[2].split('-').join('');

    let cartDetails:any={};
    if(data.product.length){
      cartDetails= {
        products:[],
        'categoryList': pageUrlMainCat+ '-'+ pageUrlSubCat,       
        currencyCode:data.product[0].product.price.currencyIso
      }
      cartDetails.currencyCode = data.product[0].product.price.currencyIso

      for(let i=0;i<data.product.length;i++){
        cartDetails.products.push({
          'productName': data.product[i].product.productDisplayName,      
      'productID': data.product[i].product.code,
      'productPrice': '',
      'productBrand': "Molton Brown",
      'productCategory': pageUrlSubCat,
      'productVariant': (data.product[i].productVariant)? data.product[i].productVariant : "", 
      'productQuantity':data.product[i].quantity,
      'size': (data.product[i].product.size)?data.product[i].product.size:'',
      'reviewRating': (data.product[i].productAverageRating)?data.product[i].productAverageRating:'',
      'reviewsCount': (data.product[i].reviewCount)?data.product[i].reviewCount:'',
      'saleStatus': (data.product[i].originalPrice)?'True':'False',
      'stockLevel': (data.stock.stockLevelStatus == "inStock")?"True":"False",   
      'productStockLevelNumber':(data.stock.stockLevel)?data.stock.stockLevel:'', 
       'deleveryType':(data.product.productEdition)?data.product.productEdition:'',
        'salePrice':(data.product[i].originalPrice)?data.product[i].price.value:''})
        if(data.product[i].product.originalPrice){
          const originalPrice= data.product[i].product.originalPrice;
          const _originalPrice = originalPrice.match(/[\d\.]+/);
          if(_originalPrice){
            cartDetails.products[i]['productPrice']=_originalPrice[0];
          }else{
            cartDetails.products[i]['productPrice']=originalPrice;
          }
          }else if(data.product[i].product.price){
            cartDetails.products[i]['productPrice']=data.product[i].product.price.value;
          }else {
            cartDetails.products[i]['productPrice']=data.bundlePrice;
            cartDetails['bundlePrice']=data.bundlePrice;
          }
      }

    }else{
      cartDetails = {
        'currencyCode': data.product.price.currencyIso,
      'categoryList': pageUrlMainCat+ '-'+ pageUrlSubCat, 
        'products':[{      
            'productName': data.product.productDisplayName,      
        'productID': data.product.code,
        'productPrice': '',
        'productBrand': "Molton Brown",
      'productCategory': pageUrlSubCat,
        'productVariant': (data.product.productVariant)? data.product.productVariant : "", 
      'productQuantity':data.quantity,
        'size':(data.product.size)?data.product.size:'',
        'reviewRating': (data.product.productAverageRating)?data.product.productAverageRating:'0',
        'reviewsCount': (data.product.reviewCount)?data.product.reviewCount:'0',
        'saleStatus': (data.product.originalPrice)?'True':'False',
        'stockLevel': (data.product.stock.stockLevelStatus == "inStock")?"True":"False",   
        'productStockLevelNumber':(data.stock.stockLevel)?data.stock.stockLevel:'',  
         'deleveryType':(data.product.productEdition)?data.product.productEdition:'',
          'salePrice':(data.product.originalPrice)?data.product.price.value:''
         }]}
         if(data.product.originalPrice){
          const originalPrice= data.product.originalPrice;
          const _originalPrice = originalPrice.match(/[\d\.]+/);
      if(_originalPrice){
        cartDetails.products[0]['productPrice']=_originalPrice[0];
      }else{
        cartDetails.products[0]['productPrice']=originalPrice;
      }
      }else if(data.product.price){
        cartDetails.products[0]['productPrice']=data.product.price.value;
      }else {
        cartDetails.products[0]['productPrice']=data.bundlePrice;
      }
    }
        
this.gtmServ.gtmRemoveFromCart(cartDetails);
// end gtm remove product to cart
  }
  removeCartEntry(token, email, code, entry) {
    const baseSite=this.singletonServ.catalogVersion;
    this.basketServ.removeEntry(baseSite,token, email, code, entry).subscribe(
      resp => {
        this.showCartBlock=false;
        this.fetchBasket(token,email,code); 
      },
      err => {
        this.fetchBasket(token,email,code);
      }
    );
  }

  onShowProduct(event, searchItem) {
    event.stopPropagation();
    this.toggleCartBox = false;
    const url = "/store" + searchItem.product.url.replace("/p/", "/");
    if(event.ctrlKey && event.which === 1){
      window.open(url); 
   } else {
     this.router.navigate([url]);
   }
  }

  onHoverCartIcon(event) {
    event.stopPropagation();
    this.toggleCartBox = true;
  }
  onleaveCart(event) {
    event.stopPropagation();
    this.toggleCartBox = false;
    this.showCartBlock = false;
  }

  /*cart data construction */

  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  getCartDetail(data){
    const that=this;
    const baseSite=this.singletonServ.catalogVersion;
    this.singletonServ.sendMessage({updateBasketEntry:true,cartObj:data});
    const cart=this.singletonServ.setupEntryStream(data);
    const _copyCart=this.nestedCopy(data);
    this.animate=true;
    this.cart=cart;
    this.singletonServ.cartObj=cart;
    if(this.cartMessage){
          if(this.cartMessage.showCartPopUp){
            if(this.cartMessage.code){
              const _target ='#richCart'+this.cartMessage.code;
              this.showCartBlock=true;
              that.waitForEl(_target, 5);
          }
         }
     } else {
      this.singletonServ.sendMessage({retreiveSamples:true,cartObj:_copyCart});
    }
    if(this.refreshBasket){    
      this.singletonServ.sendMessage({retreiveSamples:true,cartObj:_copyCart});
      this.refreshBasket=false;
    }
    this.onDiscardSubscription.emit();

    if(!this.singletonServ.sessionStarts){
    

      if(this.singletonServ.getStoreData(baseSite.reg)){
        const _regUser:any = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
            const _timeout = new Date();
            _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime);            
            this.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
            this.singletonServ.sessionStarts=true;

        //  if(_regUser.alarmTime){
        //     this.singletonServ.alarmTime =_regUser.alarmTime;
        //     this.singletonServ.sessionStarts=true;
        //  }else{
        //     const _timeout = new Date();
        //     _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime);            
        //     this.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
        //     this.singletonServ.sessionStarts=true;
        //     _regUser.alarmTime=this.singletonServ.alarmTime;
        //     this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_regUser));
        // }
      }else if(this.singletonServ.getStoreData(baseSite.guest)){
        const _guestUser:any = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        const _timeout = new Date();
        _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime);            
        this.singletonServ.alarmTime =moment.utc( _timeout ).valueOf();
        this.singletonServ.sessionStarts=true;
        
        // if(_guestUser.alarmTime){
        //   this.singletonServ.alarmTime = _guestUser.alarmTime;
        //   this.singletonServ.sessionStarts=true;
        // }else{
        //   const _timeout = new Date();
        //   _timeout.setMinutes(_timeout.getMinutes() + this.singletonServ.sessionTime); 
        //   const _timer=moment.utc( _timeout ).valueOf();           
        //   this.singletonServ.alarmTime = _timer;
        //    this.singletonServ.sessionStarts=true;
        //   _guestUser.alarmTime=this.singletonServ.alarmTime;
        //   this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guestUser));
        // }
      }

    }
 }
 waitForEl(selector, count) {
   const that=this;
  if ($(selector).length) {
      this.showCartPopUp();
  } else {
    setTimeout(function() {
      if(!count) {
        count=0;
      }
      count++;
      if(count<10) {
        that.waitForEl(selector,count);
      } else {return;}
    }, 100);
  }
}
 showCartPopUp(){ 
    const _target ='#richCart'+this.cartMessage.code;
    const elemnt = $(_target);
    if(elemnt){
      if(elemnt.offset()){
       this.singletonServ.scrollToElWithinC('.cart-list-container',elemnt)
      }
    }
    setTimeout(()=>{
      this.showCartBlock=false;
    },3000);
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
  getBundleContent(text){
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
  getTotalPrice(entry){
    if(entry.product.price){
    if (entry.product.price.value != 0){
      if(entry.product.originalPrice){
        return `<span class="ds-price">${entry.product.price.formattedValue}</span>`
      }
      return entry.product.price.formattedValue;
    }else{
       return 'FREE'
    }
  }
  }
  getBundlePrice(data){
    const _bundlePrice= data.product.filter((obj)=>{
      return obj.product.isSample
    });
    if(_bundlePrice.length !=0){
      return _bundlePrice[0]['basePrice']['formattedValue'];
    }
  }

ngOnDestroy(){
  if(this.subscription){
   this.subscription .unsubscribe();
  }
}
getCartCount() {
  let sum = 0;
  this.totalAmount = 0;
  if (this.cart) {
    if (this.cart.totalItems != 0) {
      for (let i = 0; i < this.cart["entries"].length; i++) {
        if(this.cart["entries"][i]['pickAgain']){
        if (this.cart["entries"][i]["product"]["isSample"]) {
          sum += this.cart["entries"][i]["quantity"];
         }
       }else{
        if (!this.cart["entries"][i]["product"]["isSample"]) {
          sum += this.cart["entries"][i]["quantity"];
         }
       }
      }
    }
  }
  return sum;
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
enableEntryBlock(cart:any){
    if(cart.entries.length !=0){
          const _pickAgain= _.filter(cart.entries,(entry)=>{
            if(!entry['product'].length){
                 if(!entry.pickAgain){
                     if(entry['product'].isSample){
                       return entry;
                     }
                }
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
}
