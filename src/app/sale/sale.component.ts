import { Component, OnInit,ElementRef,ViewChild,AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

import {SingletonService} from '../services/singleton.service';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit,AfterViewInit {
  @ViewChild('salesEl') salesEl:ElementRef;
  constructor(
    public singletonServ:SingletonService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title
    ) { }

  ngOnInit() {
    this.renderTemplate();
  }
  findCat(array, id) {
    if (typeof array != "undefined") {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id.toLowerCase() == id.toLowerCase()) {
          return [array[i]];
        }
        if(array[i]){
        if(array[i].subcategories){
        var a = this.findCat(array[i].subcategories, id);
        if (a != null) {
          a.unshift(array[i]);
          return a;
        }
       }
       }
      }
    }
    return null;
  }
  ngAfterViewInit() {
    const that=this;
    this.singletonServ.getMessage().subscribe(message => {
      if (message.catgories) {
        that.route.params.subscribe((params:any) => {
          if(params.saleId){
            if(that.singletonServ.menudata){
              const _breadCrumb = that.findCat(message.catgories, params.saleId); 
            }
          }
        });
      }})
    }
  renderTemplate(){
    const that =this;
    AmpCa.utils = new AmpCa.Utils();    
    const baseSite=this.singletonServ.catalogVersion;
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id:'0c9ca4b0-abfe-4803-864c-7fa3189e178b',
            store: 'moltonbrown',
            templateName: 'acc-template-specialofferbanner',
            locale:baseSite.locale
        },
        callback: function (htm) {
            that.salesEl.nativeElement.innerHTML=htm;                            
        }
    });
  }


}
