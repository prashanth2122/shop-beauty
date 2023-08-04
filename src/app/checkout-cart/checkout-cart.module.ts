import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import { SlickCarouselModule } from "ngx-slick-carousel";
import{CheckoutCartComponent} from './checkout-cart.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {CollectServiceComponent} from './delivery/collect-service/collect-service.component';
import {DeliveryFormComponent} from './delivery/delivery-form/delivery-form.component';
import {DeliveryServiceComponent} from './delivery/delivery-service/delivery-service.component';
import {StorepointComponent} from './delivery/storepoint/storepoint.component';
import {CollectionListComponent}  from './delivery/storepoint/collection-list/collection-list.component';
import {StoreLocatorModule} from './delivery/storepoint/store-locator/store-locator.module';
import {OrderConfirmationComponent} from './order-confirmation/order-confirmation.component';
import {OrderSummaryComponent}from './order-summary/order-summary.component';
import {PaytypeComponent} from './paytype/paytype.component';
import {CardFormComponent} from '../paymentType/card-form/card-form.component';
import {GiftcardComponent} from '../paymentType/giftcard/giftcard.component';
import { SepaComponent } from '../paymentType/sepa/sepa.component';
import { KlarnaComponent } from '../paymentType/klarna/klarna.component';
import {MbTermsComponent} from '../paymentType/mb-terms/mb-terms.component';
import {PaypalComponent} from '../paymentType/paypal/paypal.component';
import {LoadingModule} from '../loading/loading.module';
// import { AgmCoreModule } from "@agm/core";
import {BillingAddressComponent} from '../paymentType/billing-address/billing-address.component';
import { GooglePlacesDirectiveModule } from "./googleplacedirective.module";
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import { DeviceDetectorService } from "ngx-device-detector";
import {EncryptedCardComponent} from '../paymentType/encrypted-card/encrypted-card.component';
import { CdCardComponent } from '../paymentType/cd-card/cd-card.component';
import { checkoutCartCustomFocusDirective } from './customDirective/customFocusValid';
import {AddressFormComponent} from '../paymentType/address-form/address-form.component';
import {GiftPayFormComponent} from '../paymentType/gift-pay-form/gift-pay-form.component';
import {EncryptComponentService} from '../paymentType/encrypted-card/encrypted-card.service';
import {CustomFocusControlDirectiveModule} from '../directives/customFocus.module';
import { DeliveryComponentService } from "./delivery/delivery.service";
import { ConfirmationComponentService } from "./order-confirmation/order-confirmation.service";
import { StorePointComponentService } from "./delivery/storepoint/storepoint.service";
import {CollectComponentService} from './delivery/collect-service/collect-service.service';
import { cardFormComponentService } from "../paymentType/card-form/card-form.service";
import { GiftCardService } from "../paymentType/giftcard/giftcard.service";
import {PaypalService} from '../paymentType/paypal/paypal.service';
import {CheckoutRegComponentService} from './checkout-regitstration/checkout-registration.service';
import {SanitizeHtmlPipeModule} from "../pipe/sanitize.module";
import { CustomSelectComponent } from './custom-select/custom-select.component';
import {PreviousRouteService} from "./previousRouteState.service";
import {HomeRedirectService} from "../services/homeRedirect.service"; 
import {KlarnaService} from "../paymentType/klarna/klarna.service";
import {AccordianModule} from "../accordion/accordian.module";
import {AccordianItemModule} from "../accordion-item/accordion-item.module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
    { path: '', component: CheckoutCartComponent, data: { title: 'Customers' } ,  
       children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', loadChildren: './checkout-regitstration/checkoutregistration.module#checkoutregistrationModule' },
        { path: 'shipping', loadChildren:'./delivery/delivery.module#DeliveryPageModule' ,canActivate: [HomeRedirectService]},
        { path: 'mbOrderConfirmResponse', component: OrderConfirmationComponent }
    ],
    runGuardsAndResolvers: 'always'
}
];
@NgModule({
    imports: [
        NgbModule,
        CommonModule,
        FormsModule,
        DeviceDetectorModule,
        ReactiveFormsModule,
        CustomFocusControlDirectiveModule,
        LoadingModule,
        RouterModule.forChild(routes),
        SanitizeHtmlPipeModule,
        TranslatServicePipeModule
        // AgmCoreModule.forRoot({
        //     apiKey: gme.googleMapKey,
        //     libraries: ["places"]
        //   })
    ],
    declarations: [
        CheckoutCartComponent,
        // DeliveryComponent,
        // CollectServiceComponent,
        // DeliveryFormComponent,
        // DeliveryServiceComponent,
        // StorepointComponent,
        // CollectionListComponent,
        OrderConfirmationComponent,
        // OrderSummaryComponent,
        // PaytypeComponent,
        // CardFormComponent,
        // GiftcardComponent,
        // MbTermsComponent,
        // PaypalComponent,
        // BillingAddressComponent,
        // SepaComponent,
        // KlarnaComponent,
        // checkoutCartCustomFocusDirective,
        // EncryptedCardComponent,
        // CdCardComponent,
        // AddressFormComponent,
        // GiftPayFormComponent,
        // CustomSelectComponent
    ],
    providers:[
        TranslateServiceSubService,
        DeviceDetectorService,
        EncryptComponentService,
        ConfirmationComponentService,
        StorePointComponentService,
        CollectComponentService,
        DeliveryComponentService,
        cardFormComponentService,
        GiftCardService,
        PaypalService,
        CheckoutRegComponentService,
        PreviousRouteService,
        HomeRedirectService,
        KlarnaService
    ]
})
export class CheckoutCartPageModule { }
