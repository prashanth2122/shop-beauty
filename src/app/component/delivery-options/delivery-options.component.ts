

import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { SingletonService } from "../../services/singleton.service";
import * as _ from "lodash";
declare var AmpCa: any;
@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryOptionsComponent implements OnInit {
  @ViewChild("deliveryOptionEl") deliveryOptionEl: ElementRef;
  constructor(
    public location: Location,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    public singletonServ: SingletonService
  ) {}

  ngOnInit() {
    const data = {
      templateId: "c0559d78-2dff-4ec8-be94-35fc87a9ab39",
      templateName: "acc-template-homepage",
      contentType: "homepage"
    };
    this.renderTemplate(data);
  }
  renderTemplate(data) {
    const that = this;
     const baseSite = this.singletonServ.catalogVersion;
    AmpCa.utils = new AmpCa.Utils();    
    that.titleService.setTitle(data.titleName);
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: data.templateId,
        store: "moltonbrown",
        templateName: data.templateName,
        locale: baseSite.locale
      },
      callback: function(htm) {
        that.deliveryOptionEl.nativeElement.innerHTML = htm;
      }
    });
  }
}
