import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {  throwError } from 'rxjs';
import {  PATH } from '../../app.constant';
import {of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class CSCustomerService extends InterPolateUrlService {
    public asmPath:string=environment.CS_AUTHRISATION_PATH;
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
        if(url){
            
        }
        return this.http
            .post<any[]>(url, httpOptions)
            .pipe(map(data => data));
    }
     siteAuthentication(baseSite,body){
        let url =this.interpolateUrl(environment.AUTHRISATION_PATH+PATH.SITE_AUTENTICATION,{
         baseSite:baseSite.catalogversionId
        });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
  
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'               
            })
        };
        return this.http
            .post<any[]>(url,body,httpOptions)
            .pipe(map(data => data));
    } 

     getCurrentUserRelevantCart(baseSite,token,email){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
            email:email,     
            baseSite:baseSite.catalogversionId
         });
            // if(baseSite.csAgent){
            //     url=url+ "?access_token=" + baseSite.agentToken
            // }
        const httpOptions = {
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

    createUser(body){
        const url = this.interpolateUrl(environment.CS_AUTHRISATION_PATH+  PATH.CS_OAUTH,{
            client_id:'asm',
            agent:body.username,
            password:body.password
        });
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(body), httpOptions)
            .pipe(map(data => data));
    }
    retrieveOrderDetails(baseSite,agentToken,orderId){
        const url=this.interpolateUrl( environment.CS_CUSTOMER+PATH.CS_ORDER_SEARCH,{
                        orderId:orderId,
                        agentToken:agentToken,
                        ASMbaseSite:baseSite.catalogversionId
                    })
        return this.http
        .get<any[]>(url, {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml') 
            .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
      }).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
    }
    retrieveUsersDetails(baseSite,agentToken,email){
        const url=this.interpolateUrl( environment.CS_CUSTOMER+PATH.CS_SEARCH,{
            email:email,
            agentToken:agentToken,
            ASMbaseSite:baseSite.catalogversionId
        })
         return this.http
            .get<any[]>(url, {
                headers: new HttpHeaders()
                .set('Content-Type', 'text/xml') 
                .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
                .append('Access-Control-Allow-Origin', '*')
                .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
          }).pipe(map(data => data,
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

     getStaticContent(lang: string) {
        const langPath = `assets/i18n/${lang || 'en'}.json`;
      return this.http
              .get<any[]>(langPath).pipe(map(data => data,
                  catchError(err => of(err.message))
              ));
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
}