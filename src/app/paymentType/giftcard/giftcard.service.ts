import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PATH } from "../../app.constant";
import { Headers } from "@angular/http";
import { environment } from "../../../environments/environment";
import { InterPolateUrlService } from "../../services/commons/InterPolateUrl.service";
@Injectable({ providedIn: "root" })
export class GiftCardService extends InterPolateUrlService {
  http: HttpClient;
  constructor(http: HttpClient) {
    super();
    this.http = http;
  }
  getSystemIp(){
    const url="https://api.ipify.org/?format=json";
    return this.http.get<any[]>(url).pipe(map(data => data));
  }
  giftCardService(baseSite,body, tokenId, email, cartCode) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.GIFT_CARD,
      { 
         email: email,
         cartCode: cartCode,
         baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken;
            body['isAsm']=true;
        }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + tokenId
      })
    };
    return this.http
      .post<any[]>(url, JSON.stringify(body), httpOptions)
      .pipe(map(data => data));
  }

  splitPayment(baseSite,obj, _token, _code, email, card) {
    let url = this.interpolateUrl(environment.API_PATH + PATH.SPLIT_PAYMENT,{
                email: email,
                cartCode: _code,
                firstName: card.FirstName,
                lastName: card.LastName,
                givexCardNumber: card.GivexCardNumber.trim(),
                givexPinNumber: card.GivexPinNumber.trim(),
                amount: card.Amount.trim(),        
                baseSite:baseSite.catalogversionId
              });
      if(baseSite.csAgent){
          url=url+ "&access_token=" + baseSite.agentToken;
          obj['isAsm']=true;
      }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + _token
      })
    };
    return this.http
      .post<any[]>(url, JSON.stringify(obj), httpOptions)
      .pipe(map(data => data));
  }
  expressSplitCard(baseSite,obj, _token, cartCode, email, card, id) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.EXPRESS_SPLIT_PAYMENT,
      {
        email: email,
        cartCode: cartCode,
        firstName: card.FirstName,
        lastName: card.LastName,
        givexCardNumber: card.GivexCardNumber,
        givexPinNumber: card.GivexPinNumber,
        amount: card.Amount,
        profileID: id,
        baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken;
            obj['isAsm']=true;
        }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + _token
      })
    };
    return this.http
      .post<any[]>(url, JSON.stringify(obj), httpOptions)
      .pipe(map(data => data));
  }
  addPaymentDetails(baseSite,obj, _token, _code, email) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.REG_GIVEX_PAYMENT_DETAIL,
      { 
        cartCode: _code, 
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
        Authorization: "bearer " + _token
      })
    };
    return this.http
      .post<any[]>(url, JSON.stringify(obj), httpOptions)
      .pipe(map(data => data));
  }

  generateCartToken(baseSite) {
    let url = this.interpolateUrl(
      environment.AUTHRISATION_PATH + PATH.CART_TOKEN_PATH,{
        baseSite:baseSite.catalogversionId});
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post<any[]>(url, httpOptions).pipe(map(data => data));
  }
}
