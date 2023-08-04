import { Component, OnInit,   NgZone,ViewEncapsulation, OnDestroy,HostListener } from "@angular/core";
import { SingletonService } from "../../services/singleton.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationComponentService } from "./order-confirmation.service";
import * as _ from "lodash";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { GuestForm } from "../../forms/guestForm.form";
import { DeviceDetectorService } from "ngx-device-detector";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { PlatformLocation } from '@angular/common';
import { GtmMethodService } from '../../services/gtmmethods.service';
import * as moment from 'moment';
declare var window:any;
@Component({
  selector: "app-order-confirmation",
  templateUrl: "./order-confirmation.component.html",
  styleUrls: ["./order-confirmation.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    const queryStatus = this.route.snapshot.queryParamMap.get("PayerID");
    if (queryStatus) {      
      window.location.href='/store/index';
    }
  }
  guestUser: boolean;
  guestEmail: string;
  orderDetails: Array<any>;
  order: any;
  guest: any;
  countryName:any;
  cardTypede:any;
  allcookies:any;
  deviceInfo: any;
  mobileDevice: boolean;
  desktopDevice: boolean;
  deSiteSpecific: boolean;
  customerCenter: string;
  guestForm: FormGroup;
  duplicateUser: boolean;
  display: boolean = false;
  usSpecific: boolean;
  favourites:any;
  userCreation:boolean;
  accountCreation:boolean;
  savePayType:boolean;
  gtmPurchaseTrigger:boolean;
  paymentInfo:any;
  bvOrderid:any;
  picknmix6:string;
  picknmix3:string
  bvUseremail:any;
  inreviewcard:boolean;
  isocode:string;
  countrySite:string;
  constructor(
    public singletonServ: SingletonService,
    public router: Router,
    public cookieService: CookieService,
    public titleService: Title,
    public orderServ: ConfirmationComponentService,
    public route: ActivatedRoute,
    public deviceService: DeviceDetectorService,
    private translate: TranslateServiceSubService,
    public _guest: GuestForm,
    private fb: FormBuilder,
    public zone:NgZone,
    public location: PlatformLocation,
    public gtmServe: GtmMethodService
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.singletonServ.cartObj=undefined;
    this.guestUser=false;
    this.guestForm = this.fb.group(_guest.orderRegisterForm());
    this.countrySite=(baseSite.isoCode=="GB")?"Molton Brown UK":"Molton Brown "+baseSite.isoCode;
    this.userCreation=true;
  //   location.onPopState(() => {
  //     const queryStatus = this.route.snapshot.queryParamMap.get("PayerID");
  //     if (queryStatus) {
  //       window.location.href='/store/index';
  //     }
  // });
  }
  setLang(lang: string) {
    this.isocode=lang;
    this.translate.use(lang);
  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.giftcardForm){
      this.singletonServ.giftcardForm.reset();
    }
    if(this.singletonServ.giftBoxWithMessageForm){
      this.singletonServ.giftBoxWithMessageForm.reset();
    }
    if(this.singletonServ.giftWithcardForm){
      this.singletonServ.giftWithcardForm.reset();
    }
    this.allcookies = this.cookieService.getAll();
    // if(this.allcookies['Purchase']){
    //   this.gtmPurchaseTrigger=false;
    // }
    // else{
    //   this.gtmPurchaseTrigger=true;
    // }
    // this.cookieService.set( 'Purchase', 'OrderPlaced');
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const queryStatus = this.route.snapshot.queryParamMap.get("productId");
      if(queryStatus){
          this.addedTofav(queryStatus);
      }else{
        this.getFavourites();
      }   
    }else{
     this.setupOCDtls();
    }
    if(this.singletonServ.getStoreData('accCreationDtl')){
      const user = JSON.parse(this.singletonServ.getStoreData("accCreationDtl"));
      this.guestEmail=user.email;
      this.userCreation=false;
    }
    
  }
  ngAfterViewInit() {
    const baseSite = this.singletonServ.catalogVersion;
     if(baseSite.isoCode=="DE"){
    this.titleService.setTitle('Checkout Bestellüberprüfung - Molton Brown');
    }
    else{
      this.titleService.setTitle('Checkout Order Review - Molton Brown');
    }
    }
  addedTofav(id){
    const baseSite = this.singletonServ.catalogVersion;
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this.orderServ.generateCartToken(baseSite).subscribe((response)=>{
      const token = response["access_token"];
      user['token']=token;
      this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
      this.orderServ
        .addToFavourite(baseSite,token, user.email, id)
        .subscribe(
          resp => {
            this.getFavourites();
          },
          error => {
            if(error.message=="Product is already added"){
              this.getFavourites();
            }else{
              this.getFavourites();
            }
          }
        );      
    },err=>{

    });
  }
  onShowProductDtls(event,product){
    event.preventDefault();
    if (product.url.indexOf("/c/") != -1) {
      const _url = "/store" + product.url.replace("/c/", "/");
      if(event.ctrlKey && event.which === 1){
        window.open(_url); 
     } else {
       this.router.navigate([_url]);
     }
    } else {
      const _url = "/store" + product.url.replace("/p/", "/");
      if(event.ctrlKey && event.which === 1){
        window.open(_url); 
     } else {
       this.router.navigate([_url]);
     }
    }


  }
  setupOCDtls(){
    const baseSite = this.singletonServ.catalogVersion;
    this.getDeviceInfo();
    if (baseSite) {
      if (baseSite.isoCode == "DE") {
        this.deSiteSpecific = true;
      } else {
        this.deSiteSpecific = false;
      }
      this.communicationDtl();
      this.setLang(baseSite.lngCode);
    }
    if (baseSite.isoCode == "US") {
      this.usSpecific = true;
    }   
    // const _guestcookie = this.singletonServ.getCookie(baseSite.guest);
    // const _usercookie = this.singletonServ.getCookie("user");
    const queryStatus = this.route.snapshot.queryParamMap.get("PayerID");
     if (queryStatus) {
      this.retireivePaypalDtl(queryStatus);
     }
    if (this.singletonServ.getStoreData("order")) {
     this.setOrderDtl();
    }
  }
  communicationDtl(){
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "GB") {
      this.customerCenter = "+44 (0) 808 178 1188";
    } else if (baseSite.isoCode == "DE") {
      this.customerCenter = "customer@moltonbrown.com";
    } else if (baseSite.isoCode == "EU") {
      this.customerCenter = "00 800 4585 00 76";
    } else if (baseSite.isoCode == "US") {
      this.customerCenter = "1-866-933-2344";
    }
  }
  retireivePaypalDtl(queryStatus){
    const baseSite = this.singletonServ.catalogVersion; 
    this.orderServ.generateCartToken(baseSite).subscribe(
      response => {
        this.display = true;
        const token = response["access_token"];
        if (this.singletonServ.getStoreData("paypalReg")) {
          this.guestUser = false;
          const user = JSON.parse(this.singletonServ.getStoreData("paypalReg"));
          const email = user.email;
          const code = user.code;
          this.getOrderCode(token, email, code, queryStatus, user);
        } else {
          if (this.singletonServ.getStoreData("paypalGuest")) {
            this.guestUser = true;
            const user = JSON.parse(this.singletonServ.getStoreData("paypalGuest"));
            const guid = user.guid;
            this.getOrderCode(token, "anonymous", guid, queryStatus, user);
          }
        }
      },
      err => { }
    );
    this.updateSessionDetail();
  }
  setOrderDtl(){
    const _order = JSON.parse(this.singletonServ.getStoreData("order"));
    if (_order.reg) {
      this.guestUser = false;
      this.getOrderDetail(_order.token, _order.code, _order.user.uid);
    } else {
      this.guest = _order;
      this.guestUser = true;
      this.getGuestOrderDetail(_order.token, _order);
    }
    this.updateSessionDetail();
  }
  updateSessionDetail(){
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      let user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if (user.guid) {
        delete user.guid;
      }
      if (user.code) {
        delete user.code;
      }
      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
      this.singletonServ.removeItem(baseSite.guest);
    } else {
      this.singletonServ.removeItem(baseSite.guest);
    }
  }
  getBundleProductQuantity(entry, bottle) {
    return bottle.quantity / entry.quantity;
  }
  getOrderCode(token, email, code, payerId, user) {
     const baseSite = this.singletonServ.catalogVersion;
     this.orderServ.getSystemIp().subscribe((resp:any)=>{
    this.orderServ.getOrderCode(baseSite,token, email, code, payerId,resp.ip).subscribe(
      response => {
        this.getCartDetail(response);
        this.display = false;
        if (this.guestUser) {
          this.guestEmail = response["user"]["uid"].split("|")[1];
        }
      },
      err => {
        this.display = false;
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.orderServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                        const _reg=(email!='anonymous')?true:false;
                        if(_reg){
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                          this.getOrderCode(resp["access_token"], email, code, payerId, user) ;
                        }else{
                          const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                          user.token= resp["access_token"];
                          this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                          this.getOrderCode(resp["access_token"], email, code, payerId, user) ;
                        }
                      });
              }
            }
            }
           }
      }
    );
  },err=>{
      
  });
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
    if (isDesktopDevice) {
      this.desktopDevice = true;
    } else {
      this.desktopDevice = false;
    }
  }
  getGuestOrderDetail(tokenId, order) {
    const baseSite = this.singletonServ.catalogVersion;
    this.orderServ
      .getOrderData(baseSite, tokenId, order["code"])
      .subscribe((resp:any) => {
        const _payment=resp.paymentInfo;
        if(_payment){
          this.savePayType=(_payment.cardType.code !="mbGiftCard"||_payment.cardType.code !="sepa"||_payment.cardType.code !="klarna" ||_payment.cardType.code !="ppal")?true:false;
        if(this.savePayType){
          _payment['emmbededNumber']=order['emmbededNumber'];
          this.paymentInfo=_payment;
        }
        }     
        this.getCartDetail(resp);
        this.guestEmail = resp["user"]["uid"].split("|")[1];
      },err=>{
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.orderServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                      this.getGuestOrderDetail(resp["access_token"], order);
                      });
              }
            }
            }
           }
      });
  }
  getOrderDetail(tokenId, order, emailId) {
    const baseSite = this.singletonServ.catalogVersion;
    this.orderServ.orderService(baseSite,tokenId, order, emailId).subscribe(
      resp => {
        this.getCartDetail(resp);
      },
      err => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.orderServ.generateCartToken(baseSite).subscribe(
                  (resp:any) => {
                    this. getOrderDetail(resp["access_token"], order, emailId)
                      });
              }
            }
            }
           }
       }
    );
  }
  onNavigateHome(event) {
    event.preventDefault();
    if(event.ctrlKey && event.which === 1){
        let url = "/store/index";
        window.open(url); 
    }else{
      // this.router.navigate(["store", "index"]);
      window.location.href="store/index";
    }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  getCartDetail(data) {
    const baseSite = this.singletonServ.catalogVersion;
    this.countryName = data.deliveryAddress.country.name;
    this.cardTypede = data.paymentInfo.cardType.name
    const that=this;
    if(data){
        const cart=this.singletonServ.setupEntryStream(data);
        cart.entries.map((obj)=>{
          if(!obj.isBundle){
              const _fav = _.find(this.favourites, function(o) {
                  return o.code == obj.product.code;
                });
                if(_fav){
                  obj.product['favourite'] =true
                }
          }
        });
        if (baseSite.isoCode != "DE") {
          if(cart.productTaxDE){
            delete cart.productTaxDE; 
          }
       }
        this.order = cart;
        const _cartObj=JSON.parse(JSON.stringify(cart));
        if(_cartObj.isInReview==true){
          this.inreviewcard=true;
        }
        else{
          this.inreviewcard=false;
        }
        const _entry=[];
        _cartObj.entries.map((entry)=>{            
             const   _catName=entry.product.url.replace("/p/", "/").slice(1).split('/');
             const _category=   _.find(entry.product.categories,(obj)=>{
              const _catUrl=   obj.url.replace("/c/", "/").slice(1).split('/');
               return _catName[1]==_catUrl[1];
             });
              const  obj ={
                "price" : (entry.isBundle)?that.getBundlePrice(entry):that.getProdPriceValue(entry),
                "quantity" : entry.quantity ,
                "productId" : entry.product.code,
                "name":entry.product.productDisplayName
              } 
              if(_category){
                obj['category']=_category.code;
              }
              if(entry.product.isSample){
                obj['price']=entry.product.price.value;
                obj['category']="sample";
              }
              _entry.push(obj);             
        });
        _.uniq(_entry);
        
        console.log(this.allcookies);
        this.vPixelOrderConfirmation(_cartObj ,_entry);
        const _baseSite = this.singletonServ;
        const pageType = 'Order Confirmation Page';
        this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
        this.gtmServe.gtmMentionMe(cart);
        this.gtmServe.gtmPurchase(cart);
        

   } else{

   }
  }

  getBundleQuantity(entry) {
    let p = 0;
    let i;
    for (i = 0; i < entry.product.length; i++) {
      if (!entry.product[i]["product"]["isSample"]) {
        let qty = entry.product[i].quantity;
        p = p + qty;
      }
    }

    if (entry.bundleTemplateId) {
      if (entry.bundleTemplateId.indexOf("6") != -1) {
        p = p / 6;
      } else {
        p = p / 3;
      }
    }
    return p;
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
  
  // getProdPrice(entry) {
  //   if (entry.product.price.value != 0) {
  //     return entry.product.price.formattedValue;
  //   } else {
  //     return "FREE";
  //   }
  // }
  getProdPriceValue(entry){
    if(!entry.giveAway){
      if (entry.product.price){
        if (entry.product.price.value != 0) {
            if(entry.product.originalPrice){
              return `<span class="price-format-discount">
              <del class="price-format-discount-retail-price" >${entry.product.originalPrice}</del> &nbsp;
              <span class="ds-price">${entry.product.price.value}</span>
          </span>`
            }
          return entry.product.price.value;
        } else {
          return "FREE";
        }
    }
  }else{
    return "FREE"; 
  }
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
          return "FREE";
        }
    }
  }else{
    return "FREE"; 
  }
}
getTotalPrice(entry) {
  if(!entry.giveAway){
      if (entry.totalPrice.value != 0) {
         return entry.totalPrice.formattedValue;
      } else {
         return "FREE";
      }
      }else {
         return "FREE";
      }
}

  // getTotalPrice(entry) {
  //   if (entry.totalPrice.value != 0) {
  //     return entry.totalPrice.formattedValue;
  //   } else {
  //     return "FREE";
  //   }
  // }
  getProductPrice(entry) {
    if (entry.product.price.value != 0) {
      return entry.product.price.formattedValue;
    } else {
      return "FREE";
    }
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
      return  this.picknmix6;
    } else   if (text.bundleTemplateId.indexOf("3") != -1) {
      return  this.picknmix3;
    } else {
      return "Fragrance Finder Samples";
    }
    return  this.picknmix3;
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
  onSubmitForm(event) {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if (this.guestForm.valid) {
      const _form = this.guestForm.value;
      const body = this.order.deliveryAddress;
      const _userBody = {
        uid: that.retreiveUser(this.order.user.uid),
        password: _form.password,
        titleCode: body.titleCode ? body.titleCode : "mr",
        firstName: body.firstName ? body.firstName : "not yet complete",
        lastName: body.lastName ? body.lastName : "not yet complete"
      };
      if(_form.saveCard){
        if(this.paymentInfo){    
          const _encryptCCNumber=this.paymentInfo.cardNumber;
          const _cardNumber =this.paymentInfo['emmbededNumber']+_encryptCCNumber.slice(_encryptCCNumber.length-4)
          _userBody['ccaccountNumber']=this.paymentInfo['emmbededNumber'];
          _userBody["expiryMonth"]= this.paymentInfo.expiryMonth;
          _userBody["expiryYear"] = this.paymentInfo.expiryYear;
          _userBody["cardType"] = this.paymentInfo.cardType.code;
        }
      }
      this.orderServ.generateCartToken(baseSite).subscribe(
        token => {
          const tokenId = token["access_token"];
          this.orderServ.createUser(baseSite,tokenId, _userBody,this.order.code).subscribe(
            user => {
              const _user:any = { email: _userBody.uid, token: tokenId };
              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
              this.singletonServ.setStoreData('accCreationDtl',JSON.stringify({email: that.guestEmail}))
              this.orderServ
                .createUserAddress(baseSite,body, tokenId, that.guestEmail)
                .subscribe(
                  address => {
                     that.guest =undefined;
                     that.userCreation=false;
                     that.accountCreation=true;
                     that.guestUser = false;
                    const queryStatus = this.route.snapshot.queryParamMap.get("PayerID");
                    if (queryStatus) {
                      let user = JSON.parse(this.singletonServ.getStoreData("paypalGuest"));
                      let email = user.email;
                      let code = user.code;
                      this.getOrderCode(token, email, code, queryStatus, user);
                    }else{
                      if(that.singletonServ.getStoreData("order")){
                         const _order = JSON.parse(this.singletonServ.getStoreData("order"));
                         _order.reg=true;
                         that.singletonServ.setStoreData('order',JSON.stringify(_order));
                         that.getOrderDetail(_order.token, _order.code, this.guestEmail );
                    }
                    }
                  },
                  err => {
                    this.userCreation=false;
                    const queryStatus = this.route.snapshot.queryParamMap.get("PayerID");
                    if (queryStatus) {
                      let user = JSON.parse(this.singletonServ.getStoreData("paypalGuest"));
                      let email = user.email;
                      let code = user.code;
                      this.getOrderCode(token, email, code, queryStatus, user);
                    }else{
                      if(this.singletonServ.getStoreData("order")){
                         const _order = JSON.parse(this.singletonServ.getStoreData("order"));
                         this.getOrderDetail(_order.token, _order.code, this.guestEmail );
                      }
                    }
                  }
                );
            },
            err => {
              if (err.error["errors"][0]["type"] == "DuplicateUidError") {
                this.duplicateUser = true;
              }
            }
          );
        },
        err => { }
      );
    } else {
      this.validateAllFormFields(this.guestForm);
    }
  }
  onShowProfilePage(event){
    event.preventDefault();
    this.singletonServ.removeItem('accCreationDtl');
    if(event.ctrlKey && event.which === 1){
      let url = "/store/myaccount/profile";
      window.open(url); 
   }else{
     this.router.navigate(["store", "myaccount", "profile"]);
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

  onCloseModal() {
    this.display = false;
  }
  addToFavourite(event, data) {
    event.preventDefault();
    if(event.ctrlKey && event.which === 1){
      const _route =`/checkout/mbOrderConfirmResponse?productId=${data.product.code}&addedToFavourites=true`;
     window.open(_route);
    }else{
      this.setFavourite(data);
    }
  }
  setFavourite(data){
    const baseSite = this.singletonServ.catalogVersion;
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    if(!data.product.favourite){
      this.orderServ.generateCartToken(baseSite).subscribe((gToken)=>{
        user['token']=gToken["access_token"];
        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
          this.orderServ
        .addToFavourite(baseSite,gToken["access_token"], user.email, data.product.code)
        .subscribe(
          resp => {
            let cart =this.order;
            cart.entries.map((obj)=>{
              if(!obj.isBundle){
                    if(data.product.code==obj.product.code){
                     obj.product['favourite'] =true
                   }
             }
           });
           this.order = cart;
          },
          err => {
          }
        );
      },err=>{

      });
      }
  }
  getFavourites() {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      let user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.orderServ
        .getFavourites(baseSite,user.token, user.email)
        .subscribe(
          response => {
            this.singletonServ.favourites = response["products"];
            this.favourites=response["products"];
            this.setupOCDtls();
          },
          error => {
            this.favourites=[];
            this.setupOCDtls();
          }
        );
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
gotoMyAccount(event) {
  event.preventDefault();
  if(event.ctrlKey && event.which === 1){
   window.open('/store/myaccount/profile');
   }else {
    this.router.navigate(["store", "myaccount","profile"]);
  }

}
onRouteFavourite(event){
  event.preventDefault();
  if(event.ctrlKey && event.which === 1){
    window.open('/store/myaccount/profile/myFavorites');
    }else {
     this.router.navigate(["store", "myaccount","profile","myFavorites"]);
   }
}
goToResetPassword(event){
  event.preventDefault();
  if(event.ctrlKey && event.which === 1){
    let url = "/store/myaccount/profile/passwordReset";
    window.open(url); 
 }else{
  this.router.navigate(["store", "myaccount", "profile","passwordReset"]);
 }
}
retreiveUser(uid){
  const _user=uid.split('|');
   const _email =_user[_user.length-1];
   return _email;
}
vPixelOrderConfirmation(orderDetails ,items){
  if(orderDetails.isGiftBox){
    const _obj= {
      "name" : "Giftbox -Whole Order Gift Box",
      "price": "0.00",
      "quantity" : "1",
      "productId" : "GIFTWAP",
      "category" : true        
  }
    items.push(_obj);
  }
  const _bvData={
    currency : orderDetails.totalPriceWithTax.currencyIso,
    orderId : orderDetails.code,
    total : orderDetails.subTotal.value,
    tax:orderDetails.totalTax.value,
    items :items,
    shipping:orderDetails.deliveryCost.value,
    state:orderDetails.deliveryAddress.district
  }
if(orderDetails.deliveryAddress.country.isocode){
  _bvData["country"]=orderDetails.deliveryAddress.country.isocode;
}
  if(orderDetails.totalTax&&this.usSpecific){
    _bvData["shipping"]=orderDetails.deliveryCost.value;
  }
    window.bvCallback = function (BV) {
        BV.pixel.trackTransaction(_bvData);
      };
      this.bvOrderid =orderDetails.code;
      this.bvUseremail=this.retreiveUser(this.order.user.uid);
      const scriptElement = document.createElement('img');
      scriptElement.src = "//d1f0tbk1v3e25u.cloudfront.net/pc/yre05t09/?e="+this.bvUseremail+"&r="+this.bvOrderid;
      scriptElement.id="__tms_pc";
      scriptElement.height=1;
      scriptElement.width=1;
      document.body.appendChild(scriptElement);
   }

   getSampleHidden(entry){
    if(entry.pickAgain){
        if(entry.product.isSample){
          return true
        }
    }else if(!entry.product.isSample){
        return true
    }else{
      if(entry.product.isSample){
        return false
      }
   }
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
async ngOnDestroy() {
  // this.cookieService.delete('Purchase');
await this.destroyValues();
}
destroyValues(){
  const baseSite = this.singletonServ.catalogVersion;
  this.singletonServ.cartObj=undefined;
  this.singletonServ.cardData=undefined;
  this.singletonServ.cartCount=undefined;
  this.singletonServ.confirmOrderObj=undefined;
  if(this.singletonServ.getStoreData(baseSite.guest)){
    this.singletonServ.removeItem(baseSite.guest);
  }else  if (this.singletonServ.getStoreData(baseSite.reg)) {
    let _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    delete _user.code;
    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
  }
}
}
