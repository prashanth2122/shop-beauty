import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import { Routes, RouterModule } from '@angular/router';
import { NewsletterSignupComponent } from "./newsletter-signup.component";
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
const routes: Routes = [
    { path: '', component: NewsletterSignupComponent,runGuardsAndResolvers: 'always' }
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
        NewsletterSignupComponent
    ],
    providers:[
    ]
})
export class NewsletterSignupModule { }