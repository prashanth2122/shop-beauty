import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import {StoreDetailComponent} from './store-detail.component';
import {StoreDetailLocatorComponent} from './store-locator/store-locator.component';
// import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
// import { AgmDirectionModule } from 'agm-direction';
import { StoreRouteComponent } from './store-route/store-route.component';
import { GooglePlacesDirectiveModule } from "../checkout-cart/googleplacedirective.module";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {gme} from '../app.constant';
const routes: Routes = [
    { path: '', component: StoreDetailComponent, data: { title: 'Customers' } }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        // AgmCoreModule.forRoot({
        //     apiKey: gme.googleMapKey,
        //     libraries: ["places"]
        //   }),
        // AgmDirectionModule ,
        GooglePlacesDirectiveModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        StoreDetailComponent,
        StoreDetailLocatorComponent,
        StoreRouteComponent
    ]
})
export class StoreDetailModule { }
