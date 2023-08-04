import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import {CategoryDetailPageComponent} from './category-detail-page.component';
import {ProductviewModule} from '../component/productview/productview.module';
import {ReviewComponent}from './review/review.component';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import { DeliveryInstructionsComponent } from './delivery-instructions/delivery-instructions.component';
import { CategoryDetailComponentService } from "./category-detail-page.service";
import {LoadingModule} from '../loading/loading.module';
import {SanitizeHtmlPipeModule} from "../pipe/sanitize.module";
import {AccordianModule} from "../accordion/accordian.module";
import {AccordianItemModule} from "../accordion-item/accordion-item.module";
import { ResizeService } from '../services/resize.service';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
const routes: Routes = [
    { path: '', component: CategoryDetailPageComponent,runGuardsAndResolvers: 'always' }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProductviewModule,
        LoadingModule,
        RouterModule.forChild(routes),
        MbBreadCrumbModule,
        SanitizeHtmlPipeModule,
        AccordianModule,
        AccordianItemModule,
        TranslatServicePipeModule
    ],
    declarations: [
        CategoryDetailPageComponent,        
        ReviewComponent,
        DeliveryInstructionsComponent
    ],
    providers:[
        CategoryDetailComponentService,
        ResizeService
    ]
})
export class CategoryDetailPageModule { }
