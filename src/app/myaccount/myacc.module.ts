
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import {ProfileFormComponent} from '../component/profile-form/profile-form.component';
import { RegistrationComponent } from '../component/registration/registration.component';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {CustomFocusControlDirectiveModule} from '../directives/customFocus.module';
import { GooglePlacesDirectiveModule } from "../checkout-cart/googleplacedirective.module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GtmMethodService} from "../services/gtmmethods.service";


const routes: Routes =[
    { path: '', redirectTo: 'mbLogin', pathMatch: 'full' },
    { path: 'mbLogin', component: RegistrationComponent },
    {path:'mbRegister',component:ProfileFormComponent}
];
@NgModule({
    imports: [
        NgbModule,
        CommonModule,
        FormsModule,
        DeviceDetectorModule,
        ReactiveFormsModule,
        MbBreadCrumbModule,
        TranslatServicePipeModule,
        CustomFocusControlDirectiveModule,
        GooglePlacesDirectiveModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RegistrationComponent,
        ProfileFormComponent
    ],
    providers:[GtmMethodService]
})
export class MyaccRouteModule { }