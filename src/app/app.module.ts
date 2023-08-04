import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FooterComponent } from "./component/footer/footer.component";
import { productviewComponentService } from "./component/productview/productview.service";
import { AppService } from "./app.service";
import { HeaderComponentService } from "./component/header/header.service";
import { SingletonService } from "./services/singleton.service";
import { PagerService } from "./services/pager.service";
import { BreadcrumbComponent } from "./component/breadcrumb/breadcrumb.component";
import { BasketPageComponentService } from "./checkoutpage/basketpage/basketpage.service";
// import {  GoogleMapsAPIWrapper } from "@agm/core";
import {HeaderModule} from './component/header/header.module';
import { profileComponentService } from "./component/profile-form/profile.service";
import { OrderHistoryService } from "./component/orders/orders.service";
import { OrderPipe } from "./pipe/order.pipe";
import { GiftCardComponentService } from "./gift-cards/gift-cards.service";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthenticationGuardService } from "./guards/authentication-guard.service";
import { RoleGuardService } from "./guards/role-guard.service";
import { AuthenticationService } from "./services/authentication.service";
import { LoaderComponent } from "./loader/loader/loader.component";
import { StorefinderService } from "./storefinder/storefinder.service";
import { PlacePredictionService } from "./services/postcode-prediction.service";
import { PaymentService } from "./component/payment-detail/payment.service";
import {NewsLetterComponentService} from './newsletter-signup/newsletter.service';
import {CategoryComponentService} from './categorylanding-page/categorylanding-page.service';
import {CustomerAccountService} from './component/customer-account/customer-account.service';
import { TranslateService } from './translate.service';
import { TranslatePipe } from './translate.pipe';
import { CsHeaderComponent } from './component/cs-header/cs-header.component';
import {CSCustomerService} from './component/cs-header/cs-header.service';
import { CustomValidatorDirective } from './forms/custom-validator.directive';
import { CustomDirectiveFocusDirective } from './forms/custom-directive-focus.directive';
import {AmpHomePageService} from './amp-homepage/amp-homepage.service';
import { ConfigService } from './services/config.service';
import {MetaService} from "./services/meta.service";
import {StoreComponent} from './store/store.component';
import {FooterComponentService} from './component/footer/footer.service';
import { BrowseComponent } from './browse/browse.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AccordianModule} from "./accordion/accordian.module";
import {AccordianItemModule} from "./accordion-item/accordion-item.module";
import {GtmMethodService} from "./services/gtmmethods.service";
import {LinkService} from "./services/link.service";
import { CookiebarComponent } from './cookiebar/cookiebar.component';
import { CookieService } from 'ngx-cookie-service';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FFCatalogService } from './ff-landingpage/ff-landingpage.service';
import { FragranceComponent } from './fragrance/fragrance.component';
import {FragranceService} from "./fragrance/fragrance.service";
import { SEOService } from "./services/seo.service";
import { FfLandingpageComponent } from './ff-landingpage/ff-landingpage.component';
import{StoreSpecificRoleGuardService} from "./guards/store-specific-guard.service";
import { ResizeService } from './services/resize.service';

export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('en');
}
export function getBaseHref(): string {
  return window.location.pathname;
} 
@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbComponent,
    OrderPipe,
    TranslatePipe,
    LoaderComponent,
    CsHeaderComponent,
    CustomValidatorDirective,
    CustomDirectiveFocusDirective,
    FooterComponent,
    BrowseComponent,
    CookiebarComponent,
    StoreComponent,
    FragranceComponent,
    FfLandingpageComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    BrowserModule.withServerTransition({ appId: "moltonbrown-app" }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    DeviceDetectorModule.forRoot(),
    HeaderModule,
    AccordianModule,
    AccordianItemModule
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AppService,
    LinkService,
    CategoryComponentService,
    PlacePredictionService,
    // GoogleMapsAPIWrapper,
    CSCustomerService,
    profileComponentService,
    BasketPageComponentService,
    productviewComponentService,
    PagerService,
    HeaderComponentService,
    SingletonService,
    AuthenticationGuardService,
    RoleGuardService,
    AuthenticationService,
    GiftCardComponentService,
    OrderHistoryService,
    StorefinderService,
    PaymentService,
    NewsLetterComponentService,
    CustomerAccountService,
    FooterComponentService,
    TranslateService, 
    AmpHomePageService,
    CookieService,
    GtmMethodService,
    StoreSpecificRoleGuardService,
      {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [ TranslateService ],
      multi: true
    },
    ConfigService,
    MetaService,
    { provide: '$scope', useExisting: '$rootScope' },
    SEOService,
    FFCatalogService,
    FragranceService,
    ResizeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// const __stripTrailingSlash = (Location as any).stripTrailingSlash;  
// Location.stripTrailingSlash = function (url) {  
//   if (url.endsWith('/')) {  
//     url=url;  
//   }  
//   else {  
//     url=url+'/';  
//   }  
//   const queryString$ = url.match(/([^?]*)?(.*)/);  
//   if (queryString$[2].length > 0) {  
//     return /[^\/]\/$/.test(queryString$[1]) ? queryString$[1] + '.' + queryString$[2] : __stripTrailingSlash(url);  
//   }  
//   return /[^\/]\/$/.test(url) ? url + '.' : __stripTrailingSlash(url);  
// };  