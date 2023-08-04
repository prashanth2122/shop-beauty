
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import { PickMixTravelComponent } from './pick-mix-travel.component';
import {PickMixTravelComponentService} from './pick-mix-travel.service';
import { PickComponent } from './pick/pick.component';
import { PickBuyComponent } from './pick-buy/pick-buy.component';
const routes: Routes = [
    { path: '', component: PickMixTravelComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DeviceDetectorModule,
        ReactiveFormsModule,
        MbBreadCrumbModule,
        TranslatServicePipeModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PickMixTravelComponent,
        PickComponent,
        PickBuyComponent
    ],
    providers:[
        PickMixTravelComponentService
    ]
})
export class PickMixTravelModule { }