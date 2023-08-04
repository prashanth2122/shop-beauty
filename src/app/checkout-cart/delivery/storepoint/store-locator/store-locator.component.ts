import { Component,ElementRef, OnInit,Input,Output,EventEmitter,OnChanges,SimpleChange, AfterViewInit  } from '@angular/core';
import { SingletonService } from "../../../../services/singleton.service";
import { StorePointComponentService } from "../storepoint.service";
import * as _ from "lodash";
declare var $:any;
declare var google:any;
@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreLocatorComponent implements OnInit,OnChanges,AfterViewInit {
  public zoom: number;  
  @Input() openHourWindow:any;
  @Input() storeFinderPoints:any;
  @Input() storePoints:any;
  @Output() emitselectedStore: EventEmitter<any> = new EventEmitter<any>();
  stores:Array<any>;
  openedWindow:number;
  geoPoint:any;
  longitude:number;
  latitude:number;
  map:any;
  mapView:any;
  infoWindow:any;
  marker:any;
  checkout:boolean;
  infowindowFromList:any;
  constructor(
    public elementRef:ElementRef,
    public singletonServ:SingletonService,
    public storeServ:StorePointComponentService
    ) {
     this.latitude=singletonServ.catalogVersion.geoPoint.latitude;
     this.longitude=singletonServ.catalogVersion.geoPoint.longitude;
     }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    const that =this;
    if (changes['storePoints']){
      if (changes['storePoints']['currentValue'] != undefined){
        that.checkout=true;
        const _strorePoints =changes['storePoints']['currentValue'];
        const _st= _strorePoints.filter(_obj => {
          return _obj.geoPoint
        });
        this.stores=_st;
        if(_st.length!=0){
          this.latitude=_st[0].geoPoint.latitude;
          this.longitude=_st[0].geoPoint.longitude;
        }
        if (changes['openHourWindow']){
          if (changes['openHourWindow']['currentValue'] != undefined){
            const id=changes['openHourWindow']['currentValue']['address']['id'];
            that.stores.map((obj,i)=>{
              if(obj['address']['id']==id){
               that.openedWindow = id; 
               obj['open']=true;
              }else{
                obj['open']=false;
               }
            })
          }
          this.initMap();
        }
      }
      this.initMap();
    } else     if (changes['storeFinderPoints']){
      if (changes['storeFinderPoints']['currentValue'] != undefined){
        const _strorePoints =changes['storeFinderPoints']['currentValue'];
        that.checkout=false;
        const _arr=[];
        _strorePoints.map((obj)=>{
          _arr.push(obj.data);
        });
        const _list=  _.flattenDeep([_arr]);
        const _st= _list.filter(_obj => {
          return _obj.geoPoint
        });
        this.stores=_st;
        if(_st.length!=0){
          this.latitude=_st[0].geoPoint.latitude;
          this.longitude=_st[0].geoPoint.longitude;
        }
      }
      this.initMap();
    }

  }
  openWindow(id) {
    const that=this;
    that.openedWindow = id; 
    this.stores.map((obj,i)=>{
      if(i==id){
       that.openedWindow = id; 
       obj['open']=true;
      }else{
        obj['open']=false;
       }
    })
}
closePopup(){
  this.stores.map((obj,i)=>{
     obj['open']=false;
  })
}
isInfoWindowOpen(id) {
    return this.openedWindow == id; 
}
  ngOnInit() {
    this.zoom = 12;
    this.geoPoint=this.singletonServ.catalogVersion.geoPoint;
  }
  onSelectStore(event, data) {
    event.preventDefault();
    const baseSite = this.singletonServ.catalogVersion;
    if(data){
        const _obj = {
          clickCollect:true,
          selectedStore: data
        };   
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.setStore(user.token,user.email,user.code,data,_obj);
        } else {
          if (this.singletonServ.getStoreData(baseSite.guest)) {
            const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
            this.setStore(_guest.token,'anonymous',_guest.guid,data,_obj);
          }
        }
   }
  }


  setStore(token,email,code,data,_obj){
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    this.storeServ.setStore(baseSite,token,email,code,data).subscribe((response)=>{
      const _obj = {
        selectedStore: data,
        refreshOsSummary:true
      };  
      that.singletonServ.sendMessage(_obj);
    },err=>{
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.storeServ.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                  const _reg=(email!='anonymous')?true:false;
                  if(_reg){
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                    this.setStore(resp["access_token"],email,code,data,_obj);  
                  }else{
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                    this.setStore(resp["access_token"],email,code,data,_obj);  
                  }
                                           
                    });
            }else{
              this.emitselectedStore.emit(_obj);
            }
          }
          }
         }  
    });
  }
  getGeoPointLt(){
    if(this.stores){
    if(this.stores.length !=0){
      return this.stores[0]['latitude'];
    }else{
     return this.geoPoint.latitude;
    }
   }else{

     return this.geoPoint.latitude;
   }
   return this.geoPoint.latitude;
  }
  getGeoPointLg(){
    if(this.stores){
      if(this.stores.length !=0){
       return this.stores[0]['longitude'];
     }else{
      return this.geoPoint.longitude;
     }
   }else{
      return this.geoPoint.longitude;
    }
    return this.geoPoint.longitude;
  }
  ngAfterViewInit(){
    const  that=this;
   this.initMap();
  }
  initMap() {
    const that=this;
    const _latlng:any= {
    };
    if(this.stores){
    if(this.stores.length !=0){
      _latlng.lat= this.stores[0].geoPoint.latitude;
      _latlng.lng= this.stores[0].geoPoint.longitude;
    }else{
      _latlng.lat= that.latitude;
      _latlng.lng= that.longitude;
    }
  }else{
    _latlng.lat= that.latitude;
    _latlng.lng= that.longitude;
  }
 this.mapView= new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: _latlng,
      mapTypeId: 'roadmap',
      gestureHandling: 'cooperative'
    });
    this.mapView.setTilt(45);
    this.addMarkers();
    
  }
  addMarkers() {
    const that=this;
    const bounds = new google.maps.LatLngBounds();
   let infowindow = new google.maps.InfoWindow();
   let infowindowFromList=new google.maps.InfoWindow();
$.each( this.stores, function(i, m) {
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
    pixelOffset: new google.maps.Size(145,325),
    pane: "floatPane",
    enableEventPropagation: false,
    isHidden: false,
    infoBoxClearance: new google.maps.Size(1, 1)
  };
  infowindow.setOptions(_infowWindow);
  let marker = new google.maps.Marker({
                  position: new google.maps.LatLng(m.geoPoint.latitude , m.geoPoint.longitude),
                  bounds: true,
                  map: that.mapView,
                  icon:m['iconUrl'],
                  title: m.name
                  });
  const _center = {
                    lat: m.geoPoint.latitude,
                    lng: m.geoPoint.longitude
                  }
  const _tmpl =that.getCheckoutContent(m,marker);
              google.maps.event.addListener(marker, 'click', function() {
                  infowindowFromList.close();
                  infowindow.close();
                  infowindow.setContent(_tmpl);
                  infowindow.open(that.mapView,marker);
                  that.mapView.setCenter(_center);
              });
              if(m['open']){               
                infowindow.close();
                infowindowFromList.close();
                _infowWindow.content=_tmpl;
                infowindowFromList.setOptions(_infowWindow);
                 infowindowFromList.open(that.mapView, marker);
                 that.mapView.setCenter(_center);
             }
});
google.maps.event.addListener(infowindow, 'domready', function() {

      $("#modalSetStore").click(function(e) {
        const _storeNumber =e.currentTarget.dataset.storenumber;
        if(_storeNumber){
        const _index =that.stores.findIndex((item)=>{
           return item.storeNumber ==_storeNumber;
        });
        if(_index !=-1){
          infowindowFromList.close();
          infowindow.close();
          that.onSelectStore(e,that.stores[_index]);
        }
      }
    });
    $("#closeStore").click(function(e) {
      infowindowFromList.close()
      infowindow.close();
    });

});
google.maps.event.addListener(infowindowFromList, 'domready', function() {
  $("#modalSetStore").click(function(e) {
    const _storeNumber =e.currentTarget.dataset.storenumber;
    if(_storeNumber){
    const _index =that.stores.findIndex((item)=>{
     return item.storeNumber ==_storeNumber;
    });
    if(_index !=-1){
      that.onSelectStore(e,that.stores[_index]);
      infowindowFromList.close();
      infowindow.close();
    }
  }
});
$("#closeStore").click(function(e) {
   infowindowFromList.close()
  infowindow.close();
});
});
  }
