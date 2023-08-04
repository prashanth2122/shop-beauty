import {
  InjectionToken,
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule,
  UrlSegment,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { StoreComponent } from "./store/store.component";
import {FragranceComponent} from "./fragrance/fragrance.component";
import {FfLandingpageComponent} from "./ff-landingpage/ff-landingpage.component";
const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');
const routes: Routes = [{
    path: '',
    redirectTo: 'store',
    pathMatch: 'full'
  },
  { 
    path: 'store/404',
    pathMatch: 'full',
    loadChildren: './not-found/not-found.module#Pagenotfoundmodule'
  },
  {
    path: 'store/storeportal',
    loadChildren: './store-portal/store-portal.module#StorePortalRouteModule',
    data: {
      header: false
    }
  },
  {
    path:'store/fragrance/fragrance-finder/displayFFProducts',
    component:FfLandingpageComponent
  },
  {
    path:'store/fragrance/fragrance-finder/:catId',
    component:FragranceComponent,
    pathMatch: 'full'
  },

  {
    path: 'store',
    loadChildren: './store/store.module#StorePageModule',
    data: {
      header: true
    }
  },
  {
    path:'store/storeportal',
    loadChildren:'./store-portal/store-portal.module#StorePortalRouteModule',
    data: {
      header: false
    }
  },
  {
    path: 'checkout',
    loadChildren: './checkout-cart/checkout-cart.module#CheckoutCartPageModule',
    data: {
      header: false
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'organisation',
    loadChildren: './organisation/organisation.module#OrgainisationRouteModule',
    data: {
      header: true
    }
  },
  {
    path: '**',
    redirectTo: 'store/404'
  }
];

@NgModule({
  providers: [{
    provide: externalUrlProvider,
    useValue: (route: ActivatedRouteSnapshot) => {
      const externalUrl = route.paramMap.get('externalUrl');
      window.open(externalUrl, '_self');
    },
  }],
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
      onSameUrlNavigation: 'ignore',
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export function htmlFiles(url: UrlSegment[]) {
  return url.length === 1 && url[0].path.endsWith('gift-cards') ? ({
    consumed: url
  }) : null;
}
