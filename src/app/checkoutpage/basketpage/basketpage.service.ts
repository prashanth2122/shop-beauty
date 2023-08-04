import { 
    Injectable
 } from "@angular/core";
 import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
 import { map,catchError } from 'rxjs/operators';
 import {  throwError } from 'rxjs';
 import {  PATH } from '../../app.constant';
 import { of } from 'rxjs';
 import {environment} from '../../../environments/environment';
 import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
@Injectable({ providedIn: 'root' })
export class BasketPageComponentService extends InterPolateUrlService{
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
    }
    expressCheckout(baseSite,token,email,cartCode){
        let url=this.interpolateUrl(environment.API_PATH + PATH.EXPRESS_CHECK_PATH,{
            email:email,
            cartCode:cartCode,
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
               .post<any[]>(url,JSON.stringify({}), httpOptions)
               .pipe(map(data => data));  
    }
    generateCartToken(baseSite) {
        let url = this.interpolateUrl(environment.AUTHRISATION_PATH +PATH.CART_TOKEN_PATH,{
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

    getFRContent(lang: string) {
        const langPath = `assets/slots/${lang || 'en'}.json`;
        return this.http
             .get<any[]>(langPath).pipe(map(data => data,
                 catchError(err => of(err.message))
             ));
   }
    retrieveCartDetails(baseSite,token,email,cartcode){
        let url=this.interpolateUrl(environment.API_PATH+PATH.USER_CARTDETAILS,{
            cartID:cartcode,
            email:email,
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
            .get<any[]>(url,httpOptions).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }


    updateEntry(baseSite,token,email,code,item,entry){
        const _path="/users/"+email+"/carts/"+code+"/entries/"+entry;

        let url =this.interpolateUrl(environment.API_PATH +_path ,{

            baseSite:baseSite.catalogversionId
        });
       if(baseSite.csAgent){
                url=url+ "?access_token=" + baseSite.agentToken
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer  '+token
            })
        };
        return this.http.patch(url, JSON.stringify(item), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }

    removeEntry(baseSite,token,email,code,entry){
        const _path="/users/"+email+"/carts/"+code+"/entries/"+entry;
        let url =this.interpolateUrl(environment.API_PATH + _path,{
            email:email,
            cartCode:code,
            entry:entry,
            baseSite:baseSite.catalogversionId
        });
       if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken
       }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer  '+token
            })
        };

       return this.http.delete(url,httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
    }
    getBasketSampleProducts(baseSite){
        const _path="/products/search?query=:relevance:category:GWPSP&sort=name-asc&fields=FULL";
        const url=this.interpolateUrl(environment.API_PATH,{
            baseSite:baseSite.catalogversionId
        });
        let _smapleProductPath=url+_path;
            if(baseSite.csAgent){
                _smapleProductPath=_smapleProductPath+ "&access_token=" + baseSite.agentToken
            }
            return this.http
              .get<any[]>(_smapleProductPath)
              .pipe(map(data => data));

            
    }


    getSampleProducts(baseSite){
        const _path="/products/search?query=:relevance:category:0101&sort=name-asc&fields=FULL";
        const url=this.interpolateUrl(environment.API_PATH,{
            baseSite:baseSite.catalogversionId
        });
        let _smapleProductPath=url+_path;
            if(baseSite.csAgent){
                _smapleProductPath=_smapleProductPath+ "&access_token=" + baseSite.agentToken
            }
            return this.http
              .get<any[]>(_smapleProductPath)
              .pipe(map(data => data));

            
    }

    storesampleProducts(baseSite,item,tokenId,code,email){
        let url = this.interpolateUrl(environment.API_PATH+PATH.ADD_TO_BASKET,
        {
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
                'Authorization': 'bearer  '+tokenId
            })
        };
        return this.http.post(url, JSON.stringify(item), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }

    

    
    giftMessage(baseSite,tokenId,body,email,code){
    let url = this.interpolateUrl(environment.API_PATH +  PATH.GIFT_BOX,{
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
            'Authorization': 'bearer  '+tokenId
        })
    };
    return this.http.post(url, JSON.stringify(body), httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
  }

  addPickerSample(baseSite,tokenId,body,email,code){
    let url = this.interpolateUrl(environment.API_PATH +  PATH.PICKERADDTOBASKET,{
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
            'Authorization': 'bearer  '+tokenId
        })
    };
    return this.http.post(url, JSON.stringify(body), httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
  }

//   REMOVE_BUNDLE_PATH

removeBundle(baseSite,token,email,code,entry){
    let url =this.interpolateUrl(environment.API_PATH +  PATH.REMOVE_BUNDLE_PATH,{
        email:email,
        cartCode:code,
        bundleNo:entry,
        baseSite:baseSite.catalogversionId});
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer  '+token
        })
    };
    return this.http.delete(url,httpOptions)
    .pipe(map(data => data,
        catchError(err => of(err.message))
    ));
    }
    applyPromoCode(baseSite,token,email,code,voucherId){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.PROMOCODE,{
            email:email,
            cartCode:code,
            voucherId:voucherId,
            baseSite:baseSite.catalogversionId
        });
            if(baseSite.csAgent){
                url=url+ "&access_token=" + baseSite.agentToken
            }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer  '+token
            })
        };
        return this.http.post(url, JSON.stringify({}), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
updateBundleItem(baseSite,token,email,code,body, bundleNo,qty){
    let url = this.interpolateUrl(environment.API_PATH +  PATH.UPDATE_BUNDLE,{
        email:email,
        cartCode:code,
        bundleNo:bundleNo,
        qty:qty,
        baseSite:baseSite.catalogversionId
    });
        if(baseSite.csAgent){
            url=url+ "&access_token=" + baseSite.agentToken
        }
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer  '+token
        })
    };
    return this.http.patch(url, JSON.stringify(body), httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}
    removePromoCode(baseSite,token,email,code,voucherId){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.REMOVE_PROMO,{
            email:email,
            cartCode:code,
            coupon:voucherId,
            baseSite:baseSite.catalogversionId
        });
       if(baseSite.csAgent){
                url=url+ "?access_token=" + baseSite.agentToken
        }    
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer  '+token
            })
        };
        return this.http.delete(url,httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    getStaticContent(lang: string) {
        const langPath = `assets/i18n/${lang || 'en'}.json`;
      return this.http
              .get<any[]>(langPath).pipe(map(data => data,
                  catchError(err => of(err.message))
              ));
    }
    getStaticGiftContent(lang: string) {
        const langPath = `assets/contents/${lang || 'en'}.json`;
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
     addToBasket(baseSite,token,email,code,productObj){
        let url = this.interpolateUrl(environment.API_PATH+PATH.ADD_TO_BASKET,
          {
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
                'Authorization':'bearer '+token
            })
        };
        return this.http.post(url, JSON.stringify(productObj), httpOptions)
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

}