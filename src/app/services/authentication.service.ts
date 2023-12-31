import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Observable, pipe, throwError} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private message: string;

  constructor(private _router: Router) { }

  /**
   * this is used to clear anything that needs to be removed
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * check for expiration and if token is still existing or not
   * @return {boolean}
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('token') != null && !this.isTokenExpired();
  }

  // simulate jwt token is valid
  // https://github.com/theo4u/angular4-auth/blob/master/src/app/helpers/jwt-helper.ts
  isTokenExpired(): boolean {
    return false;
  }

  loginAdmin(): void {

  }

  login(): void {

  }

  /**
   * this is used to clear local storage and also the route to login
   */
  logout(): void {
    this.clear();
    // this._router.navigate(['/login']);
  }

  decode() {
    return decode(localStorage.getItem('token'));
  }
}