import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { SingletonService } from "../services/singleton.service";
import { MetaService } from "../services/meta.service";
import * as _ from "lodash";
declare var AmpCa: any;

@Component({
  selector: 'app-careersection',
  templateUrl: './careersection.component.html',
  styleUrls: ['./careersection.component.scss']
})
export class CareersectionComponent implements OnInit {
  @ViewChild("careerEl") careerEl: ElementRef;
  constructor(
    public singletonServ: SingletonService,
    public metaService: MetaService
  ) {}

  ngOnInit() {
    this.renderTemplate();
    this.metaService.createCanonicalURL();
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

