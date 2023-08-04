import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SingletonService } from "../services/singleton.service";
import { TranslateServiceSubService } from "../pipe/translate-service-sub.service";
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public translate: TranslateServiceSubService,
    public singletonServ: SingletonService
  ) { }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  onRouteTo(event,route){
    if(event.ctrlKey && event.which === 1){
      window.open(route); 
   }  else{
      const _path= route.slice(1);
      let _route =_path.split('/');
      this.router.navigate(_route);
    }
  }
}
