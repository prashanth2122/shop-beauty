import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CorporateGiftsComponent } from "./corporate-gifts.component";
const routes: Routes = [
    { path: '', component: CorporateGiftsComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CorporateGiftsComponent
    ],
    providers:[
    ]
})
export class corporateGiftModule { }