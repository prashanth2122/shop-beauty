
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import { OrganisationComponent } from "../organisation/organisation.component";
import {OrganisationComponentService} from "./organisation.service";
import { SitemapComponent } from './sitemap.component';
const routes: Routes = [
    { path: '', component: OrganisationComponent,runGuardsAndResolvers: 'always' }
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
        OrganisationComponent,
        SitemapComponent
    ],
    providers:[
        OrganisationComponentService
    ]
})
export class OrgainisationRouteModule { }