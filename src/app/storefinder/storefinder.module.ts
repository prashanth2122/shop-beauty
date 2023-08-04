import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import {StorefinderComponent} from './storefinder.component';
// import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
// import { AgmDirectionModule } from 'agm-direction';
import { GooglePlacesDirectiveModule } from "../checkout-cart/googleplacedirective.module";
import {AccordianModule} from "../accordion/accordian.module";
import {AccordianItemModule} from "../accordion-item/accordion-item.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import {gme} from '../app.constant';
const routes: Routes = [
    { path: '', component: StorefinderComponent, data: { title: 'Customers' } },
    { path: 'store/404',pathMatch: 'full',loadChildren: '../not-found/not-found.module#Pagenotfoundmodule'}
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
        TranslatServicePipeModule,
        FormsModule,
        ReactiveFormsModule,
        AccordianModule,
        AccordianItemModule
    ],
    declarations: [
        StorefinderComponent
    ],
    providers:[
       TranslateServiceSubService,
    ]
})
export class StoreFinderModule { }