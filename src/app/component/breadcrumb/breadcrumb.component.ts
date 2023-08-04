import { Component, OnInit, Input,OnChanges, SimpleChange } from '@angular/core';
import {SingletonService} from '../../services/singleton.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnChanges {
@Input() breadcrumb:Array<any>;
listData:any;
  constructor(
    public singletonServ:SingletonService,
    public titleService:Title,
    public location: Location,
    public router: Router,
    public route :ActivatedRoute
    ) { }


  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {  
    if (changes['breadcrumb']['currentValue']){
      if (changes['breadcrumb']['currentValue'] != undefined){
       this.listData=changes['breadcrumb']['currentValue'];
      }
    }
  }
  onbreadcrumbClick(data){
  if(data.categoryDisplayName){
    let url ='/store'+data.url.replace('/c/','/').toLowerCase();
    this.titleService.setTitle(data.titleName);
    this.router.navigate([url]);
  }else if(data.route){
    this.router.navigate([data.route]);
  }
  }
  goToHome(){
    this.router.navigate(['store']);
  }
}