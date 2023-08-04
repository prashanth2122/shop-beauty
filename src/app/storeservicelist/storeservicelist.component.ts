import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  AfterViewInit
} from "@angular/core";
import { StorefinderService } from "../storefinder/storefinder.service";
import { SingletonService } from "../services/singleton.service";
import { Router } from "@angular/router";
import { TranslateService } from "./../translate.service";
import * as _ from "lodash";
import { GtmMethodService } from './../services/gtmmethods.service';
declare const google: any;
declare var $:any;
@Component({
  selector: "app-storeservicelist",
  templateUrl: "./storeservicelist.component.html",
  styleUrls: ["./storeservicelist.component.scss"]
})
export class StoreservicelistComponent implements OnInit,AfterViewInit {
  @ViewChild("storeFinderFeed") storeFinderFeed: ElementRef;
  @ViewChild("findStore") fsElementRef: ElementRef;
  openHourWindow: any;
  storePointList:any;
  storesList: any;
  zoom: number;
  copyOfStoreList:Array<any>;
  storePoints: Array<any>;
  uniqStoreList:number;
  storeTypeList = [
    {
      name: "Stores",
      sortBy: "MBSTORES",
      checked: false
    },
    {
      name: "Stockists",
      sortBy: "STOCKISTS",
      checked: false
    },
    {
      name: "Airports",
      sortBy: "AIRPORTS",
      checked: false
    },
    {
      name: "Hotel",
      sortBy: "HOTELS",
      checked: false
    }
  ];
  enableFilterSort:boolean;
  loadGMscript:boolean;
  storeName:string;
  mapView:any;
  storedetails:any;
  infoWindow:any;
  constructor(
    public storeServ: StorefinderService,
    public zone: NgZone,
    public gtmServ:GtmMethodService,
    private translate: TranslateService,
    public singletonServ: SingletonService,
    public router: Router
  ) {

  }
  ngOnInit() {
    const that =this;
    const  url = that.singletonServ.googleScriptKey;
    let checkExist = setInterval(function() {
      if (typeof google === 'object' && typeof google.maps === 'object') {
         that.constructStorServiceList();
         clearInterval(checkExist);
      }else{
        const _checkUrl = that.singletonServ.isMyScriptLoaded(url);
        setTimeout(()=>{
           if(!_checkUrl){
             that.loadScript(url);
           }else{
             that.loadGMscript=true;
           }
        });
      }
   }, 100);

  }
  waitForEl( count) {
    const that=this;
    alert('kick'+count);
    if (typeof google === 'object' && typeof google.maps === 'object') {
      alert('kick')
     
   } else {
       if(!count) {
         count=0;
       }
       count++;
       if(count<10) {
         that.waitForEl(count);
       } else {
         return;
        }
   }
 }
 ngAfterViewInit(){
}
 constructStorServiceList(){
  const baseSite=this.singletonServ.catalogVersion;
  this.zoom = 8;
  if(baseSite){
    this.setLang(baseSite.lngCode);
  }
  this.loadGMscript=true;
  this.retrieveStoreList();
 }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  retrieveStoreList(){
  const that=this;
  if (that.singletonServ.mbStores) {
    const stores = that.singletonServ.mbStores;
    if (that.singletonServ.getStoreData("kaoStoreLtLng")) {
      const stor = JSON.parse(that.singletonServ.getStoreData("kaoStoreLtLng"));
      that.storeName=stor.postCode;
      this.initMap(stor);
    }
    const _store=stores.filter((item)=>{
      if(item.storeType=='HOTELS'||item.storeType=='MBSTORES'||item.storeType=='STOCKISTS'||item.storeType=='AIRPORTS'){
        return item;
      }
  });
    that.setUpStore(_store);
  } else {
    if (that.singletonServ.getStoreData("kaoStoreLtLng")) {
      const stor = JSON.parse(that.singletonServ.getStoreData("kaoStoreLtLng"));
      if(stor.lat&&stor.lng){
          that.findMBstores(stor.lat, stor.lng);
          this.initMap(stor);
          that.storeName=stor.postCode;
      }
    }
  }
  that.wrapFRslots();
  }
  onShowDt(event, i,p) {
    event.stopPropagation();
    this.storesList[i]['data'][p]["show"] = !this.storesList[i]['data'][p]["show"];
  }
  searchAddress(event){
    this.onSearchStore(event);
  }
  setAddress(addrObj) {
    const that = this;
    const actionCarriedOut:string = 'Search Store';
    if(addrObj.postCode){
      this.storeName=addrObj.postCode;
      that.findMBstores(addrObj.latitude, addrObj.longitude);
    } else  {
      this.storeName=addrObj.formatted_address;
      let usapostalCode=this.storeName.split(",");

      if(usapostalCode[usapostalCode.length-1]==" UK"){
        that.storedetails=this.storeName.replace(/[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? [0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}/,'');
      }
      else{
        that.storedetails='Other';
      }
      
      that.getPostCodeByLatLng(addrObj.latitude,addrObj.longitude,addrObj.postal_code);
      this.gtmServ.gtmStoreLocator(actionCarriedOut,that.storedetails);
    }

    
    if(this.fsElementRef){
      const _input=this.fsElementRef.nativeElement.value; 
      that.storedetails = _input;
      this.gtmServ.gtmStoreLocator(actionCarriedOut,that.storedetails);
    }
  }
  getPostCodeByLatLng(lan ,longe,postal_code) {
    const that=this;
    const latlng = new google.maps.LatLng(lan,longe);
    const geocoderrr = new google.maps.Geocoder();
    geocoderrr.geocode({'latLng': latlng}, function(results1, status) {
        if (status == google.maps.GeocoderStatus.OK) {
         const data = results1.filter((obj)=>{
           return  obj['types'][0] =="postal_code"       
          });
          if(data.length !=0){
           const _obj={
             latitude:data[0].geometry.location.lat(),
             longitude:data[0].geometry.location.lng()
          } 
           _obj['postCode']=postal_code;
           that.findMBstores(_obj.latitude, _obj.longitude);
         } else {

           that.storesList=[];
         }
     }else{
       this.storeLoad=false;
     }
        if (status == "ZERO_RESULTS") {

         this.storeLoad=false;
         that.storesList=[];
        }
      });
}
  onSearchKeyUp(event) {
    if (event.key === "Enter") {
      this.onSearchStore(event);
    }
  }
  onSearchStore(event) {
    event.preventDefault();
    const that=this;
    const geocoder = new google.maps.Geocoder();    
    const _input =  this.storeName;
    geocoder.geocode({ address: _input }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        const data = results.filter((obj)=>{
          return  obj['types'][0] =="postal_code"       
         });
         if(data.length !=0){
          that.findMBstores(
            data[0].geometry.location.lat(),
            data[0].geometry.location.lng()
          );
         }else if(results.length !=0){
          that.findMBstores(
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng()
          );
         }

      } else {
      }
    });
  }

  findMBstores(lat, lng) {
    const _postCode =  this.storeName;
    const baseSite=this.singletonServ.catalogVersion;
    this.singletonServ.setStoreData("kaoStoreLtLng",JSON.stringify({ lat, lng, postCode: _postCode }));
    this.storeName=_postCode;
    this.storeServ.findStore(baseSite,lat, lng).subscribe(
      (response:any) => {
        if (response) {
          const stores = response["stores"];
          const _store=stores.filter((item)=>{
              if(item.storeType=='HOTELS'||item.storeType=='MBSTORES'||item.storeType=='STOCKISTS'||item.storeType=='AIRPORTS'){
                return item;
              }
          });
          if(_store){
            console.log(_store);
            this.setUpStore(_store);
          }
       }
      },
      err => {}
    );
  }


  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  setStoreOrder(_storeType){ 
    if (_storeType === "MBSTORES") {
      return 0;
    } else if (_storeType === "AIRPORTS") {
      return 1;
    } else if (_storeType === "STOCKISTS") {
      return 2;
    } else if (_storeType === "HOTELS") {
      return 3;
    }
  }
  getImageIcon(_storeType) {
    if (_storeType === 'MBSTORES') {
      const _obj = {
        image: '../../assets/imgs/detail-tabstore.png',
        icon: {
          url: '../../assets/imgs/MBstore_pinicon.png',
          scaledSize: {
            height: 40,
            width: 40
          }
        }
      };
      return _obj;
    } else if (_storeType === 'AIRPORTS') {
      const _obj = {
        image: '../../assets/imgs/airport-icon.png',
        icon: {
          url: '../../assets/imgs/Airports_pinicon.png',
          scaledSize: {
            height: 40,
            width: 40
          }
        }
      };
      return _obj;
    } else if (_storeType == "STOCKISTS") {
      const _obj = {
        image: "../../assets/imgs/stockists_icon.png",
        icon: {
          url: "../../assets/imgs/Stockists_pinicon.png",
          scaledSize: {
            height: 40,
            width: 40
          }
        }
      };
      return _obj;
    } else if (_storeType === 'HOTELS') {
      const _obj = {
        image: '../../assets/imgs/hotel-icon.png',
        icon: {
          url: '../../assets/imgs/hotel_pinicon.png',
          scaledSize: {
            height: 40,
            width: 40
          }
        }
      };
      return _obj;
    }
  }

  onChangeStoreBy(event,k) {
    event.preventDefault();
    if (event.target.checked) {
          this.storeTypeList[k]['checked'] = true;
          const _types=[];
          this.storeTypeList.map((item:any)=>{
            if(item.checked){
              if(item.stores.data.length !=0){
                 _types.push(item.stores);
              }
            }
          });
          _types.sort(function(a, b) {
           return a.order - b.order;
         });
        this.storesList=_types;
        this.constructMarkers();
        this.checkStoresCount(this.storesList);
    } else {
      this.storeTypeList[k]['checked'] = false;
      const _types=[];
      this.storeTypeList.map((item:any)=>{
        if(item.checked){
          _types.push(item.stores);
         }
      });
     _types.sort(function(a, b) {
           return a.order - b.order;
      });
      if(_types.length !=0){
        this.storesList=_types;
        this.constructMarkers();
      }else{
        this.storesList=this.copyOfStoreList;
        this.constructMarkers();
      }
      this.checkStoresCount(this.storesList);
    }
    
  }

  onFindStoreDetail(storeData) {
    this.onCheckStore(storeData.name, false);
  }
  onFindStoreDirection(storeData) {
    this.onCheckStore(storeData.name, true);
  }
  onCheckStore(storeName, direction) {
    const that = this;
    const baseSite=this.singletonServ.catalogVersion;
    console.log("check store");
    this.storeServ.checkStore(baseSite,storeName).subscribe(
      response => {
        if (direction) {
          const url = 'store/' + 'store-finder/' + response['url'];
          this.singletonServ.storeDetail = response;
          this.router.navigate([url], {
            queryParams: { getDirections: true },
            queryParamsHandling: 'merge'
          });
        } else {
          const url = 'store/' + 'store-finder/' + response['url'];
          this.singletonServ.storeDetail = response;
          that.router.navigate([url]);
        }
      },
      err => {}
    );
  }

  checkStoresCount(data){
    let len=0
    data.map((obj) => {

       len=len+obj.data.length;       
    });
    this.uniqStoreList = len;
  }

