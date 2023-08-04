import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { FormsModule} from "@angular/forms";
// import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
// import { AgmDirectionModule } from 'agm-direction';
import { GooglePlacesDirectiveModule } from "../checkout-cart/googleplacedirective.module";
import {StoreservicelistComponent} from './storeservicelist.component';
import {StoreLocatorModule} from '../checkout-cart/delivery/storepoint/store-locator/store-locator.module';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {gme} from '../app.constant';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';

const routes: Routes = [
    { path: '', component: StoreservicelistComponent, data: { title: 'Customers' } }

];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        StoreLocatorModule,
        // AgmCoreModule.forRoot({
        //     apiKey: gme.googleMapKey,
        //     libraries: ["places"]
        //   }),
          TranslatServicePipeModule,
        // AgmDirectionModule ,
        GooglePlacesDirectiveModule
    ],
    declarations: [
        StoreservicelistComponent
    ],
    providers:[TranslateServiceSubService]
})
export class StoreservicelistModule { }