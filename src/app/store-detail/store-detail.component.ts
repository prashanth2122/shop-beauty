import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  AfterViewInit
} from "@angular/core";
import { SingletonService } from "../services/singleton.service";
import { StorefinderService } from "../storefinder/storefinder.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { MetaService } from "../services/meta.service";
import { GtmMethodService } from './../services/gtmmethods.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import * as _ from "lodash";
declare var google:any;
@Component({
  selector: "app-store-detail",
  templateUrl: "./store-detail.component.html",
  styleUrls: ["./store-detail.component.scss"]
})
export class StoreDetailComponent implements OnInit,AfterViewInit {
  storeData: any;
  listView: boolean;
  currentOpenHour: any;
  direction: any;
  storeForm: FormGroup;
  loadGMscript:boolean;
  @ViewChild("findStore") fsElementRef: ElementRef;
  @ViewChild("myPanel") mypanelRefer: ElementRef;
  @ViewChild("storeRoute") myStoreRouteEl: ElementRef;
  mapView:any;
  public zoom: number;
  show: boolean;
  address:any;
  dir: any;
  infoWindow:any;
  storeImage:any;
  public renderOptions = {
    suppressMarkers: true
  };
  public markerOptions = {
    origin: {
      icon: "https://i.imgur.com/7teZKif.png",
      draggable: true
    },
    destination: {
      icon: "https://i.imgur.com/7teZKif.png",
      draggable: true,
      infoWindow: `
          <h4>Hello<h4>
          <a href='http://www-e.ntust.edu.tw/home.php' target='_blank'>Taiwan Tech</a>
          `
    }
  };
  public travelMode: string = "DRIVING";
  public transitOptions: any = undefined;
  public drivingOptions: any = undefined;
  public waypoints: object = [];
  public optimizeWaypoints: boolean = true;
  public provideRouteAlternatives: boolean = false;
  public avoidHighways: boolean = false;
  public avoidTolls: boolean = false;
  public visible: boolean = true;
  public panel: object | undefined;
  destroy: boolean;
  latitude:any;
  longitude:any;
  constructor(
    private zone: NgZone,
    public singletonServ: SingletonService,
    public storeServ: StorefinderService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public gtmServ:GtmMethodService,
    public metaService: MetaService
  ) {
    this.storeData = singletonServ.storeDetail;
    this.latitude=singletonServ.catalogVersion.geoPoint.latitude;
    this.longitude=singletonServ.catalogVersion.geoPoint.longitude;
    this.listView = true;
    this.zoom = 18;
    this.show = false;
    this.dir = {
      origin: { lat: 24.799748, lng: 120.974021 },
      destination: { lat: 24.792524, lng: 120.975517 }
    };
  }
  onSearchKeyUp(event) {
    if (event.key === "Enter") {

    }
  }
  setAddress(addrObj) {
        let actionCarriedOut = 'Search Store';
    const _input=this.fsElementRef.nativeElement.value; 
    let storedetails = _input;
    this.gtmServ.gtmStoreLocator(actionCarriedOut,storedetails);
    this.zone.run(() => {
      const _obj = {
        latitude: addrObj.latitude,
        longitude: addrObj.longitude
      };
    });
  }
  onSubmitForm(event) {
    if (this.storeForm.valid) {
      this.router.navigate(["store", "company", "stores"]);
      let actionCarriedOut = 'Search Store';
      const _input=this.fsElementRef.nativeElement.value; 
      let storedetails = _input;
      this.gtmServ.gtmStoreLocator(actionCarriedOut,storedetails);
    }
  }
  ngOnInit() {
    this.storeForm = this.fb.group({
      storeName: new FormControl("", { validators: [Validators.required] })
    });
    this.destroy = true;
  }

  titleCase(str) {
    let splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }
  getImageIcon(_storeType) {
    if (_storeType == "MBSTORES") {
      let _obj = {
        image: "../../assets/imgs/detail-tabstore.png",
        url: "../../assets/imgs/MBstore_pinicon.png",
        scaledSize: {
          height: 40,
          width: 40
        }
      };
      return _obj;
    } else if (_storeType == "AIRPORTS") {
      let _obj = {
        image: "../../assets/imgs/airport-icon.png",
        url: "../../assets/imgs/Airports_pinicon.png",
        scaledSize: {
          height: 40,
          width: 40
        }
      };
      return _obj;
    } else if (_storeType == "STOCKISTS") {
      let _obj = {
        image: "../../assets/imgs/stockists_icon.png",
        url: "../../assets/imgs/Stockists_pinicon.png",
        scaledSize: {
          height: 40,
          width: 40
        }
      };
      return _obj;
    } else if (_storeType == "HOTELS") {
      let _obj = {
        image: "../../assets/imgs/hotel-icon.png",
        url: "../../assets/imgs/hotel_pinicon.png",
        scaledSize: {
          height: 40,
          width: 40
        }
      };
      return _obj;
    }
  }

  getIcon(storeType) {
    if (storeType == "MBSTORES") {
      return "../../assets/imgs/detail-tabstore.png";
    } else if (storeType == "AIRPORTS") {
      return "../../assets/imgs/airport-icon.png";
    } else if (storeType == "STOCKISTS") {
      return "../../assets/imgs/stockists_icon.png";
    } else if (storeType == "HOTELS") {
      return "../../assets/imgs/airport-icon.png";
    }
  }
  onShowStoreList(status) {
    this.listView = status;
  }

