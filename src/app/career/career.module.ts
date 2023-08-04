import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CareerComponent } from "./career.component";
const routes: Routes = [
    { path: '', component: CareerComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CareerComponent
    ],
    providers:[
    ]
})
export class careerModule { }