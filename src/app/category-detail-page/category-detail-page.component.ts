import {
  Inject,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  HostListener,
  NgZone
} from "@angular/core";
import { Location, isPlatformBrowser } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { CategoryDetailComponentService } from "./category-detail-page.service";
import { SingletonService } from "../services/singleton.service";
import { Subscription } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";
import { GtmMethodService } from './../services/gtmmethods.service';
import { SEOService } from "../services/seo.service";
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
declare var AmpCa: any;
declare var window:any;
declare var $:any;
// declare var $TB:any;
declare var crl8:any;
@Component({
  selector: "app-category-detail-page",
  templateUrl: "./category-detail-page.component.html",
  styleUrls: ["./category-detail-page.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CategoryDetailPageComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("youMayLike") youMayLike: ElementRef;
  @ViewChild("worksWellWith") worksWellWith: ElementRef; 
  @ViewChild("curlElement") curlElement:ElementRef;
  @HostListener("window:resize", [])
  onResize(event) {
    if (window.innerWidth <=874) {
      this.curalateLg=false;
    }else{
      this.curalateLg=true;
    }
  }
  productInfo: any;
  showUpReview:boolean;
  navParamSubscription: any;
  breadcrumb: Array<any>;
  childname: string;
  currentProd: any;
  categorybanner:any;
  categoryOf:any;
  deliveryResctrictions:string;
  dlInstructionShowUp:boolean;
  menuData:any;
  categorySubscription:Subscription;
  categoryBreadcrumb:Array<any>;
  youmayLikeTempl:string;
  accordionItems = [
    { title: 'title 1', content: 'content 1' },
    { title: 'title 2', content: 'content 2' },
    { title: 'title 3', content: 'content 3' },
    { title: 'title 4', content: 'content 4' },
  ];
  isoCode:string;
  isCategoryLoaded:boolean = false;
  curlateProductCode:string;
  favourite:boolean=true;
  progress:number=0;
  curalateLg:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public categoryServ: CategoryDetailComponentService,
    public deviceService: DeviceDetectorService,
    public gtmServ: GtmMethodService,
    public seoService: SEOService,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
    public elRef:ElementRef,
    private _ngZone:NgZone
  ) {
    const baseSite = this.singletonServ.catalogVersion;
    this.isoCode=baseSite.isoCode;
    const isMobile = this.deviceService.isMobile();
    if(isMobile){
       this.curalateLg=false;
    }else{
      this.curalateLg=true;
    }
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
 }

 wrapFRslots(){
  const that=this;
  const isMobile = this.deviceService.isMobile();
  const baseSite = this.singletonServ.catalogVersion;
  // let _FR=$TB;
  this.categoryServ.getFRContent(baseSite.lngCode).subscribe((response:any)=>{
    if(response){
      if(that.worksWellWith){
       that.worksWellWith.nativeElement.innerHTML = response.productDetails.worksWellWith.slotId; 
      }  
      if(that.youMayLike){   
       that.youMayLike.nativeElement.innerHTML = response.productDetails.youmayalsoLike.slotId;
      }
      that.youmayLikeTempl=  response.productDetails.youmayalsoLike.slotId;
      if(!isMobile){
        // if(_FR){
        //   _FR.loadPageSlots();
        // }
       }
    }
  },err=>{

  });
}

 onVariantProduct(data){}
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

  ngOnInit() {    
    const _scripts=[
      {url:'https://dev-solutions.s3.amazonaws.com/viewer-kit-playground/v1.1.0/js/jquery.min.js'},
      {url:'https://dev-solutions.s3.amazonaws.com/viewer-kit-playground/v1.1.0/js/jquery-ui-custom.js'}
    ];
    _scripts.forEach((resp)=>{
      this.seoService.appendScript(resp.url);
    });
    const baseSite = this.singletonServ.catalogVersion;
    const favQueryStatus = this.route.snapshot.queryParamMap.get("productId");
    if(favQueryStatus){
    if (this.singletonServ.getStoreData(baseSite.reg)) {
       const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        this.addFav(user.token, user.email,favQueryStatus)
     }
    }

}
onReviewClick() {
  this.showUpReview = !this.showUpReview;
  this.singletonServ.scrollToTarget('#BVRRWidgetID')
}
addFav(token, email,code){
  const baseSite=this.singletonServ.catalogVersion;
  this.categoryServ
  .addToFavourite(baseSite,token, email,code)
  .subscribe(
    resp => {
   
    },
    error => {
      const err=error.error["errors"][0];           
    }
  );
}

/* Code not used
isMyScriptLoaded(url) {
  if (!url) url = "http://cdn.curalate.com/sites/moltonbrown-pabiml/site/latest/site.min.js";
  var scripts = this.dom.getElementsByTagName('script');
  for (var i = scripts.length; i--;) {
      if (scripts[i].src == url) return true;
  }
  return false;
} */

  ngAfterViewInit() { 
    this.singletonServ.getMessage().subscribe(message => {
      if (message.catgories) {
        this.singletonServ.menudata = message.catgories;
        this.menuData=this.singletonServ.menudata;
        this.navParamSubscription = this.route.params.subscribe(params => {
          let _catId = Object.values(params);
          _catId.pop();
          const code = params.itemid;
          if(_catId.length >1){
            this.childname = _catId[1];
            const _categories = message.catgories;
            this.breadcrumb = this.findCat(_categories, this.childname);        
            this.categoryOf=this.breadcrumb;
            // this.getCategoryData(code);
          }else{
            // this.getCategoryData(code);
          }
        });
      }
    });
    
    this.getheadData();
    const _baseSite = this.singletonServ;
    const pageType = 'Product Detail Page';
     this.gtmServ.gtmPageCategorisation(_baseSite,pageType);
  }

  getheadData(){
    const that=this;
   this.navParamSubscription = this.route.params.subscribe(params => {
     const code = params.itemid;
     const message =this.singletonServ.menudata;
     that.menuData=that.singletonServ.menudata;
    //  if(message){
        //    let _catId = Object.values(params);
        //    _catId.pop();
        //    if(_catId.length >1){
        //      that.breadcrumb = this.findCat(message,  _catId[1] );
        //      that.categoryOf=that.breadcrumb;
        //     //  that.getCategoryData(code);
        //  }else{
        //   //  that.getCategoryData(code);
        //  }
         
         let checkExist = setInterval(function() {
          if(that.singletonServ.menudata){
            let _catId = Object.values(params);
            _catId.pop();
               if(_catId.length >1){
                 that.breadcrumb = that.findCat(that.singletonServ.menudata,  _catId[1] );
                 that.categoryOf=that.breadcrumb;
                  that.getCategoryData(code);
                 clearInterval(checkExist);
               }              
            }
       }, 100);

      //  }
   });
  }
  removeFromTree(parent, childNameToRemove){
    const that =this;
    for (var i = 0; i < parent.length; i++) {
    parent[i].subcategories = parent[i].subcategories
        .filter(function(child){ return child.name !== childNameToRemove})
        .map(function(child){ return that.removeFromTree(child, childNameToRemove)});
    return parent;
    }
  }
  findCat(array, id) {
     const _id=id.toLowerCase();
     if (typeof array != "undefined") {
      for (var i = 0; i < array.length; i++) { 
        if( array[i].name != "" ){
          if (array[i].name.toLowerCase() == _id) {
            return [array[i]];
          }
          if(array[i]){
          if(array[i].subcategories){
          if(array[i].subcategories.length !=0){
          const a = this.findCat(array[i].subcategories, _id);
          if (a != null) {
            a.unshift(array[i]);
            return a;
          }
        }
       }
       }
       }
      }
    }
    return null;
  }
  onbreadcrumbClick(event,data,first,last){
    event.stopPropagation();
    event.preventDefault();
    if(first){

      } else if(last){

      }else{
        const url ='/store'+data.url.replace('/c/','/');
        this.router.navigate([url]);
      }

  }
  goToHome(){
    this.router.navigate(['store']);
  }
 checkFavourite(user, code) {
    const baseSite=this.singletonServ.catalogVersion;
    const _favourites = this.singletonServ.favourites; 
    if (_favourites) {
      const _fav = _.find(_favourites, function(o) {
        return o.code == code;
      });
      if (_fav) {
          this.favourite = false;
      } else {
          this.favourite = true;
      }
    } else {
      this.categoryServ
            .getFavourites(baseSite,user.token, user.email)
            .subscribe(
              response => {
                if(response){
                const _fav = _.find(response["products"], function(o) {
                  return o.code == code;
                });
                this.singletonServ.favourites = response["products"];
                if (_fav) {
                  if (_fav) {
                    this.favourite = false;
                } else {
                    this.favourite = true;
                }
                }
              }

              },
              err => {
              if(err.error){
                  if(err.error["errors"]){
                    if(err.error["errors"][0]){
                      if(err.error["errors"][0]['type']== "InvalidTokenError") {
                        this.categoryServ.generateToken(baseSite).subscribe((token)=>{
                          const tokenId = token["access_token"];
                          user['token']=tokenId;
                          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
                          this.checkFavourite(user, code);
                       });
                      }
                    }
                    }
                   }
              }
            );
    }
  }
  getCategoryData(code) {
    const that=this;
    const baseSite=this.singletonServ.catalogVersion;
    if(this.breadcrumb){
      const _catCode = this.breadcrumb[this.breadcrumb.length-1];
      const _parentCode=_catCode['id'];
    if(_parentCode){
        this.categorySubscription=  this.categoryServ.getMbProdDetails(baseSite,code,_parentCode).subscribe(
            (resp:any) => {
              if(resp){    
                  const _code = resp["code"]; 
                  this.curlateProductCode="productId:"+ "'"+_code.toLocaleString()+"'";
                  this.productInfo = resp;
                  if(this.singletonServ.getStoreData(baseSite.reg)){
                    const user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                    this. checkFavourite(user, code)
                  }
                  if(resp['breadcrumbsList']){
                    this.categoryBreadcrumb=resp['breadcrumbsList']['breadcrumbsList'];
                  }
                  const _pdpData:any = resp;
                  this.wrapFRslots(); 
                  this.getDeliveryTabInfo(_code, _pdpData);
                  this.constructSeoService(resp);
                  this.constructBreadcrumbs(resp,_code);
                  this.enableReviewSection();
                  this.setGtmOnPDPLoad(resp);
        }
      },(err:any) => {
        if(err.error.errors[0].type=='UnknownIdentifierError'){
           that.router.navigate(['store','404']);
         }
      });
   }
  }
  
  }
  enableReviewSection(){
    const queryStatus = this.route.snapshot.queryParamMap.get(
      "BVRRContainer"
    );
    if(queryStatus){
      const target="#PDPBVRRContainer";
      this.showUpReview=true;
      $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $(target).offset().top - 0
        },
        10,
        function() {
        }
      );
    }else{
    this.showUpReview=false;
    }  
  }
  constructBreadcrumbs(resp,_code){
    
    this.currentProd = {
      categoryDisplayName: resp["productDisplayName"],
      name: resp["name"],
      code: _code,
      product:true
    };
    if(this.breadcrumb){
      const _breadCrumb=this.breadcrumb;
      const _product =  _breadCrumb.filter((obj)=>{
        return obj.product
      })
      if(_product.length ==0){
        _breadCrumb.push(this.currentProd);        
        this.breadcrumb =_.uniq(JSON.parse(JSON.stringify(_breadCrumb)));
      }   
      if(!this.breadcrumb[1].isL3){
        this.breadcrumb.splice(1, 1);
      }
      this.setproductFeeds(resp);
    }
  }
  constructSeoService(resp){
    let titleName: string = "";
    if(resp["titleName"]){
      titleName = resp["titleName"].trim().toLocaleString();
      this.title.setTitle(titleName);
    }else{
      titleName = resp["name"];
      this.title.setTitle(titleName);
    }
    this.seoService.updateTitle(titleName);
    this.seoService.updateDescription(resp["description"]);
    this.seoService.updateOGDescription(resp["description"]);
    this.seoService.updateDCDescription(resp["description"]);
    this.seoService.updateOGURL(resp["url"]);
    this.seoService.updateOGImage(resp["amplienceImageName"]);
    this.seoService.createCanonicalURL(resp["url"]);
    this.seoService.removeAlternateTags();
  }
  setGtmOnPDPLoad(resp){
    let variant;
    if(resp.baseOptions){
        if(resp.baseOptions.length != 0){
          variant=resp.baseOptions[0].options[1].code
        } else{
          variant=''
        }
    }else{
      variant=''
    }
    const productdetails={
    'currencyCode': (resp.price) ? resp.price.currencyIso:"",              
    'actionList': resp.breadcrumbsList.breadcrumbsList[0].name  +'-'+ resp.breadcrumbsList.breadcrumbsList[1].name,     
    'productName': resp.productDisplayName,      
    'productID': resp.code,
    'productPrice': '',
    'productBrand': "Molton Brown",
    'productCategory': resp.breadcrumbsList.breadcrumbsList[1].name,
    'productVariant': variant, 
    'size': resp.size,
    'reviewRating': (resp.productAverageRating)?resp.productAverageRating:'0',
    'reviewsCount': (resp.reviewCount)?resp.reviewCount:'0',
    'saleStatus': (resp.originalPrice)?'True':'False',
    'stockLevel': (resp.stock.stockLevelStatus == "inStock")?"True":"False",   
    'productStockLevelNumber':(resp.stock.stockLevel)?resp.stock.stockLevel:'', 
     'deleveryType':(resp.productEdition)?resp.productEdition:'',
      'salePrice':(resp.originalPrice)?(resp.price)?resp.price.value:'':''
   
  };
  if(resp.originalPrice){
    const originalPrice= resp.originalPrice;
    const _originalPrice = originalPrice.match(/[\d\.]+/);
    if(_originalPrice){
      productdetails['productPrice']=_originalPrice[0];
    }else{
      productdetails['productPrice']=originalPrice;
    }
    }else if(resp.price){
      productdetails['productPrice']=resp.price.value;
    }else{

      productdetails['productPrice']=""
    }
this.gtmServ.gtmProductDetailPages(productdetails);
this.enablecuralate();
  }
  setproductFeeds(resp){
    let _feeds=[];
    let breadcrumb=JSON.parse(JSON.stringify(this.breadcrumb));
    breadcrumb.pop();
    if(breadcrumb.length !=0){
      breadcrumb.map((obj)=>{
          let _catFeed={
            id:obj.id,
            Name:obj.categoryDisplayName
          }
          _feeds.push(_catFeed);
      });
    this.setBVFeeds(breadcrumb,resp);
    }
  }
  setBVFeeds(catFeed,resp){
    const that=this;
    const baseSite=this.singletonServ.catalogVersion;
    const _hostPath = this.location['_platformStrategy']._platformLocation.location.href;
    const imgUrl='https://media.moltonbrown.co.uk/s/moltonbrown/'+resp.code+'_uk_set?$largeImg$&amp;fmt=jpg';
    const  bvDCC = {
            catalogData: {
                locale: baseSite.bv_locale,
                catalogProducts: [{
                        productId: resp['code'],
                        productName: resp['productDisplayName'],
                        productDescription: resp['description'],
                        productImageURL: imgUrl,
                        productPageURL:_hostPath,
                        brandName: catFeed[0]["categoryDisplayName"],
                        categoryPath: catFeed,
                        family: "F02"
                }]
        }
    }
    window.bvCallback = function (BV) {
      BV.reviews.on('show', function (event) {
          // If the R&R container is hidden (such as behind a tab), put code here to make it visible (open the tab)
        // $('#review_tab').show();
        that.showUpReview = true;
        that.singletonServ.scrollToTarget('#BVRRWidgetID');
     });


    BV.pixel.trackEvent("CatalogUpdate", {
      type: 'Product',
      locale: bvDCC.catalogData.locale,
      catalogProducts: bvDCC.catalogData.catalogProducts
    });
    }
  }
  getDeliveryTabInfo(code, resp) {
    const that=this;
    const isMobile = this.deviceService.isMobile();
     const _path=this.location['_platformStrategy']._platformLocation.location.pathname;
    AmpCa.utils = new AmpCa.Utils();
    const baseSite=this.singletonServ.catalogVersion;
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: "f6b7b43e-4d6b-46f4-8ea1-c1417686cb1c",
        store: "moltonbrown",
        templateName: "acc-template-homepage",
        locale:baseSite.locale
      },
      callback: function(data) {
        resp['contentTabs']=[];
        let benefits =[];
        let fragrance =[];
        let explore =[];
        let delivery =[];
        if(resp.description) {
          const _obj = {
            header:(baseSite.isoCode=="DE")?'der duft':'the fragrance',
            htmlData:resp.description,
            order:1
          };
          if(isMobile){
            fragrance.push(_obj);
          }else{
            _obj['show']=true;
            fragrance.push(_obj);
          }
        
        }   
        if(resp.explore) {
          const _obj = {
            header:(baseSite.isoCode=="DE")?'entdecken':'explore',
            htmlData:resp.explore,
            order:2
          }
          explore.push(_obj);
        }   
        if(resp.benefits) {
          const _obj = {
            header:(baseSite.isoCode=="DE")?'das besondere':'benefits',
            htmlData:resp.benefits,
            order:3
          }
          benefits.push(_obj);
        }  
        that.deliveryResctrictions=data;      
          const _obj = {
            htmlData:data,
            show:false,
            order:4
          }    
          if(baseSite.isoCode=="DE"){
            _obj['header']='lieferung';
            _obj['dlInstruction']=false;
            _obj['dlTab']=true;
          } else if(baseSite.isoCode=="US") {
            _obj['header']='shipping';
            _obj['dlInstruction']=false;
            _obj['dlTab']=true;
          }else{
            _obj['header']='delivery';
            _obj['dlInstruction']=true;
            _obj['dlTab']=true;
          } 
        let _uniqData= _.uniq(_.union([_obj],benefits,explore,fragrance));
        _uniqData.sort(function(a, b) {
          return a['order'] - b['order'];
        });

       if(isMobile){
        const _obj = {
          header:(baseSite.isoCode=="DE")?'Ihnen könnte auch gefallen':'You might also like',
          htmlData:that.youmayLikeTempl,
          show:true,
          order:5
        } 
        _uniqData.push(_obj);
       }
       that.productInfo['contentTabs']=_uniqData;
       that.renderDeliveryInstruction();
      }
    });




  }
  showDlRstrn(){
    const target= "#deliveryRstnBlock";
    $("html, body")
    .stop()
    .animate(
      {
        scrollTop: $(target).offset().top - 0
      },
      10,
      function() {
      }
    );
    this.dlInstructionShowUp=true;

  }
  scrollToElement(element) {
    if($('.cart-list-container')[0]){
        $('.cart-list-container')[0].scrollIntoView(true);
        let _elmnt=$(element).offset();
        $('.cart-list-container').animate({
          scrollTop: $('.cart-list-container').scrollTop() + _elmnt.top - $('.cart-list-container').offset().top-25
        }, {
          duration: 'slow',
          easing: 'swing'
        });
  }
}
  renderDeliveryInstruction(){
    const that=this;
    AmpCa.utils = new AmpCa.Utils();
    const baseSite=this.singletonServ.catalogVersion;
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: "ee1745a7-5e99-4c04-8882-3e121bc68cb1",
        store: "moltonbrown",
        templateName: "acc-template-homepage",
        locale:baseSite.locale
      },
      callback: function(data) {    
        that.productInfo['deliveryServiceReturns']=data; 
      }
    });
  
  }


  enablecuralate(){
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
          crl8.ready(function() {
            if(typeof  crl8 !="undefined"){
                crl8.getAllExperiences().then((crl)=>{
                 console.log(crl);   
                 if(crl.length ==0){
                   crl8.createExperience('custom-product'); 
                 }
               });
             }
        });
      });
    });
  }
  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    if (this.progress < 90) {
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
 async ngOnDestroy() {
  await  this.destroyCuralate();
    if(this.categorySubscription){
    this.categorySubscription.unsubscribe();
    }
    this.currentProd = undefined;
    this.breadcrumb = undefined;
    if (this.navParamSubscription) {
      this.navParamSubscription.unsubscribe();
    }
  }
}
