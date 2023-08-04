import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {of} from 'rxjs';
import {SERVER_PATHS, PATH } from '../../app.constant';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
import { map,catchError } from 'rxjs/operators';
@Injectable()
export class OrderHistoryService extends InterPolateUrlService {
  constructor(private http:HttpClient) {
           super();
    }
    getOrderHistoryService(baseSite,token,email): Observable<any>{
        let url=this.interpolateUrl(environment.API_PATH +  PATH.ORDER_HISTORY_PATH,{
            email:email,
            baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'bearer '+token
            })
        };
        return this.http.get<any[]>(url,httpOptions).pipe(map(data => data));
    }

getOrderHistoryDetailService(baseSite,token,user,orderId): Observable<any>{
    let url = this.interpolateUrl(environment.API_PATH +  PATH.ORDER_HISTORY_DETAILS,{
        email:user,
        orderCode:orderId,
        baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "&access_token=" + baseSite.agentToken
    }
    const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'bearer '+token
            })
        };
        return this.http
            .get<any[]>(url, httpOptions)
            .pipe(map(data => data));
        }
    
    generateOrderToken(baseSite) {
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
    repeatOrder(baseSite,token,email,code,cartCode){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.REPEAT_ORDER,{
            email:email,
            orderCode:code,
            cartCode:cartCode,
            cartId:cartCode,
            baseSite:baseSite.catalogversionId});
            if(baseSite.csAgent){
                url=url+ "&access_token=" + baseSite.agentToken
            }
        const httpOptions = {
                 headers: new HttpHeaders({
                     'Content-Type': 'application/json',
                     Authorization: 'bearer '+token
                 })
             };
             return this.http
                 .post<any[]>(url,JSON.stringify({}), httpOptions)
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
     mergeCart(baseSite,data,_email,token,oldCartId,newCartId){
        let url = this.interpolateUrl(environment.API_PATH + PATH.MERGE_CART,{
            email:_email,
            oldCartId:oldCartId,
            newCartId:newCartId,
            baseSite:baseSite.catalogversionId});
            if(baseSite.csAgent){
                url=url+ "&access_token=" + baseSite.agentToken
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
}