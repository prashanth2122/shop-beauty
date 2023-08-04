import {
  Inject,
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
  HostListener,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import * as _ from "lodash";
import { HeaderComponentService } from "../../component/header/header.service";
import { SingletonService } from "../../services/singleton.service";
import { productviewComponentService } from "../../component/productview/productview.service";
import { GtmMethodService } from '../../services/gtmmethods.service';
import { TranslateService } from "../../translate.service";
declare var $: any;
@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnChanges,OnInit,AfterViewInit,AfterViewChecked,OnDestroy  {
  @Input() displayGrid: boolean;
  @Input() activeProducts: boolean;
  @Input() categoryResponse: any;
  @Input() pagedItems: any;
  @HostListener("window:resize", [])
  onResize(event) {
    if (window.innerWidth <=874) {
     this.mobileDevice=true;
    }else{
      this.mobileDevice=false;
    }
  }
  @ViewChild('qvElement') qvElement:ElementRef;
  deviceInfo: any;
  productClickDetails:any;
  mobileDevice: boolean;
  gridtoggle: boolean;
  siteSpecific: boolean;
  localData:any;
  prodQuantity: string;
  feedList:Array<any>;
  productDisplayName:string="&euro;";
  countrySite:string;
  constructor(
    @Inject(DOCUMENT) public dom,
    public quickServ: productviewComponentService,
    private el: ElementRef,
    public deviceService: DeviceDetectorService,
    public headerServ: HeaderComponentService,
    public location: Location,
    public router: Router,
    private translate: TranslateService,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public gtmServ:GtmMethodService
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.prodQuantity = "1";
    this.localData=this.singletonServ.appLocaleData;
    this.countrySite=(baseSite.isoCode=="GB")?"Molton Brown UK":"Molton Brown "+baseSite.isoCode;
    // if(!this.localData){
     this.setLang(baseSite.lngCode);
  //  }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["displayGrid"]) {
      if (changes["displayGrid"]["currentValue"] != undefined) {
        that.gridtoggle = changes["displayGrid"]["currentValue"];
      }
    }
    if (changes["pagedItems"]) {
      if (changes["pagedItems"]["currentValue"] != undefined) {
         this.starRating();
      }
    }
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      if (baseSite.isoCode == "DE") {
        this.siteSpecific = false;
      } else {
        this.siteSpecific = true;
      }

  }
    this.getDeviceInfo();
  }

  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
  }


  setLang(lng: string) {
     this.headerServ.getStaticContent(lng).subscribe(response => {
      this.singletonServ.appLocaleData = response;
      this.localData=response;
    });
  }
  getRouterPath(data) {
    const _keyword = this.categoryResponse;
    if (_keyword.keywordRedirectUrl) {
      if (_keyword.keywordRedirectUrl.indexOf("/c/") != -1) {
        const _replaceUrl = _keyword.keywordRedirectUrl.replace("/c/", "/");
        const _url = "/store" + _replaceUrl;
       return _url;
      } else {
        const _replaceUrl = _keyword.keywordRedirectUrl.replace("/p/", "/");
        const _url = "/store" + _replaceUrl;
        return _url;
      }
    } else {
      if (data.category) {
            const _constructUrl = data.category.url.slice(1).split("/");
            _constructUrl.splice(-2, 2);
            const _produrl = _constructUrl.join("/");
            const _url = "/store/" + _produrl + "/" + data.name + "/" + data.code;
            return _url; 
      }else if(_keyword.category){
        const _constructUrl = _keyword.category.url.slice(1).split("/");
        _constructUrl.splice(-2, 2);
        const _produrl = _constructUrl.join("/");
        const _url = "/store/" + _produrl + "/" + data.name + "/" + data.code;
        return _url;
      }
      // else if (data.url.indexOf("/c/") != -1) {
      //       const _replaceUrl = data.url.replace("/c/", "/");
      //        if (_replaceUrl.indexOf("/c/") != -1) {
      //         const _url = "/store" + _replaceUrl.replace("/p/", "/");
      //         return _url;
      //         }
      // }
      else{
            const _url = "/store" + data.url.replace("/p/", "/");
            return _url;
      }
    }
  }

  onCloseWindow(data, i) {
    const _name = "" + data.code;
    _name.trim();
    const el=this.dom.getElementsByClassName(_name)[0];
    if(el){
    el['checked'] = false;
  }
 }
  onCloseQuickView(data) {
    const index = _.findIndex(this.pagedItems, (resp:any) => {
      return resp.code == data.code;
    });
    this.pagedItems[index]["show"] = false;
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onCollapseQuickView(event, data)
  {
    event.stopPropagation();
    const _target="#qv" + data.code;
    this.prodQuantity="1";
   let actionCarriedOut = this.qvElement.nativeElement.value;   
   if(actionCarriedOut == 'on' ){
      actionCarriedOut = 'open';
   } 
   const prouductName = data.productDisplayName;
    this.gtmServ.gtmQuickView(actionCarriedOut,prouductName);
       setTimeout(()=>{
    if($(_target)){
        if($(_target).offset()){
        this.singletonServ.scrollToTargetElement(_target);
      }
  }
 });
  }
  showFirstPage(event) {
    const _obj = {
      page: 1
    };
  }



  onShowDetailPage(event, data) {
    event.preventDefault();
    const _keyword = this.categoryResponse;
    this.setGTMService(data);
    if (_keyword.keywordRedirectUrl) {
      if (_keyword.keywordRedirectUrl.indexOf("/c/") != -1) {
        const _replaceUrl = _keyword.keywordRedirectUrl.replace("/c/", "/");
        const _url = "/store" + _replaceUrl;
        if(event.ctrlKey && event.which === 1){
          window.open(_url); 
       } else {
         this.router.navigate([_url]);
       }
      } else {
        const _replaceUrl = _keyword.keywordRedirectUrl.replace("/p/", "/");
        const _url = "/store" + _replaceUrl;
          if(event.ctrlKey && event.which === 1){
            window.open(_url); 
        } else {
           this.router.navigate([_url]);
        }
      }
    }else {
        if (data.category) {
          const _constructUrl = data.category.url.slice(1).split("/");
          _constructUrl.splice(-2, 2);
          const _produrl = _constructUrl.join("/");
          const _url = "/store/" + _produrl + "/" + data.name + "/" + data.code;
          if(event.ctrlKey && event.which === 1){
            window.open(_url); 
          } else {
            this.router.navigate([_url]);
          }   
        } else if(_keyword.category){
          const _constructUrl = _keyword.category.url.slice(1).split("/");
          _constructUrl.splice(-2, 2);
          const _produrl = _constructUrl.join("/");
          const _url = "/store/" + _produrl + "/" + data.name + "/" + data.code;
          if(event.ctrlKey && event.which === 1){
            window.open(_url); 
          } else {
            this.router.navigate([_url]);
          } 
        } else{
          const _url = "/store" + data.url.replace("/p/", "/");
          if(event.ctrlKey && event.which === 1){
            window.open(_url); 
         } else {
           this.router.navigate([_url]);
         }
        }

    }
  }



  setGTMService(data){
    const pageUrlCat = this.retireveCatpath(data);
    const _mainCat= pageUrlCat[0].split('-').join('');
    const _subCatg=pageUrlCat[1].split('-').join('');
    const _catDisplayName= (data.category)?data.category.categoryDisplayName:_subCatg;
    const _categoryList =_mainCat+ '-'+_catDisplayName;
    // const _priceCode=(data.price.currencyIso)?data.price.currencyIso:''
    const productClickDetails ={   
      "currencyCode":(data.price)? data.price.currencyIso:"",                  
      'categoryList': _categoryList,     
      'productName': data.productDisplayName,      
      'productID': data.code,
      'productPrice': '',
      'productBrand': "Molton Brown",
      'productCategory': _catDisplayName,
      'productVariant': (data.productVariant)? data.productVariant : "",
      'position': data.id,
      'size': data.size,
      'reviewRating': (data.productAverageRating)?data.productAverageRating:'0',
      'reviewsCount': (data.reviewCount)?data.reviewCount:'0',
      'saleStatus': (data.originalPrice)?'True':'False',
      'stockLevel': (data.stock.stockLevelStatus == "inStock")?"True":"False",   
      'productStockLevelNumber':(data.stock.stockLevel)?data.stock.stockLevel:'',
       'deleveryType':(data.productEdition)?data.productEdition:'',
        'salePrice':(data.originalPrice)?data.price.value:''
      

    }
       if(data.originalPrice){
        const originalPrice= data.originalPrice;
        const _originalPrice = originalPrice.match(/[\d\.]+/);
        if(_originalPrice){
          productClickDetails['productPrice']=_originalPrice[0];
        }else{
          productClickDetails['productPrice']=originalPrice;
        }
        }else if(data.price){
          productClickDetails['productPrice']=data.price.value;
        }else{    
          productClickDetails['productPrice']="null"
        }
   this.gtmServ.gtmProductClick(productClickDetails);
  }
  retireveCatpath(dataurl){
    if(dataurl.category){
      const _url= dataurl.category.url.slice(1).replace("/c/", "/");
      return _url.split("/");
     }else{
      const _url= dataurl.url.slice(1).replace("/p/", "/");
      return _url.split("/");
     }
    }
  onShowProductReview(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const _keyword = this.categoryResponse;
    if (_keyword.keywordRedirectUrl) {
      if (_keyword.keywordRedirectUrl.indexOf("/c/") != -1) {
        const _replaceUrl = _keyword.keywordRedirectUrl.replace("/c/", "/");
        let _url = "/store" + _replaceUrl;
        if(event.ctrlKey && event.which === 1){
          _url=_url+'?BVRRContainer=true';
          window.open(_url); 
       } else {
        this.router.navigate([_url], {
          queryParams: { BVRRContainer: true },
          queryParamsHandling: "merge"
        });
       }
      } else {
        const _replaceUrl = _keyword.keywordRedirectUrl.replace("/p/", "/");
        let _url = "/store" + _replaceUrl;
          if(event.ctrlKey && event.which === 1){
            _url=_url+'?BVRRContainer=true';
            window.open(_url); 
        } else {
          this.router.navigate([_url], {
            queryParams: { BVRRContainer: true },
            queryParamsHandling: "merge"
          });
        }
      }
    } else {
        if (data.category) {
           if(data.category.subcategories){
                let _url = "/store" + data.url.replace("/p/", "/");
                if(event.ctrlKey && event.which === 1){
                  _url=_url+'?BVRRContainer=true';
                  window.open(_url); 
                } else {
                  this.router.navigate([_url], {
                    queryParams: { BVRRContainer: true },
                    queryParamsHandling: "merge"
                  });
                }
           }else{
                const _constructUrl = data.category.url.slice(1).split("/");
                _constructUrl.splice(-2, 2);
                const _produrl = _constructUrl.join("/");
                let _url = "/store/" + _produrl + "/" + data.name + "/" + data.code;
                if(event.ctrlKey && event.which === 1){
                  _url=_url+'?BVRRContainer=true';
                  window.open(_url); 
                } else {
                  this.router.navigate([_url], {
                    queryParams: { BVRRContainer: true },
                    queryParamsHandling: "merge"
                  });
                }
           }      
        } else{
          let _url = "/store" + data.url.replace("/p/", "/");
          if(event.ctrlKey && event.which === 1){
            _url=_url+'?BVRRContainer=true';
            window.open(_url); 
         } else {
          this.router.navigate([_url], {
            queryParams: { BVRRContainer: true },
            queryParamsHandling: "merge"
          });
         }
        }

    }
  }
  onRatingSet(event){
  }
  addToBasket(event,item) {
    event.stopPropagation();
    const baseSite = this.singletonServ.catalogVersion;
    const productObj = {
      product: { code: item["code"] },
      quantity: parseInt(this.prodQuantity)
    };
const pageUrlCat = this.retireveCatpath(item);
const _mainCat= pageUrlCat[0].split('-').join('');
const _subCatg=pageUrlCat[1].split('-').join('');
const _catDisplayName= (item.category)?item.category.categoryDisplayName:_subCatg;
const _categoryList =_mainCat+ '-'+_catDisplayName;
const _stock=(item.stock)?item.stock:"False";
 const cartDetails = {   
    'currencyCode': item.price.currencyIso,
    'categoryList': _categoryList,       
    'productName': item.productDisplayName,      
    'productID': item.code,
    'productPrice':'',
    'productBrand': "Molton Brown",
  'productCategory': _catDisplayName,
    'productVariant': (item.productVariant)? item.productVariant : "", 
  'productQuantity':productObj.quantity,
    'size': item.size,
    'reviewRating': (item.productAverageRating)?item.productAverageRating:'0',
    'reviewsCount': (item.reviewCount)?item.reviewCount:'0',
    'saleStatus': (item.originalPrice)?'True':'False',
    'stockLevel': (_stock.stockLevelStatus == "inStock")?"True":"False",   
    'productStockLevelNumber':(_stock.stockLevel)?_stock.stockLevel:'', 
     'deleveryType':(item.productEdition)?item.productEdition:'',
      'salePrice':(item.originalPrice)?item.price.value:''
     


}
if(item.price['formattedValue']){
  cartDetails['productPrice']=item.price.value;
}else{
  if(item.originalPrice){
    const originalPrice= item.originalPrice;
  const _originalPrice = originalPrice.match(/[\d\.]+/);
  if(_originalPrice){
    cartDetails['productPrice']=_originalPrice[0];
  }else{
    cartDetails['productPrice']=originalPrice;
  }
  }
}
 
this.gtmServ.gtmAddToCart(cartDetails);
// end gtm add to cart
      
      const _name = "" + item["code"];
      if(this.dom.getElementsByClassName(_name)[0]){
        this.dom.getElementsByClassName(_name)[0]['checked'] = false;
      }
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.singletonServ.loggedIn = true;
          if (!user.code) {       
            this.createCart(user.email,productObj,true);
          } else {
            if(user["token"]){
              this.addToCart(user["token"],user.email,user.code,productObj);
            }else{  
              this.quickServ.generateCartToken(baseSite).subscribe(
                resp => {
                   const token = resp["access_token"];
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user)); 
                   this.addToCart(token,user.email,user.code,productObj);
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
            if(cartId){
                if(tokenId){
                  this.addToCart(tokenId,'anonymous',cartId,productObj);
                }else{
                  this.quickServ.generateCartToken(baseSite).subscribe(
                    resp => {
                       const token = resp["access_token"];
                       _guest.token= resp["access_token"];
                       this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_guest)); 
                       this.addToCart(tokenId,'anonymous',cartId,productObj);
                    },err=>{
    
                    });
                }
            }else{
              this.createCart('anonymous',productObj,false);
            }
         
        }
        }
 
  }

  createCart(email,productObj,logged){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    this.quickServ.generateCartToken(baseSite).subscribe(
      resp => {
        const token = resp["access_token"]; 
       this.quickServ.generateCartId(baseSite,resp["access_token"],email).subscribe(
          (cartcode) => {
            if(logged){
              const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
              user['code']=cartcode['code'];
              user['guid']=cartcode["guid"];
              user['token']=token;
              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
              this.addToCart(token,email,user['code'],productObj);
            }else{
              const _user = {token:'',guid:''};
              _user["guid"]=cartcode["guid"];
              _user['code']=cartcode['code'];
              _user['token']=resp["access_token"];
              this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
              this.addToCart(resp["access_token"],email,cartcode["guid"],productObj);
            }
           
          },err=>{
          });
        },
        error => {}
      );
  }
  addToCart(token,email,code,productObj){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    this.quickServ.addToBasket(baseSite,token,email,code,productObj).subscribe((response)=>{
          const obj = {
            code: productObj['product']["code"],
            showCartPopUp: true
          };         
          const index = _.findIndex(this.pagedItems, (resp:any) => {
            return resp.code == productObj['product']["code"];
          });
          this.pagedItems[index]["show"] = false;
          this.singletonServ.sendMessage(obj);
          this.singletonServ.scrollToTarget('#rich_cart');
    },(err:any)=>{      
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.quickServ.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                      const _reg=(email!='anonymous')?true:false;
                      if(_reg){
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this.addToCart(resp["access_token"],email,code,productObj);
                      }else{
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this.addToCart(resp["access_token"],email,code,productObj);
                      }
                    });
            } else if(err.error["errors"][0]['type']== "InsufficientStockError"){
              that.singletonServ.sendMessage({outofStock:err.error["errors"][0]});
              this.singletonServ.scrollToTarget('#rich_cart');
          }
          }
          }
         }
    });
  }
  onOpenBVReview(event){
    event.preventDefault();
    event.stopPropagation();
  }
  getAvgRating(rating){
    return '2.65';
  }
  ngAfterViewInit(){
    this.starRating();
  }
  ngAfterViewChecked(){
    this.starRating();
  }
  starRating(){
    $('.js-star-rating').each( function() {
      const    rating       = $(this).data('rating');
      const    starNumber   = $(this).children().length;
      const     fullStars:any   = Math.floor(rating);
      const     halfStarPerc = (rating - fullStars) * 100;

      if(rating > 0) {
          $(this).children().each(function (index) {
              $(this).addClass('fa-star');
              $(this).removeClass('fa-star-o');
              return ( (index + 1) < fullStars );
          });
      }

      if ( halfStarPerc !== 0 && fullStars < starNumber ) {
          var halfStar = $(this).children(":nth-child(" + parseInt(fullStars+1, 10) + ")");

          $('<span class="fa fa-star fa-star-percentage"></span>').width(halfStarPerc + '%').appendTo(halfStar);
      }

  });
  }
ngOnDestroy(){

}
}
