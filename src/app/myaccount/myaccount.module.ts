
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import { AddressbookComponent } from "../component/addressbook/addressbook.component";
import { PaymentDetailComponent } from "../component/payment-detail/payment-detail.component";
import { FavouritesComponent } from "../component/favourites/favourites.component";
import { OrdersComponent } from "../component/orders/orders.component";
import { CustomerAccountComponent } from "../component/customer-account/customer-account.component";
import { CustomerDetailComponent } from "../component/customer-detail/customer-detail.component";
import { OrdersDetailsComponent } from "../component/orders/orders-details/orders-details.component";
import { ForgotPasswordComponent } from '../component/customer-account/forgot-password/forgot-password.component';
import {EditPaymentCardComponent} from '../component/payment-detail/edit-payment-card/edit-payment-card.component';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import { CustomerProfileFormComponent } from "../component/customer-profile-form/customer-profile-form.component";
import { PaymentNewSavedCardComponent } from '../component/payment-new-saved-card/payment-new-saved-card.component';
import { PersonalFormComponent } from "../component/personal-form/personal-form.component";
import {CustomFocusControlDirectiveModule} from '../directives/customFocus.module';
import { GooglePlacesDirectiveModule } from "../checkout-cart/googleplacedirective.module";
import {MyaccountComponent} from './myaccount.component';
import {AuthGuardService} from '../services/authGuard.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import {CustomDatePipe} from "../component/orders/orderDatePipe.pipe"; 
const routes: Routes = [
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    {path:'accountCardEdit',component:EditPaymentCardComponent},
    { path: 'profile', component: CustomerAccountComponent,               
    children: [
        { path: '', redirectTo: 'detail', pathMatch: 'full' ,canActivate: [AuthGuardService] },                    
        { path: 'paymentInfo', component: PaymentDetailComponent ,canActivate: [AuthGuardService]},
        { path: 'detail', component: CustomerDetailComponent,canActivate: [AuthGuardService]},
        { path: 'addressBook', component: AddressbookComponent,canActivate: [AuthGuardService] },                    
        { path: 'myFavorites', component: FavouritesComponent,canActivate: [AuthGuardService] },                    
        { path: 'mbOrderhistory', component: OrdersComponent ,canActivate: [AuthGuardService]},
        { path: 'orderDetails', component: OrdersDetailsComponent,canActivate: [AuthGuardService]},
        { path:'passwordReset',component:ForgotPasswordComponent}
    ]
}
]

@NgModule({
    imports: [
        NgbModule,
        CommonModule,
        FormsModule,
        DeviceDetectorModule,
        ReactiveFormsModule,
        MbBreadCrumbModule,
        TranslatServicePipeModule,
        GooglePlacesDirectiveModule,
        CustomFocusControlDirectiveModule,
        RouterModule.forChild(routes),
        RecaptchaModule,
        RecaptchaFormsModule
    ],
    declarations: [
        MyaccountComponent,
        EditPaymentCardComponent, 
        CustomerAccountComponent,
        PaymentDetailComponent,
        AddressbookComponent,
        FavouritesComponent,
        OrdersComponent,
        OrdersDetailsComponent,
        ForgotPasswordComponent,
        CustomerDetailComponent,
        PaymentNewSavedCardComponent,
        CustomerProfileFormComponent,
        PersonalFormComponent,
        CustomDatePipe 
    ],
    providers:[
        AuthGuardService,
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
              siteKey: '6Le1rMQUAAAAAIGRT2rhKrQ6l6CaXCuUKv5C9L5L',
            } as RecaptchaSettings,
          }
    ]
})
export class MyaccountRouteModule { }