import { Injectable } from '@angular/core';
import { Router, NavigationEnd,NavigationStart } from '@angular/router';

@Injectable()
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;
  private currentState:string;
  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {        
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
    router.events.subscribe(event => {
        if (event instanceof NavigationStart) {        
         
          this.currentState = event.url;
        };
      });
  }
 
  public currentStateUrl (){
    return this.currentState;
  }
  public getPreviousUrl() {
    return this.previousUrl;
  }    
}