import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SingletonService } from '../services/singleton.service';
import {InterPolateUrlService} from '../services/commons/InterPolateUrl.service';
import { map,catchError } from 'rxjs/operators';
import { PATH } from '../app.constant';
import {environment} from '../../environments/environment';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackFormserviceService extends InterPolateUrlService{
  // http: HttpClient;
   constructor(public http: HttpClient,    
               public singletonServ: SingletonService,
               ) {                 
        super();
       this.http = http;
   }
   generateCartToken(baseSite) {
    let url =this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
        baseSite:baseSite.catalogversionId});
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
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
   getFeedback(baseSite,token,data,formType){
    let url =this.interpolateUrl( environment.API_PATH +  PATH.FEEBACK_FORMS,{
        formType:formType,
        baseSite:baseSite.catalogversionId
    });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken
        }
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+token
        })
    };
    return this.http
    .post<any[]>(url,JSON.stringify(data),httpOptions)
    .pipe(map(data => data));
}
getPostCode(postCode){
    const url=this.interpolateUrl(PATH.FIND_POSTCODE.trim(),{postCode:postCode});
      return this.http
      .post<any[]>(url,  {
              headers: new HttpHeaders()
              .set('Content-Type', 'text/xml') 
              .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
              .append('Access-Control-Allow-Origin', '*')
              .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
        })
      .pipe(map(data => data));   
 }
 retrievePostalAddress(postCode){
    const url=this.interpolateUrl(PATH.POSTAL_ADDRESS.trim(),{postCode:postCode});
    return this.http
    .post<any[]>(url,  {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml') 
            .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
      })
    .pipe(map(data => data));
 }
}
