import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {of} from 'rxjs';
import {SERVER_PATHS, PATH } from '../app.constant';
import {environment} from '../../environments/environment';
import {InterPolateUrlService} from '../services/commons/InterPolateUrl.service';
import { map,catchError } from 'rxjs/operators';

declare const $: any;

@Injectable()
export class AmpHomePageService extends InterPolateUrlService {
  constructor(private http:HttpClient) {
           super();
    }
    getStaticContent(lang: string) {
        const langPath = `assets/contents/${lang || 'en'}.json`;
        return this.http
                .get(langPath).pipe(map(data => data
                ));
      }
      getI8nContent(lang: string) {
        const langPath = `assets/i18n/${lang || 'en'}.json`;
        return this.http
                .get(langPath).pipe(map(data => data
                ));
      }
      scrollToTargetElement(id){
        const _pos=$(id).offset().top;  
        $('html ,body').animate({
          scrollTop: _pos
        },200);
      }


}