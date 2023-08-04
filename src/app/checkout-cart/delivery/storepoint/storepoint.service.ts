import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {  PATH } from '../../../app.constant';
import {of,Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {InterPolateUrlService} from '../../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class StorePointComponentService extends  InterPolateUrlService{
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
    checkStore(baseSite,storeName){
        const url =this.interpolateUrl(environment.API_PATH+PATH.CHECK_STORE_PATH,{
          storeName:storeName,      
          baseSite:baseSite.catalogversionId
        });
        return this.http
        .get<any[]>(url)
        .pipe(map(data => data));
      }
    getGFSData(baseSite,token,email,cartCode,data){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.GFS_PATH,{
            email:email,
            cartCode:cartCode,
            postalCode:data.postCode,
            latitude:data.latitude,
            longitude:data.longitude,        
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
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => this.handleError(err))
        ));
    }


    setStore(baseSite,token,email,cartCode,data){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.SET_STORE,{
            email:email,
            cartCode:cartCode,
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
        .post<any[]>(url,JSON.stringify(data), httpOptions)
        .pipe(map(data => data));
    }
     handleError (error: Response) {
        return Observable.throw(error.json() || 'server error')
      }
}