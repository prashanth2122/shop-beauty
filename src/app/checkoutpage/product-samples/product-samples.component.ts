import { 
  Component,
  OnInit, 
  AfterViewInit, 
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener
 } from "@angular/core";
import { SingletonService } from "../../services/singleton.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { BasketPageComponentService } from "../basketpage/basketpage.service";
import { Title } from '@angular/platform-browser';
import { GuestForm } from "../../forms/guestForm.form";
import { GtmMethodService } from '../../services/gtmmethods.service';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import {GiftwrapComponent} from "../giftwrap/giftwrap.component";
import * as _ from "lodash";
import { Subscription } from "rxjs";
declare var $:any;
declare var AmpCa:any;
/*slideConfig = {
   “slidesToShow”: 3,
   “slidesToScroll”: 2,
   “nextArrow”:”“, 
   “prevArrow”:”“, 
   “dots”:false, 
   “infinite”: false, 
   “responsive”: [
      { 
        “breakpoint”: 1920,
        “settings”: { 
        “slidesToShow”: 3, 
        “slidesToScroll”: 3, 
        “infinite”: true, 
        “dots”: true 
      } },
      { “breakpoint”: 1024, “settings”: { “slidesToShow”: 2, “slidesToScroll”: 2, “infinite”: true,“dots”: true } },
     { “breakpoint”: 600, “settings”: { “slidesToShow”: 1, “slidesToScroll”: 1 } }, 
     { “breakpoint”: 480, “settings”: { “slidesToShow”: 1, “slidesToScroll”: 1 } } ] };*/ 
