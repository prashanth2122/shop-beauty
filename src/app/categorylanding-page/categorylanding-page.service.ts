import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {  PATH } from '../app.constant';
 import {of} from 'rxjs';
 import {InterPolateUrlService} from "../services/commons/InterPolateUrl.service";
 import {environment} from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class CategoryComponentService extends InterPolateUrlService {
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }
      getMBProduct(baseSite,categoryCode,pageSize,sort){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.CATEGORY_PRODUCTS,{
          categoryCode:categoryCode,
          pageSize:pageSize,
          sort:(sort)?sort:'',
          baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
        return this.http
        .get<any[]>(url).pipe(map(data => data,
          catchError(err => of(err.message))
      ));
      }
      getMbProdDetails(baseSite,productCode){
        let url = this.interpolateUrl(environment.API_PATH+PATH.PRODUCT_DATA_PATH,{
          productCode:productCode,
          baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
        return this.http
        .get<any[]>(url).pipe(map(data => data,
          catchError(err => of(err.message))
      ));
      }
    getCategorySearchResults(baseSite,searchValue,pageSize){
      let url =this.interpolateUrl(environment.API_PATH + PATH.CATEGORY_SEARCH_PRODUCTS,{
        searchValue:searchValue,
        pageSize:pageSize,
        baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }

      return this.http
          .get<any[]>(url).pipe(map(data => data,
              catchError(err => of(err.message))
          ));
  }
  getStaticContent(lang: string) {
     const langPath = `assets/slots/${lang || 'en'}.json`;
     return this.http
          .get<any[]>(langPath).pipe(map(data => data,
              catchError(err => of(err.message))
          ));
}
}