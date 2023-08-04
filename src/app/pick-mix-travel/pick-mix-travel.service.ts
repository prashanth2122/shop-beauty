import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import {  PATH } from '../app.constant';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {InterPolateUrlService} from '../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class PickMixTravelComponentService  extends InterPolateUrlService{
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }
    getBundlePrice(baseSite,token){
        let url =this.interpolateUrl(environment.API_PATH+PATH.PICK_MIX_BUNDLEPRICE,{
            baseSite:baseSite.catalogversionId
        });
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
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
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
    getPickandMixProducts(baseSite,categoryId){
        let url =this.interpolateUrl(environment.API_PATH +  PATH.PICK_MIX_PATH,{
            relavance:':relavance:',
            category:"category:",
            categoryId:categoryId,
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
}