import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {  PATH } from '../app.constant';
import {environment} from '../../environments/environment';
import {InterPolateUrlService} from '../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class GiftCardComponentService  extends InterPolateUrlService{
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
    givexLogin(baseSite,token,email,card){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.CHECK_GIFTBALANCE,{
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
            .post<any[]>(url,JSON.stringify(card),httpOptions)
            .pipe(map(data => data));
    }
    transferbalance(baseSite,token,email,card){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.TRANSFER_BALANCE,{
            email:email,
            FromGiftCardNumber:card.depositor,
            ToGiftCardNumber:card.creditor,
            baseSite:baseSite.catalogversionId
        });
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
            .post<any[]>(url,JSON.stringify({}),httpOptions)
            .pipe(map(data => data));    
    }
    registerGivexCard(baseSite,token,email,card){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.GIVEX_REGISTRATION,{
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
            .post<any[]>(url,JSON.stringify(card),httpOptions)
            .pipe(map(data => data));
    }
    checkBalance(baseSite,token,body){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.CHECK_GIFTBALANCE,{
            baseSite:baseSite.catalogversionId
        });
        // if(baseSite.csAgent){
        //     url=url+ "?access_token=" + baseSite.agentToken
        // }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':'bearer '+token
                
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(body),httpOptions)
            .pipe(map(data => data));
    }

}