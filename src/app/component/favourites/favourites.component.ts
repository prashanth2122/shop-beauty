import { Component, OnInit } from '@angular/core';
import {profileComponentService} from '../profile-form/profile.service';
import * as _ from 'lodash';
import { DeviceDetectorService } from "ngx-device-detector";
import {SingletonService} from '../../services/singleton.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  favouriteList: Array<any>;
  pageLoad:boolean;
  user: any;
  isocode:string;
  constructor(
    public profileServ: profileComponentService,
    public singletonServ: SingletonService,
    public router: Router,
    public deviceService: DeviceDetectorService
  ) {}
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.isocode=baseSite.lngCode;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.pageLoad=true;
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.user = user;
      if ( user.token ) {
      this.fetchFavourites(user.token, user.email);
    } else {
      this.profileServ.generateToken(baseSite).subscribe((response) => {
         const token = response['access_token'];
         user.token = token;
         this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
         this.fetchFavourites(user.token, user.email);
      });
    }}
  }
  fetchFavourites(tokenId, email) {
    const baseSite=this.singletonServ.catalogVersion;
    this.profileServ.getFavourites(baseSite,tokenId, email).subscribe(
      (response:any) => {
        if ( response ) {
        this.favouriteList = response['products'];
        this.singletonServ.favourites = response['products'];
        this.pageLoad=false;
      }
      },
      err => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                   this.profileServ.generateToken(baseSite).subscribe((resp)=>{
                    const _reg=(email!='anonymous')?true:false;
                    if(_reg){
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.   fetchFavourites(resp["access_token"], email);
                    }else{
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                      this.    fetchFavourites(resp["access_token"], email);
                    }
                   });
              }
            }
            }
           }
      }
    );
  }
  addToBasket(product) {
    const baseSite = this.singletonServ.catalogVersion;
        const productObj = {
          product: { code: product['code'] },
          quantity: 1
        };
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          if (_user.code) {
            this.storeProductTocart(
              productObj,
              _user.token,
              _user.code,
              _user.email
            );
          } else {
            this.registerToCart(productObj, _user.token, _user.email);
          }
        }
  }
  storeProductTocart( body, token, code, email) {
    const baseSite=this.singletonServ.catalogVersion;
    this.profileServ
      .storeCurrentUserProducts(baseSite,body, token, code, email)
      .subscribe(
        response => {
          const obj = {
            code: body['product']['code'],
            showCartPopUp: true
          };
          this.singletonServ.sendMessage(obj);
          const isMobile = this.deviceService.isMobile();
          if(isMobile){
           this.singletonServ.scrollToTarget("#miniRichCart");
          } else{
           this.singletonServ.scrollToTarget("#rich_cart");
         }
        },
        err => {
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  this.profileServ.generateToken(baseSite).subscribe((resp)=>{
                    const _reg=(email!='anonymous')?true:false;
                    if(_reg){
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                      this.  storeProductTocart( body, resp["access_token"], code, email) ;
                    }else{
                      const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                      user.token= resp["access_token"];
                      this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                      this.  storeProductTocart( body, resp["access_token"], code, email) ;
                    }
                   });
                }
              }
              }
             }
        }
      );
  }
  registerToCart( body, token, email) {
    const baseSite = this.singletonServ.catalogVersion;
    this.profileServ.createRegisterCart(baseSite, token, email).subscribe(
      response => {
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          user['code'] = response['code'];
          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
        }
        this.storeProductTocart(
          body,
          token,
          response['code'],
          email
        );
      },
      err => {
        if(err.error){
          if(err.error["errors"]){
            if(err.error["errors"][0]){
              if(err.error["errors"][0]['type']== "InvalidTokenError") {
                this.profileServ.generateToken(baseSite).subscribe((resp)=>{
                  const _reg=(email!='anonymous')?true:false;
                  if(_reg){
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                    this.   registerToCart(body,resp["access_token"], email);
                  }else{
                    const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                    user.token= resp["access_token"];
                    this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                    this.    registerToCart(body,resp["access_token"], email);
                  }
                 });
              }
            }
            }
           }
      }
    );
  }
  removeFromWhislist(product) {
    const baseSite = this.singletonServ.catalogVersion;
        if (this.singletonServ.getStoreData(baseSite.reg)) {
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.profileServ
            .removeFavorite(baseSite, user.token, user.email, product.code)
            .subscribe(
              response => {
                this.fetchFavourites(user.token, user.email);
              },
              err => {
                if(err.error){
                  if(err.error["errors"]){
                    if(err.error["errors"][0]){
                      if(err.error["errors"][0]['type']== "InvalidTokenError") {
                        this.profileServ.generateToken(baseSite).subscribe((resp)=>{
                            user.token= resp["access_token"];
                            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
                            this.removeFromWhislist(product);
                         });
                      }
                    }
                    }
                   }
              }
            );
        }
  }
  onShowProduct(event, data) {
    event.preventDefault();
    if (data.url.indexOf('/c/') !== -1) {
        const url = '/store' + data.url.replace('/c/', '/');
        if(event.ctrlKey && event.which === 1){
          window.open(url); 
       } else {
         this.router.navigate([url]);
       }
    } else {
      const url = '/store' + data.url.replace('/p/', '/');
      if(event.ctrlKey && event.which === 1){
        window.open(url); 
     } else {
       this.router.navigate([url]);
     }
    }
  }
  getRouterPath(data) {
    if (data.url.indexOf('/c/') !== -1) {
      const url = '/store' + data.url.replace('/c/', '/');
      return url;
  } else {
      const url = '/store' + data.url.replace('/p/', '/');
       return url;
  }
  }
}
