import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
declare const google: any;
@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyaccountComponent implements OnInit,AfterViewInit {
  loadGoogleInstance:boolean;
  pageLoad:boolean;
  constructor(
    public router: Router,
    public route :ActivatedRoute
    ) {
   }

  ngOnInit() {
   
  }
  ngAfterViewInit():void{

  }

}
