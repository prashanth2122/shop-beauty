import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  Output,
  NgZone
} from "@angular/core";

declare var H: any;
@Component({
  selector: "app-store-route",
  templateUrl: "./store-route.component.html",
  styleUrls: ["./store-route.component.scss"]
})
export class StoreRouteComponent implements OnInit, AfterViewInit{
  current: any;
  addrObj:any;
  @Input() storeData: any;
  @Output() setDirection: EventEmitter<any> = new EventEmitter<any>();
  @Input() direction: any;
  origin:any; 
  @ViewChild("map")
  public mapElement: ElementRef;
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild('myPanel') mypanelRefer:ElementRef;
  constructor(
    private zone: NgZone
  ) {
    this.current = "WALKING";
  }

  ngOnInit() {}
  ngAfterViewInit() {}
  onRouteType(data: any) {
    const that=this;
    this.current = data;
    if(that.addrObj){
      const _obj = {
        origin: { lat: that.addrObj.latitude, lng: that.addrObj.longitude },
        destination: { lat: that.storeData.geoPoint.latitude, lng: that.storeData.geoPoint.longitude },
        travelMode:this.current
      };
      this.setDirection.emit(_obj);
    }
  }
  onGetDirection() {
    const that=this;
    if(that.addrObj){
    const _obj = {
      origin: { lat: that.addrObj.latitude, lng: that.addrObj.longitude },
      destination: { lat: that.storeData.geoPoint.latitude, lng: that.storeData.geoPoint.longitude },
      travelMode:this.current
    };
    this.setDirection.emit(_obj);
  }
}
  setAddress(data) {
    this.zone.run(() => {
          this.addrObj=data
    });
  }

}
