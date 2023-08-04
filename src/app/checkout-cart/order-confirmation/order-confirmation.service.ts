import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map ,catchError} from 'rxjs/operators';
import {  PATH } from '../../app.constant';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
import {of} from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ConfirmationComponentService extends InterPolateUrlService {
   http: HttpClient;
   constructor(http: HttpClient) {
       super();
       this.http = http;
   }
   generateCartToken(baseSite) {
       let url =this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
           baseSite:baseSite.catalogversionId 
       });
       if(baseSite.csAgent){
           url=url + "&access_token=" + baseSite.agentToken
       }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json'
           })
       };
       return this.http
           .post<any[]>(url, httpOptions)
           .pipe(map(data => data));
   }
   createUser(baseSite,tokenId,body,orderCode){
       let url =this.interpolateUrl( environment.API_PATH +  PATH.CREATE_USER_OC_PATH,{
           orderCode:orderCode,
           baseSite:baseSite.catalogversionId
       });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+tokenId
           })
       };
       return this.http
           .post<any[]>(url,JSON.stringify(body), httpOptions)
           .pipe(map(data => data));
   }
   createUserAddress(baseSite,body,tokenId,email){
       let url = this.interpolateUrl( environment.API_PATH +  PATH.CREATE_ADDRESS,{
           email:email,
           baseSite:baseSite.catalogversionId
       });
        if(baseSite.csAgent){
               url=url+ "?access_token=" + baseSite.agentToken
       }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+tokenId
           })
       };
       return this.http
           .post<any[]>(url,JSON.stringify(body), httpOptions)
           .pipe(map(data => data));
   }
   siteAuthentication(baseSite,cVrsnid,user){
       let url =this.interpolateUrl(environment.AUTHRISATION_PATH+PATH.SITE_AUTENTICATION,{
           uid:user.email,
           password:user.password,
           siteId:cVrsnid,  
           baseSite:baseSite.catalogversionId
        });
           if(baseSite.csAgent){
               url=url+ "&access_token=" + baseSite.agentToken
           }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               
           })
       };
       return this.http
           .post<any[]>(url,httpOptions)
           .pipe(map(data => data));
   }
   orderService(baseSite,tokenId,order,emailId){
       let url =this.interpolateUrl( environment.API_PATH +  PATH.ORDER_DETAILS,{
           email:emailId,
           orderCode:order,
           baseSite:baseSite.catalogversionId
       });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+tokenId
           })
       };
       return this.http
           .get<any[]>(url,httpOptions)
           .pipe(map(data => data));
   }

   getOrderData(baseSite,tokenId,orderId){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.ORDERCONFIRMATION,{
           orderId:orderId,
           baseSite:baseSite.catalogversionId
       });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
       
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+tokenId
           })
       };
       return this.http
           .get<any[]>(url,httpOptions)
           .pipe(map(data => data));
   }

   getSystemIp(){
    const url="https://api.ipify.org/?format=json";
    return this.http.get<any[]>(url).pipe(map(data => data));
  }
   getOrderCode(baseSite,token,email,code,payerId,systemIP){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.PAYERID_PATH,{
           email:email,
           cartCode:code,
           payerID:payerId,
           baseSite:baseSite.catalogversionId,
           systemIP:systemIP
       });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+token
           })
       };
       return this.http
           .post<any[]>(url,JSON.stringify({}),httpOptions)
           .pipe(map(data => data));
   }
   addToFavourite(baseSite,tokenId,email,code){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.ADD_FAVOURITES,{
           email:email,
           code:code,
           baseSite:baseSite.catalogversionId
        });
           if(baseSite.csAgent){
               url=url+ "&access_token=" + baseSite.agentToken
           }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+tokenId
           })
       };
       return this.http.post(url, JSON.stringify({}),httpOptions)
           .pipe(map(data => data,
               catchError(err => of(err.message))
           ));
    }
   getFavourites(baseSite,tokenId,email){
       let url=this.interpolateUrl( environment.API_PATH + PATH.FAVOURITES,{
           email:email,
           baseSite:baseSite.catalogversionId
        });
       if(baseSite.csAgent){
               url=url+ "?access_token=" + baseSite.agentToken
       }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization':'bearer'+tokenId
               
           })
       };
       return this.http
           .get<any[]>(url,httpOptions).pipe(map(data => data,
               catchError(err => of(err.message))
           ));
   }
}