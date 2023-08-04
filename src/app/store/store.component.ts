import { Inject,Component, OnInit,AfterViewInit,HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {SingletonService} from '../services/singleton.service';
import { Subscription } from 'rxjs';
import { Router, RouterOutlet,ActivatedRoute } from "@angular/router";
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { NavigationStart } from "@angular/router";
import { Meta } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit,AfterViewInit {
  toggleMainMenu:boolean;
  subscription:Subscription;
  @HostBinding('@.disabled')
  public animationsDisabled = false;
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ :SingletonService,
    public router: Router,
    public route: ActivatedRoute,
    private meta: Meta
    ) {
    this.toggleMainMenu=false;
    router.events
    .pipe(
      filter((event: NavigationEvent) => {
        return event instanceof NavigationStart;
      })
    )
    .subscribe((event: NavigationStart) => {
      if(this.dom.referrer.indexOf('store-finder') !=-1){
        $('#storeDirection').remove();
      }
    });

  }

  ngOnInit() {
    this.meta.addTag({ name: 'description', content: `Discover an exquisite world of fragrances with Molton Brown's luxury beauty and home gifts. Find your complimentary sample included with every purchase.` });
  
  }

  onActivate(e, outlet){
     outlet.scrollTop = 0;
 }
  ngAfterViewInit() {
    this.subscription = this.singletonServ.getMessage().subscribe(message => {
      if (message.moltonSideumenu) {
        this.toggleMainMenu= message.moltonSideumenu.state;
      }
     });
    }
}
