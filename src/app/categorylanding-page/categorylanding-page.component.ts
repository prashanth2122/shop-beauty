import {
  Inject,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  Renderer2,
  HostListener
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { CategoryComponentService } from "./categorylanding-page.service";
import { PagerService } from "../services/pager.service";
import { SingletonService } from "../services/singleton.service";
import {MetaService} from "../services/meta.service";
import { Subscription } from "rxjs";
import { GtmMethodService } from '../services/gtmmethods.service';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import { SEOService } from "../services/seo.service";

declare var AmpCa: any;
// declare var $TB:any;
declare const $: any;
@Component({
  selector: "app-categorylanding-page",
  templateUrl: "./categorylanding-page.component.html",
  styleUrls: ["./categorylanding-page.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CategorylandingPageComponent
  implements OnInit, AfterViewInit, OnDestroy {
 
    @HostListener("window:scroll", ["jQueryevent"])
    windowScroll(event) {
        const that=this;
        that.setProductFeeds();
    }
    setProductFeeds(){
      const that=this;
      const baseSite = this.singletonServ.catalogVersion;
      $(window).scroll(function(event) {
        event.stopPropagation(); 
        const windowBottom = $(this).scrollTop() + $(this).innerHeight();
        if(that.freshRelevanceSpecific){
     
        } else{
          if($('.plp_hb_specific')){
            if($('.plp_hb_specific').offset()) { 
            if($('.plp_hb_specific').offset().top < windowBottom){
            const _dataList :any= $('.plp_hb_specific').children().map(function(item,i){
                        const objectBottom = $(this).offset().top +5;
                        if (objectBottom < windowBottom) { 
                          const _getFeed=that.constructPLPFeed($(this)[0].dataset.code);
                          if(_getFeed){
                          return _getFeed
                        }
                    }
              });
              if(_dataList.length !=0){
                    if(that.feedList){
                      const _result= _.differenceWith(_dataList, that.feedList, _.isEqual);     
                      if(_result.length !=0){
                          that.gtmServe.gtmProductListPages(baseSite.isoCode,_result);
                          that.feedList=_dataList;
                      }
                    }else{
                      that.feedList=_dataList;
                      that.gtmServe.gtmProductListPages(baseSite.isoCode,_dataList);
                    }
           }
          }
          }
        }
      }

      });
    }
  @ViewChild("facetTag") facetValue: ElementRef;
  @ViewChild("parentCategory") parentCategory: ElementRef;
  categoryLandingSubscription:Subscription;
  catalogSpecific: boolean;
  navigationSubscription: any;
  searchPrdId: string;
  breadcrumb: any = [];
  routeParams: any;
  totalProducts: number;
  pager: any = {};
  pagedItems: any[];
  displayGrid: boolean;
  categorybanner: Array<any>;
  paths: string;
  freshRelevanceSpecific: boolean;
  viewAllProducts: boolean;
  searchCatId: string;
  activeProducts: boolean;
  catId: string;
  pageSize: number = 12;
  pageLoad: boolean;
  pagination: any;
  categoryResponse: any;
  facetResponse: any;
  checkList: boolean;
  openFacet: boolean;
  menuData: any;
  productreview:any;
  productreviewcount:any;
  reviewCount:any;
  feedList:Array<any>;
  outofstock:boolean;
  outofstockMessage:any;
  constructor(
    @Inject(DOCUMENT) public dom,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    private titleService: Title,    
    public translate: TranslateServiceSubService,
    public mbPagerService: PagerService,
    public categoryServ: CategoryComponentService,
    public metaService:MetaService,
    public renderer: Renderer2,
    public gtmServe: GtmMethodService,
    private seoService: SEOService,
  ) {
    this.paths = "";
    this.catalogSpecific = false;
    this.displayGrid = true;
    this.viewAllProducts = false;
    this.pageLoad = false;
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  constructPLPFeed(code){
    const _feedData=_.find(this.pagedItems,(obj)=>{
      return obj.code==code;
    });
    if(_feedData){
      const _feedPrice=(_feedData.price)?_feedData.price.value:'';
      const pageUrlCat = this.retireveCatpath(_feedData);
      const _mainCat= pageUrlCat[0].split('-').join('');
      const _subCatg=pageUrlCat[1].split('-').join('');
      const _size=(_feedData.size)?_feedData.size:'';
      const _formattedsize=_size.replace("&#44",",");
      const _catDisplayName= (_feedData.category)?_feedData.category.categoryDisplayName:_subCatg;
      const _categoryList =_catDisplayName;
      const reviewsproduct=(_feedData.stock)?_feedData.stock["stockLevelStatus"]:'outOfStock';
      if(reviewsproduct=="inStock"){
        this.productreview="True";
      } else{
        this.productreview="False";
      }
      if(_feedData.productAverageRating){
        this.productreviewcount=_feedData.productAverageRating;
        this.reviewCount=_feedData.reviewCount;
      }
      else{
        this.productreviewcount=0;
        this.reviewCount=0;
      }
      const _item={
        'name': _feedData.productDisplayName,      
        'id': _feedData.code,
        'productPrice': '',
        'brand': 'Molton Brown',
        'category': _mainCat,
        'list': _categoryList,
        'variant': (_feedData.variantProduct)?(_feedData.variantProduct):'',
        'position': _feedData.id,
        'dimension3': (_formattedsize)?_formattedsize:"",
        'dimension4': this.productreviewcount,
        'dimension5': this.reviewCount,
        'dimension6': this.productreview,
        'dimension12':  this.productreview,    
        'dimension13': (_feedData.stock["stockLevel"])?_feedData.stock["stockLevel"]:'',
        'dimension14': (_feedData.productEdition)?_feedData.productEdition:'',
        'metric2': _feedPrice
      }
      if(_feedData.originalPrice){
        const originalPrice= _feedData.originalPrice;
        const _originalPrice = originalPrice.match(/[\d\.]+/);
        if(_originalPrice){
          _item['productPrice']=_originalPrice[0];
        }else{
          _item['productPrice']=originalPrice;
        }
        }else{
          _item['productPrice']=_feedPrice;
        }
      return _item;
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  fetchCatalogProducts() {
    this.navigationSubscription = this.route.params.subscribe(params => {
      this.routeParams = params;
      if (params.categoryId) {
          const queryStatus = this.route.snapshot.queryParamMap.get("viewAllCat");
          // const cookieSearch = this.singletonServ.getCookie("searchId");
          let prdId = "/search?query=:relevance:category:" + params.categoryId;
          this.catId = params.categoryId;
          // if (cookieSearch.length != 0) {
          //   const data = JSON.parse(cookieSearch);
          //   if (data.catId == params.productid) {
          //     prdId = data.id;
          //   }
          // }
          this.searchCatId = params.categoryId;
          this.searchPrdId = prdId;
          if (queryStatus) {
            this.catalogSpecific = true;
            this.freshRelevanceSpecific = false;
            let prdId = "/search?query=:relevance:category:" + params.categoryId;
            this.getCategoryData(prdId, true, this.pageSize);
          } else {

            this.wrapFRslots();
            this.freshRelevanceSpecific = true;            
            this.pageLoad = true;
          }
      } else if (params.productid) {
        // const cookieSearch = this.singletonServ.getCookie("searchId");
        let prdId = "/search?query=:relevance:category:" + params.productid;
        this.catId = params.productid;
        // if (cookieSearch.length != 0) {
        //   const data = JSON.parse(cookieSearch);
        //   if (data.catId == params.productid) {
        //     prdId = data.id;
        //   }
        // }
        this.searchPrdId = prdId;
        this.getCategoryData(prdId, true, this.pageSize);
      }
      if (params.categoryname) {
        this.catalogSpecific = true;
      }

    });
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
  constructCatBanner(_catData) {
    const that=this;
    if (_catData) {
      this.navigationSubscription = this.route.params.subscribe(params => {
        if (params.categoryId) {
          that.setBannerContent(_catData, params.categoryId);
        }else if (params.productid) {
          that.setBannerContent(_catData, params.productid);
        }
      });

    }
  }

  setBannerContent(_catData, _catId){
    const that=this;
    const _breadCrumb = this.findCat(_catData, _catId);         
    if (_breadCrumb) {
          if(_breadCrumb[1]){
            if(!_breadCrumb[1].isL3){
              _breadCrumb.splice(1, 1);
              this.breadcrumb = _breadCrumb;
            } else {
              this.breadcrumb = _breadCrumb;
            }
        } else {
          this.breadcrumb = _breadCrumb;
        }
    }else{
      this.router.navigate(['store','404']);
    }
    for (let obj of _catData) {
      const result = this.getCatalogtree(obj, _catId);
      if (result) {
        this.titleService.setTitle(result.seoTitle);
        this.categorybanner = result;
        break;
      }else{
      }
    }
  }
  wrapFRslots(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    // let _FR=$TB;
    this.categoryServ.getStaticContent(baseSite.lngCode).subscribe((response:any)=>{
      if(response){
          that.parentCategory.nativeElement.innerHTML = response.parentProductLandingPage.slotId;
        //   if(_FR){
        //     _FR.loadPageSlots();
        //  }
      }
    },err=>{

    });
  }
  ngOnInit() {
    
    const baseSite = this.singletonServ.catalogVersion;
    const message = this.singletonServ.menudata;
    if (message) {
      this.constructCatBanner(message);
    }
    this.fetchCatalogProducts();
    this.metaService.createCanonicalURL();

    
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }

  ngAfterViewInit() {
    const that=this;
    this.singletonServ.getMessage().subscribe(message => {
      if (message.catgories) {
        this.menuData = message.catgories;
        this.singletonServ.menudata = message.catgories;
        this.constructCatBanner(message.catgories);
      } else if(message.outofStock){
        that.outofstock=true;
        that.outofstockMessage=message.outofStock.message;
      }
    });

    if (this.freshRelevanceSpecific) {
      let _element = this.dom.querySelectorAll("#frProduct");
      this.totalProducts = _element.length;
    }
    const _baseSite = this.singletonServ;     
    const pageType = 'Category Landing Page';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
  }
  catbanner(catgories, _catId){
    const _breadCrumb = this.findCat(catgories, _catId);
    if (_breadCrumb) {
         if(_breadCrumb[1]){
       if(!_breadCrumb[1].isL3){
        _breadCrumb.splice(1, 1);
        this.breadcrumb = _breadCrumb;
    } else {
      this.breadcrumb = _breadCrumb;
    }
  } else {
    this.breadcrumb = _breadCrumb;  
  }
}
    for (let obj of catgories) {
      const result = this.getCatalogtree(obj, _catId);
      if (result) {
        this.titleService.setTitle(result.seoTitle);
        this.categorybanner = result;
        break;
      }
    }
  }
  getCatalogtree(obj, targetId) {
    if (obj.id.toLowerCase() === targetId.toLowerCase()) {
      return obj;
    }
    if (obj.subcategories) {
      for (let item of obj.subcategories) {
        let check = this.getCatalogtree(item, targetId);
        if (check) {
          return check;
        }
      }
    }
    return null;
  }
  findCat(array, id) {
    if (typeof array != "undefined") {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id.toLowerCase() == id.toLowerCase()) {
          return [array[i]];
        }
        if(array[i]){
        if(array[i].subcategories){
        var a = this.findCat(array[i].subcategories, id);
        if (a != null) {
          a.unshift(array[i]);
          return a;
        }
       }
       }
      }
    }
    return null;
  }
  /* category level call */
  onviewAllClick(event) {
    this.freshRelevanceSpecific = false;
    let prdId = "/search?query=:relevance:category:" + this.catId;
    const pageSize = 123;
    this.catalogSpecific = true;
    this.pager = false;
    this.viewAllProducts = true;
    this.getCategoryData(prdId, true, pageSize);
  }
  fetchProductNextperPage(data: any) {
    const status = data.status;
    this.singletonServ.scrollToTarget('#rich_cart');
    if (!status) {
      let page = this.pagination.currentPage + 1;
      let prdId = "/search?query=:relevance:category:" + this.catId;
      const id = prdId + this.paths + "&currentPage=" + page;
      this.getCategoryData(id, false, this.pageSize);
    } else {
      const _pageNumber = this.pagination.currentPage - 1;
      let prdId = "/search?query=:relevance:category:" + this.catId;
      const id = prdId + this.paths + "&currentPage=" + _pageNumber;
      this.getCategoryData(id, false, this.pageSize);
    }
  }
  fetchProductperPage(data) {
    this.pageLoad = false;
    this.viewAllProducts = false;
    const pgNo = data["pageId"] - 1;
    let prdId = "/search?query=:relevance:category:" + this.catId;
    const id = prdId + this.paths + "&currentPage=" + pgNo;
    this.singletonServ.scrollToTarget('#rich_cart');
    this.getCategoryData(id, false, this.pageSize);
  }

  sortByCahnge() {}

  onViewAllProducts() {
    this.freshRelevanceSpecific = false;
    this.catalogSpecific = true;
    const productname = this.routeParams.productname;
    const categoryId = this.routeParams.categoryId;
    this.router.navigate(["store", productname, categoryId], {
      queryParams: { viewAllCat: true },
      queryParamsHandling: "merge"
    });
  
  }

  //swap products
  swapproducts(products, oldIndex, newIndex) {
    var temp = products[oldIndex];
    products[oldIndex] = products[newIndex];
    products[newIndex] = temp;
  }



  //filters functions
  onShowFirstPage() {
    this.singletonServ.scrollToTarget('#rich_cart');
    this.pager = true;
    this.viewAllProducts = false;
    this.freshRelevanceSpecific = false;
    let prdId = "/search?query=:relevance:category:" + this.catId;
    const pageSize = 12;
    this.getCategoryData(prdId, true, pageSize);
  }
  onCheckRefineFacet() {
    this.openFacet = !this.openFacet;
  }
  onRefetchProducts(data) {
    let prdId = "/search?query=:relevance:category:" + this.catId;
    if (data.id.length == 0) {
      this.checkList = false;
    } else {
      this.checkList = true;
    }
    this.paths = data.id;
    this.searchPrdId = prdId + this.paths;
    this.getCategoryData(this.searchPrdId, false, 12);
  }
  onClearAll() {
    let prdId = "/search?query=:relevance:category:" + this.catId;
    this.checkList=false;
    this.getCategoryData(prdId, true, this.pageSize);
  }

  //tabs
  onUpdateFilterData(data) {}
  updateFilterData(event, valueData, i) {}
  onMbFilterByClick() {}
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.categoryLandingSubscription){
    this.categoryLandingSubscription.unsubscribe();
   } 
  }
  sortByChange(data) {    
    let prdId = "/search?query=:relevance:category:" + this.catId;
    if(data.value=="displayName:ascending"){
      this.getCategoryData(prdId, true, this.pageSize,'name-asc');
    }else if(data.value == "displayName:descending"){
      this.getCategoryData(prdId, true, this.pageSize,'name-desc');
    }else if(data.value=="price:ascending"){
      this.getCategoryData(prdId, true, this.pageSize,'price-asc');
    }else if(data.value=="price:descending"){
      this.getCategoryData(prdId, true, this.pageSize,'price-desc');
    }
  }
  onGridClick(data) {
    const _bol = data.status;
    if (_bol) {
      this.displayGrid = true;
    } else {
      this.displayGrid = false;
    }
    let _element = this.dom.querySelectorAll("#frProduct");
    if (_element != null) {
      for (var i = 0; i < _element.length; i++) {
        if (!_bol) {
          _element[i].classList.remove("col-md-4");
          _element[i].classList.remove("col-sm-4");
          _element[i].classList.remove("col-xs-6");
          _element[i].classList.remove("col-xxs-6");

          _element[i].classList.add("col-md-6");
          _element[i].classList.add("col-sm-6");
          _element[i].classList.add("col-xs-12");
          _element[i].classList.add("col-xxs-12");
        } else {
          _element[i].classList.remove("col-md-6");
          _element[i].classList.remove("col-sm-6");
          _element[i].classList.remove("col-xs-12");
          _element[i].classList.remove("col-xxs-12");

          _element[i].classList.add("col-md-4");
          _element[i].classList.add("col-sm-4");
          _element[i].classList.add("col-xs-6");
          _element[i].classList.add("col-xxs-6");
        }
      }
    }
  }
    //category Related Call
    getCategoryData(id, facets, pageSize,sort?) {
      const that = this;      
      const queryStatus = this.route.snapshot.queryParamMap.get("viewAllCat");
      const baseSite = this.singletonServ.catalogVersion;
      const _searchId = {
        id: id,
        catId: this.searchCatId
      };
      // this.singletonServ.setCookie("searchId", JSON.stringify(_searchId));
      const indexArray = [];
      this.pageLoad = false;
      this.categoryLandingSubscription= this.categoryServ.getMBProduct(baseSite,id,pageSize,sort).subscribe(
        (resp:any) => { 
          if (resp) {
          } else {
            this.pageLoad = true;
          }
          resp['category']=(queryStatus)?undefined:that.categorybanner;
          this.categoryResponse = resp;
          const categoryAlternateURLs = this.categoryResponse.categoryAlternateURLs;
          if(categoryAlternateURLs){
            const urls = categoryAlternateURLs.entry;
            for(var i = 0; i < urls.length; i++) {
              switch(urls[i].key){
                case "x-default":
                  this.seoService.updateAlternateLink("x-default", urls[i].value);
                  break;
                case "en-gb":
                  this.seoService.updateAlternateLink("en-gb", urls[i].value);
                  break;
                case "en-us":
                  this.seoService.updateAlternateLink("en-us", urls[i].value);
                  break;
                case "en-ca":
                  this.seoService.updateAlternateLink("en-ca", urls[i].value);
                  break;
                case "en-de":
                  this.seoService.updateAlternateLink("en-de", urls[i].value);
                  break;
                case "de-de":
                  this.seoService.updateAlternateLink("de-de", urls[i].value);
                  break;
                case "en-eu":
                  this.seoService.updateAlternateLink("en-eu", urls[i].value);
                  break;
                case "en":
                  this.seoService.updateAlternateLink("en", urls[i].value);
                  break;
                default:
                  break;
              }
            }
          }
          _.forEach(resp["products"], function(value, i) {
            _.assignIn(value, {
              category: (queryStatus)?undefined:that.categorybanner,
              redirectUrl: resp["keywordRedirectUrl"],
              show: false,
              id: i + 1
            });
            if (value.isDummy) {
              value["currentIndex"] = i;
              const obj = {
                oldindex: i,
                newIndex: 4
              };
              indexArray.push(obj);
              AmpCa.utils.getHtmlServiceData({
                auth: {
                  baseUrl: "https://c1.adis.ws",
                  id: value.code,
                  store: "moltonbrown",
                  templateName: "acc-template-card",
                  locale: "en-GB"
                },
                callback: function(data) {
                  _.assignIn(value, { htmlData: data });
                }
              });
            }
          });
          const prodPaginator = resp["pagination"];
          this.pagination = resp["pagination"];
          const products = resp["products"];
          if (indexArray.length >= 1) {
            _.forEach(indexArray, function(value, i) {
              that.swapproducts(products, value.oldindex, value.newIndex);
            });
          }
          this.totalProducts = prodPaginator["totalResults"];
          this.pagedItems = products;
          this.activeProducts = products ? true : false;
          const _facetObj = {
            facets: resp["facets"],
            status: facets
          };
          this.facetResponse = _facetObj;
          this.pageLoad = true;
        //  this.setProductFeeds();
        setTimeout(()=>{
          that.sendInitialFeed();
        })
        },
        (err:any) => {
          this.pageLoad = true;
          if(err.error){
             if(err.error.errors){
                if(err.error.errors[0].type=='UnknownIdentifierError'){
                  that.router.navigate(['store','404']);
                }
             }
          }

        }
      );
    }
    sendInitialFeed(){
      const that = this;
      const dataLayaer=[];
      const baseSite = this.singletonServ.catalogVersion;
      if($('.plp_hb_specific')){
        if($('.plp_hb_specific').offset()) { 
        if($('.plp_hb_specific').offset().top ){
        const _dataList :any= $('.plp_hb_specific').children().map(function(item,i){
          if(!that.isScrolledIntoView(this)){
                const _getFeed=that.constructPLPFeed($(this)[0].dataset.code);
                if(_getFeed){
                    dataLayaer.push(_getFeed);
                 }
          }
          });
          if(dataLayaer.length !=0){
            if(that.feedList){
              const _result= _.differenceWith(dataLayaer, that.feedList, _.isEqual); 
                
               if(_result.length !=0){
    
                  that.gtmServe.gtmProductListPages(baseSite.isoCode,_result);
                  that.feedList=_dataList;
              }
          }else{
            if(dataLayaer.length ==4){
              const _feeds=dataLayaer;
              _feeds.splice(3,1);
              that.feedList=_feeds;
              that.gtmServe.gtmProductListPages(baseSite.isoCode,_feeds);
            }else{
              that.feedList=dataLayaer;
              that.gtmServe.gtmProductListPages(baseSite.isoCode,dataLayaer);
            }

          }
         }
    }
  }
}
}

    isScrolledIntoView(elem) {
      const elementTop = $(elem).offset().top;
      const elementBottom = elementTop + $(elem).outerHeight();    
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height();    
      return elementBottom > viewportTop && elementTop > viewportBottom;
    }
}
