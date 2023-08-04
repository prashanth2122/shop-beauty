import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HeaderComponentService } from "../component/header/header.service";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { SingletonService } from "../services/singleton.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import * as _ from "lodash";
import * as amp from "../../assets/js/amp-min.js";
import * as Handlebars from "../../assets/js/handlebar.min";
declare var $: any;
declare var AmpCa: any;
@Component({
  selector: "app-gift-cards",
  templateUrl: "./gift-cards.component.html",
  styleUrls: ["./gift-cards.component.scss"]
})
export class GiftCardsComponent implements OnInit {
  @ViewChild("giftCardEl") giftCardEl: ElementRef;
  orgMenu: boolean;
  searchByData:any;
  deviceInfo: any;
  mobileDevice: boolean;

  constructor(
    public location: Location,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public route: ActivatedRoute,
    public headerServ: HeaderComponentService,
    public singletonServ: SingletonService
  ) {
    this.orgMenu = true;
  }
  ngOnInit() {
    const baseSite =this.singletonServ.catalogVersion;
    if(baseSite){
        this.getStaticCntnt(baseSite.lngCode) ;
    }
  }
  renderTemplate() {}
  onMenuContentClick(data) {
    this.router.navigate([data.route]);
  }
  getStaticCntnt(lang: string) {
    this.headerServ.getStaticContent(lang).subscribe(response => {
      this.searchByData = response["giftCard"];
    });
  }
}
