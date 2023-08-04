import { Component, OnInit,ViewEncapsulation,
  ViewChild,
  ElementRef } from '@angular/core';
import { Title } from "@angular/platform-browser";
import {FeatureComponentService} from "../../features/features.service";
import {MetaService} from "../../services/meta.service";
import { SingletonService } from "../../services/singleton.service";
import { ActivatedRoute } from '@angular/router';
import { GtmMethodService } from '../../services/gtmmethods.service';
declare var AmpCa: any;

@Component({
  selector: 'app-coco-and-sandalwood',
  templateUrl: './coco-and-sandalwood.component.html',
  styleUrls: ['./coco-and-sandalwood.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CocoAndSandalwoodComponent implements OnInit {

  @ViewChild("cocoandsandalwood") cocoandsandalwood: ElementRef;
  param1: string;
  constructor(
    public singletonServ: SingletonService,
    public metaService: MetaService,
    public titleService: Title,
    public featureServ:FeatureComponentService,
    public gtmServe: GtmMethodService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.param1 = params['api'];    
  });
   }

   ngOnInit() {
    this.titleService.setTitle('Geranium Nefertum | Behind the Fragrance | Molton Brown® UK');
    this.metaService.createCanonicalURL();
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
  }
  setLang(lng) {
    this.featureServ.getStaticContent(lng).subscribe(response => {
      this.singletonServ.appLocaleData = response;
      const _data = response["feature"]['cocoandsandalwood'];
            const category = _data.category;
    const editorialTitle =_data.title;
      const readingTime=  _data.readingTime;
      this.gtmServe.gtmBlogSection(category,editorialTitle,readingTime);
      this.setAmpContent(_data);
    });
  }
  
  setAmpContent(obj) {
    const that=this;
    const baseSite = this.singletonServ.catalogVersion;
      AmpCa.utils = new AmpCa.Utils();
      let api;
      if(this.param1==undefined){
        api="https://c1.adis.ws";
      }
      else{
        api="https://"+this.param1;
      }
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: api,
          id: obj.content,
          store: "moltonbrown",
          templateName: obj.templateName,
          locale: baseSite.locale
        },
        callback: function(data) {
          if (data) {
            that.cocoandsandalwood.nativeElement.innerHTML = data;
          }
        }
      });
  }

}