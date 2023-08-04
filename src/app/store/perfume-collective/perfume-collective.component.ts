import { Component, OnInit,ViewEncapsulation,
  ViewChild,AfterViewInit,
  ElementRef, 
  OnDestroy,
  NgZone} from '@angular/core';
import { Title } from "@angular/platform-browser";
import {FeatureComponentService} from "../../features/features.service";
import {MetaService} from "../../services/meta.service";
import { SingletonService } from "../../services/singleton.service";
import { ActivatedRoute } from '@angular/router';
import { GtmMethodService } from '../../services/gtmmethods.service';
declare var AmpCa: any;
declare var crl8:any;
@Component({
  selector: 'app-perfume-collective',
  templateUrl: './perfume-collective.component.html',
  styleUrls: ['./perfume-collective.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PerfumeCollectiveComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild("perfumecollective") perfumecollective: ElementRef;
  param1: string;
  ukcountrysite:boolean;
  progress:number=0;
  constructor(
    public singletonServ: SingletonService,
    public metaService: MetaService,
    public titleService: Title,
    public gtmServe: GtmMethodService,
    public featureServ:FeatureComponentService,
    private route: ActivatedRoute,
    public _ngZone:NgZone
  ) {
    this.route.queryParams.subscribe(params => {
      this.param1 = params['api'];    
  });
   }

   ngOnInit() {
    this.titleService.setTitle('Geranium Nefertum | Behind the Fragrance | Molton Brown® UK');
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
      const _data = response["feature"]['perfumecollective'];
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
            that.perfumecollective.nativeElement.innerHTML = data;
          }
        }
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