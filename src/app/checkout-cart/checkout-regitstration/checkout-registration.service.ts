import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {  PATH } from '../../app.constant';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
import {of} from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CheckoutRegComponentService  extends InterPolateUrlService{
   http: HttpClient;
   constructor(http: HttpClient) {
       super();
       this.http = http;
   }
   generateCartToken(baseSite) {
       let url = this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
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
   retrieveCartDetails(baseSite,token,email,cartcode){
    let url=this.interpolateUrl( environment.API_PATH +  PATH.USER_CARTDETAILS,{
        cartID:cartcode,
        email:email,
        baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "&access_token=" + baseSite.agentToken
    }
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+token
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}
   generateCartId(baseSite,tokenId,email){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
           email:email,
           baseSite:baseSite.catalogversionId});
           if(baseSite.csAgent){
               url=url+ "?access_token=" + baseSite.agentToken
           }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': tokenId
           })
       };
       return this.http.post(url, httpOptions)
           .pipe(map(data => data,
               catchError(err => of(err.message))
           ));
    }
    swapCart(baseSite,token, code, oldCode){
       let url=this.interpolateUrl(environment.API_PATH + PATH.GUEST_CART_SHIFTING_PATH ,{
                      cartCode:code,
                      oldCartCode:oldCode,
                      mergeCartGuid:code,
                      baseSite:baseSite.catalogversionId
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
              .post<any[]>(url,JSON.stringify({}), httpOptions)
              .pipe(map(data => data)); 
   }
   getStaticContent(lang: string) {
     const langPath = `assets/contents/${lang || 'en'}.json`;
     return this.http
             .get<any[]>(langPath).pipe(map(data => data,
                 catchError(err => of(err.message))
             ));
   }
   
   siteanonymousAuth(baseSite,tokenId,code,email){
       let url =this.interpolateUrl(environment.API_PATH+PATH.ANANONYMOUSCART,{
           email:email,
           cartCode:code,
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
            .put(url,JSON.stringify({}),httpOptions)
            .pipe(map(data => data));
            
    }
    
    siteAuthentication(baseSite,body){
        let url =this.interpolateUrl(environment.AUTHRISATION_PATH+PATH.SITE_AUTENTICATION,{
         baseSite:baseSite.catalogversionId
        });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
  
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'               
            })
        };
        return this.http
            .post<any[]>(url,body,httpOptions)
            .pipe(map(data => data));
    }
   getUserData(baseSite,tokenId,email){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.PROFILE,{
           email:email,
           baseSite:baseSite.catalogversionId});
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
           .get<any[]>(url,httpOptions)
           .pipe(map(data => data));
   }
        
   creatEmptyCart(baseSite,token,data,email){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
           email:email,
           baseSite:baseSite.catalogversionId});
           if(baseSite.csAgent){
               url=url+ "?access_token=" + baseSite.agentToken
           }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization':'bearer '+token
               
           })
       };
       return this.http
           .post<any[]>(url,JSON.stringify(data),httpOptions)
           .pipe(map(data => data));
   }
   mergeCart(baseSite,data,_email,token,oldCartId,newCartId){
       let url = this.interpolateUrl(environment.API_PATH + PATH.MERGE_CART,{
           email:_email,
           oldCartId:oldCartId,
           newCartId:newCartId,
           baseSite:baseSite.catalogversionId});
           if(baseSite.csAgent){
               url=url+ "&access_token=" + baseSite.agentToken
           }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization':'bearer '+token
               
           })
       };
       return this.http
           .post<any[]>(url,JSON.stringify(data),httpOptions)
           .pipe(map(data => data));
   }
}