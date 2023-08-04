
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StoreEventsComponent } from "./store-events.component";
const routes: Routes = [
    { path: '', component: StoreEventsComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        StoreEventsComponent
    ],
    providers:[
        StoreEventsComponent
    ]
})
export class storeEventsModule { }