import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {of} from "rxjs";
import {  PATH } from '../app.constant';
 import { Headers } from '@angular/http';
import {environment} from '../../environments/environment';
import {InterPolateUrlService} from '../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class StorefinderService extends InterPolateUrlService {
  private headers: Headers;  
  http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    getStores(baseSite){
      const url = this.interpolateUrl(environment.API_PATH +  PATH.STORES,{
        baseSite:baseSite.catalogversionId 
      });
      return this.http
          .get<any[]>(url)
          .pipe(map(data => data));
  }
  findStore(baseSite,latitude,longitude){
    let url = this.interpolateUrl(environment.API_PATH +  PATH.FIND_STORE,{
      latitude:latitude,
      longitude:longitude,
      baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "&access_token=" + baseSite.agentToken
    }
    return this.http
        .get<any[]>(url)
        .pipe(map(data => data));
  }
  checkStore(baseSite,storeName){
    const url =this.interpolateUrl(environment.API_PATH+PATH.CHECK_STORE_PATH,{
      storeName:storeName,      
      baseSite:baseSite.catalogversionId
    });
    return this.http
    .get<any[]>(url)
    .pipe(map(data => data));
  }
  getStaticContent(lang: string) {
    const langPath = `assets/slots/${lang || 'en'}.json`;
    return this.http
         .get<any[]>(langPath).pipe(map(data => data,
             catchError(err => of(err.message))
         ));
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
biReport(baseSite,body,token){
  // let url="https://10.22.63.16:9002/kaowebservices/v2/moltonbrown-gb/bireports";
  let url =this.interpolateUrl(environment.API_PATH+PATH.BI_REPORT,{     
     baseSite:baseSite.catalogversionId,
  });
  const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer '+token
    })
};
  return this.http
  .post<any[]>(url,JSON.stringify(body),httpOptions)
  .pipe(map(data => data));

}
}
