import { Inject,Component, AfterViewInit,OnInit, OnDestroy, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import {FeatureComponentService} from "../features/features.service";
import {ActivatedRoute} from "@angular/router";
import {MetaService} from "../services/meta.service";
import { SingletonService } from "../services/singleton.service";
import { GtmMethodService } from '../services/gtmmethods.service';
declare var AmpCa: any;
declare var crl8:any;
@Component({
  selector: 'app-meet-the-perfumers',
  templateUrl: './meet-the-perfumers.component.html',
  styleUrls: ['./meet-the-perfumers.component.scss']
})
export class MeetThePerfumersComponent implements OnInit,AfterViewInit,OnDestroy {
  param1:any;
  progress:number=0;
  ukcountrysite:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,  
    public singletonServ: SingletonService,
    public metaService: MetaService,
    public titleService: Title,
    private route: ActivatedRoute,
    public gtmServe: GtmMethodService,
    public featureServ:FeatureComponentService,
    public _ngZone:NgZone
  ) { 
    this.route.queryParams.subscribe(params => {
      this.param1 = params['api'];    
  });
  }

  ngOnInit() {
    this.metaService.createCanonicalURL();
    const baseSite = this.singletonServ.catalogVersion;
    this.ukcountrysite=(baseSite.isoCode=='GB')?true:false;
    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
  }
  setLang(lng) {
    this.featureServ.getStaticContent(lng).subscribe(response => {
      this.singletonServ.appLocaleData = response;
      const _data = response["feature"]['meettheperfumers'];
      _data.sort((a, b) => {
        return a.order - b.order;
      });
      const category = _data[0].category;
      const editorialTitle =_data[0].title;
      const readingTime=  _data.readingTime;
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
  ngAfterViewInit(){
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=='GB'){
      this. enablecuralate();
    }
  }

  enablecuralate(){
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
          crl8.ready(function() {
            if(typeof  crl8 !="undefined"){
               crl8.getAllExperiences().then((crl)=>{
                  if(crl.length ==0){
                   crl8.createExperience('custom-campaign'); 
                 }
               });
             }
        });
      });
    });
  }
  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
  async destroyCuralate(){
     const baseSite = this.singletonServ.catalogVersion;
     if(baseSite.isoCode=='GB'){
      await this._ngZone.runOutsideAngular(() => {
             crl8.destroyAllExperiences();
       });
   }
  }
  async ngOnDestroy(){
     await this.destroyCuralate();
     
   }
}
