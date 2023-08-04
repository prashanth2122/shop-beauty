import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { SingletonService } from "../services/singleton.service";
@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent implements OnInit,AfterViewInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public titleService: Title

  ) { }

  ngOnInit() {
    this.titleService.setTitle('Molton Brown | UK-Official Online Store');
    const _baseSite = this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(_baseSite.guest)){
      this.singletonServ.removeItem(_baseSite.guest);
    } else if(this.singletonServ.getStoreData(_baseSite.reg)){
      this.singletonServ.removeItem(_baseSite.reg);
     }
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
  ngAfterViewInit(){
    this.singletonServ.sendMessage({refreshCart:true});
  }
}
