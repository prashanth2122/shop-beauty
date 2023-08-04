import { Component,  NgZone, OnInit,ViewChild,ElementRef, AfterViewInit, HostListener } from "@angular/core";
import { StorefinderService } from "../storefinder/storefinder.service";
import { Title } from "@angular/platform-browser";
import { SingletonService } from "../services/singleton.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import {RegistrationForm} from '.././forms/registration.form';
import { TranslateService } from "./../translate.service";
import * as _ from "lodash";  
import { GtmMethodService } from './../services/gtmmethods.service';
declare const google: any;
// declare var $TB:any;
@Component({
  selector: "app-storefinder",
  templateUrl: "./storefinder.component.html",
  styleUrls: ["./storefinder.component.scss"]
})
export class StorefinderComponent implements OnInit,AfterViewInit {
  @ViewChild("findStore") fsElementRef: ElementRef;
  @ViewChild("storeFinderFeed") storeFinderFeed: ElementRef;
  stores: any;
  sorryErrMsgBlock:boolean;
  postCode:string;
  emptyErrMsgBlocks:boolean;
  submitted:boolean;
  storedetails:any;
  findMoreContent:boolean;
  storeSuggestionBlock:boolean;
  storeForm:FormGroup;
  descriptionBlock:boolean;
  loadGMscript:boolean;
  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  constructor(
    private zone: NgZone,
    public customerForm: RegistrationForm,
    private fb: FormBuilder,
    public storeServ: StorefinderService,
    public titleService:Title,
    public singletonServ: SingletonService,
    public router: Router,
    private translate: TranslateService,
    public gtmServ:GtmMethodService

  ) {
    
    this.storeForm = this.fb.group(customerForm.storesForm());
  }
  ngOnInit() {
    const that=this;
    const  url = that.singletonServ.googleScriptKey;
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode == "US"){
      this.findMoreContent =false;
    }
    else{
      this.findMoreContent=true;
    }
    let checkExist = setInterval(function() {
       if (typeof google === 'object' && typeof google.maps === 'object') {
         that.loadGMscript=true;
          clearInterval(checkExist);
       }else{
         const _checkUrl = that.singletonServ.isMyScriptLoaded(url);
         setTimeout(()=>{
            if(!_checkUrl){
              that.loadScript(url);
            }
         });
       }
    }, 100);
    