loadScript(url){
  this.singletonServ.loadScript(url).then(() => {
    this.loadGMscript=true;
  });
}
wrapFRslots(){
  const that=this;
  const baseSite = this.singletonServ.catalogVersion;
  this.storeServ.getStaticContent(baseSite.lngCode).subscribe((response:any)=>{
    if(response){
      that.storeFinderFeed.nativeElement.innerHTML = response.storeFinder.slotId;
    }
  },err=>{

  });
}





setUpStore(stores) {
  const that=this;
  const date = new Date();
  date.getDay();
  const _day = date.toDateString().split(" ")[0].toLowerCase();
  stores.map((obj, k) => {
    const storeAssetInfo:any = that.getImageIcon(obj["storeType"]);
    obj["image"] = storeAssetInfo.image;
    obj["iconUrl"] = storeAssetInfo.icon;
    obj['order']=that.setStoreOrder(obj["storeType"]);
    const currentOpenHour = _.find(obj["kaoOpeningHoursList"], function(o) {
      return o.day.indexOf(_day) != -1;
    });
    if (currentOpenHour != -1) {
       obj["currentOpenHour"] = currentOpenHour;
    }
  });
  const _mbStores = stores.filter(_obj => {
    return _obj.storeType == "MBSTORES";
  });
  const _airports = stores.filter(_obj => {
    return _obj.storeType == "AIRPORTS";
  });

  const _stocklist = stores.filter(_obj => {
    return _obj.storeType == "STOCKISTS";
  });

  const _hotels = stores.filter(_obj => {
    return _obj.storeType == "HOTELS";
  });

  const _storelist=[
    {
      storeType:"MBSTORES",
      header:true,
      name:"STORES",
      order:0,
      data:_mbStores
    },
    {
      storeType:"STOCKISTS",
      header:true,
      name:"STOCKISTS",
      order:1,
      data:_stocklist
    },
    {
      storeType:"AIRPORTS",
      header:true,
      name:"AIRPORTS",
      order:2,
      data:_airports
    },
    {
      storeType:"HOTELS",
      header:true,
      name:"HOTELS",
      order:3,
      data:_hotels
    }
  ];
  _storelist.sort(function(a, b) {
    return a.order - b.order;
  });

  this.copyOfStoreList=this.nestedCopy(_storelist);
  
  const _copyOfStoreList=this.nestedCopy(_storelist);
  const storesPoint = _copyOfStoreList.filter((obj)=>{
   return  obj.storeType !="HOTELS"
  });
  this.storesList=storesPoint;
  const _data=JSON.parse(JSON.stringify(storesPoint));
  this.checkStoresCount(_data);
  this.storePointList=storesPoint;
  this.storesList = storesPoint;
  this.storeTypeList.map(item => {
    if (_storelist) {
      const _data = _storelist.filter(_obj => {
        return _obj.storeType == item.sortBy;
      });
      if (_data.length != 0) {
        item["stores"] = _data[0];
        item["checked"] = (_data[0]['data'].length !=0)? true:false;
        item["disabled"] = false;
      } else {
        item["checked"] = false;
        item["disabled"] = true;
      }
    }
  });
  this.storeTypeList[3]["checked"]=false;
  this.constructMarkers();
}

 constructMarkers(){
    const that=this;
    const _strorePoints =this.storesList; 
    const _arr=[];
    _strorePoints.map((obj)=>{
      _arr.push(obj.data);
    });
    const _list=  _.flattenDeep([_arr]);
    const _st= _list.filter(_obj => {
      return _obj.geoPoint
    });
    if(_st.length!=0){
      that.addMarkers(_st);
    }else{
      const _emptyStores=[];
      that.addMarkers(_emptyStores);
    }  
 }

