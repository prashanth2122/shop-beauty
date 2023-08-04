import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
 import {InterPolateUrlService} from "../services/commons/InterPolateUrl.service";
import {of} from 'rxjs';
@Injectable({ providedIn: 'root' })
export class OrganisationComponentService  extends InterPolateUrlService{
    private headers: HttpHeaders;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
    }
    getStaticContent(lang: string) {
      const langPath = `assets/contents/${lang || 'en'}.json`;
      return this.http
              .get<any[]>(langPath).pipe(map(data => data,
                  catchError(err => of(err.message))
              ));
    }
}