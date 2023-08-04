
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AmpHomepageComponent } from "./amp-homepage.component";
import{NgUiViewModule} from '../component/ngui-in-view/ngUiView.module';
import { ResizeService } from '../services/resize.service';
const routes: Routes = [
    { path: '', component: AmpHomepageComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgUiViewModule
    ],
    declarations: [
        AmpHomepageComponent
    ],
    providers:[
        ResizeService
    ]
})
export class AmpHomePageModule { }