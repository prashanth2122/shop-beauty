 import { Injectable } from '@angular/core';
 import { HttpClient,HttpHeaders } from '@angular/common/http';
 import { map} from 'rxjs/operators';
 import { PATH } from '../../app.constant';
 import {environment} from '../../../environments/environment';
 import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class KlarnaService  extends InterPolateUrlService{

    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }

    generateCartToken(baseSite) {
        let url = this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
          baseSite:baseSite.catalogversionId});
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
creatKlarnaSession(baseSite,token,email,code,obj){
    let url = this.interpolateUrl(
        environment.API_PATH + PATH.KLARNA_SESSION,
        { 
          cartCode: code, 
          email: email, 
          baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken;
            obj['isAsm']=true;
        }
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "bearer " + token
        })
      };
      return this.http
        .post<any[]>(url, JSON.stringify(obj), httpOptions)
        .pipe(map(data => data));
}
    setKlarnaAuth(baseSite,token,email,code,_body,auth_token){
        let url = this.interpolateUrl(
            environment.API_PATH + PATH.KLARNA_AUTHORIZATION,
            { 
              cartCode: code, 
              email: email,
              authorizationToken:auth_token,
              baseSite:baseSite.catalogversionId
            });
            if(baseSite.csAgent){
                url=url+ "&access_token=" + baseSite.agentToken;
                _body['isAsm']=true;
            }
          const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
              Authorization: "bearer " + token
            })
          };
          return this.http
            .post<any[]>(url, JSON.stringify(_body), httpOptions)
            .pipe(map(data => data));
    }
}