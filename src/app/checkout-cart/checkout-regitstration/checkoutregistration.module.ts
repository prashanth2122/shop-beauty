
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomFocusControlDirectiveModule} from '../../directives/customFocus.module';
import {LoadingModule} from '../../loading/loading.module';
import {SanitizeHtmlPipeModule} from "../../pipe/sanitize.module";
import {TranslatServicePipeModule} from '../../pipe/transalte.module';
import {CheckoutRegitstrationComponent} from './checkout-regitstration.component';
const routes: Routes = [
    { path: '', component: CheckoutRegitstrationComponent,runGuardsAndResolvers: 'always' }
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
    ],
    declarations: [
        CheckoutRegitstrationComponent
    ],
    providers:[
    ]
})
export class checkoutregistrationModule { }