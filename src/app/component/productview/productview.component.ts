import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
  AfterContentInit,
  AfterViewChecked,
  ElementRef,
  AfterViewInit,
  HostListener
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { ResizeService } from '../../services/resize.service';
import { DeviceDetectorService } from "ngx-device-detector";
import { productviewComponentService } from "./productview.service";
import { SingletonService } from "../../services/singleton.service";
import * as _ from "lodash";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { patternValidator } from '../../forms/pattern-validator';
import { GtmMethodService } from '../../services/gtmmethods.service';
import { trigger, state, transition, animate, style, group} from '@angular/animations';
declare var amp:any;
declare var $: any;
// declare var $TB:any;
@Component({
  selector: "app-productview",
  animations: [
    trigger('accordionItemContentAnimation',[
      state('isOpen', style({height: '*',visibility:'visible',display:'block'})),
      state('isClose', style({height: 0,visibility:'hidden',display:'none'})), 
      transition('isOpen <=> isClose', group([animate('500ms')])),      
    ])
  ],
  templateUrl: "./productview.component.html",
  styleUrls: ["./productview.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ProductviewComponent implements OnInit, OnChanges,AfterContentInit,AfterViewChecked,AfterViewInit {
  @Input() categoryResponse:any;
  @Input() showDetail: boolean;
  @Input() curlateProductCode:any;
  @Input() productInfo: any;
  @Output() showProductDetail: EventEmitter<any> = new EventEmitter<any>();
  @Output() onQuickView: EventEmitter<any> = new EventEmitter<any>();
  @Output() onVariantProduct: EventEmitter<any> = new EventEmitter<any>();
  @Output() showDlRstrn:EventEmitter<any> = new EventEmitter<any>();
  @Input() favourite:boolean;
  @Input() curalateEnableSm:boolean;
  @HostListener('document:click')
  onPDPDocumentClick() {
  }
  showExplore: boolean;
  showDelivery: boolean;
  currentCnt: string;
  prodQuantity: string;
  dragrotation:any;
  taprotation:any;
  doubletaprotation:any;
  pdpImage: string;
  emailstring:string;
  pdpSlides: Array<any>;
  slideConfig: any;
  mailtoBody:string;
  regUser: any;
  code:any;
  siteSpecific:boolean;
  doubletaptoZoom:any;
   repoUrl : string;
   imageUrl :string;
   decscription: string;
   mailText:string;
   cartForm: FormGroup;
   checkoutToBPage:boolean;
   continueShopping:boolean;
   deTootip:any;
   zoomingClick:any;
   tapForZoom:any;
   display:boolean;
   outofstock:any;
   isoCode:string;
   isMobile:boolean;
   currentState:any;

  constructor(
    public quickServ: productviewComponentService,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private translate: TranslateServiceSubService,
    private fb: FormBuilder,
    public elementRef: ElementRef, 
    public resizeSvc: ResizeService,
    public deviceService: DeviceDetectorService,
    public gtmServ:GtmMethodService
    ) {
        const baseSite = this.singletonServ.catalogVersion;
        this.currentState=this.location['_platformStrategy']._platformLocation.location;
        this.isoCode=baseSite.isoCode;
        this.showExplore = false;
        this.showDelivery = false;
        this.prodQuantity = "1";
        this.slideConfig = { slidesToShow: 1, slidesToScroll: 2 };
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
          return false;
        };
        this.cartForm = this.fb.group({"quantity":new FormControl('',{
          validators:[
            Validators.required, 
            patternValidator(/[1-9][0-9]*$/)],
            updateOn: 'change'
        })
        });
  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      if(baseSite.isoCode =="DE" ){
        this.siteSpecific=false;
        this.deTootip="deData"
      }else{
        this.siteSpecific=true;
        this.deTootip="data"
      }
    }
  }
  ngAfterContentInit(){
    // if(!$('[collapaseid=collapse0]').hasClass('collapsed')) {
    //   $('#collapse0').stop(true).slideDown(1200, function(){
    //     $('[collapaseid=collapse0]').removeClass('collapsed');
    //   });
    // }
    var interval = setInterval(function(){
      if($('[collapaseid=collapse0]').length > 0) {
        if(!$('[collapaseid=collapse0]').hasClass('collapsed')) {
            $('#collapse0').stop(true).slideDown(1200, function(){
              $('[collapaseid=collapse0]').removeClass('collapsed');
            });
          }

        clearInterval(interval);
      }
    },1000)
}
setLang(lang: string) {
  this.translate.use(lang);
}
ngAfterViewChecked(){
  
}
  onClickFavourite() {
    this.router.navigate(["store", "myaccount", "profile", "myFavorites"]);
  }
  onVariantClick(data){
      const _prod=this.productInfo;
      const _catName=_prod.category;
      const _path=this.location.path().slice(1).split('/');
      _path.shift();

      this.router.navigate(['store',_path[0],_path[1],data.name,data.code]);
  }
  addToFavourite(event, data) {
    event.preventDefault();
    const baseSite = this.singletonServ.catalogVersion;
    if(event.ctrlKey && event.which === 1){
        const _route =`/store/browse/productDetailSingleSku?productId=${data.code}&addedToFavourites=true`;
        window.open(_route);
      } else {    
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    this.quickServ
          .addToFavourite(baseSite,user.token, user.email, data.code)
          .subscribe(
            resp => {
              this.favourite = false;
            },
            error => {
              const err=error.error["errors"][0];           
            }
          );
    }
      
  }
  onShowProductDetails(data) {
    if(data){    
          if(data.url.indexOf('/c//p/') !=-1){
            let _constructUrl= data.category.url.slice(1).split('/');
            _constructUrl.splice(-2,2);
            const _produrl=_constructUrl.join("/");
            const _url ="/store/"+_produrl+'/'+data.name+'/'+data.code;
            this.router.navigate([_url]);
          }else if(data.url.indexOf('/c/') !=-1){
            let url = "/store" + data.url.replace("/c/", "/");
            if(url.indexOf('/p/') !=-1){
              let producturl = "/store" + url.replace("/p/", "/");
              this.router.navigate([producturl]);
            }else{
              this.router.navigate([url]);  
            }
           
          }else{
          let url = "/store" + data.url.replace("/p/", "/");
          this.router.navigate([url]);
          }
      }
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  pdpData(data) {}
  getImageUrl(data, bol) {
    if (bol) {
      return (
        "https://media.moltonbrown.co.uk/s/moltonbrown/" +
        data.code +
        "_uk_set?$LargeImageTemplate1$"
      );
    } else {
      return data.src;
    }
  }
  Versand(){
    window.open('/store/german-delivery');

  }
  // checkFavourite(user, code) {
  //   const baseSite=this.singletonServ.catalogVersion;
  //   const _favourites = this.singletonServ.favourites; 
  //   if (_favourites) {
  //     const _fav = _.find(_favourites, function(o) {
  //       return o.code == code;
  //     });
  //     if (_fav) {
  //       this.favourite = false;
  //     } else {
  //       this.favourite = true;
  //     }
  //   } else {
  //     this.quickServ
  //           .getFavourites(baseSite,user.token, user.email)
  //           .subscribe(
  //             response => {
  //               if(response){
  //               const _fav = _.find(response["products"], function(o) {
  //                 return o.code == code;
  //               });
  //               this.singletonServ.favourites = response["products"];
  //               if (_fav) {
  //                 this.favourite = false;
  //               } else {
  //                 this.favourite = true;
  //               }
  //             }

  //             },
  //             err => {
  //             if(err.error){
  //                 if(err.error["errors"]){
  //                   if(err.error["errors"][0]){
  //                     if(err.error["errors"][0]['type']== "InvalidTokenError") {
  //                       this.quickServ.generateToken(baseSite).subscribe((token)=>{
  //                         const tokenId = token["access_token"];
  //                         user['token']=tokenId;
  //                         this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
  //                         // this.checkFavourite(user, code);
  //                      });
  //                     }else{
  //                       this.favourite = true;
  //                     }
  //                   }
  //                   }else{
  //                     this.favourite = true;
  //                   }
  //                  }else{
  //                   this.favourite = true;
  //                  }
  //             }
  //           );
  //   }
  // }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["productInfo"]) {
      const baseSite = this.singletonServ.catalogVersion;
      if (changes["productInfo"]["currentValue"] != undefined) {
        const  _product = changes["productInfo"]["currentValue"];
        const _code = _product["code"];
        this.pdpImage = "https://media.moltonbrown.co.uk/s/moltonbrown/" + _code + "_uk_set";
        this.repoUrl='https://www.moltonbrown.co.uk'+this.location.path();
        this.imageUrl=this.pdpImage;
        this.mailtoBody =_product.productDisplayName.replace("&"," ") ;

        this.emailstring= `mailto:?Subject=Thought you might like this… &body=${this.mailtoBody}${this.repoUrl}`;
        this.constructPDP(_product);        
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          that.regUser = true;
          that.favourite = true;
           if (_product["explore"] ) {
              //  that.checkFavourite(_user, _code);
          }
        }else {
          that.regUser = false;
        }
      }
    }
  }
  constructPDP(productInfo){
    // let _FR=$TB;

const baseSite = this.singletonServ.catalogVersion;
if (baseSite) {
  if(baseSite.isoCode =="DE" ){
    this.zoomingClick="Klicken Sie, um zu zoomen";
    this.tapForZoom="Klicken Sie, um zu zoomen";
    this.doubletaptoZoom="Zum Zoomen zweimal tippen";
    this.dragrotation="Zum Drehen ziehen"
    this.taprotation="Tippen Sie zum Drehen auf"
    this.doubletaprotation="Zum Drehen zweimal tippen"
  }else{
    this.zoomingClick="Click to zoom";
    this.tapForZoom="Tap to zoom";
    this.doubletaptoZoom="Double tap to zoom";
    this.dragrotation="Drag to rotate"
    this.taprotation="Tap to rotate"
    this.doubletaprotation="Double tap to rotate"

  }
}
    const isMobile = this.deviceService.isMobile();
    this.isMobile=isMobile;
    const isWeb = (this.deviceService.browser=="Chrome"  || this.deviceService.browser=="Opera")?true:false;
      this.singletonServ.loadScript('https://dev-solutions.s3.amazonaws.com/viewer-kit-playground/v1.1.0/js/viewer.min.js').then(() => {
      this.route.params.subscribe(params => {
          const _code=params.itemid;
          const _checkSet=(productInfo.amplienceImageSet)?productInfo.amplienceImageSet:"_uk_set";
          const ampImageSet=_checkSet.trim();
          const _setType=(ampImageSet=="")?'_uk_set':ampImageSet;
          const _set =''+_code+_setType;
          const  viewerSettings = {
            target : '.viewer-kit-target',
            client : 'moltonbrown',
            secure : true,
            imageBasePath : 'https://media.moltonbrown.co.uk/',
            set : _set,
            responsive:false,
            templates : {
              thumb : (isWeb)?'$smallImg$&fmt=webp':'$smallImg$&fmt=jpg',
              desktop : {
                main : (isWeb)?'$xLImg$&fmt=webp':'$xLImg$&fmt=jpg',
                mainRetina : (isWeb)?'$xLImgRetina$&fmt=webp':'$xLImgRetina$&fmt=jpg'
              },
              desktopFull : {
                main : (isWeb)?'$xLImg$&fmt=webp':'$xLImg$&fmt=jpg',
                mainRetina : (isWeb)?'$xLImgRetina$&fmt=webp':'$xLImgRetina$&fmt=jpg'
              },
              mobile: {
                main: (isWeb)?'$mobPDPImg$&fmt=webp':'$mobPDPImg$&fmt=jpg',
                mainRetina: (isWeb)?'$mobPDPImgRetina$&fmt=webp':'$mobPDPImgRetina$&fmt=jpg'
            }
            },
            tooltips: {
              offsets: {
                left: -102,
                top:  -39
              },
              displayTime: 3000,
              desktop: {
                image: {
                  noTouch: {
                    text: this.zoomingClick
                  },
                  touch: {
                    text: this.tapForZoom
                  },
                 doubleTouch: {
                            text: this.doubletaptoZoom
                        }
                },
                spin: {
                  text: ''
                },
                video: {
                  play: {
                    text: ''
                  },
                  pause: {
                    text: ''
                  }
                }
              },
            desktopFull: {
                    image: {
                        noTouch: {
                            text: this.zoomingClick
                        },
                        touch: {
                            text: this.tapForZoom
                        },
                        doubleTouch: {
                            text: this.doubletaptoZoom
                        }
                    },
                    spin: {
                        noTouch: {
                            text: this.dragrotation
                        },
                        touch: {
                            text:  this.taprotation
                        },
                        doubleTouch: {
                            text: this.doubletaprotation
                        }

                    },
                    video: {
                        play: {
                            noTouch:{
                                text: ''
                            },
                            touch:{
                                text: ''
                            }
                        },
                        pause: {
                            noTouch:{
                                text: ''
                            },
                            touch:{
                                text: ''
                            }
                        }
                    }
                },
                mobile: {
                    image: {
                        noTouch: {
                            text: this.zoomingClick
                        },
                        touch: {
                            text: this.tapForZoom
                        },
                        doubleTouch: {
                            text: this.doubletaptoZoom
                        }
                    },
                    spin: {
                        noTouch: {
                            text: 'Drag to rotate'
                        },
                        touch: {
                            text: 'Tap to rotate'
                        },
                        doubleTouch: {
                            text: 'Double tap to rotate'
                        }

                    },
                    video: {
                        play: {
                            noTouch:{
                                text: ''
                            },
                            touch:{
                                text: ''
                            }
                        },
                        pause: {
                            noTouch:{
                                text: ''
                            },
                            touch:{
                                text: ''
                            }
                        }
                    }
                }

            },
          ampConfigs : {
            navElementsCount : {
              forDesktop : 5,
              forDesktopFull : 5
            },
            mainContainerCarousel : {
              width : "600px",
              height : "600px",
              responsive : false,
              start : 3,
              loop : false,
              dir : 'horz',
              autoplay : false,
              gesture : {
                enabled : true,
                fingers : 1,
                dir : 'horz',
                distance : 80
              },
              animDuration : 500,
              layout : 'standard',
              onActivate : {
                select : true,
                goTo : true
              },
              animate : true,
              easing : 'linear',
              preferForward : true,
              preloadNext : true
            }
          }
          };
          
          var viewer = new amp.Viewer(viewerSettings);
          if(isMobile){
          //   if(_FR){
          //     _FR.loadPageSlots();
          //  }
          }
        });

});
  }
  getrelevantProducts(code) {}
  onCollapseDetail(event, data) {
    event.stopPropagation();
    

  }

  onThumbnailClick(event, pic) {
    event.preventDefault();
    this.pdpImage = pic.src;
  }
  onFindDRtcn(){
   this.showDlRstrn.emit();
  }
  ngAfterViewInit(){
  }
  detectScreenSize() {
    const currentSize = this.singletonServ.sizes.find(x => {
      const el = this.elementRef.nativeElement.querySelector(`.is-${x.id}`);
     if(el){
      const isVisible = window.getComputedStyle(el).display != 'none';
      return isVisible;
    }
    });

  }
