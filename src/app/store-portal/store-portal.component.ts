import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SingletonService } from "../services/singleton.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-store-portal',
  templateUrl: './store-portal.component.html',
  styleUrls: ['./store-portal.component.scss']
})
export class StorePortalComponent implements OnInit,AfterViewInit {
  auth:any;
  constructor(
    public singletonServ: SingletonService,
    public router: Router,
  ) {
    this.auth={
      status:false
    }
   }
   ngOnInit() {
      if(this.singletonServ.getStoreData('portalEncoder')){
        const _portAuth=JSON.parse(this.singletonServ.getStoreData('portalEncoder'));
        this.auth['status'] = _portAuth['status'];
        this.auth['storeName'] = _portAuth['storeName'];
        let _obj ={
          auth:_portAuth
        };
        this.singletonServ.sendMessage(_obj);
        this.router.navigate(['store','storeportal','info_table']);
      }
  }
  ngAfterViewInit(){
    this.singletonServ.getMessage().subscribe(message => {
       if(message.auth){
        this.auth['status'] = message.auth['status'];
        this.auth['storeName'] = message.auth['storeName'];
       }
    })
  }
  onSignOut(){
    this.singletonServ.removeItem('portalEncoder');
    this.auth={
      status:false
    }
    this.router.navigate(['store','storeportal']);
  }
}
