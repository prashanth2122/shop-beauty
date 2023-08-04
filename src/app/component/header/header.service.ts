import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError, distinctUntilChanged } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../../app.constant';

import {environment} from '../../../environments/environment';
 import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
import {of} from 'rxjs';
@Injectable({ providedIn: 'root' })
export class HeaderComponentService  extends InterPolateUrlService{
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }
    generateCartToken(baseSite) {
        let url =this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{baseSite:baseSite.catalogversionId});
        if(baseSite.csAgent){
            url=url + "&access_token=" + baseSite.agentToken
        }
        
        let httpOptions = {
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
    getCatalogData(baseSite:any) {        
        let url = this.interpolateUrl(environment.API_PATH +  PATH.catalog,{
            baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url + "?access_token=" + baseSite.agentToken
        }
        
        return this.http.get<any[]>(url).pipe(map(data => data));
    }
    getampcontent(slotId){
        let url = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
        + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + slotId }))
        + "&scope=tree&store=moltonbrown"
           let headers = new Headers({ 'Content-Type': 'application/json' });
           return this.http.get<any[]>(url).pipe(map(data => data));
    }



    getCurrentUserRelevantCart(baseSite,token,email){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
            email:email,     
            baseSite:baseSite.catalogversionId
         });
            if(baseSite.csAgent){
                url=url+ "?access_token=" + baseSite.agentToken
            }
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':'bearer'+token
                
            })
        };
        return this.http
            .get<any[]>(url,httpOptions).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    removeBundle(baseSite,token,email,code,bundleNo){
        let url =this.interpolateUrl(environment.API_PATH +  PATH.REMOVE_BUNDLE_PATH,{
            email:email,
            cartCode:code,
            bundleNo:bundleNo,
        baseSite:baseSite.catalogversionId});
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer'+token
            })
        };
        return this.http.delete(url,httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
        }
    
    getCategorySearchResults(baseSite,searchValue){
        let url =this.interpolateUrl(environment.API_PATH  + PATH.CATEGORY_SEARCH_RESULTS,{
            searchValue:searchValue,
            baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }

        return this.http
            .get<any[]>(url).pipe( distinctUntilChanged(),  map(data => data,
                catchError(err => of(err.message))
            ));
    }
    getPolicyContent(lang: string) {
        let langPath = `assets/contents/${lang || 'en'}.json`;
      return this.http
              .get<any[]>(langPath).pipe(map(data => data,
                  catchError(err => of(err.message))
              ));
    }
    getStaticContent(lang: string) {
        const langPath = `assets/i18n/${lang || 'en'}.json`;
      return this.http
              .get<any[]>(langPath).pipe(map(data => data,
                  catchError(err => of(err.message))
              ));
    }
    getUserData(baseSite,tokenId,email){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.PROFILE,{
            email:email,
            baseSite:baseSite.catalogversionId});
            if(baseSite.csAgent){
                url=url+ "?access_token=" + baseSite.agentToken
            }
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http
            .get<any[]>(url,httpOptions)
            .pipe(map(data => data));
    }

    addBundleToCart(baseSite,token,email,cartCode,body){
        let url=this.interpolateUrl(environment.API_PATH + PATH.PICK_MIX_BUNDLE_PATH,{
            email:email,
            cartCode:cartCode,
            baseSite:baseSite.catalogversionId});
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
               .post<any[]>(url,JSON.stringify(body), httpOptions)
               .pipe(map(data => data));   
    }
    generateToken(baseSite) {
        let url =this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
            baseSite:baseSite.catalogversionId 
        });
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
    creatEmptyCart(baseSite,token,data,email){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
            email:email,
            baseSite:baseSite.catalogversionId 
        });
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
    verifyProduct(baseSite,categoryCode){
        
        let url=`${environment.CS_CUSTOMER}kaowebservices/v2/${baseSite.catalogversionId}/products/search?query=:relevance:category:${categoryCode}&pageSize=12&fields=FULL&sort=`;
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
        return this.http
        .get<any[]>(url).pipe(map(data => data,
          catchError(err => of(err.message))
      ));
      }
}