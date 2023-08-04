import { 
    Inject,
    Injectable,
    PLATFORM_ID
 } from "@angular/core";
 import { DOCUMENT } from '@angular/common';
 import { HttpClient ,HttpHeaders} from '@angular/common/http'; 
import { map,catchError } from 'rxjs/operators';
import { PATH } from '../../app.constant';
import {of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class DeliveryComponentService extends InterPolateUrlService {
    http: HttpClient;
    constructor(
        http: HttpClient,
        @Inject(PLATFORM_ID) public platformId: Object,
        @Inject(DOCUMENT) public dom
        ) {
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

    getUserAddress(baseSite,token,email){
        let url =this.interpolateUrl( environment.API_PATH +  PATH.CREATE_ADDRESS,{
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

    createAnnonymousAddress(baseSite,tokenId,cartId,body){
        let url = this.interpolateUrl(environment.API_PATH +  PATH.GUEST_SHIPPING_ADDRESS,{
            cartId:cartId,
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
    const url=this.interpolateUrl(PATH.POSTAL_ADDRESS.trim(),{postCode:postCode}); return this.http
    .post<any[]>(url,  {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml') 
            .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
      })
    .pipe(map(data => data));
}

confirmAddress(baseSite,tokenId,email,cartCode,addressId){
    let url = this.interpolateUrl( environment.API_PATH +  PATH.CONFIRM_ADDRESS,{
        cartCode:cartCode,
        email:email,
        addressId:addressId,
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
    .post<any[]>(url,JSON.stringify({}), httpOptions)
    .pipe(map(data => data));
}
getDeliveryMethod(baseSite,tokenId,email,cartCode,_delveryCountryId){
   
    let url = '';
    
   if(typeof(_delveryCountryId) != "boolean" ){
    url = this.interpolateUrl(environment.API_PATH +  PATH.US_DELIVERY_MODES,{
        deliveryGroup:_delveryCountryId,
        email:email,
        cartCode:cartCode,
        baseSite:baseSite.catalogversionId
    });
   }else{
    url = this.interpolateUrl(environment.API_PATH +  PATH.DELIVERY_METHOD,{
        email:email,
        cartCode:cartCode,
        baseSite:baseSite.catalogversionId
    });
   }
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
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}

deliverymethodToCart(baseSite,tokenId,body,deliveryType,email,cartCode){
    let url = this.interpolateUrl( environment.API_PATH +  PATH.DELIVERY_METHOD_TO_CART,{
        cartCode:cartCode,
        email:email,
        deliverycode:deliveryType.code,
        baseSite:baseSite.catalogversionId
    });
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
    .post<any[]>(url,JSON.stringify(body), httpOptions)
    .pipe(map(data => data));
}

deliveryNamedDayToCart(baseSite,tokenId,email,cartCode){
    let _path = this.interpolateUrl(environment.API_PATH +  PATH.DELIVERY_SERVICE,{
        email:email,
        cartCode:cartCode,
        baseSite:baseSite.catalogversionId,
        catalogversionId:baseSite.catalogversionId
    });
    if(baseSite.csAgent){
        _path=_path+ "&access_token=" + baseSite.agentToken
    }
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(_path,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
    
}



setNamedDeliveryModeToCart(baseSite,tokenId,email,cartCode,data){
    let url = this.interpolateUrl( environment.API_PATH +  PATH.DELIVERY_NAMED_DAY_SERVICE,{
        cartCode:cartCode,
        email:email,
        deliveryCode:data.deliveryCode,
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
     .post<any[]>(url,JSON.stringify(data), httpOptions)
     .pipe(map(data => data));
}


getInternationalDelivery(baseSite,tokenId,email,cartCode,countryCode){
    let url=this.interpolateUrl( environment.API_PATH +  PATH.GET_INTERNATIONAL_DELIVERY_METHOD,{
        cartCode:cartCode,
        email:email,
        countryCode:countryCode,
        baseSite:baseSite.catalogversionId
        });
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
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));

}



setInternationalDeliveryToCart(baseSite,tokenId,email,cartCode,countryCode,data){
    let url=this.interpolateUrl( environment.API_PATH +  PATH.SET_INTERNATIONAL_DELIVERY_METHOD,{
        cartCode:cartCode,
        email:email,
        countryCode:countryCode,
        baseSite:baseSite.catalogversionId
        });
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
        .post<any[]>(url,JSON.stringify(data),httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));

}


addShippingAddress(baseSite,token,email,cartCode,shipAddress){
    let url=this.interpolateUrl(environment.API_PATH +  PATH.SHIPPING_ADDRESS,{
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
            Authorization: 'bearer '+token
        })
    };
    return this.http
        .post<any[]>(url, JSON.stringify(shipAddress),httpOptions)
        .pipe(map(data => data));
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
    return this.http.patch(url, JSON.stringify(body), httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
  }

  getDeliveryModes(baseSite,token,email,cartCode,method){
    let url=this.interpolateUrl( environment.API_PATH +  PATH.OS_FULLCART,{
        cartCode:cartCode,
        email:email,
        baseSite:baseSite.catalogversionId
    });
    if (baseSite.isoCode == "GB") {
         url = url + "KaoDeliveryModes&isOrderSummary=true";
         if(method){
            url=url+'&deliveryCode='+method;
        }
    } else if(baseSite.isoCode=="US") {
         url = url + "KaoUSDeliveryModes&isOrderSummary=true";
         if(method){
            url=url+'&deliveryCode='+method;
        }
    }else{
        if(method){
            url=url+'&isOrderSummary=true&deliveryCode='+method;
        }else{
            url=url+'&isOrderSummary=true'; 
        }
    } 
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
  generateCartId(baseSite,tokenId,email){
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
            'Authorization': tokenId
        })
    };
    return this.http.post(url, httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
 }
retrieveCartDetails(baseSite,token,email,cartcode){
    let url=this.interpolateUrl( environment.API_PATH +  PATH.USER_CARTDETAILS,{
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

storeProductsToCart(baseSite,token,email,cartCode,productObj) {
    let url = this.interpolateUrl(environment.API_PATH +  PATH.ADD_TO_BASKET,{
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
    return this.http.post(url, JSON.stringify(productObj), httpOptions)
        .pipe(map(data => data,
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
use(lang: string) {
      const langPath = `assets/i18n/${lang || 'en'}.json`;
    return this.http
            .get<any[]>(langPath).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
  }
  getStaticContent(lang: string) {
    const langPath = `assets/contents/${lang || 'en'}.json`;
  return this.http
          .get<any[]>(langPath).pipe(map(data => data,
              catchError(err => of(err.message))
          ));
}
//   createAddress
mergeCart(baseSite,token, code, oldCode){
    let url=this.interpolateUrl(environment.API_PATH + PATH.GUEST_CART_SHIFTING_PATH,{
                   cartCode:code,
                   oldCartCode:oldCode,
                   mergeCartGuid:code,
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