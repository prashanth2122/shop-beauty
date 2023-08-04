import {
  Inject,
  Component,
  OnInit,
  OnChanges,
  SimpleChange,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
declare var google:any;
@Component({
  selector: 'app-store-locate',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreDetailLocatorComponent implements OnInit,OnChanges,AfterViewInit,OnDestroy{
@Input() storeData:any;
@Input() direction:any;
@ViewChild('myPanel') mypanelRefer:ElementRef;
public zoom: number;  
show:boolean;
dir:any;
  constructor(@Inject(DOCUMENT) public dom,) {
    this.zoom=18;
    this.show=false;
    this.dir = {
      origin: { lat: 24.799748, lng: 120.974021 },
      destination: { lat: 24.792524, lng: 120.975517 }
  }
   }
   public renderOptions = {
    suppressMarkers: true,
  };
  
  public markerOptions = {
    origin: {
      icon: 'https://i.imgur.com/7teZKif.png',
      draggable: true,
    },
    destination: {
      icon: 'https://i.imgur.com/7teZKif.png',
      draggable: true,
      infoWindow: `
        <h4>Hello<h4>
        <a href='http://www-e.ntust.edu.tw/home.php' target='_blank'>Taiwan Tech</a>
        `
    },
  //   waypoints: [
  //     {
  //      infoWindow: string,        
  //     },
  // ]
  };
public travelMode: string = 'DRIVING'
public transitOptions: any = undefined
public drivingOptions: any = undefined
public waypoints: object = []
public optimizeWaypoints: boolean = true
public provideRouteAlternatives: boolean = false
public avoidHighways: boolean = false
public avoidTolls: boolean = false
public visible: boolean = true
public panel: object | undefined;
destroy:boolean;
mapView:any;
  ngOnInit() {
    this.destroy=true;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["direction"]) {
      that.show=false;
      if (changes["direction"]["currentValue"] != undefined) {
        that.show=true;
        that.dir=changes["direction"]["currentValue"]; 
    
      }
    }
    if (changes["storeData"]) {
      that.show=false;
      if (changes["storeData"]["currentValue"] != undefined) {
      
        that.initMap(changes["storeData"]["currentValue"]); 
    
      }
    }
  }
   setPanel() {
     if(this.dom.querySelector('#storeDirection')){
    return this.dom.querySelector('#storeDirection');
  }
}
ngAfterViewInit(){
  this.initMap(this.storeData);
}
initMap(storeData) {
  const that=this;
  const _latlng= {
    lat: storeData.geoPoint.latitude,
    lng: storeData.geoPoint.longitude
  };
  this.mapView= new google.maps.Map(document.getElementById('storeMapView'), {
    zoom: 8,
    center: _latlng,
    mapTypeId: 'roadmap',
    gestureHandling: 'cooperative'
  });
  this.mapView.setTilt(45);
  
}
ngOnDestroy(){
  this.dir=false;
}
}
