import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { map,catchError, distinctUntilChanged } from 'rxjs/operators';
import {  PATH } from '../app.constant';
 import { Headers } from '@angular/http';
 import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {InterPolateUrlService} from '../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class NewsLetterComponentService  extends InterPolateUrlService{
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
newsLetterSignUp(baseSite,_body){
    
    let url = this.interpolateUrl(environment.API_PATH +  PATH.NEWSLETTER_SIGNUP,{
        baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "?access_token=" + baseSite.agentToken
    }
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    return this.http
        .post<any[]>(url,JSON.stringify(_body),httpOptions)
        .pipe(map(data => data)); 
}
unSubscribeNewsletter(baseSite,token,sapOutboundId,body){
    const url = this.interpolateUrl(environment.API_PATH +  PATH.UNSUBSCRIBE,{
        baseSite:baseSite.catalogversionId,
        OutboundId:sapOutboundId
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

retrieveUnsubscribeEmail(body,b64){
        const url = PATH.UNSUBSCRIBEYMARKETING;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':'Basic '+b64,
                'x-csrf-token':'FfJIiaqJ1p-w8IBA0AZd_g=='
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(body),httpOptions)
            .pipe(map(data => data)); 
    
}
retrieveCSRFToken(b64){
    const url = PATH.CSRF_TOKEN;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':'Basic U1VCU0NSSVBUSU9OX1VTRVI6TTBsdDBuITE='
        }),
       
    };
  return this.http
  .get<any[]>(url,httpOptions).pipe(map(data => data,
      catchError(err => of(err.message))
  ));

}
communicateSAPOutboundID(baseSite,token,sapID){
    const url = this.interpolateUrl(environment.API_PATH +  PATH.YMARKETING,{
        baseSite:baseSite.catalogversionId,
        sapOutBoundId:sapID
    });
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+token
        })
    };
    return this.http
        .get<any[]>(url,httpOptions)
        .pipe(map(data => data));  

}
updateSubscriber(baseSite,token,body){
    const url = this.interpolateUrl(environment.API_PATH +  PATH.UPDATESUBSCRIBER,{
        baseSite:baseSite.catalogversionId
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