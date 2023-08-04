import { Injectable } from "@angular/core";
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from "rxjs/operators";
import { of } from 'rxjs';
import { PATH } from "../app.constant";
import {environment} from '../../environments/environment';
import {InterPolateUrlService} from "../services/commons/InterPolateUrl.service";
@Injectable({ providedIn: "root" })
export class CategoryDetailComponentService extends InterPolateUrlService{
  http: HttpClient;
  constructor(http: HttpClient) {
    super();
    this.http = http;
  }
  generateToken(baseSite) {
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
  getMbProdDetails(baseSite,id,parentId) {
      let url = this.interpolateUrl(environment.API_PATH + PATH.PRODUCT_DATA_PATH,{
      productCode:id,
      categoryCode:parentId,
      baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "?access_token=" + baseSite.agentToken
    }
    return this.http.get<any[]>(url).pipe(map(data => data));
  }
  getrelevantDynamicData(code) {
    const url = "https://media.moltonbrown.co.uk/s/moltonbrown/" + code + "_uk_set.json";
    return this.http.get<any[]>(url).pipe(map(data => data));
  }
  getFRContent(lang: string) {
    const langPath = `assets/slots/${lang || 'en'}.json`;
    return this.http
         .get<any[]>(langPath).pipe(map(data => data,
             catchError(err => of(err.message))
         ));
}
addToFavourite(baseSite,tokenId,email,code){
  let url = this.interpolateUrl(environment.API_PATH +  PATH.ADD_FAVOURITES,{
    email:email,
    code:code,
    baseSite:baseSite.catalogversionId});
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
}
