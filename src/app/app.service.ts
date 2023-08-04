import { Injectable } from "@angular/core";
import { map,catchError } from 'rxjs/operators';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import {  PATH } from './app.constant';
import {environment} from '../environments/environment';
import {throwError,of } from 'rxjs';
import {InterPolateUrlService} from "./services/commons/InterPolateUrl.service";
@Injectable({ providedIn: 'root' })
@Injectable()
export class AppService  extends InterPolateUrlService {

    private headers: HttpHeaders;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
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
     generateCartId(baseSite,token,email){
        let url = this.interpolateUrl(environment.API_PATH+PATH.GENERATTE_CART,
                {
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
        return this.http.post(url, JSON.stringify({}), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
     }
     addToBasket(baseSite,token,email,code,productObj){
        let url = this.interpolateUrl(environment.API_PATH+PATH.ADD_TO_BASKET,
          {
              email:email,
              cartCode:code,
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
        return this.http.post(url, JSON.stringify(productObj), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
     }
     storeCurrentUserProducts(baseSite,item,tokenId,cartCode,email){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.ADD_TO_BASKET,{
            email:email,
            cartCode:cartCode,
            baseSite:baseSite.catalogversionId});
            if(baseSite.csAgent){
                url=url+ "?access_token=" + baseSite.agentToken
            }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer'+tokenId
            })
        };
        return this.http.post(url, JSON.stringify(item), httpOptions)
            .pipe(map(data => data,
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
     handleError(error: HttpErrorResponse) {
            let errMsg = '';
            // Client Side Error
            if (error.error instanceof ErrorEvent) {        
            errMsg = `Error: ${error.error.message}`;
            } 
            else {  // Server Side Error
            errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            }
            // return an observable
            return throwError(errMsg);
     }
}
