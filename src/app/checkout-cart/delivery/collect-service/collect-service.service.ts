import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {  PATH } from '../../../app.constant';
import {InterPolateUrlService} from '../../../services/commons/InterPolateUrl.service';
import {environment} from '../../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class CollectComponentService extends InterPolateUrlService {
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }
    generateCartToken(baseSite) {
        let url =this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
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
    setRegCcCommunication(baseSite,token,email,code,mobile){
        let url =this.interpolateUrl(environment.API_PATH +  PATH.SET_PHONENUMBER,{
            email:email,
            cartCode:code,
            phoneNumber:mobile,
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
            .post<any[]>(url,JSON.stringify({}), httpOptions)
            .pipe(map(data => data));
    }
}