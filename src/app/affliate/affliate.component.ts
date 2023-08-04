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
import { SingletonService } from "../services/singleton.service";
import {MetaService} from "../services/meta.service";
import * as _ from "lodash";
declare var AmpCa: any;
@Component({
  selector: "app-affliate",
  templateUrl: "./affliate.component.html",
  styleUrls: ["./affliate.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AffliateComponent implements OnInit {
  @ViewChild("affliateEl") affliateEl: ElementRef;
  constructor(
    public location: Location,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    public singletonServ: SingletonService,
    public metaService:MetaService
  ) {}

  ngOnInit() {
    const data = {
      templateId: "457774a2-f216-4db5-8297-c16679bd739e",
      templateName: "acc-template-homepage",
      contentType: "homepage"
    };
    this.renderTemplate(data);
    this.metaService.createCanonicalURL();
  }
  ngAfterViewInit() {
    const baseSite = this.singletonServ.catalogVersion;
     if(baseSite.isoCode=="DE"){
    this.titleService.setTitle('Affiliate-Marketing-Programm');
    }
    else{
     this.titleService.setTitle('Affiliate-Marketing-Programm');
    }
    }
  renderTemplate(data) {
    const that = this;
    const content = data;
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
        that.affliateEl.nativeElement.innerHTML = htm;
      }
    });
  }
}
