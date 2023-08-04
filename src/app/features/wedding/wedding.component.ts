import { Inject,
  Component, 
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
 } from '@angular/core';
 import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import {FeatureComponentService} from "../features.service";
import {MetaService} from "../../services/meta.service";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { SingletonService } from "../../services/singleton.service";
import { ActivatedRoute } from '@angular/router';
import { GtmMethodService } from '../../services/gtmmethods.service';
declare var AmpCa: any;
@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class WeddingComponent implements OnInit {
  @ViewChild("weddingComp") weddingComp: ElementRef;
  param1: string;
  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ: SingletonService,
    public metaService: MetaService,
    public translate: TranslateServiceSubService,
    public titleService: Title,
    public gtmServe: GtmMethodService,
    public featureServ:FeatureComponentService,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      this.param1 = params['api'];    
  });
  }



  ngOnInit() {
    this.titleService.setTitle('The Perfect Pair | Wedding Gift Ideas from Molton Brown ');
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
      const _data = response["feature"]['perfectPairWedding'];
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
      if(this.param1){
        api="https://"+this.param1;
      }else{
        api="https://c1.adis.ws";
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
            that.weddingComp.nativeElement.innerHTML = data;
          }
        }
      });
  }
}
