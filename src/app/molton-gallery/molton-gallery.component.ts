import { Component, OnInit, NgZone,OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { SingletonService } from "../services/singleton.service";
declare var crl8:any;
@Component({
  selector: 'app-molton-gallery',
  templateUrl: './molton-gallery.component.html',
  styleUrls: ['./molton-gallery.component.scss']
})
export class MoltonGalleryComponent implements OnInit,AfterViewInit,OnDestroy {
  progress:number=0;
  constructor(
    public singletonServ: SingletonService,
    public titleService: Title,
    public _ngZone:NgZone

  ) { 
    this.titleService.setTitle(' Molton Brown Gallery | ');
  }

  ngOnInit() {

  }
  ngAfterViewInit(){
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite.isoCode=="GB"){
      this.enablecuralate()
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
                   crl8.createExperience('custom-gallery'); 
                 }
               });
             }
        });
      });
    });
  }
  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);
    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
  async destroyCuralate(){
    console.log("destroy starts");
     const baseSite = this.singletonServ.catalogVersion;
     if(baseSite.isoCode=='GB'){
      await this._ngZone.runOutsideAngular(() => {
             crl8.destroyAllExperiences();
             console.log("destroy ends");
       });
   }
  }
  async ngOnDestroy(){
     await this.destroyCuralate();
     
   }
}
