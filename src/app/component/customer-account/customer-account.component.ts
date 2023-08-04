import { Component, OnInit } from "@angular/core";
import { SingletonService } from "../../services/singleton.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DeviceDetectorService } from "ngx-device-detector";
@Component({
  selector: "app-customer-account",
  templateUrl: "./customer-account.component.html",
  styleUrls: ["./customer-account.component.scss"]
})
export class CustomerAccountComponent implements OnInit {
  breadcrumb: Array<any>;
  orgMenu:boolean;
  routeTo:string;
  checkProfileList:boolean;
  checkAddressList:boolean;
  checkPaymentList:boolean;
  checkFavouriteList:boolean;
  checkOrderHistoryList:boolean;
  mobileDevice:boolean;
  isDeviceSpecific:boolean;
  constructor(
    public singletonService: SingletonService,
    public location: Location,
    public titleService: Title,
    public router: Router,
    public route: ActivatedRoute,
    public deviceService: DeviceDetectorService
  ) {
    this.orgMenu=false;
    this.routeTo= "profile";
  }

  ngOnInit() {
    const baseSite=this.singletonService.catalogVersion;
    if(baseSite.isoCode=="DE"){
      this.breadcrumb=[{name:'Mein Konto',route:'/store/myaccount/profile/detail'},{name:'MEIN PROFIL'}]
    }
    else{
      this.breadcrumb=[{name:'MY ACCOUNT',route:'/store/myaccount/profile/detail'},{name:'MY PROFILE'}]
    }
    
    const _path=this.location.path();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.mobileDevice=isMobile;
    if(isMobile){
        if(_path=="/store/myaccount/profile/passwordReset"){
          this.isDeviceSpecific=false;
        }else if(_path =='/store/myaccount/profile/detail'){
          this.checkProfileList=true;
          this.checkAddressList=false;
          this.checkPaymentList=false;
          this.checkFavouriteList=false;
          this.checkOrderHistoryList=false;
          this.isDeviceSpecific=true;
        }else if(_path =='/store/myaccount/profile/addressBook'){
          this.checkProfileList=false;
          this.checkAddressList=true;
          this.checkPaymentList=false;
          this.checkFavouriteList=false;
          this.checkOrderHistoryList=false;
          this.isDeviceSpecific=true;
        }else if(_path =='/store/myaccount/profile/paymentInfo'){
          this.checkProfileList=false;
          this.checkAddressList=false;
          this.checkPaymentList=true;
          this.checkFavouriteList=false;
          this.checkOrderHistoryList=false;
          this.isDeviceSpecific=true;
        }else if(_path =='/store/myaccount/profile/myFavorites'){
          this.checkProfileList=false;
          this.checkAddressList=false;
          this.checkPaymentList=false;
          this.checkFavouriteList=true;
          this.checkOrderHistoryList=false;
          this.isDeviceSpecific=true;
        }else if(_path =='/store/myaccount/profile/mbOrderhistory'){
          this.checkProfileList=false;
          this.checkAddressList=false;
          this.checkPaymentList=false;
          this.checkFavouriteList=false;
          this.checkOrderHistoryList=true;
          this.isDeviceSpecific=true;
        }
   }else{
    this.isDeviceSpecific=false;
   }
  }
  ngAfterViewInit() {
    const baseSite = this.singletonService.catalogVersion;
     if(baseSite.isoCode=="DE"){
    this.titleService.setTitle('Mein Konto Molton Brown');
    }
    else{
        this.titleService.setTitle('My Account | Molton Brown');
    }
    }
  onContentClick(data) {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
      if (data == "profile") {
        this.router.navigate(["store", "myaccount", "profile"]);
      } else if (data == "address") {
        this.router.navigate(["store", "myaccount", "profile", "addressBook"]);
      } else if (data == "payment") {
        this.router.navigate(["store", "myaccount", "profile", "paymentInfo"]);
      } else if (data == "favourites") {
        this.router.navigate(["store", "myaccount", "profile", "myFavorites"]);
      } else if (data == "history") {
        this.router.navigate(["store", "myaccount", "profile", "mbOrderhistory"]);
    }
  }
  onCollapseMenu(){
    if(this.orgMenu){
      this.orgMenu=false;
    }else{
      this.orgMenu=true;
    }
  }
}
