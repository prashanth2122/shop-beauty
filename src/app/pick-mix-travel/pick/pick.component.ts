import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  Output,
  Input,
  OnChanges, 
  SimpleChange,
  AfterViewInit,Renderer2, OnDestroy
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Location, ViewportScroller } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { SingletonService } from "../../services/singleton.service";
import { PickMixTravelComponentService } from "../pick-mix-travel.service";

import { GtmMethodService } from '../../services/gtmmethods.service';
import * as _ from "lodash";
declare var conv_pickMix_Continue:any;
declare var _conv_q:any;
declare var $: any;
@Component({
  selector: "app-pick",
  templateUrl: "./pick.component.html",
  styleUrls: ["./pick.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickComponent implements OnInit, OnChanges,AfterViewInit,OnDestroy {
  @ViewChild("pickMixEl") pickMixEl: ElementRef;
  @Input() collectedproducts: any;
  @Input() bundlePriceDtls:any;
  @Input() pickMixData:any;
  @Output() setCollection: EventEmitter<any> = new EventEmitter<any>();
  packThreePrice:string;
  packEmtyPrice:string;
  packSixPrice:string;
  openTooltip:boolean;
  pickPackPrice:string;
  display:string="none";
  pickMixCollection:Array<any>=[
    {
      code:'',
      selection:false,
      jackOne:true
    },
    {
      code:'',
      selection:false,
      jackOne:true
    },
    {
      code:'',
      selection:false,
      jackOne:true
    },
    {
      code:'',
      selection:false,
      jackOne:false
    },
    {
      code:'',
      selection:false,
      jackOne:false
    },
    {
      code:'',
      selection:false,
      jackOne:false
    }
  ];
  current: boolean;
  pickMix: boolean;
  navigationSubscription: any;
  routeParams: any;
  catId: string;
  collection: Array<any>;
  pickBuyCheck: boolean;
  addExtraProduct:boolean;
  allItems: Array<any>;
  jackOne: number = 0;
  jackTwo: number = 0;
  totalCount: number = 0;
  pack: boolean;
  pickItems: boolean;
  viewMode: string = "pick";
  threePackCurrencyCode:any='';
  sixPackCurrencyCode:any='';
  infoPopup:boolean=false;
  innerWidth: any;
  hideScrollHint:boolean = false;
  @HostListener("window:scroll", ["$event"])
  scrollToPick(type) {
    type = type || "";
    if(this.innerWidth > 768){
      var scrollDistance = $(window).scrollTop();
      $(".page-section").each(function(i) {
        if ($(this).position().top <= scrollDistance) {
          $(".navigation a.active").removeClass("active");
          $(".navigation a")
            .eq(i)
            .addClass("active");
        }
      });
    } else {
      if(type != "init"){
        this.hideScrollHint = true;
      }
      let scrollDistance = $('.pickmix-product-container').scrollLeft();
      let topScroller = document.getElementById('pickListSubcategories').scrollWidth;
      let totalWidth = 0;
      for (let i of $(".page-section")) {
        totalWidth += i.offsetWidth;
        if (scrollDistance < totalWidth) {
          $(".navigation a.active").removeClass("active");
          $('.navigation a[href="#' + i.getAttribute('id') + '"]').addClass('active');

          let headerScroll = 0;
          for (let j of $('#pickListSubcategories li')) {
            if ($(j).find('a').hasClass('active')) {
              $('#pickListSubcategories').stop().animate({
                'scrollLeft': headerScroll
              }, 500);
              break;
            }
            headerScroll += $(j).width();
          }

          break;
        }
      }
    }
  }
  @HostListener('document:click')
  clickout() {
    if (this.infoPopup) {
      this.infoPopup = false;
      this.pickMixData['subcategories'].map((item,i)=>{
         item['products'].map((obj,l)=>{
              obj['action']=false;
          });
      });
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public titleService: Title,
    public pickMixServ: PickMixTravelComponentService,
    private renderer:Renderer2,
    public gtmServ:GtmMethodService,
    public viewPortScroller: ViewportScroller
     
  ) {

  }
  showTooltip(event,p,k){
    event.stopPropagation();
    event.preventDefault();
    this.pickMixData['subcategories'].map((item,i)=>{
      if(i==p){
       item['products'].map((obj,l)=>{
          if(l==k){
            obj['action']=!obj['action'];
          }else{
            obj['action']=false;
          }
        });
      }else{
        item['products'].map((obj)=>{
          obj['action']=false;
        });
      }
    });
   this.infoPopup=true;
}
  onCloseModal(event){
    event.stopPropagation(); 
    this.display="none";
  }
  onInfoContentClick(event){
    event.stopPropagation();
    event.preventDefault();
  }
  onAddProduct(event,product) {
    event.stopPropagation();
    const that = this;
    this.addExtraProduct=false;
    if(this.collection){
    const baseSite = this.singletonServ.catalogVersion;
    const _obj = {
      code: product.code,
      amplienceImageName:product.amplienceImageName,
      name: product.productDisplayName,
      description:product.description,
      selection: true
    };
    this.pickMixCollection = _.flatten(this.collection);
    const _arr = this.nestedCopy(this.pickMixCollection);
    this.pickItems = true;
    if(this.totalCount==6){
      this.display="block";
      this.addExtraProduct=true;
    }
    if (this.totalCount != 6) {
      if (this.totalCount < 3) {
          _obj["jackOne"] = true;
          _arr[this.totalCount] = _obj;
          this.jackOne = this.jackOne + 1;
          this.totalCount = this.totalCount + 1;
          if (this.totalCount == 3) {
            this.pickBuyCheck = true;
            that.pickPackPrice=that.packThreePrice;
          } else {
            this.pickBuyCheck = false;
            that.pickPackPrice=that.packEmtyPrice;
          }
          this.allItems = this.nestedCopy(_arr);
          this.collection = that.chunkArray(_arr, 3);        
          if(this.singletonServ.getStoreData(baseSite.reg)){
            this.singletonServ.setStoreData(baseSite.regPickMix,JSON.stringify(this.collection));
          }else{
            this.singletonServ.setStoreData(baseSite.guestPickMix,JSON.stringify(this.collection));
          }
      } else {
        _obj["jackTwo"] = true;
        _arr[this.totalCount] = _obj;
        this.jackTwo = this.jackTwo + 1;
        this.totalCount = this.totalCount + 1;
       
        if (this.totalCount == 6) {
          this.pickBuyCheck = true;
          that.pickPackPrice=that.packSixPrice;
          
        } else {
          if (this.totalCount >= 3) {
            this.pickBuyCheck = false;
            that.pickPackPrice=that.packThreePrice;
          }
        }
        this.allItems = this.nestedCopy(_arr);
        this.collection = that.chunkArray(_arr, 3);

        if(this.singletonServ.getStoreData(baseSite.reg)){
          this.singletonServ.setStoreData(baseSite.regPickMix,JSON.stringify(this.collection));
        }else{
          this.singletonServ.setStoreData(baseSite.guestPickMix,JSON.stringify(this.collection));
        }
      }
    }
  }
  if(this.totalCount <= 6){ 
    if(this.addExtraProduct){

    }
    else{
      const pageUrlCat = this.pageUrl1(product);
      const pickandMixCategory= pageUrlCat[3];
      const productAdded = product.productDisplayName;
      this.gtmServ.gtmPickAndMixEvent(pickandMixCategory,productAdded);
 
    }
        
    

  }

  }
  pageUrl1(product){
    const pageUrl = product.url;
    return pageUrl.split("/");
    
    }
  onRemoveItem(event, indx) {
    event.preventDefault();
    event.stopPropagation();
    const baseSite = this.singletonServ.catalogVersion;
    this.totalCount = this.totalCount - 1;
    const that=this;
    const _obj = {
      code: "",
      selection: false
    };
    this.pickMixCollection = _.flatten(this.collection);
    const _arr = this.nestedCopy(this.pickMixCollection);
    _arr.splice(indx, 1);
    _arr.push(_obj);
    if (this.totalCount == 0 ) {
      this.pickItems = false;
      this.pickBuyCheck = false;
      that.pickPackPrice=that.packEmtyPrice;
    }else if(this.totalCount < 3){
      that.pickPackPrice=that.packEmtyPrice;
      this.pickBuyCheck = false;
    }else if(this.totalCount == 3){
      that.pickPackPrice=that.packThreePrice;
      this.pickBuyCheck = true;
      this.pickItems = true;
    }else if((this.totalCount < 6)&&(this.totalCount > 3)){
      that.pickPackPrice=that.packThreePrice;
      this.pickBuyCheck = false;
    }
    this.allItems = this.nestedCopy(_arr);
    this.collection = this.chunkArray(_arr, 3);    

    if(this.singletonServ.getStoreData(baseSite.reg)){
        this.singletonServ.setStoreData(baseSite.regPickMix,JSON.stringify(this.collection));
    }else{
        this.singletonServ.setStoreData(baseSite.guestPickMix,JSON.stringify(this.collection));
    }
  }
  setPickPackCollection(){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    let _pickMixBundle;
    if(this.singletonServ.getStoreData(baseSite.reg)){
     if( this.singletonServ.getStoreData(baseSite.regPickMix)){
      _pickMixBundle=JSON.parse(this.singletonServ.getStoreData(baseSite.regPickMix));
     }
   }else if(this.singletonServ.getStoreData(baseSite.guestPickMix)){
         _pickMixBundle=JSON.parse(this.singletonServ.getStoreData(baseSite.guestPickMix));
  }
    if(_pickMixBundle){
      const _data =_pickMixBundle;
      this.pickItems=true;     
      this.pickMixCollection = _.flatten(_data);
      const _arr = this.nestedCopy(this.pickMixCollection);
      _arr.map((obj,i)=>{
          if(obj.selection){
            this.totalCount=this.totalCount+1;
              if (this.totalCount == 0 ) {
                this.jackOne=0
                this.jackTwo=0;
                this.pickItems = false;
                this.pickBuyCheck = false;
                that.pickPackPrice=that.getThreePackCurrencyCode(0);;
              }else if(this.totalCount < 3){
                that.pickPackPrice=that.getThreePackCurrencyCode(0);
                that.jackOne=this.totalCount;
                this.pickBuyCheck = false;
              }else if(this.totalCount == 3){
                that.jackOne=this.totalCount;
                that.pickPackPrice=that.getThreePackCurrencyCode(that.threePackCurrencyCode);
                this.pickBuyCheck = true;
                this.pickItems = true;
              }else if((this.totalCount < 6)&&(this.totalCount > 3)){
                that.jackOne=3;
                that.jackTwo=that.totalCount-3;
                that.pickPackPrice=that.getThreePackCurrencyCode(that.threePackCurrencyCode);
                that.pickBuyCheck = false;
              }else if(this.totalCount == 6){
                that.jackOne=3;
                that.jackTwo=that.totalCount-3;
                that.pickPackPrice=that.getThreePackCurrencyCode(that.sixPackCurrencyCode);
                that.pickBuyCheck = true;
                that.pickItems = true;
              }   
          }
      });
      this.allItems = this.nestedCopy(_arr);
      this.collection = that.chunkArray(_arr, 3);  
    }else{
      const _arr = that.nestedCopy(that.pickMixCollection);
      that.collection = that.chunkArray(_arr, 3);
    }
  }
  ngOnInit() {
    const that=this;
    this.innerWidth = window.innerWidth;
    const baseSite = this.singletonServ.catalogVersion;

    if(baseSite.isoCode ==='GB'){
      const _price=' &nbsp;&#163;0';
      that.pickPackPrice=_price;
      that.packEmtyPrice=_price;
    }else if(baseSite.isoCode ==='EU'){
      const _price='0&nbsp;&#128;&nbsp;';
      that.pickPackPrice=_price;
      that.packEmtyPrice=_price;
    }else if(baseSite.isoCode ==='DE'){
      const _price='0&nbsp;&#8364;&nbsp;';
      that.pickPackPrice=_price;
      that.packEmtyPrice=_price;
    }
    this.setPickPackCollection();
   }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that=this;
    if (changes["bundlePriceDtls"]) {
      if (changes["bundlePriceDtls"]["currentValue"] != undefined) {
        const _data=changes["bundlePriceDtls"]["currentValue"];
        that.threePackCurrencyCode=_data['pick3']['bundlePrice'];
        that.sixPackCurrencyCode=_data['pick6']['bundlePrice'];
 
      }
    }
  }
  ngAfterViewInit() {  
    this.scrollToPick("init");
    const _baseSite = this.singletonServ;
    const travelBag = '';
    const pageType='Pick Buy';
    this.gtmServ.gtmPageCategorisation(_baseSite,pageType);
    this.gtmServ.gtmSetPickandMixSteps("pick",travelBag);
  }
  onChecKToCart(event) {
    conv_pickMix_Continue =1;
    _conv_q = _conv_q || []; 
    _conv_q.push(["run","true"]);

    event.stopPropagation();
    const _arr = this.allItems;
    const _obj = {
      data: _arr,
      price:this.pickPackPrice
    };
    this.setCollection.emit(_obj);
  }
  onViewModeChange(container) {
    this.viewMode = container;
    this.pack = false;
  }

  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  chunkArray(myArray, chunk_size) {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }



  scrollToUsageSection(event, id) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target.getAttribute("href");
    if(this.innerWidth > 768){
      $("html, body").stop().animate({
        scrollTop: $(target).offset().top - 250
      },100, function() { });
    } else {
      let totalWidth = 0;
      for (let i of $(".page-section")) {
        if (i.getAttribute('id') == id) {
          $('.pickmix-product-container').stop().animate({
            'scrollLeft': totalWidth
          }, 1000);
          break;
        }
        totalWidth += i.offsetWidth;
      }
    }
    return false;
  }
  onStart() {
    this.pickMix = true;
  }


  getBgImage(bol,k){
    if(bol){
      const id=k+1;
      return "url('https://css.moltonbrown.co.uk/images/bottle-"+id+".svg')"
    }else{
       return "url('https://css.moltonbrown.co.uk/images/bottle-"+k+".svg')"
    }
  }
  getThreePackCurrencyCode(price){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode ==='GB'){
      const _price='&#163;'+price;
      that.packThreePrice=_price;
      return _price
    }else if(baseSite.isoCode ==='EU'){
      const _price=price+'&nbsp;&#128;';
      that.packThreePrice=_price;
      return _price
    }else if(baseSite.isoCode ==='DE'){
      const _price=price+'&nbsp;&#8364;';
      that.packThreePrice=_price;
      return _price
    }    
  }
  getSixPackCurrencyCode(price){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode ==='GB'){
      const _price='&#163;'+price;
      that.packSixPrice=_price;
      return _price;
    }else if(baseSite.isoCode ==='EU'){
      const _price=price+'&nbsp;&#128;';
      that.packSixPrice=_price;
      return _price
    }else if(baseSite.isoCode ==='DE'){
      const _price=price+'&nbsp;&#8364;';
      that.packSixPrice=_price;
      return _price
    }  
  }
  hide() {
    this.renderer.addClass(event.target,"info-close");
  }
  ngOnDestroy(){
    $(".page-section").each(function(i) {
        $(".navigation a.active").removeClass("active");
      
    })
    $(".navigation a")
    .eq(0)
    .addClass("active");
  }
}