    this.innerWidth = window.innerWidth;
    this.wrapFRslots();
    this.findDstore();
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }
    this.descriptionBlock=true;
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }
    const _baseSite = this.singletonServ;
    const pageType = 'Store Finder';
    this.gtmServ.gtmPageCategorisation(_baseSite,pageType);
  }
  loadScript(url){
    this.singletonServ.loadScript(url).then(() => {
    });
}
  setLang(lang: string) {
    this.translate.use(lang);
  }

 
  onShowStoreEvents(event){
    this.router.navigate(['store','store-events']);
  }
  wrapFRslots(){
    const that=this;
    // let _FR=$TB;
    const baseSite = this.singletonServ.catalogVersion;
    this.storeServ.getStaticContent(baseSite.lngCode).subscribe((response:any)=>{
      if(response){
        that.storeFinderFeed.nativeElement.innerHTML = response.storeFinder.slotId; 
      //   if(_FR){
      //     _FR.loadPageSlots();
      //  }
      }
    },err=>{

    });
  }
  findDstore() {
    const baseSite = this.singletonServ.catalogVersion;
    this.storeServ.getStores(baseSite).subscribe(
      response => {
        const store = response["kaoStores"];
        const currentIndex = _.findIndex(store, (res:any) => {
          return res.country == baseSite.name;
        });
        store.sort();
        this.stores = store;
        if (currentIndex != -1) {
          if(this.innerWidth > 768){
            this.stores[currentIndex]["show"] = true;
            if (this.stores[currentIndex]["stores"]) {
              this.stores[currentIndex]["stores"][0]["show"] = true;
            }
          }
        }
      },
      err => {}
    );
  }
  onStoretyeClick(event, k, l) {
    event.stopPropagation();
    event.preventDefault();
    this.stores[k]["stores"].map((obj, index) => {
      if (index == l) {
        obj["show"] = !obj["show"];
      } else {
        obj["show"] = false;
      }
    });
    setTimeout(() => {
      this.singletonServ.scrollToTargetFindStoreElement('#kaoStoreLabel'+k+l);
    }, 300);
  }
  onCountryTyeClick(event,data, k) {
    event.preventDefault();
    const _id='#kaoStoreLabel'+k;
    const top= document.getElementById("viewtotop");
    this.stores.map((obj, id) => {
        if(obj.stores){
          const _index= _.findIndex(obj.stores,(stores:any)=>{
            return stores.show
           });
           if(_index !=-1){
           obj.stores[_index]['show']=false;
           obj["show"] = false;
          }else{
            obj["show"] = false;
          }
         }else{
          obj["show"] = false;
         }
    }); 
    
    this.stores[k]['show']=!this.stores[k]['show'];
    setTimeout(() => {
      this.singletonServ.scrollToTargetFindStoreElement(_id);
    }, 300);

  }
  onCheckStore(storeName) {
    const baseSite=this.singletonServ.catalogVersion;
    this.storeServ.checkStore(baseSite,storeName).subscribe(
      response => {
        const url = "store/" + "store-finder/" + response["url"];
        this.singletonServ.storeDetail = response;
        this.router.navigate([url]);
      },
      err => {}
    );
  }
  setAddress(addrObj) {
    const that=this;
    this.zone.run(() => {
      that.fsElementRef.nativeElement.blur();
      that.findMBstores(addrObj.latitude,addrObj.longitude);
    }); 
    const _input=this.fsElementRef.nativeElement.value;    
    const actionCarriedOut = 'Search Store';
    const storedetails:string = _input;
    that.storedetails=storedetails.replace(/[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? [0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}/,'');    
    this.gtmServ.gtmStoreLocator(actionCarriedOut,that.storedetails);  
  }
  onSearchKeyUp(event) {
      let _storeval=this.storeForm.value.storeName.value;
      if(this.storeForm.value.storeName.value){
      if(_storeval.length !=0){
        _storeval.trim();
      }
    
    if (event.key === "Enter") {
      if(_storeval.length!=0){
          this.storeSuggestionBlock=false;
          this.emptyErrMsgBlocks=false;
          this.onSearchStore(event);
      }
      else{
        this.storeSuggestionBlock=true;
        this.emptyErrMsgBlocks=true;
      }
       
     }
    }
  }
  onSearchStore(event){   
       event.preventDefault();
       const that=this;
       const geocoder = new google.maps.Geocoder();
       const _input=this.fsElementRef.nativeElement.value;    
       let actionCarriedOut = 'Search Store';        
        geocoder.geocode( { 'address': _input}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) { 
              
             if(that.storeForm.valid)  {     
              const data = results.filter((obj)=>{
                return  obj['types'][0] =="postal_code"       
               });
              if(data.length !=0){
                if(data[0].address_components){
                  that.storedetails= data[0].address_components[1].long_name
                }
                else{
                  that.storedetails= '';
                }
                
                that.findMBstores(data[0].geometry.location.lat(),data[0].geometry.location.lng());
              } else if(results.length!=0){
                if(results[0].address_components){
                  that.storedetails= results[0].address_components[1].long_name
                }
                else{
                  that.storedetails= '';
                }
                that.findMBstores(results[0].geometry.location.lat(),results[0].geometry.location.lng());
              }
              that.gtmServ.gtmStoreLocator(actionCarriedOut,that.storedetails);
             that.emptyErrMsgBlocks=false;
             that.storeSuggestionBlock=true;        
             that.descriptionBlock=false;
            }else{
              that.emptyErrMsgBlocks=true;
              that.sorryErrMsgBlock=false;
              that.storeSuggestionBlock=true;        
              that.descriptionBlock=false;
            }
          } else {          
          }
        });  
     
  }
  findMBstores(lat,lng){
    const _postCode=this.fsElementRef.nativeElement.value;
    const _postcodeVal= this.storeForm.controls['storeName'].value;
    const baseSite=this.singletonServ.catalogVersion;
    if(lat && lng){
      this.singletonServ.setStoreData('kaoStoreLtLng',JSON.stringify({lat,lng,postCode:_postcodeVal}));
      this.storeServ.findStore(baseSite,lat,lng).subscribe((response)=>{
        this.storeSuggestionBlock=false;
        if(response['stores']){
          this.singletonServ.setStoreData("kaoStoreLtLng",JSON.stringify({lat,lng, postCode: _postCode }));
          let stores=response['stores'];       
          this.singletonServ.mbStores=stores;
          this.sorryErrMsgBlock=false;
          this.router.navigate(['store','company','results']);
        }else{
          const _input=this.fsElementRef.nativeElement.value;  
          this.postCode=_input; 
          this.storeSuggestionBlock=true;
          this.sorryErrMsgBlock=true;
        }
      },err=>{
        const _input=this.fsElementRef.nativeElement.value;  
          this.postCode=_input; 
          this.storeSuggestionBlock=true;
          this.sorryErrMsgBlock=true;
      });
   }
  }


  getImageIcon(_storeType){
    if(_storeType =='MBSTORES'){
     let _obj={
       image:'../../assets/imgs/detail-tabstore.png',
       icon:{
       url: "../../assets/imgs/MBstore_pinicon.png",
       scaledSize: {
         height: 40,
         width: 40
       }}
       
   }
      return _obj
    }else if(_storeType =='AIRPORTS'){
     let _obj={
       image:'../../assets/imgs/airport-icon.png',
       icon:{
       url: "../../assets/imgs/Airports_pinicon.png",
       scaledSize: {
         height: 40,
         width: 40
       }
      }
   }
      return _obj
    }else if(_storeType =='STOCKISTS'){
     let _obj={
       image:'../../assets/imgs/stockists_icon.png',
       icon:{
       url: "../../assets/imgs/Stockists_pinicon.png",
       scaledSize: {
         height: 40,
         width: 40
       }
      }
   }   
      return _obj;
    }else if(_storeType =='HOTELS'){
     let _obj={
       image:'../../assets/imgs/hotel-icon.png',
       icon:{
       url: "../../assets/imgs/hotel_pinicon.png",
       scaledSize: {
         height: 40,
         width: 40
       }
      }
   }
      return _obj;
    }
  }
    ngAfterViewInit(){
const baseSite = this.singletonServ.catalogVersion;
 if(baseSite.isoCode=="DE"){
this.titleService.setTitle('Stores | Deutschland | Molton Brown');
}
else{
  this.titleService.setTitle('Store Finder | Molton Brown® UK');
}

  }

}
