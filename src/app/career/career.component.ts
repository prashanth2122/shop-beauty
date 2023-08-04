import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { SingletonService } from "../services/singleton.service";
import { MetaService } from "../services/meta.service";
import * as _ from "lodash";
declare var AmpCa: any;
@Component({
  selector: "app-career",
  templateUrl: "./career.component.html",
  styleUrls: ["./career.component.scss"]
})
export class CareerComponent implements OnInit {
  @ViewChild("careerEl") careerEl: ElementRef;
  europeSpecific:boolean;
  constructor(
    public singletonServ: SingletonService,
    public metaService: MetaService
  ) {}

  ngOnInit() {
    this.renderTemplate();
    this.metaService.createCanonicalURL();
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="DE" || baseSite.isoCode=="EU"){
    this.europeSpecific=true;
    }
    else{
      this.europeSpecific=false;
    }
  }
  renderTemplate() {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: "b53d52e2-5cce-430a-983c-9a1d4ea725e7",
        store: "moltonbrown",
        templateName: "acc-template-homepage",
        locale: baseSite.locale
      },
      callback: function(htm) {
        that.careerEl.nativeElement.innerHTML = htm;
      }
    });
  }
}
