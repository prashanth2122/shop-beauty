import { Injectable } from "@angular/core";
import { map,catchError } from 'rxjs/operators';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import {  PATH } from '../app.constant';
import {environment} from '../../environments/environment';
import {throwError,of } from 'rxjs';
import {InterPolateUrlService} from "../services/commons/InterPolateUrl.service";
@Injectable({ providedIn: 'root' })
@Injectable()
export class FragranceService  extends InterPolateUrlService {

    private headers: HttpHeaders;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
    }
    getMbProdDetails(baseSite,personaId) {
        let url = this.interpolateUrl(environment.API_PATH + PATH.FFCATEGORYPATH,{
            personaId:personaId,
             baseSite:baseSite.catalogversionId
        });
        if(baseSite.csAgent){
            url=url+ "?access_token=" + baseSite.agentToken
        }
        return this.http.get<any[]>(url).pipe(map(data => data));
    }

    getQuizContent(path) {
        const langPath = `assets/resource/data/uk/quiz-results.json`;
        return this.http
             .get<any[]>(path).pipe(map(data => data,
                 catchError(err => of(err.message))
             ));
   }

   getMoltonBrownQuiz(path) {
    const langPath = `assets/resource/data/uk/molton-brown.json`;
    return this.http
         .get<any[]>(path).pipe(map(data => data,
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