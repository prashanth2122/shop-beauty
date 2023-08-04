import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map ,catchError} from 'rxjs/operators';
import { PATH } from '../../app.constant';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
import {of} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService extends InterPolateUrlService{
  constructor(private http:HttpClient) {
    super();
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
  getUserAddress(baseSite,token,email){
    let url =this.interpolateUrl( environment.API_PATH +  PATH.RETREIVE_ADDRESS,{
        email:email,
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
    .get<any[]>(url,httpOptions)
    .pipe(map(data => data));
}
  generatePaymentToken(baseSite) {
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
 postCardDetails(baseSite,token,email,body){
  let url = this.interpolateUrl(environment.API_PATH +  PATH.CREATE_CARD,{
      email:email,
      baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "?access_token=" + baseSite.agentToken
    }
  const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'bearer'+token
      })
  };
  return this.http.post(url, JSON.stringify(body), httpOptions)
      .pipe(map(data => data,
          catchError(err => of(err.message))
      ));
 } 
 setDefaultCard(baseSite,token,email,id,body){
  let url =this.interpolateUrl( environment.API_PATH +  PATH.DEFAULT_CARD,{
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
          'Authorization': 'bearer '+token
           })
  };
  return this.http
  .put<any[]>(url,JSON.stringify(body),httpOptions)
  .pipe(map(data => data));
 }
 removeCard(baseSite,token,email,id){
    let url =this.interpolateUrl( environment.API_PATH +  PATH.REMOVE_CARD,{
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
            'Authorization': 'bearer '+token
             })
    };
    return this.http
    .delete<any[]>(url,httpOptions)
    .pipe(map(data => data)); 
 }


 getPostCode(postCode){
    const url=this.interpolateUrl(PATH.FIND_POSTCODE.trim(),{postCode:postCode});
      return this.http
      .post<any[]>(url,  {
              headers: new HttpHeaders()
              .set('Content-Type', 'text/xml') 
              .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
              .append('Access-Control-Allow-Origin', '*')
              .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
        })
      .pipe(map(data => data));   
}
retrievePostalAddress(postCode){
    const url=this.interpolateUrl(PATH.POSTAL_ADDRESS.trim(),{postCode:postCode});
    return this.http
    .post<any[]>(url,  {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml') 
            .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
      })
    .pipe(map(data => data));
}
 getUserData(baseSite,tokenId,email){
    let url = this.interpolateUrl(environment.API_PATH +  PATH.PROFILE,{
        email:email,
        baseSite:baseSite.catalogversionId});
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken
        }
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions)
        .pipe(map(data => data));
}
updateCard(baseSite,token,email,body,id){
    let url =this.interpolateUrl( environment.API_PATH +  PATH.EDIT_CARD,{
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
            'Authorization': 'bearer '+token
             })
    };
    return this.http
    .put<any[]>(url,JSON.stringify(body),httpOptions)
    .pipe(map(data => data)); 
}
   }

