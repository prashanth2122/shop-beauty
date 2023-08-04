import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule} from "@angular/forms";
import { SearchLandingpageComponent } from './search-landingpage.component';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import {sortTypeModule} from '../categorylanding-page/sort-type/sort-type.module';
import {ProductModule} from '../categorylanding-page/product/product.module';
import {FilterModule} from '../categorylanding-page/filter/filter.module';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import {PageTypeModule} from '../component/pager/page.module';
import{NgUiViewModule} from '../component/ngui-in-view/ngUiView.module';
const routes: Routes = [
    { path: '', component: SearchLandingpageComponent, data: { title: 'Customers' } }
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
        FilterModule
    ],
    declarations: [
        SearchLandingpageComponent
    ],
    providers:[
        TranslateServiceSubService
    ]
})
export class SearchLandingPageModule { }
