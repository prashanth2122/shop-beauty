import { 
  Inject,
  Component,
  OnDestroy,
  ElementRef, 
  ViewEncapsulation,
  OnInit,
  HostListener, 
  AfterViewInit,
  NgZone
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import {MetaService} from "../services/meta.service";
import { ResizeService } from '../services/resize.service';
import { CookieService } from 'ngx-cookie-service';
import { SCREEN_SIZE } from '../services/screen-size.enum';
import { SingletonService } from "../services/singleton.service";
import {AmpHomePageService} from './amp-homepage.service';
import {ActivatedRoute} from "@angular/router";
import { Title } from "@angular/platform-browser";
import { GtmMethodService } from '../services/gtmmethods.service';
import * as _ from "lodash";
declare var AmpCa: any;
declare var $:any;
// declare var $TB:any;
declare var crl8:any;
declare function attachComponents():any;
declare var window:any;

@Component({
  selector: "app-amp-homepage",
  templateUrl: "./amp-homepage.component.html",
  styleUrls: ["./amp-homepage.component.scss"],  
  encapsulation: ViewEncapsulation.None
})
export class AmpHomepageComponent implements OnInit,AfterViewInit,OnDestroy {
  prefix = 'is-';
  checkExist:any;
  sizes = [
    {
      id: SCREEN_SIZE.XS, name: 'xs',
      css: `d-block d-sm-none`
    },
    {
      id: SCREEN_SIZE.SM, name: 'sm',
      css: `d-none d-sm-block d-md-none`
    },
    {
      id: SCREEN_SIZE.MD, name: 'md',
      css: `d-none d-md-block d-lg-none`
    },
    {
      id: SCREEN_SIZE.LG, name: 'lg',
      css: `d-none d-lg-block d-xl-none`
    },
    {
      id: SCREEN_SIZE.XL, name: 'xl',
      css: `d-none d-xl-block`
    }
  ];
  scrollFeedList:Array<any>=[];
  @HostListener("window:resize", [])
   onResize() {

  }
  @HostListener("window:scroll", ["$event"])
  windowScroll() {
    const that=this;
    const dataLayer=[];
    const baseSite = this.singletonServ.catalogVersion;
    const currentSize = this.sizes.find(x => {
      const el = that.elementRef.nativeElement.querySelector(`.${that.prefix}${x.id}`);

      const isVisible = window.getComputedStyle(el).display != 'none';

      return isVisible;
    });
if(currentSize.name== "lg" || currentSize.name== "xl" || currentSize.name== "md"){  
    $(window).scroll(function(event) {
      var windowBottom = $(this).scrollTop() + $(this).innerHeight();
      $(".amp-dc-card-wrap").each(function() {
        var objectBottom = $(this).offset().top +5;
        if (objectBottom < windowBottom) { 
         if ($(this).css("opacity")==0) {
            $(this).addClass("fade-wrapper");
            if(that.isScrolledIntoView(this) ){
             const _dataSet=$(this)[0].dataset;
              if(_dataSet.promoid){
                const _data= {
                    'id': _dataSet.promoid,            
                    'name':_dataSet.promoname,
                    'creative': (_dataSet.promocreative)?(_dataSet.promocreative):'',
                    'position': _dataSet.promoposition
                };
                that.gtmServe.gtmScrollPromoImpressions(_data);
              
              }
              }
          }
         } else {
          if ($(this).css("opacity")==1) {
              $(this).removeClass("fade-wrapper");
          }
        }
      });
    }); 
  }
  }

  param1:any;
  feedList:Array<any>=[];
  isocode:string;
  ukcountrysite:boolean;
  progress:number=0;
  enablecurlateHeading:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ: SingletonService,
    public cookieService: CookieService,
    public ampHomeServ:AmpHomePageService,
    public elementRef: ElementRef, 
    public resizeSvc: ResizeService,
    private route: ActivatedRoute,
    public metaService:MetaService,
    public titleService: Title,
    public gtmServe: GtmMethodService,
    private _ngZone: NgZone
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.route.queryParams.subscribe(params => {
      this.param1 = params['api'];    
  });
  this.isocode=baseSite.isoCode;
  if(baseSite.isoCode =="GB"){
    this.ukcountrysite=true;
  }
  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    const _baseSite = this.singletonServ;
    this.metaService.createCanonicalURL();
    const allCookies: {} = this.cookieService.getAll();
    // if(baseSite.isoCode=='GB'){
    //   if(allCookies['cookiestored-gb']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }

    //  if(baseSite.isoCode=='US'){
    //   if(allCookies['cookiestored-US']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }

    //  if(baseSite.isoCode=='EU'){
    //   if(allCookies['cookiestored-eu']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // }

    //  if(baseSite.isoCode=='DE'){
    //   if(allCookies['cookiestored-de']){
    //     document.getElementById("cookie").style.display="none";
    //   }
    // } 
    if (baseSite) {
       this.setLang(baseSite.lngCode);
    }
  }
  GTMdetails(){
  }
  ngAfterViewInit(){
    const that=this;
    const _baseSite = this.singletonServ;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=='GB'){
      that. enablecuralate();
    }
    const pageType = 'Home page';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);

  }
  detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);

      const isVisible = window.getComputedStyle(el).display != 'none';

      return isVisible;
    });

    this.resizeSvc.onResize(currentSize.id);
  }
  setLang(lng) {
      const that=this;
      this.ampHomeServ.getI8nContent(lng).subscribe((response:any) => {
        that.titleService.setTitle(response.titleBar);
      });
     this.ampHomeServ.getStaticContent(lng).subscribe((response:any) => {
      that.singletonServ.appLocaleData = response;
      const _data = response["ampHome"];
      _data.sort((a, b) => {
        return a.order - b.order;
      });
      that.setAmpContent(_data);
    });
  }
  setAmpContent(data) {
    const that=this;
    let counter=0;
    const baseSite = this.singletonServ.catalogVersion;
    let api;
    if(this.param1){
      api="https://"+this.param1;
    }else{
      api="https://c1.adis.ws";
    }
    const _ampContent=data;
    data.forEach((obj,k) => {
      if(AmpCa){
      AmpCa.utils = new AmpCa.Utils();
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: api,
          id: obj.content,
          store: "moltonbrown",
          templateName: obj.templateName,
          locale: baseSite.locale
        },
        callback: function(data) {
          if (data) {
            counter++;
            if(that.dom.querySelectorAll(obj.identifier)[0]){
             that.dom.querySelectorAll(obj.identifier)[0].innerHTML = data;
           }
           if(obj.identifier == "#heritageSlot"){
     
            }
            if(_ampContent.length === counter){
              setTimeout(()=>{
               that.sendPromotionFeed();
              },500);
            }
          }
        }
      });
    }
    });
    setTimeout(() => {
      attachComponents();
    }, 4000);
  }
  sendPromotionFeed(){
    const that=this;
    const dataLayer=[]; 
    $('.amp-dc-card-wrap').map(function(item,i){
      const bounding:any = this.getBoundingClientRect();
                  const _dataSet=$(this)[0].dataset;
                  if (that.isScrolledIntoView(this)) {
                    if(_dataSet.promoid){
                      const _dataList= {
                          'id': _dataSet.promoid,            
                          'name':_dataSet.promoname,
                          'creative': (_dataSet.promocreative)?(_dataSet.promocreative):'',
                          'position': _dataSet.promoposition
                      };
                      dataLayer.push(_dataList);
                 }
                  }
          
      });
      that.gtmServe.gtmPromoImpressions(dataLayer);
  }
  isScrolledIntoView(elem) {
    var elementTop = $(elem).offset().top;
    var elementBottom = elementTop + $(elem).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }
  scrolldown(){
    var id=document.getElementById("dlBannerslot")
    this.ampHomeServ.scrollToTargetElement(id);

  }
  enablecuralate(){
    const that=this;
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
          crl8.ready(function() {
            if(typeof  crl8 !="undefined"){
                crl8.getAllExperiences().then((crl)=>{
                 if(crl.length ==0){
                   crl8.createExperience('custom-homepage'); 
                   that.enablecurlateHeading=true;
                 }
               });
             }
        });
      });
    });
  }
  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);
    if (this.progress < 70) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
 async destroyCuralate(){
   console.log("destroy starts");
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=='GB'){
     await this._ngZone.runOutsideAngular(() => {
            crl8.destroyAllExperiences();
            console.log("destroy ends");
      });
  }
 }
 async ngOnDestroy(){
    await this.destroyCuralate();    
  }
}