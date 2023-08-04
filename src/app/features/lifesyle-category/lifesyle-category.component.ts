import { Inject,Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import {FeatureComponentService} from "../features.service";
import {MetaService} from "../../services/meta.service";
import { SingletonService } from "../../services/singleton.service";
import {ActivatedRoute} from "@angular/router";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { GtmMethodService } from '../../services/gtmmethods.service';
declare var AmpCa: any;

@Component({
  selector: 'app-lifesyle-category',
  templateUrl: './lifesyle-category.component.html',
  styleUrls: ['./lifesyle-category.component.scss']
})
export class LifesyleCategoryComponent implements OnInit {
  param1:any;
  constructor(
    @Inject(DOCUMENT) public dom,  
    public singletonServ: SingletonService,
    public metaService: MetaService,
    public gtmServe: GtmMethodService,
    public translate: TranslateServiceSubService,
    public titleService: Title,
    private route: ActivatedRoute,
    public featureServ:FeatureComponentService
  ) { 
    this.titleService.setTitle('Molton Brown® UK | Luxury Beauty, Fragrance, Bath & Body Gift Sets');
    this.route.queryParams.subscribe(params => {
      this.param1 = params['api'];    
  });
  }

  ngOnInit() {
    this.metaService.createCanonicalURL();
    const baseSite = this.singletonServ.catalogVersion;

    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
  }
  setLang(lng) {
    this.translate.use(lng);
    this.featureServ.getStaticContent(lng).subscribe(response => {
      this.singletonServ.appLocaleData = response;
      const _data = response["feature"]['Lifestyle'];
      _data.sort((a, b) => {
        return a.order - b.order;
      });
      const category = _data[0].category;
      const editorialTitle =_data[0].title;
     const readingTime=  '';
      this.gtmServe.gtmBlogSection(category,editorialTitle,readingTime);
      this.setAmpContent(_data);
    });
  }
  setAmpContent(data) {
    const that=this
    const baseSite = this.singletonServ.catalogVersion;
    let api;
    if(this.param1){
      api="https://"+this.param1;
    }else{
      api="https://c1.adis.ws";
    }
    data.forEach(obj => {
      AmpCa.utils = new AmpCa.Utils();
      AmpCa.utils.getHtmlServiceData({
        auth: {
          baseUrl: "https://c1.adis.ws",
          id: obj.content,
          store: "moltonbrown",
          templateName: obj.templateName,
          locale: baseSite.locale
        },
        callback: function(data) {
          if (data) {
            that.dom.querySelectorAll(obj.identifier)[0].innerHTML = data;
          }
        }
      });
    });

  }

}
