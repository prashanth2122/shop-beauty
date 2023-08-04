import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {  PATH } from '../app.constant';
 import { Headers } from '@angular/http';
 import {of} from 'rxjs';
 import {InterPolateUrlService} from "../services/commons/InterPolateUrl.service";
 import {environment} from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class StorePortalService extends InterPolateUrlService {
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }
    generateToken(baseSite) {
        let url =this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
            baseSite:"moltonbrown-gb" 
        });
        if(baseSite.csAgent){
            url=url + "&access_token=" + baseSite.agentToken
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        if(url){
            
        }
        return this.http
            .post<any[]>(url, httpOptions)
            .pipe(map(data => data));
    }
    getStores(baseSite){
        const url = this.interpolateUrl(environment.API_PATH +  PATH.STORES,{
            baseSite:"moltonbrown-gb"
        });
        return this.http
            .get<any[]>(url)
            .pipe(map(data => data));
    }
   portalAuthentication(baseSite,tokenId,storeName,password ){
    const url =  this.interpolateUrl(environment.API_PATH +  PATH.STOREPORTAL_LOGIN,{
                  storeName:storeName,
                  password:password,
                  baseSite:"moltonbrown-gb"
                });
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .post<any[]>(url,JSON.stringify({}), httpOptions)
        .pipe(map(data => data));
  }
  retrieveStores(baseSite,token,storeName,orderStatus,body){
    const url = this.interpolateUrl(environment.API_PATH +  PATH.STORE_ORDERS,{
        storeName:storeName,
        orderStatus:orderStatus,
        baseSite:"moltonbrown-gb"
    });
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
  retrieveDispatchedStores(baseSite,token,storeName,orderStatus,body){
    const url = this.interpolateUrl(environment.API_PATH +  PATH.ORDER_CHECKIN,{
                storeName:storeName,
                status:orderStatus,
                baseSite:"moltonbrown-gb"
            });
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
}