
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingpageComponent } from "./landingpage.component";
import{NgUiViewModule} from '../component/ngui-in-view/ngUiView.module';
const routes: Routes = [
    { path: '', component: LandingpageComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgUiViewModule
    ],
    declarations: [
        LandingpageComponent
    ]
})
export class landingpageModule { }