  setOriginName(lat,lng){
      let geocoder = new google.maps.Geocoder;
      let latlng = {lat: lat, lng: lng};
       geocoder.geocode({'location': latlng}, (results, status) => {
        const data = results.filter((obj)=>{
          return  obj['types'][0] =="postal_code"       
         });
       if(data.length !=0){
        this.myStoreRouteEl['searchElementRef'].nativeElement.value=data[0]["formatted_address"];
       }else if(results.length !=0){
        this.myStoreRouteEl['searchElementRef'].nativeElement.value=results[0]["formatted_address"];
       }
    });
  }
  ngAfterViewInit(){
    const that =this;
    const  url = that.singletonServ.googleScriptKey;
    this.metaService.createCanonicalURL();
    let checkExist = setInterval(function() {
      if (typeof google === 'object' && typeof google.maps === 'object') {
         that.constructStoreDetail();
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
loadScript(url){
  this.singletonServ.loadScript(url).then(() => {
    this.loadGMscript=true;
  });
}
constructStoreDetail(){
  const baseSite=this.singletonServ.catalogVersion;
      //  if (!this.storeData) {
        const _urlPath = this.location
        .path()
        .slice(1)
        .split("/");
      let _storename = _urlPath[_urlPath.length - 2];
      _storename = _storename.replace(/-/g, " ");
      const name = this.titleCase(_storename);
      this.storeServ.checkStore(baseSite,name).subscribe(
        response => {
          let date = new Date();
          const storeData = response;
          this.storeImage=     this.getImageIcon(response["storeType"])     
          storeData["storeAssets"] = this.getImageIcon(response["storeType"]);
          date.getDay();
          const currentOpenHour = _.find(
            response["kaoOpeningHoursList"],
            function(o) {
              let _date=date.toDateString().split(" ")[0].toLowerCase();
              return (
                o.day.indexOf(_date) != -1
              );
            }
          );
          this.currentOpenHour = currentOpenHour;
  
          this.storeData = storeData;
          const queryStatus = this.route.snapshot.queryParamMap.get(
            "getDirections"
          );
          if (queryStatus) {
            const _obj = {
              origin: { lat: "", lng: "" },
              destination: {
                lat: this.storeData.geoPoint.latitude,
                lng: this.storeData.geoPoint.longitude
              },
              travelMode: "WALKING"
            };

            _obj['origin']['lat']=baseSite['geoPoint']['latitude'];
            _obj['origin']['lng']=baseSite['geoPoint']['longitude'];
            this.listView =false;
            this.initMap(storeData);
          }else{
            this.initMap(storeData);
          }
          this.storeForm.controls["storeName"].patchValue(response["name"]);
         
        },
        err => {
          const queryStatus = this.route.snapshot.queryParamMap.get(
            "getDirections"
          );
          if (queryStatus) {
            this.listView =false;
            this.initMap(this.storeData);
          }else{
            this.initMap(this.storeData);
          }
          
        }
      );
}
getStoreImage(data){
 const _img= this.getImageIcon(data["storeType"]);
 return _img.image;
}
initMap(storeData) {
  const that=this;
  const _latlng= {
    lat: that.latitude,
    lng: that.longitude
  };
  if(this.storeData){
    _latlng.lat= this.storeData.geoPoint.latitude;
    _latlng.lng= this.storeData.geoPoint.longitude;
  }else{
    _latlng.lat= that.latitude;
    _latlng.lng= that.longitude;
  }
  const bounds = new google.maps.LatLngBounds();
  this.mapView= new google.maps.Map(document.getElementById('storeDateMapView'), {
    zoom: 18,
    center: _latlng,
    mapTypeId: 'roadmap',
    gestureHandling: 'cooperative'
  });
  this.mapView.setTilt(45);
  this.addMarkers(storeData);
}
addMarkers(storeData){
  const that=this;
  const bounds = new google.maps.LatLngBounds();
  this.infoWindow = new google.maps.InfoWindow();
 let infowindow = new google.maps.InfoWindow({
content: '',
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
infoBoxClearance: new google.maps.Size(0, 90),
pixelOffset: new google.maps.Size(135,270)
});
const _icon=this.getImageIcon(storeData["storeType"])
let marker = new google.maps.Marker({
  position: new google.maps.LatLng(storeData.geoPoint.latitude , storeData.geoPoint.longitude),
  bounds: true,
  map: that.mapView,
  icon:_icon.url,
  title: storeData.name,
  pixelOffset: new google.maps.Size(10, 60)
});
}
getDirections(){

}
setDirection(data) {
  this.dir = data;
  this.show = true;
  this.calculateAndDisplayRoute(data);
}
calculateAndDisplayRoute(data:any) {
  const that=this;
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer({
    'map': that.mapView,
    'preserveViewport': false,
    'draggable': true
  });
  this.zone.runOutsideAngular(()=>{


  document.getElementById("directions_panel").innerHTML = ""; 
  directionsRenderer.setPanel(null);
  directionsRenderer.setMap(null); 
  directionsRenderer.set('directions', null);
  directionsRenderer.setMap(this.mapView);
  directionsRenderer.setPanel(document.getElementById('directions_panel'));
  directionsService.route(
      {
        origin: data.origin,
        destination:  data.destination,
        travelMode: google.maps.TravelMode[data.travelMode],
        unitSystem: google.maps.UnitSystem.METRIC
      },
      function(response, status) {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          // window.alert('Directions request failed due to ' + status);
        }
      });
    });
}
}