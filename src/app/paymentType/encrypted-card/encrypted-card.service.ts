import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {  PATH } from '../../app.constant';
 import { Headers } from '@angular/http';
 import {environment} from '../../../environments/environment';
 import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
 declare var Window:any;
@Injectable({ providedIn: 'root' })
export class EncryptComponentService extends InterPolateUrlService {
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }

    updateCardData(baseSite,tokenId,email,id,body){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.EDIT_CARD,{
            email:email,
            profileID:id,
            baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
        const httpOptions = {
            headers: new HttpHeaders({            
                'Content-Type': 'application/json',
              Authorization: 'bearer '+tokenId
            })
          };
        return this.http
            .put<any[]>(url,JSON.stringify(body),httpOptions)
            .pipe(map(data => data)); 
      }
      getUserSavedCards(baseSite,token,email){
        let url=this.interpolateUrl(environment.API_PATH +  PATH.CARD_DETAILS,{
            email:email,
            baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken
        }      
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'bearer '+token
            })
        };
        return this.http.get<any[]>(url,httpOptions).pipe(map(data => data));
      }
      getUserAddress(baseSite,token,email){
        let url =this.interpolateUrl( environment.API_PATH +  PATH.RETREIVE_ADDRESS,{
            email:email,
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
        .get<any[]>(url,httpOptions)
        .pipe(map(data => data));
    }
}