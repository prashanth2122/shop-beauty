import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {  PATH } from '../../app.constant';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
import {of} from 'rxjs';
@Injectable({ providedIn: 'root' })
export class profileComponentService extends InterPolateUrlService {
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

   mergeCart(baseSite,data,_email,token,oldCartId,newCartId){
       let url = this.interpolateUrl(environment.API_PATH + PATH.MERGE_CART,{
           email:_email,
           oldCartId:oldCartId,
           newCartId:newCartId,
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
           .post<any[]>(url,JSON.stringify(data),httpOptions)
           .pipe(map(data => data));
   }

   createUser(baseSite,body,tokenId){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.CREATE_USER_PATH,{
           baseSite:baseSite.catalogversionId
       });
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
           .post<any[]>(url,JSON.stringify(body), httpOptions)
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

   createUserAddress(baseSite,body,tokenId,email){
       let url = this.interpolateUrl( environment.API_PATH +  PATH.CREATE_ADDRESS,{
           email:email,
           baseSite:baseSite.catalogversionId
       });
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
           .post<any[]>(url,JSON.stringify(body), httpOptions)
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

   siteanonymousAuth(baseSite,tokenId,code,email){
      let url =this.interpolateUrl(environment.API_PATH+PATH.ANANONYMOUSCART,{
          email:email,
          cartCode:code,
          baseSite:baseSite.catalogversionId});
          if(baseSite.csAgent){
              url=url+ "&access_token=" + baseSite.agentToken
          }
  
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer '+tokenId
           })
       };
       return this.http
           .put(url,JSON.stringify({}),httpOptions)
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

   updateUserAddress(baseSite,body,tokenId,email,addressId){
       let url =this.interpolateUrl(environment.API_PATH +  PATH.UPDATE_ADDRESS,{
           email:email,
           addressId:addressId,
           baseSite:baseSite.catalogversionId
       });
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
       .patch<any[]>(url,JSON.stringify(body),httpOptions)
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
    
   creatEmptyCart(baseSite,token,data,email){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
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
       return this.http
           .post<any[]>(url,JSON.stringify(data),httpOptions)
           .pipe(map(data => data));
   }

   getCurrentUserRelevantCart(baseSite,token,email){
       let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
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
       return this.http
           .get<any[]>(url,httpOptions).pipe(map(data => data,
               catchError(err => of(err.message))
           ));
   }
   spliceUserAddress(baseSite,tokenId,email,addressId){
       let url =this.interpolateUrl( environment.API_PATH +  PATH.UPDATE_ADDRESS,{
           email:email,
           addressId:addressId,
           baseSite:baseSite.catalogversionId
       });
           if(baseSite.csAgent){
               url=url+ "?access_token=" + baseSite.agentToken
           }
       const httpOptions = {
           headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Authorization': 'bearer'+tokenId
           })
       };
       return this.http.delete(url,httpOptions)
       .pipe(map(data => data,
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
updateProfile(baseSite,tokenId,email,data){
   let url =this.interpolateUrl( environment.API_PATH + PATH.PROFILE,{
       email:email,
       baseSite:baseSite.catalogversionId});
       if(baseSite.csAgent){
           url=url+ "?access_token=" + baseSite.agentToken
       }

   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization':'bearer'+tokenId
           
       })
   };
   return this.http
       .patch<any[]>(url,JSON.stringify(data),httpOptions).pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}
updateProfileAddress(baseSite,cVrsnId,tokenId,email,addressId,data){
   let  url =this.interpolateUrl( environment.API_PATH + PATH.UPDATE_ADDRESS,{
       email:email,
       addressId:addressId,
       baseSite:baseSite.catalogversionId});
       if(baseSite.csAgent){
           url=url+ "?access_token=" + baseSite.agentToken
       }
   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization':'bearer'+tokenId
           
       })
   };
   return this.http
       .patch<any[]>(url,JSON.stringify(data),httpOptions).pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}

