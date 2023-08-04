import { Component, OnInit, ElementRef, AfterViewInit,ViewChild } from "@angular/core";
import { HotelAmenitiesComponentService } from "./hotel-amenities.service";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import {MetaService} from "../services/meta.service";
import { SingletonService } from "../services/singleton.service";
import * as _ from "lodash";
declare var $: any;
declare var AmpCa: any;
@Component({
  selector: "app-hotel-amenities",
  templateUrl: "./hotel-amenities.component.html",
  styleUrls: ["./hotel-amenities.component.scss"]
})
export class HotelAmenitiesComponent implements OnInit,AfterViewInit {
  @ViewChild("hotelAmenitiesEl") hotelAmenitiesEl: ElementRef;
  orgMenu: boolean;
  searchByData ;
  deviceInfo: any;
  mobileDevice: boolean;
  constructor(
    public location: Location,
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    public hotelAmenty: HotelAmenitiesComponentService,
    public metaService:MetaService
    ) {
    this.orgMenu = true;

  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      this.getStaticCntnt(baseSite.lngCode);
    }    
    this.getDeviceInfo();
    this.metaService.createCanonicalURL();
  }
ngAfterViewInit(){

}

  wrapContent(){
    const that=this;
    const _catData = that.searchByData;
    const _pathName = this.router.url.split("/");
    const sitename=_pathName[_pathName.length-1];
    const _checkRouteBy= _catData.filter((item)=>{
           if(item.children){
                  const data =item.children.filter((obj)=>{
                    if(obj["filterBy"] === sitename){
                      return obj;        
                     }
                  });
            if(data.length !=0){
              return  data;
            }
           }else{
             if(item["filterBy"] === sitename){
              return item

             }
           }
        });
  for (let obj of _catData) {
    const result = that.getChildObj(obj, sitename);
    if (result) {
      this.renderTemplate(result);
      break;
    }
  }
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
      this.orgMenu = false;
    } else {
      this.mobileDevice = false;
      this.orgMenu = true;
    }
  }
  getChildObj(obj, targetId) {
    if (obj["filterBy"] === targetId) {
      return obj;
    }
    if (obj.children) {
      for (let item of obj.children) {
        let check = this.getChildObj(item, targetId);
        if (check) {
          return check;
        }
      }
    }
    return null;
  }
  renderTemplate(data) {
    const that = this;
    const baseSite = this.singletonServ.catalogVersion;
    const content = data;
    this.titleService.setTitle(data.titleName);
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: data.templateId,
        store: "moltonbrown",
        templateName: data.templateName,
        locale: baseSite.locale
      },
      callback: function(htm) {
        that.hotelAmenitiesEl.nativeElement.innerHTML = htm;
        if (content.contentType != "text") {
          AmpCa.utils.postProcessing.execHtmlService(content.contentType, {});
          AmpCa.utils.postProcessing.execHtmlService("splitBlock", {});
        }
      }
    });
  }
  onMenuContentClick(data, k) {
    if (!this.mobileDevice) {
        if (data.filterBy == "hotel-amenities") {
          this.router.navigate(["store", "hotel-amenities"]);
        }
        else if(data.filterBy == "bespoke-hotel-amenities"){
          this.router.navigate(["store", data.filterBy]);
        } 
        else if(data.templateId== "Contact-Hotel-Amenities"){
          this.router.navigate(["store", "browse","feedback","feedback"],{ queryParams: { type: "hotelservicesfeedback"}});
        } 
        else {
          this.router.navigate(["store", "hotel-amenities", data.filterBy]);
        }
    } else {
        if (data.children) {
          this.searchByData[k]["show"] = !this.searchByData[k]["show"];
        }  if (data.filterBy == "hotel-amenities") {
          this.router.navigate(["store", "hotel-amenities"]);
        } else {
          this.router.navigate(["store", "hotel-amenities", data.filterBy]);
        }
    }
  }
  onSubMenuContentClick(event, data, subData) {
    event.stopPropagation();
    this.router.navigate([
      "store",
      "hotel-amenities",
      data.filterBy,
      subData.filterBy
    ]);
  }
  onCollapseMenu() {
    if (this.orgMenu) {
      this.orgMenu = false;
    } else {
      this.orgMenu = true;
    }
  }
  getStaticCntnt(lang: string) {
    const that = this;
    this.hotelAmenty.getStaticContent(lang).subscribe(response => {
      that.searchByData = response["hotelAmenities"];
      that.wrapContent();
    });
  }
}