/* Add to basket */
onShowCheckoutPopup(event,item){
  this.singletonServ.scrollToTarget('#miniRichCart');
  // this.display=true;
  // if(this.display){
    setTimeout(()=>{
      this.addToBasket(event,item,true);
    });
  // }
}
checkoutToBasket(event,item){
  this.display=false;
  this.checkoutToBPage=true;
  this.continueShopping=false;
  this.router.navigate(['store','mbcart']);
}
onContinueShopping(event,item){
  this.display=false;
  this.checkoutToBPage=false;
  this.continueShopping=true;
}
onTargetRecomendation(){
  this.singletonServ.scrollToTarget('#uk-hybris-prod-feed-product-page-you-may-also-like-div');
  this.display=false;

}
  addToBasket(event,item,openPopup) {
    event.preventDefault();
    event.stopPropagation();
    const baseSite = this.singletonServ.catalogVersion;
    const productObj = {
      product: { code: item["code"] },
      quantity: parseInt(this.prodQuantity)
    };

// start ---gtm Add to cart


 const cartDetails = {
    'currencyCode': item.price.currencyIso,
    'categoryList': item.breadcrumbsList.breadcrumbsList[0].name+ '-'+ item.breadcrumbsList.breadcrumbsList[1].name,       
        'productName': item.productDisplayName,      
    'productID': item.code,
    'productPrice': '',
    'productBrand': "Molton Brown",
  'productCategory': item.breadcrumbsList.breadcrumbsList[1].name,
    'productVariant': (item.productVariant)? item.productVariant : "", 
  'productQuantity':productObj.quantity,
    'size': item.size,
    'reviewRating': (item.productAverageRating)?item.productAverageRating:'',
    'reviewsCount': (item.reviewCount)?item.reviewCount:'',
    'saleStatus': (item.originalPrice)?'True':'False',
    'stockLevel': (item.stock.stockLevelStatus == "inStock")?"True":"False",   
    'productStockLevelNumber':(item.stock.stockLevel)?item.stock.stockLevel:'',  
     'deleveryType':(item.productEdition)?item.productEdition:'',
      'salePrice':(item.originalPrice)?item.price.value:''
     


}

if(item.price['formattedValue']){
  cartDetails['productPrice']=item.price.value;
}
else{
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
if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.singletonServ.loggedIn = true;
          if (!user.code) {       
            this.createCart(user.email,productObj,true,openPopup);
          } else {
            if(user["token"]){
              this.addToCart(user["token"],user.email,user.code,productObj,openPopup);
            }else{  
              this.quickServ.generateCartToken(baseSite).subscribe(
                resp => {
                   const token = resp["access_token"];
                   user.token= resp["access_token"];
                   this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user)); 
                   this.addToCart(token,user.email,user.code,productObj,openPopup);
                },err=>{

                });
            }
          }
        } else {
          
          if (!this.singletonServ.getStoreData(baseSite.guest)) {
            this.createCart('anonymous',productObj,false,openPopup);
          } else {
            const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            const cartId =  _guest["guid"];
            const tokenId =_guest["token"];
            if(tokenId){
              this.addToCart(tokenId,'anonymous',cartId,productObj,openPopup);
            }else{
              this.createCart('anonymous',productObj,false,openPopup);
            }
        }
        }
 
  }

  createCart(email,productObj,logged,openPopup){
    const baseSite = this.singletonServ.catalogVersion;
    this.quickServ.generateCartToken(baseSite).subscribe(
      resp => {
        const token = resp["access_token"];
        this.quickServ.generateCartId(baseSite,resp["access_token"],email).subscribe(
          data => {
            if(logged){
              const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
              user['code']=data['code'];
              user['guid']=data["guid"];
              user['token']=token;
              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
              this.addToCart(token,email,user['code'],productObj,openPopup);
            }else{
              const _user = {token:'',guid:''};
              _user["guid"]=data["guid"];
              _user['code']=data['code'];
              _user['token']=resp["access_token"];
              this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_user));
              this.addToCart(resp["access_token"],email,data["guid"],productObj,openPopup);
            }
           
          },err=>{

          });
        },
        error => {}
      );
  }
  addToCart(token,email,code,productObj,openPopup){
    const baseSite=this.singletonServ.catalogVersion;
    this.quickServ.addToBasket(baseSite,token,email,code,productObj).subscribe((response)=>{
              const obj = {
                code: productObj['product']["code"],
                showCartPopUp: true
              };         
              this.onQuickView.emit(obj);
              this.singletonServ.sendMessage(obj);
              this.singletonServ.scrollToTarget('#rich_cart'); 
              if(openPopup){
                this.display=true;
              }
          },err=>{
            if(err.error){
              if(err.error["errors"]){
                if(err.error["errors"][0]){
                  if(err.error["errors"][0]['type']== "InvalidTokenError") {
                    this.quickServ.generateToken(baseSite).subscribe((respToken:any)=>{
                      const tokenId = respToken["access_token"];             
                      const _reg=(email!='anonymous')?true:false;
                      if(_reg){
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= respToken["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this.addToCart(tokenId,email,code,productObj,openPopup);
                      }else{
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= respToken["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this.addToCart(tokenId,email,code,productObj,openPopup);
                      }

                   });
                  }else if(err.error["errors"][0]['type']== "InsufficientStockError"){
                    const _stockMsg:string=err.error["errors"][0]['message'].replace("\n.","\n");
                    _stockMsg.replace('\n'," \n. ")
                     this.outofstock=_stockMsg;
                  }
                }
                }
              }
          });
  }
  onClickTabs(event,k){
    event.preventDefault();
    this.productInfo['contentTabs'].map((obj,id)=>{
      if(id==k){
      } else {
        obj['show']=false;
      }
    })
    this.productInfo['contentTabs'][k]['show']=!this.productInfo['contentTabs'][k]['show'];
  }
  openFirstAccordian(event,id) {
   if(id == 0) this.openPopup(event,id);
  }
  openPopup(event,id){
    if(!$(event.target).hasClass('collapsed')) {
      $('#collapse'+id ).stop(true).slideUp(1200, function(){
        $('[collapaseid=collapse'+id+']').addClass('collapsed');
      });
    } else {
      this.productInfo['contentTabs'].map((obj,id)=>{
        $('#collapse'+id ).stop(true).slideUp(1200,function(){
          $('[collapaseid=collapse'+id+']').addClass('collapsed');
        });
      });
      $('#collapse'+id ).stop(true).slideDown(1200, function(){
        $('[collapaseid=collapse'+id+']').removeClass('collapsed');
      });
    } 
  }

  onOpenDlmodal(event){  
  event.preventDefault();  
    if(event.ctrlKey && event.which === 1){
      const _url= this.location['_platformStrategy']._platformLocation.location.href;
      window.open(_url);
    }
}
}