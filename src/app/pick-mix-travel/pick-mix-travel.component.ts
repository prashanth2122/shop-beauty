import { Inject,Component, OnInit,ViewEncapsulation,ChangeDetectionStrategy,AfterViewInit,SecurityContext,HostListener,ElementRef,ViewChild } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from '@angular/common';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { SingletonService } from "../services/singleton.service";
import {PickMixTravelComponentService} from './pick-mix-travel.service';
import {PickComponent} from './pick/pick.component';
import { GtmMethodService } from '../services/gtmmethods.service';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any;
@Component({
  selector: 'app-pick-mix-travel',
  templateUrl: './pick-mix-travel.component.html',
  styleUrls: ['./pick-mix-travel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickMixTravelComponent implements OnInit {
  @ViewChild('scrollbarRef') scrollRef: ElementRef;
  @ViewChild("pickMixEl") pickMixEl: PickComponent;
  current:boolean;
  pickMix:boolean; 
  collection:any;
  pack:boolean;
  pickItems:boolean;
  viewMode:string ='pick';
  collectionData:any;
  pickStore:boolean=true;
  pickPackPrice:string;
  pickbannerid:any;
  pickmixAmpContent:boolean;
  switchMode:string;
  bundlePriceDtls:any;
  navigationSubscription: any;
  pickMixData:any;
  catId:any;
  enablePickMixContainer:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,  
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public titleService:Title,
    public pickMixServ:PickMixTravelComponentService,
    public gtmServe: GtmMethodService
  ) {
    const baseSite=this.singletonServ.catalogVersion;
    this.enablePickMixContainer=true;
    this.getPickMixContent();
    this.pickMix=false;

    if(this.singletonServ.getStoreData(baseSite.reg)){
      if( this.singletonServ.getStoreData(baseSite.regPickMix)){
        this. switchMode='localStore';
      }else{
        this. switchMode='emptyStore';
      }
   }else{
         if(this.singletonServ.getStoreData(baseSite.guestPickMix)){
          this. switchMode='localStore';
        }else{
          this. switchMode='emptyStore';
        }
   }
   }
   onChecKToCart(){
     this.viewMode='pick&Buy';
   }


   onViewModeChange(container){ 
    this.viewMode=container;
    this.pack=false; 
  }
  ngOnInit() {
    const baseSite=this.singletonServ.catalogVersion;   
    this.pickMix=false;  
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if(_user.token){
       this.retrieveBundlePrice(_user.token);
      }else{
       this.pickMixServ.generateToken(baseSite).subscribe((token)=>{
        const tokenId = token["access_token"]; 
        const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
         _user.token=tokenId;
         this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
         this.retrieveBundlePrice(_user.token);
        });
     }
    }else{
      const baseSite=this.singletonServ.catalogVersion;
      if(this.singletonServ.getStoreData(baseSite.guest)){
        const _guest=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        if(_guest.token){
         this.retrieveBundlePrice(_guest.token);
       }else{
        this.pickMixServ.generateToken(baseSite).subscribe((token)=>{
          const tokenId = token["access_token"]; 
          const _guest=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          _guest.token=tokenId;
           this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
           this.retrieveBundlePrice(_guest.token);
          });
       }
        
    }else{
      this.pickMixServ.generateToken(baseSite).subscribe((token)=>{
        const tokenId = token["access_token"]; 
        const _guest={token:tokenId};
         this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_guest));
         this.retrieveBundlePrice(_guest.token);
        });
    }
  }

  
  }

  ngAfterViewInit() {
    const _baseSite = this.singletonServ;
    const baseSite = this.singletonServ.catalogVersion;
 if(baseSite.isoCode=="DE"){
this.titleService.setTitle('Pflegeprodukte in Reisegröße: Shampoo, Duschgel &amp; mehr | Molton Brown');
}
else{
  this.titleService.setTitle('Pick & Mix Travel Toiletries | Holiday Toiletries | Molton Brown UK'); 
}
    const pageType = 'Pick & Mix';
    this.gtmServe.gtmPageCategorisation(_baseSite,pageType);
  }
  getPickMixContent(){
    const baseSite=this.singletonServ.catalogVersion;
    if(baseSite.isoCode == "GB"){
      this.pickbannerid="6c1981ea-56d8-4dd9-bbaa-358d4f2e9d8b"
    }
    else  if(baseSite.isoCode == "EU"){
      this.pickbannerid="a713ccee-b030-4f5f-8509-62b0e6dcacc1"
    }
    else  if(baseSite.isoCode == "DE"){
      this.pickbannerid="84015484-26d5-4588-8f06-87a388372463"
    }
    else{
      this.pickbannerid="fb1f033f-147d-4fc5-9711-e6016becfd1f"
    }

    const that=this;
    AmpCa.utils = new AmpCa.Utils();   
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: this.pickbannerid,
        store: "moltonbrown",
        templateName: "slot-contentWrapper",
        locale:baseSite.locale
      },
      callback: function(data) {
        that.dom.querySelectorAll("#pickmix-amp-content")[0].innerHTML = data;
        AmpCa.utils.postProcessing.execHtmlService('banner'); 
      }
    });
  }
  onChangeCollection(data){     
    this.viewMode='pick'; 
    this.pack=false; 
  }
  setCollection(data){
   this.collection=data;
   this.viewMode='pick&Buy';
   this.singletonServ.scrollToTarget('#rich_cart');
   this.pack=true;
  }
  onStartPickMix(){
    const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      if( this.singletonServ.getStoreData(baseSite.regPickMix)){
          this.singletonServ.removeItem(baseSite.regPickMix);
      }
      this.viewMode='pick';
      this.pickMix=true; 
   }else{
    this.singletonServ.removeItem(baseSite.guestPickMix); 
    this.viewMode='pick';
    this.pickMix=true;        
   }
 
  }

  onActivate(e,parent){
    parent.scrollTop = 0;
  }
  onContinue(){
    const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      this.viewMode='pick';
      this.pickMix=true; 
      // this.getBundlePrice(baseSite.reg);
   }else{
    this.viewMode='pick';
    this.pickMix=true; 
    // this.getBundlePrice(baseSite.guest);       
   } 

  }
  onStart(){
    const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      if( this.singletonServ.getStoreData(baseSite.regPickMix)){
          this.singletonServ.removeItem(baseSite.regPickMix);
      }
      this.viewMode='pick';
      this.pickMix=true; 
   }else{
    if( this.singletonServ.getStoreData(baseSite.guestPickMix)){
      this.singletonServ.removeItem(baseSite.guestPickMix);
     }
    this.viewMode='pick';
    this.pickMix=true;     
   } 

   }
  getBundlePrice(name){
    const that=this;
    const baseSite=this.singletonServ.catalogVersion;
    this.pickMixServ.generateToken(baseSite).subscribe((token)=>{
      const tokenId = token["access_token"]; 
      const _user=JSON.parse(this.singletonServ.getStoreData(name));
       _user.token=tokenId;
       this.singletonServ.setStoreData(name,JSON.stringify(_user));
       this.pickMixServ.getBundlePrice(baseSite,tokenId).subscribe((resp)=>{
        this.viewMode='pick';
        this.pickMix=true; 
        setTimeout(()=>{
          if(that.pickMixEl){
            that.pickMixEl.threePackCurrencyCode=resp['pick3']['bundlePrice'];
            that.pickMixEl.sixPackCurrencyCode=resp['pick6']['bundlePrice'];
          }
        },200);
      
       },err=>{

       })
    },err=>{

    });
  }
  retrieveBundlePrice(token){
       const baseSite=this.singletonServ.catalogVersion;
       this.pickMixServ.getBundlePrice(baseSite,token).subscribe((resp)=>{
         this.bundlePriceDtls=resp;
         this.pickmixAmpContent=true; 
         this.getPickPack();
       },(err:any)=>{
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.pickMixServ.generateToken(baseSite).subscribe((tokenizer)=>{
                  if(this.singletonServ.getStoreData(baseSite.reg)){
                    const tokenId = tokenizer["access_token"]; 
                    const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                     _user.token=tokenId;
                     this.singletonServ.setStoreData(name,JSON.stringify(_user));
                     this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
                      this.retrieveBundlePrice(token);
                  }else if(this.singletonServ.getStoreData(baseSite.guest)){
                      const tokenId = tokenizer["access_token"]; 
                      const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                       _user.token=tokenId;
                       this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_user));
                       this.retrieveBundlePrice(token);                  
                  } else {
                    const tokenId = tokenizer["access_token"]; 
                    const _user={token:tokenId};
                     this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_user));
                     this.retrieveBundlePrice(token)
                  }
               });
              
                
              } 
            }
            }
           }
       });
  }

  getPickPack(){
    const that=this;
    const baseSite=this.singletonServ.catalogVersion;
    this.navigationSubscription = this.route.params.subscribe(params => {
      const _catId = params.productid;
      this.catId = params.productid;
      const categories = that.singletonServ.pickPackCategories;
      if (categories) {
        for (let obj of categories) {
          const result = this.getCatalogtree(obj, _catId);
          if (result) {
             result.subcategories.sort(function(a, b) {
              return a.order - b.order;
             });
            that.pickMixData = result;
            break;
          }
        }
        if (that.pickMixData) {
          that.pickMixData.subcategories.map(obj => {
            that.pickMixServ
              .getPickandMixProducts(baseSite,obj.id)
              .subscribe(
                response => {
                  obj["products"] = response["products"];
                  
    that.enablePickMixContainer=false;
                },
                err => {}
              );
          });
        }
      }
  
    });

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
}
