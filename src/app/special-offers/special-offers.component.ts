import { Inject,Component, OnInit, ElementRef, AfterViewInit} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import {FeatureComponentService} from "../features/features.service";
import { SingletonService } from "../services/singleton.service";
import { MetaService } from "../services/meta.service";
import { GtmMethodService } from '../services/gtmmethods.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

import * as _ from "lodash";
declare var $: any;
declare var AmpCa: any;
@Component({
  selector: "app-special-offers",
  templateUrl: "./special-offers.component.html",
  styleUrls: ["./special-offers.component.scss"]
})
export class SpecialOffersComponent implements OnInit,AfterViewInit {
  constructor(
    @Inject(DOCUMENT) public dom,  
    public singletonServ: SingletonService,
    public metaService: MetaService,
    public titleService: Title,
    public gtmServe: GtmMethodService,
    public featureServ:FeatureComponentService,
    public router: Router,
    public route: ActivatedRoute
    ) {}
 
  ngOnInit() {
    this.metaService.createCanonicalURL();

  }
  ngAfterViewInit(){
    const baseSite = this.singletonServ.catalogVersion;
    this.setLang(baseSite.lngCode);
  }
  setLang(lng) {
    const that=this;
    this.featureServ.getStaticContent(lng).subscribe(response => {
      that.singletonServ.appLocaleData = response;
      const _data = response["specialOffers"];
      _data.content.sort((a, b) => {
        return a.order - b.order;
      });
      that.setAmpContent(_data);
    });
  }
  setAmpContent(data:any) {
    const that=this
    const baseSite = this.singletonServ.catalogVersion;
    that.titleService.setTitle(data.titleName);
    data.content.forEach(obj => {
      AmpCa.utils = new AmpCa.Utils();
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: "https://c1.adis.ws",
          id: obj.content,
          store: "moltonbrown",
          templateName: obj.templateName,
          locale: baseSite.locale
        },
        callback: function(htm) {
          if (htm) {
            if(obj.identifier){
             that.dom.querySelectorAll(obj.identifier)[0].innerHTML = htm;          
           }
          }
        }
      });
    });

  }
}