createRegisterCart(baseSite,tokenId,email){
   let url = this.interpolateUrl(environment.API_PATH +  PATH.REGISTER_CART,{
       email:email,
       baseSite:baseSite.catalogversionId});
       if(baseSite.csAgent){
           url=url+ "?access_token=" + baseSite.agentToken
       }
   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': 'bearer'+tokenId
       })
   };
   return this.http.post(url, JSON.stringify({}), httpOptions)
       .pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}

getFavourites(baseSite,tokenId,email){
   let url=this.interpolateUrl( environment.API_PATH + PATH.FAVOURITES,{
       email:email,
       baseSite:baseSite.catalogversionId
     });
       if(baseSite.csAgent){
           url=url+ "?access_token=" + baseSite.agentToken
       }
   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization':'bearer'+tokenId
           
       })
   };
   return this.http
       .get<any[]>(url,httpOptions).pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}
storeCurrentUserProducts(baseSite,item,tokenId,code,email){
   let url = this.interpolateUrl(environment.API_PATH +  PATH.ADD_TO_BASKET,{
       email:email,
       cartCode:code,
       baseSite:baseSite.catalogversionId});
       if(baseSite.csAgent){
           url=url+ "?access_token=" + baseSite.agentToken
       }
   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': 'bearer'+tokenId
       })
   };
   return this.http.post(url, JSON.stringify(item), httpOptions)
       .pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}
removeFavorite(baseSite,tokenId,email,productCode){
   let url = this.interpolateUrl(environment.API_PATH +  PATH.REMOVE_FAVOURITE,{
       email:email,
       productCode:productCode,
       baseSite:baseSite.catalogversionId});
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }

   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': 'bearer'+tokenId
       })
   };
   return this.http.delete(url,httpOptions)
   .pipe(map(data => data,
       catchError(err => of(err.message))
   ));
}

getDlMethod(baseSite,token,email,code){
   let url = this.interpolateUrl(environment.API_PATH +  PATH.DELIVERY_METHODS,{
                email:email,
                cartCode:code,
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
   return this.http.get(url,  httpOptions)
       .pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}
getDlEUDEMethods(baseSite,token,email,code,countryCode){
   let url = this.interpolateUrl(environment.API_PATH +  PATH.EU_DL_METHODS,{
               email:email,
                cartCode:code,
               countryCode:countryCode,
               baseSite:baseSite.catalogversionId
           });
           if(baseSite.csAgent){
               url=url+ "&access_token=" + baseSite.agentToken
           }
  const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': 'bearer'+token
       })
   };
   return this.http.get(url,  httpOptions)
       .pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}

getDlUSMethod(baseSite,token,email,code,deliveryGroup){
   let url = this.interpolateUrl(environment.API_PATH +  PATH.US_DELIVERY_SERVICES,{
                 email:email,
                 cartCode:code,
                 deliveryGroup:deliveryGroup,
                 baseSite:baseSite.catalogversionId
               });
               if(baseSite.csAgent){
                   url=url+ "&access_token=" + baseSite.agentToken
               }  
   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': 'bearer'+token
       })
   };
   return this.http.get(url,  httpOptions)
       .pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}

postDeliveryMethod(baseSite,token,email,dlMode){
    let deliveryMethod=(dlMode.code)?dlMode.code:dlMode.zoneName;
    let url = this.interpolateUrl(environment.API_PATH +  PATH.SET_DELIVERY_METHOD,{
        email:email,
        deliveryMethod:deliveryMethod,
        baseSite:baseSite.catalogversionId
       });
       if(baseSite.csAgent){
           url=url+ "&access_token=" + baseSite.agentToken
       }
   const httpOptions = {
       headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': 'bearer'+token
       })
   };
   let _body={
       serviceName: dlMode.serviceName,  
       description:dlMode.description, 
       deliveryCost: dlMode.deliveryCost
   }
   if(dlMode.code){
       _body['code']=dlMode.code;
   }else{
       _body['zoneName']=dlMode.zoneName;
   }
   return this.http.post(url, JSON.stringify(_body), httpOptions)
       .pipe(map(data => data,
           catchError(err => of(err.message))
       ));
}
}