import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { PATH } from "../../app.constant";
import { environment } from "../../../environments/environment";
import { InterPolateUrlService } from "../../services/commons/InterPolateUrl.service";
import { of } from "rxjs";
declare var Window: any;
@Injectable({ providedIn: "root" })
export class cardFormComponentService extends InterPolateUrlService {
  http: HttpClient;
  constructor(http: HttpClient) {
    super();
    this.http = http;
  }
  
  getSystemIp(){
    const url="https://api.ipify.org/?format=json";
    return this.http.get<any[]>(url).pipe(map(data => data));
  }

  generateJWT(baseSite,token,email,code){
    let url =this.interpolateUrl(environment.API_PATH+PATH.JWT_TOKEN,{
              email:email,
              cartCode:code,
              baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken;

        }
    const httpOptions={
      headers:new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    }
    return this.http.post<any[]>(url,JSON.stringify({}), httpOptions).pipe(map(data => data));
  }

  validatePayMode(baseSite,token,email,code,body,responseJWT,transactionID){
    let url =this.interpolateUrl(environment.API_PATH+PATH.VALIDATE_PAYMENT,{
                        email:email,
                        cartCode:code,
                        responseJWT:responseJWT,
                        transactionID:transactionID,
                        baseSite:baseSite.catalogversionId
                      });
                      if(baseSite.csAgent){
                          url=url+ "&access_token=" + baseSite.agentToken;
                          body['isAsm']=true;
                      }
    const httpOptions={
      headers:new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    }
    return this.http.post<any[]>(url,JSON.stringify(body), httpOptions).pipe(map(data => data));
  }

  validateExpressPayMode(baseSite,token,email,code,body,responseJWT,transactionID,profileID){
    let url =this.interpolateUrl(environment.API_PATH+PATH.EXPRESS_VALIDATE_PAYMENT,{
                        email:email,
                        cartCode:code,
                        responseJWT:responseJWT,
                        transactionID:transactionID,
                        profileID:profileID,
                        baseSite:baseSite.catalogversionId
                      });
                      if(baseSite.csAgent){
                          url=url+ "&access_token=" + baseSite.agentToken;
                          body['isAsm']=true;
                      }
    const httpOptions={
      headers:new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    }
    return this.http.post<any[]>(url,JSON.stringify(body), httpOptions).pipe(map(data => data));
  }


  expressPaymentAuthentication(baseSite,token, email, code, body,profileID, sessionID){
    let url =this.interpolateUrl(environment.API_PATH+PATH.EXPRESS_PAYMENT,{
      email:email,
      cartCode:code,
      profileID:profileID,
      sessionID:sessionID,
      baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken;
            body['isAsm']=true;
        }
    const httpOptions={
      headers:new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    }
    return this.http.post<any[]>(url,JSON.stringify(body), httpOptions).pipe(map(data => data));
  }

  paymentAuthentication(baseSite,token,email,code,body,sessionID){
    let url =this.interpolateUrl(environment.API_PATH+PATH.PAYMENT_AUTHENTICATION,{
      email:email,
      cartCode:code,
      sessionID:sessionID,
      baseSite:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        url=url+ "&access_token=" + baseSite.agentToken;
        body['isAsm']=true;
    }
    const httpOptions={
      headers:new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    }
    return this.http.post<any[]>(url,JSON.stringify(body), httpOptions).pipe(map(data => data));
  }
  


  confirmOrder(baseSite,tokenId, body, emailId, cartCode) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.REG_DEBIT_PAYMENT,
      { 
        email: emailId, 
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
  
  getUserAddress(baseSite:any,token, email) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.CREATE_ADDRESS,
      { 
        email: email,
        baseSite:baseSite.catalogversionId
      });
        if(baseSite.csAgent){
            url = url+ "?access_token=" + baseSite.agentToken;
        }

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    };
    return this.http.get<any[]>(url, httpOptions).pipe(map(data => data));
  }
  createUserAddress(baseSite,body, tokenId, email) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.CREATE_ADDRESS,
      {
         email: email,
         baseSite:baseSite.catalogversionId});
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

  expressPayment(baseSite,tokenId, email, code, body, id) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.EXPRESS_DBPAYMENT,
      { 
        cartCode: code, 
        email: email, 
        profileID: id, 
        baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken;
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

  addCCShippingAddress(baseSite,tokenId, address, email, code) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.CLICKANDCOLLECT_ADDRESS_PATH,
      { 
        email: email, 
        cartCode: code, 
        baseSite:baseSite.catalogversionId
      });
      if(baseSite.csAgent){
          url=url+ "?access_token=" + baseSite.agentToken;
          address['isAsm']=true;
      }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + tokenId
      })
    };
    return this.http
      .post<any[]>(url, JSON.stringify(address), httpOptions)
      .pipe(map(data => data));
  }
  addBillingAddress(baseSite,tokenId, email, code, _address) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.CHANGE_BILLING_ADDRESS,
       {
          email: email, 
          cartCode: code ,
          baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken;
            _address['isAsm']=true;
        }

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + tokenId
      })
    };
    return this.http
      .post<any[]>(url, JSON.stringify(_address), httpOptions)
      .pipe(map(data => data));
  }


  getUserSavedCards(baseSite,token, email) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.CARD_DETAILS,
      { 
        email: email,
        baseSite:baseSite.catalogversionId
      });
      if(baseSite.csAgent){
          url=url+ "?access_token=" + baseSite.agentToken;
      }

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      })
    };
    return this.http.get<any[]>(url, httpOptions).pipe(map(data => data));
  }
  postCardDetails(baseSite,token, email, body) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.CREATE_CARD,
      { email: email, 
        baseSite:baseSite.catalogversionId
      });
      if(baseSite.csAgent){
          url=url+ "?access_token=" + baseSite.agentToken;
          body['isAsm']=true;
      }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "bearer" + token
      })
    };
    return this.http
      .post(url, JSON.stringify(body), httpOptions)
      .pipe(map(data => data, catchError(err => of(err.message))));
  }
  updateUserAddress(baseSite,body, tokenId, email, addressId) {
    let url = this.interpolateUrl(
      environment.API_PATH + PATH.UPDATE_ADDRESS,
      {
         email: email, 
         addressId: addressId,     
         baseSite:baseSite.catalogversionId});
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
      .patch<any[]>(url, JSON.stringify(body), httpOptions)
      .pipe(map(data => data));
  }
  getJWT() {
    const url = "../signature.php";
    return this.http
      .get<any[]>(url)
      .pipe(map(data => data, catchError(err => err.message)));
  }
}
