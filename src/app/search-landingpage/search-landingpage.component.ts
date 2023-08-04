import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  HostListener
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import {CategoryComponentService} from '../categorylanding-page/categorylanding-page.service';
import { PagerService } from "../services/pager.service";
import { SingletonService } from "../services/singleton.service";
import { TranslateService } from "./../translate.service";
import {MetaService} from "../services/meta.service";
import { GtmMethodService } from '.././services/gtmmethods.service';

import "../../assets/js/handlebars_helpers";
// declare var $TB:any;
declare const $:any;
@Component({
  selector: 'app-search-landingpage',
  templateUrl: './search-landingpage.component.html',
  styleUrls: ['./search-landingpage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchLandingpageComponent
  implements OnInit,AfterViewInit, OnDestroy {
     
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
                          const _getFeed=that.constructPLPFeed($(this)[0].dataset.code,i);
                          if(_getFeed){
                          return _getFeed
                        }
                    }
              });
              if(_dataList.length !=0){
              if(that.feedList){
                const _result= _.differenceWith(_dataList, that.feedList, _.isEqual);     
                 if(_result.length !=0){
                    that.gtmServ.gtmProductListPages(baseSite.isoCode,_result);
                    that.feedList=_dataList;
                }
            }else{
              that.feedList=_dataList;
              that.gtmServ.gtmProductListPages(baseSite.isoCode,_dataList);
            }
           }
          }
          }
        }
      }

      });
    }
  @ViewChild("facetTag") facetValue: ElementRef;
  @ViewChild("customerFav") customerFav: ElementRef;
  searchDisplay: boolean;
  paramcode: string;
  facets: Array<any>;
  catalogSpecific: boolean;
  navigationSubscription: any;
  searchPrdId: string;
  breadcrumb: any=[{name:"SEARCH",search:true},{name:"MY SEARCH",search:true}];
  routeParams: any;
  categoryData: Array<any>;
  totalProducts: number;
  currentPage: number;
  pager: any = {};
  pagedItems: any[];
  displayGrid: boolean;
  parentCatName: string;
  productname: string;
  categorybanner: Array<any>;
  IsmodelShow: boolean;
  refineFacets: Array<any>;
  mbFacet: boolean;
  refinePath: string;
  checkedfilter: boolean;
  showFacets: boolean;
  checkList: boolean = false;
  paths: string;
  showFacetVal: boolean;
  freshRelevanceSpecific: boolean;
  viewAllProducts: boolean;
  pageNumber: number;
  checkedCount: number;
  checkedData: any = [];
  searchCatId: string;
  freeSearchText: string;
  spellingSuggestion: any;
  activeProducts: boolean;
  totalNumber: Array<any>;
  catId: string;
  pageSize: number = 12;
  pageLoad: boolean;
  pagination: any;
  sortId: number;
  categoryResponse:any;
  facetResponse:any;
  filterQuery:string='';
  outofstock:boolean;
  outofstockMessage:any;
  feedList:Array<any>;
  constructor(
    private el: ElementRef,
    private titleService: Title,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public mbPagerService: PagerService,
    public categoryServ: CategoryComponentService,
    public metaService:MetaService,
    private translate: TranslateService,
    public gtmServ:GtmMethodService
  ) {
    this.paths = "";
    this.showFacets = true;
    this.categoryData = [];
    this.checkedCount = 1;
    this.catalogSpecific = false;
    this.displayGrid = true;
    this.facets = [{}];
    this.refinePath = "";
    this.IsmodelShow = false;
    this.mbFacet = true;
    this.viewAllProducts = false;
    this.pageNumber = 0;
    this.pageLoad = false;
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
 

  }


  fetchCatalogProducts(){
    const that=this;
    this.navigationSubscription = this.route.params.subscribe(params => {
      that.routeParams = params;
      that.searchDisplay = true;
      that.searchPrdId = params.searchId;
      that.catId=params.searchId;
      that.paramcode = params.searchId;
      that.renderSearchRelatedpage(that.searchPrdId, true, this.pageSize);
    });
  }
  ngOnInit() {
      const _host = this.location['_platformStrategy']._platformLocation.location.href;
      this.titleService.setTitle(_host);
      this.fetchCatalogProducts();    
      this.metaService.createCanonicalURL();
      const baseSite = this.singletonServ.catalogVersion;
      if(baseSite){
        this.setLang(baseSite.lngCode);
      }

      
  }
  ngAfterViewInit(){
    const that=this;
    this.singletonServ.getMessage().subscribe(message => {
           if(message.outofStock){
             that.outofstock=true;
             that.outofstockMessage=message.outofStock.message;
       }
    });
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  wrapFRslots(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    this.categoryServ.getStaticContent(baseSite.lngCode).subscribe((response:any)=>{
      if(response){
        if(that.customerFav){
        that.customerFav.nativeElement.innerHTML = response.searchCategory.slotId; 
      }
      }
    },err=>{

    });
  }



  /* category level call */

  onviewAllClick(event) {
    this.freshRelevanceSpecific = false;
    let prdId = this.searchPrdId;
    const pageSize = 123;
    this.catalogSpecific = true;
    this.pager = false;
    this.viewAllProducts = true;
    this.renderSearchRelatedpage(prdId, true, pageSize);
  }

  fetchProductNextperPage(data:any) {
  const status=data.status;
  this.pageLoad = false;
  this.singletonServ.scrollToTarget('#rich_cart');
  if (!status) {
      let page = this.pagination.currentPage + 1;
      this.pageNumber = page;
      const id = this.paramcode +  this.filterQuery + "&currentPage=" + page;
      this.renderSearchRelatedpage(id, false, 12);
  } else {
    const _pageNumber = this.pagination.currentPage - 1;
    this.pageNumber = _pageNumber;
        const id =
          this.paramcode +
          this.filterQuery +
          "&currentPage=" +
          _pageNumber;
           this.renderSearchRelatedpage(id, false, 12);
  }
  }

  fetchProductperPage(data) {
    const page=data.page;
    this.pageLoad = false;
    this.viewAllProducts = false;
    this.pageNumber = page["content"];
    const pgNo=data["pageId"]-1;
    const id =this.paramcode +this.filterQuery +"&currentPage=" +pgNo;
    this.viewAllProducts = false;
    this.singletonServ.scrollToTarget('#rich_cart');
    this.renderSearchRelatedpage(id, false, 12);

  }
  
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

  //search related call

  renderSearchRelatedpage(searchId, facets, pageSize) {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    this.catalogSpecific = true;  
    this.singletonServ.setStoreData('searchId',JSON.stringify(searchId));
    // this.singletonServ.setCookie("searchId", searchId);
    this.categoryServ
      .getCategorySearchResults(baseSite,searchId, pageSize)
      .subscribe((resp:any) => {
        if(resp.keywordRedirectUrl){
          if(resp.keywordRedirectUrl !=''){
              const _keywordRedirectUrl=resp.keywordRedirectUrl;
              if (_keywordRedirectUrl.indexOf("/c/") != -1) {
                const _replaceUrl = _keywordRedirectUrl.replace("/c/", "/");
                const _url = "/store" + _replaceUrl;
                this.router.navigate([_url]);
              } else if(_keywordRedirectUrl.indexOf("/p/") != -1){
                const _replaceUrl = _keywordRedirectUrl.replace("/p/", "/");
                const _url = "/store" + _replaceUrl;
                this.router.navigate([_url]);
              }       
          }else{
            this.constructSearchLandingPage(resp,facets);
          }
        } else {
          this.constructSearchLandingPage(resp,facets);
        }
          
        },
        error => {
          this.pageLoad = true;
        }
      );
  }
constructSearchLandingPage(resp,facets){
  const that=this;
  this.pageLoad = true;
          this.categoryResponse=resp;
          const products = resp["products"];
          const prodPaginator = resp["pagination"];
          this.pagination = resp["pagination"];
          _.forEach(products, function(value, i) {
            _.assignIn(value, {
              redirectUrl:resp['keywordRedirectUrl'],
              show: false,
              id: i + 1,
              category:that.categorybanner
            });
          });
          const _facetObj ={
            facets:resp["facets"],
            status:facets
          }
          this.facetResponse=_facetObj;
          this.categoryData = products;
          this.pagedItems = products;
          if(products){
            that.activeProducts = (products.length !=0) ? true : false;
          }else{
            that.activeProducts =false;
          }
          this.totalProducts = prodPaginator["totalResults"];
          this.currentPage = prodPaginator["currentPage"];
          this.freeSearchText = resp["freeTextSearch"];
          this.spellingSuggestion = resp["spellingSuggestion"];
          var searchTerm = this.freeSearchText;
          this. wrapFRslots();
          if((products.length ==0)){           
          this.gtmServ.gtmZeroSearchResults(searchTerm);
          }
}
  //filters functions
  onShowFirstPage() {
    this.pager = true;
    this.viewAllProducts = false;
    this.freshRelevanceSpecific = false;
    const pageSize = 12;
    this.pageLoad=false;
    this.singletonServ.scrollToTarget('#rich_cart');
    this.renderSearchRelatedpage(this.paramcode, true, pageSize);
  }

  onRefetchProducts(data){ 
    const _facetQuery= data.id.replace(new RegExp(':relevance:', 'g'), ':');;
    this.filterQuery=':relevance'+_facetQuery;
    const id =this.paramcode+this.filterQuery;
    this.pageLoad=false;
    this.renderSearchRelatedpage(id, false, 12);
  }
  onClearAll() {
      this.checkList = false;
      this.showFacets = true;     
      this.pageLoad=false; 
      this.renderSearchRelatedpage(this.paramcode, true, this.pageSize);   
  }
  onFacetClicked(filterData, sortId) {
    this.facets[sortId]["checked"] = !this.facets[sortId]["checked"];
  }


  //tabs
  updateFilterData(event, valueData, i) {
    const sortId = this.sortId;
    this.checkList = false;
    this.checkedfilter = true;
  }
  onMbFilterByClick() {
    this.refinePath = "";
    this.refineFacets = [];
    this.mbFacet = true;
    this.IsmodelShow = true;
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  sortByChange(){

  }
  onGridClick(data) {
    const _bol=data.status;
    if (_bol) {
      this.displayGrid = true;
    } else {
      this.displayGrid = false;
    }  
 }
 onShowStore(){
  this.router.navigate(['store','company','stores']);
 }
 sendInitialFeed(){
  const that = this;
  const baseSite = this.singletonServ.catalogVersion;
  if($('.plp_hb_specific')){
    if($('.plp_hb_specific').offset()) { 
    if($('.plp_hb_specific').offset().top ){
    const _dataList :any= $('.plp_hb_specific').children().map(function(item,i){
      if(!that.isScrolledIntoView(this)){
            const _getFeed=that.constructPLPFeed($(this)[0].dataset.code,i);
            if(_getFeed){
               return _getFeed;
             }
         }
      });
      if(_dataList.length !=0){
        if(that.feedList){
          const _result= _.differenceWith(_dataList, that.feedList, _.isEqual); 
            
           if(_result.length !=0){
              that.gtmServ.gtmProductListPages(baseSite.isoCode,_result);
              that.feedList=_dataList;
          }
      }else{
        if(_dataList.length ==4){
          const _feeds=_dataList;
          _feeds.splice(3,1);
          that.feedList=_feeds;
          that.gtmServ.gtmProductListPages(baseSite.isoCode,_feeds);
        }else{
          that.feedList=_dataList;
          that.gtmServ.gtmProductListPages(baseSite.isoCode,_dataList);
        }

      }
     }
}
}
}
}

constructPLPFeed(code,position){
  const _feedData=_.find(this.pagedItems,(obj)=>{
    return obj.code==code
  });
  if(_feedData){
    const _feedPrice=(_feedData.price)?_feedData.price.value:'';
    const pageUrlCat = this.retireveCatpath(_feedData);
    const _mainCat= pageUrlCat[0].split('-').join('');
    const _subCatg=pageUrlCat[1].split('-').join('');
    const _size=_feedData.size;
    const _formattedsize=_size.replace("&#44",",");
    const _catDisplayName= (_feedData.category)?_feedData.category.categoryDisplayName:_subCatg;
    const _categoryList =_catDisplayName;
    const _stockStatus=(_feedData.stock)?(_feedData.stock.stockLevelStatus == "inStock")? 'True' : 'False':'False';
    const _stockLevel=(_feedData.stock)?(_feedData.stock["stockLevel"])?_feedData.stock["stockLevel"]:'':'';
    const _item={
      'name': _feedData.productDisplayName,      
      'id': _feedData.code,
      'productPrice': '',
      'brand': 'Molton Brown',
      'category': _mainCat,
      'list': _categoryList,
      'variant': (_feedData.variantProduct)?(_feedData.variantProduct):'',
      'position': position+1,
      'dimension3': (_formattedsize)?_formattedsize:"",
      'dimension4': (_feedData.productAverageRating)?(_feedData.productAverageRating):'0',
      'dimension5': (_feedData.reviewCount)?(_feedData.reviewCount):'0',
      'dimension6': (_feedData.productVariant)?'True':'False',
      'dimension12': _stockStatus,  
      'dimension13': _stockLevel,
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
retireveCatpath(dataurl){
  if(dataurl.category){
    const _url= dataurl.category.url.slice(1).replace("/c/", "/");
    return _url.split("/");
   }else{
    const _url= dataurl.url.slice(1).replace("/p/", "/");
    return _url.split("/");
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