getCheckoutContent(m,marker){
  // <h4>${(m.storeType== "GFSSTORE")?'location details':'store details'}</h4>
    const _top =marker.position.lat()+'px';
    const _left =marker.position.lng()+'px';
    const _town=(m.address.town)?`,${m.address.town}`:'';
    const _line2 =(m.address.line2)?'':`,${m.address.line2} `;
    const _storeInput=`<input type="hidden" value="${m.storeNumber}" id="storeNumber">`;
    const _kaoOpeningHours=` 
    <ul class="store-timings" >
    ${m.kaoOpeningHoursList.map(function(kaoStor){
      let temp=` <li class="store-timing-list">
      <span class="store-day">${ kaoStor.day}</span>
      <span class="store-hours">${kaoStor.openingTime}<span>/li>`
       return temp;                      
     })}
     </ul>`;
    const timings =(m.address.phone)?`
    <h6>Telephone </h6>
    <div style="width: 200px;">
     ${m.address.phone}
    </div>`:'';

  const contentString = `
  <div 
    class="infoBox" 
    style="
     width: 100%; 
     transform: translateZ(0px); 
      visibility: visible; 
      left: ${_left}; 
      top: ${_top}; 
      cursor: default;
      ">
     <div class="stores-map-view-details">
     <button type="button"  id="closeStore" class="close btn-close"  aria-label="Close"><span aria-hidden="true">X</span></button>
 
     <h4>location details</h4>
     <h5>${m.name}</h5>
     <p>${(m.address.line1)?m.address.line1+', ':''}${(m.address.line2)?m.address.line2+', ':''}${(m.address.town)?m.address.town+', ':''}${(m.address.postalCode)?m.address.postalCode+', ':''}${m.address.country.name} <br/> </p>
     <p>${m.formattedDistance} <br/></p>
     <p class="dl-content">${m.deliveryDescription}</p>
     <p>${(m.collectionTime)?m.collectionTime:''}</p>
     ${_kaoOpeningHours}
     ${_storeInput}
     <input type="hidden" value="${m.storeNumber}" id="storeNumber">
     <button type="button" id="modalSetStore" data-storeNumber="${m.storeNumber}"  class="btn btn-default btnChooseStore">SELECT</button>
        </div>
        </div>`;

        return contentString;
}

}