initMap(storeData) {
  const _latlng= {
    lat: storeData.lat,
    lng: storeData.lng
  };
  this.mapView= new google.maps.Map(document.getElementById('storeFinderMapView'), {
    zoom: 12,
    center: _latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    gestureHandling: 'cooperative'
  });
}
addMarkers(stores) {
  console.log(stores);
  const that=this;
 const infowindow = new google.maps.InfoWindow();
$.each(stores, function(i, m) {
      const _infowWindow ={
        content: '',
        alignBottom:true,
        disableAutoPan: false,
        maxWidth: 350,
        zIndex: null,
        boxStyle: {
          background: "url('https://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
          opacity: 0.90,
          width: "300px"
      },
      closeBoxMargin: "12px 4px 2px 2px",
      closeBoxURL: "https://www.google.com/intl/en_us/mapfiles/close.gif",
      pixelOffset: new google.maps.Size(150,350),
      pane: "floatPane",
      enableEventPropagation: false,
      isHidden: false,
      infoBoxClearance: new google.maps.Size(1, 1)
    };
    infowindow.setOptions(_infowWindow)
          let _url;
          let _getDirections;
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(m.geoPoint.latitude , m.geoPoint.longitude),
          map: that.mapView,
          icon:m['iconUrl'],
          title: m.name
      });
      const _tmpl =that.getStoreContent(m,_url,_getDirections,marker);
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.close();
          infowindow.setContent(_tmpl);
          infowindow.open(that.mapView,marker);

      });  
    }
    );
    google.maps.event.addListener(infowindow, 'domready', function() {
        $("#modalSetStore").click(function(e) {
          const _storeNumber =e.currentTarget.dataset.storenumber;
          const _index =stores.findIndex((item)=>{
          return item.storeNumber ==_storeNumber;
          });
          if(_index !=1){
          }
        });
        $("#closeStore").click(function(e) {
          infowindow.close();
        });
    });
}
getStoreContent(m,_url,_getDirections,marker){
  const _top =marker.position.lat()+'px';
  const _left =marker.position.lng()+'px';
  const _town=(m.address.town)?`,${m.address.town}`:'';
  const _line2 =(m.address.line2)?'':`,${m.address.line2} `;
  const _kaoOpeningHours=`<h4>Opening Hours </h4>
  <dl>
  ${m.kaoOpeningHoursList.map(function(kaoStor){
    let temp=` <dt>${ kaoStor.day}</dt>
    <dd>${kaoStor.openingTime}</dd>`
     return temp;                      
   })}
   </dl>`;
  const timings =(m.address.phone)?`
  <h4>Telephone </h4>
  <div style="width: 200px;">
   ${m.address.phone}
  </div>`:'';

let contentString = `
<div 
  class="infoBox" 
  style="
  background-color:#fff; 
  width: 234px; 
  transform: translateZ(0px); 
   visibility: visible; 
   left: ${_left}; 
   top: ${_top}; 
   cursor: default;
    ">
<img 
   id="closeStore"
   src="//images.moltonbrown.co.uk/images/en_GB/close-btn.png?version=4" 
   align="right" 
   style=" position: relative; cursor: pointer; margin: 2px;">
   <div class="tooltip-map">
   <div class="arrow-tooltip"></div>
   <div class="title-map">
   <div class="tmap-inner">
    <h3>${m.name}</h3>
    <p>${(m.address.line1)?m.address.line1+', ':''}${(m.address.line2)?m.address.line2+', ':''}${m.address.country.name} </p>
    </div>
    </div>
     ${_kaoOpeningHours}
     <div class="map-links">
      <a href="${_url}" 
        class="tool-link1">
        Store Details
      </a>
      <a href="${_getDirections}">
      Get Directions
      </a>
      </div>
      </div>
      </div>`;
      return contentString;
}


}