@Component({
  selector: "app-product-samples",
  templateUrl: "./product-samples.component.html",
  styleUrls: ["./product-samples.component.scss"]
})
export class ProductSamplesComponent
  implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('slickModal') slickModal: any;
    @ViewChild("giftWrapEl") giftWrapEl:GiftwrapComponent;
    @ViewChild("policyEl") policyEl: ElementRef;
  slides: Array<any>;
  subscription:Subscription;
  expressChcSubscription:Subscription;
  slideConfig: any;
  deviceInfo: any;
  totalAmount: string;
  cartEntryObj: any;
  showExpress: boolean;
  cartCode: string;
  samplesCopy: Array<any>;
  giftMsg: boolean;
  giftMessageForm: FormGroup;
  giftText: string;
  totalPriceValue: any;
  isValidSubmit:boolean;
  disableGiftBox:boolean;
  pageLoad:boolean;
  dlRestriction:boolean;
  isSlickCarouselExits:boolean;
  isocode:string;
  hazardousEntries:boolean;
  hazardousData: any = {
    description: `<p class="redstar">Cannot continue using express checkout option as the following hazardous products present in the basket cannot be shipped using the default shipping option that has been set. Please use the normal checkout process. </p>`,
    list: []
  };
  countrySite:string;
  @HostListener("window:resize", [])
  onResize(event) {
    if(this.slideConfig){
    this.slickModal.unslick();
    if (window.innerWidth <=874) {
      this.slickModal.config['slidesToShow']=1;
      this.slickModal.config['slidesToScroll']=1;
    }else{
      this.slickModal.config['slidesToShow']=4;
      this.slickModal.config['slidesToScroll']=1;
      this.slickModal.config['dots']=false;
      this.slickModal.config['infinite']=false;
    }
   this.slickModal.initSlick();
   this.slickModal.init;
  }
 }
  constructor(
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService,
    public location: Location,
    public _giftMessageDetails: GuestForm,
    private title: Title,
    public router: Router,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public basketServ: BasketPageComponentService,
    private translate: TranslateServiceSubService,
    public gtmServ:GtmMethodService,
    public elementRef:ElementRef
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.countrySite=(baseSite.isoCode=="GB")?"Molton Brown UK":"Molton Brown "+baseSite.isoCode;
    this.isocode=baseSite.isoCode;
    this.totalAmount = singletonServ.totalAmount;
    this.showExpress = false;
    this.giftMessageForm = this.fb.group({
      giftCard:this.fb.group(_giftMessageDetails.getGiftMessageForm())
    });
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.showExpress = user['isExpressCheckout'];
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit() { 
    
    const baseSite = this.singletonServ.catalogVersion;
    this.slideConfig = {
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: false,
      infinite: true,
      cssEase: 'linear',
      variableWidth: true,
      variableHeight: true,
      mobileFirst: true,
      responsive: [
       
        {
          breakpoint: 768,
          settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
          }
      }
      ]
  
    };

    this.getDeviceInfo();

    if (baseSite) {
      if(baseSite.isoCode=="GB" || baseSite.isoCode=="EU"){
        this.dlRestriction=true;
      }  
      this.setLang(baseSite.lngCode);
    }
  }


  ngAfterViewInit() {
    const _baseSite = this.singletonServ;
    const baseSite = this.singletonServ.catalogVersion;
 if(baseSite.isoCode=="DE"){
  this.title.setTitle('Molton Brown – Proben und Geschenke');
}
else{
  this.title.setTitle('Molton Brown - Samples');
}
    const pageType = 'Basket Sample Page';
    this.title.setTitle('Molton Brown - Samples');
    this.gtmServ.gtmPageCategorisation(_baseSite,pageType);
     this.testimonialsSlick();
   }
   testimonialsSlick() {
    const that=this;
    let slickInterval = window.setInterval(()=>{
     if (typeof $.fn.slick == 'function') {
         that.isSlickCarouselExits=true;
         that.constructSamplePage();
         clearInterval(slickInterval)
     }else{
       const htmlScriptElement = document.createElement('script');
       htmlScriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js';
       that.elementRef.nativeElement.appendChild(htmlScriptElement);
     }
    }, 300);

}
constructSamplePage(){
  const baseSite = this.singletonServ.catalogVersion;  
  this.subscription=this.singletonServ.getMessage().subscribe(message => {
    if (message.retreiveSamples) {
      let _cartObj=message.cartObj;
      if (_cartObj) {
        this.cartEntryObj= _cartObj;
        this.totalPriceValue =
        _cartObj.totalPrice.value != 0 ? true : false;
        this.getSampleProducts();
      }
    }
  });
  if (baseSite) {
    if(baseSite.isoCode=="GB" || baseSite.isoCode=="EU"){
      this.retrieveDlRestriction();
    }
  }
  const _cartObj=this.singletonServ.cartObj;
  this.pageLoad=true;
  if (_cartObj) {
      this.cartEntryObj= _cartObj;
      this.totalPriceValue =_cartObj.totalItems != 0 ? true : false;
      this.getSampleProducts();
   }
}

  getSampleProducts() {
    this.slides = undefined;
    const baseSite=this.singletonServ.catalogVersion;
    let _sampleEntry;
    this.basketServ.getSampleProducts(baseSite).subscribe(
      resp => {
        this.slides = resp["products"];
        this.samplesCopy = resp["products"];
        const entry = _.find(
          this.singletonServ.cartObj["entries"],
          item => {
            return item.product.isSample;
          }
        );
        if (entry) {
          this.slides.map((obj,k) => {
            if (entry.product.code == obj.code) {
              obj["status"] = "added";
              obj["disabled"] = true;
            } else {
              obj["status"] = "pending";
              obj["disabled"] = false;
            }
          });
           
          setTimeout(() => {
            this.setInitialSlide();  
          }); 
         
        }
          this.pageLoad=false;
  

      },
      error => {
        this.pageLoad=false;
  });
  }
  setInitialSlide(){
    const entry = _.find(
      this.singletonServ.cartObj["entries"],
      item => {
        return item.product.isSample;
      }
    );
    if(entry){
        const  _sampleIndex = _.findIndex(
          this.slides,
          item => {
            return entry.product.code == item.code;
          }
        );
        if(_sampleIndex !== -1){
            this.slickModal.unslick(); 
            this.slickModal.config['initialSlide']=_sampleIndex;
            this.slickModal.config['arrows']=false;
            this.slickModal.config['draggable']=false;
            // this.slickModal.config['swipe']=false;
            this.slickModal.initSlick();
            this.slickModal.init;
      }
   }
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
      this.slideConfig = {
        dots: false,
        infinite: true
      };
    } else {
      this.slideConfig = {
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: false,
        infinite: false
      };
    }
  }

  onContinueShoppingEvent() {
    this.router.navigate(["store"]);
  }

  
  onSecureCheckout(bol) {
    const data={status:false};
    if(bol){
      data['status']=true;
      this.checkHazardouswithExpressPay(data);
    }else{
      this.onDispatchBasket(data);
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
onDispatchBasket(data){
  const baseSite = this.singletonServ.catalogVersion;      
  // this.singletonServ.checkoutStatus = true;
  // const obj = { checkoutStatus: true, store: false };
  // this.singletonServ.sendMessage(obj);
  if (this.singletonServ.getStoreData(baseSite.reg)) {
        if(data.status){
          this.router.navigate(["checkout", "shipping"], {
            queryParams: { expressCheckout: true, express: true },
            queryParamsHandling: "merge"
          });
        }else{
          this.router.navigate(["checkout", "shipping"]);
        }
  }else{
    this.router.navigate(["checkout","login"]);
  }
}
  showTooltip(event, index) {
    this.slides.map((obj, k) => {
      if (index == k) {
        if(obj.status){
        if(obj.status != 'pending'){
         obj["action"] = !obj["action"];
        }
        }else{
          obj["action"] = !obj["action"];
        }
      } else {
        obj["action"] = false;
      }
    });
  }


  onAddItem(event,data, k) {
    event.preventDefault();
    const baseSite = this.singletonServ.catalogVersion; 
    const sampleSize = data.size;
    const sampleName = data.productDisplayName;
    this.gtmServ.gtmAddSample(sampleSize,sampleName);
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user:any = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if (!user.code) {
      } else {
        const tokenId = user.token;
        this.storeCurrentUserBasket(
          data,
          tokenId,
          user.code,
          user.email,
          k
        );
      }
    } else{
       if (this.singletonServ.getStoreData(baseSite.guest)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.storeCurrentUserBasket(
        data,
        user.token,
        user.guid,
        'anonymous',
        k
      );
    }
  }
  }

  storeCurrentUserBasket(item, tokenId, code, _email, k) {
    const baseSite = this.singletonServ.catalogVersion;
    const productObj = {
      product: { code: item["code"] },
      quantity: 1
    };
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.basketServ
      .storesampleProducts(baseSite,productObj, tokenId, code, _email)
      .subscribe(
       ( resp:any )=> {
          let _entry=resp.entry;
          _entry['product']['isSample']=true;
          this.singletonServ.cartObj.entries.push(_entry);
          this.slides[k]["email"] = _email;
          this.slides[k]["code"] = item["code"];
          this.slides[k]["entryCode"] = code;
          this.slides[k]["entryNumber"] = resp["entry"]["entryNumber"];

          this.slickModal.unslick(); 
          this.slickModal.config['arrows']=false;
          this.slickModal.config['draggable']=false;
          // this.slickModal.config['swipe']=false;
          this.slides.map(obj => {
            if (item["code"] == obj.code) {
              obj["status"] = "added";
              obj["disabled"] = true;
            } else {
              obj["status"] = "pending";
              obj["disabled"] = false;
            }
          });
          const  _sampleIndex = _.findIndex(
            this.slides,
            slideItem => {
              return slideItem["code"]  == item.code;
            }
          );
          if(_sampleIndex !== -1){
            if(isMobile ||isTablet){
              this.slickModal.config['initialSlide']=_sampleIndex;
             }else{
               if(k >= 4){
                 this.slickModal.config['initialSlide']=k;
                }else{
                  this.slickModal.config['initialSlide']=0;
                }
           }
          }
          this.slickModal.initSlick();
          this.slickModal.init;
         },
        error => {
          if(error.error){
            if(error.error["errors"]){
              if(error.error["errors"][0]){
                  const err = error.error["errors"][0];
                  if(err.type== "InvalidTokenError") {
                    this.basketServ.generateCartToken(baseSite).subscribe(
                      (resp:any) => {
                            const _reg=(_email!='anonymous')?true:false;
                            if(_reg){
                              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                              user.token= resp["access_token"];
                              this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                              this. storeCurrentUserBasket(item, resp["access_token"], code, _email, k);
                            }else{
                              const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                              user.token= resp["access_token"];
                              this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                              this. storeCurrentUserBasket(item, resp["access_token"], code, _email, k);
                            }
                          });
                  }
          }
        }
      }
        }
      );
  }

  onRemoveItem(data, k) {
     const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const _usr = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.onRemoveSampleEntry(_usr.token, data, _usr.email, _usr.code,k);
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
      const _usr = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      this.onRemoveSampleEntry(_usr.token, data, "anonymous", _usr.guid,k);
    }
  }
  }
  onRemoveSampleEntry(token, data, email, code,k) {
    let sampleId;
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.cartObj["entries"]) {
      sampleId = _.findIndex(this.singletonServ.cartObj["entries"], (obj:any, k) => {
        return obj.product.isSample
      });
    if (sampleId !=-1) {
      const entry = this.singletonServ.cartObj["entries"][sampleId]["entryNumber"];
      this.basketServ.removeEntry(baseSite,token, email, code, entry).subscribe(
        res => {
          this.slickModal.unslick(); 
          this.slickModal.config['arrows']=true;
          this.slickModal.config['draggable']=true;
          const  _sampleIndex = _.findIndex(
            this.slides,
            slideItem => {
              return slideItem["code"]  == data.code;
            }
          );
          if(_sampleIndex !== -1){
              if(isMobile ||isTablet){
                this.slickModal.config['initialSlide']=_sampleIndex;
              }else{
                if(k >= 4){
                  this.slickModal.config['initialSlide']=k;
                  }else{
                    this.slickModal.config['initialSlide']=0;
                  }
            }
                
          }else{
            this.slickModal.config['initialSlide']=0;
          }
          // this.slickModal.config['swipe']=true;
          this.slides.map(obj => {
            obj["status"] = "";
            obj["disabled"] = false;
          });
          this.singletonServ.cartObj["entries"].splice(sampleId,1);
          this.slickModal.initSlick();
          this.slickModal.init;
         },
        error => {
          if(error.error){
            if(error.error["errors"]){
              if(error.error["errors"][0]){
                const err = error.error["errors"][0];
            if(err.type== "InvalidTokenError") {
              this.basketServ.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                      const _reg=(email!='anonymous')?true:false;
                      if(_reg){
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                        this.   onRemoveSampleEntry(resp["access_token"], data, email, code,k);
                      }else{
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this.   onRemoveSampleEntry(resp["access_token"], data, email, code,k);
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
    retrieveDlRestriction(){
      const that=this;
      const baseSite = this.singletonServ.catalogVersion;
      AmpCa.utils = new AmpCa.Utils();
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: 'https://c1.adis.ws',
          id: "ee1745a7-5e99-4c04-8882-3e121bc68cb1",
          store: 'moltonbrown',
          templateName: "acc-template-homepage",
          locale: baseSite.locale
        },
        callback: function (htm) {
          that.policyEl.nativeElement.innerHTML= htm;
          }
      });
    }
    onOpenCartModal(){
      $('#modalCheckoutPopup').animate({
        scrollTop: $('.modal-body').offset().top
      });
      setTimeout(() => {
        const _target ='#Delivery_Hazardous';
        this.waitForEl(_target, 5);
      });
    }
    waitForEl(selector, count) {
      const that=this;
     if ($(selector).length) {
     this.scrollToEl(selector);
     } else {
         if(!count) {
           count=0;
         }
         count++;
         if(count<10) {
           that.waitForEl(selector,count);
         } else {
           return;
          }
     }
   }
   scrollToEl(target){ 
    const elemq = $(target);
    if(elemq){
      if(elemq.offset()){
      this.scrollToElement(elemq);
      }
    }
  }
    scrollToElement(element) {
    this.singletonServ.scrollToElWithinC('.chck-modal-body',element)
  }
  ngOnDestroy() {
    if(this.subscription){
     this.subscription.unsubscribe();
    }
  }
}
