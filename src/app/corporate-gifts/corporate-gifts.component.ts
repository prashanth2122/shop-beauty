import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {SingletonService} from '../services/singleton.service';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-corporate-gifts',
  templateUrl: './corporate-gifts.component.html',
  styleUrls: ['./corporate-gifts.component.scss']
})
export class CorporateGiftsComponent implements OnInit {

  @ViewChild('corporateGift') corporateGift:ElementRef;
  constructor(public singletonServ:SingletonService) { }

  ngOnInit() {
    this.renderTemplate();
  }
  renderTemplate(){
    const that =this;    
    const baseSite=this.singletonServ.catalogVersion;
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id:'ee27602d-f776-483d-93b8-940f63858006',
            store: 'moltonbrown',
            templateName: 'acc-template-homepage',
            locale:baseSite.locale
        },
        callback: function (htm) {
            that.corporateGift.nativeElement.innerHTML=htm;                              
        
        }
    });
  }

}
