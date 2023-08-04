import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule} from "@angular/forms";
import { CategorylandingPageComponent } from './categorylanding-page.component';
import {CategorybannerComponent} from './categorybanner/categorybanner.component';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import {sortTypeModule} from './sort-type/sort-type.module';
import {ProductModule} from './product/product.module';
import {FilterModule} from './filter/filter.module';
import {PageTypeModule} from '../component/pager/page.module';
import{NgUiViewModule} from '../component/ngui-in-view/ngUiView.module';
import {LoadingModule} from '../loading/loading.module';
import {SanitizeHtmlPipeModule} from "../pipe/sanitize.module";
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
const routes: Routes = [
    { path: '', component: CategorylandingPageComponent, data: { title: 'Customers' } }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        NgUiViewModule,
        PageTypeModule,
        MbBreadCrumbModule,
        TranslatServicePipeModule,
        sortTypeModule,
        ProductModule,
        FilterModule,
        LoadingModule,
        SanitizeHtmlPipeModule
    ],
    providers:[TranslateServiceSubService],
        
    declarations: [
        CategorylandingPageComponent,
        CategorybannerComponent
    ]
})
export class CategorylandingPageModule { }
