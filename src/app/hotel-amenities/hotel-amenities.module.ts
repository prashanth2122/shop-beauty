import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HotelAmenitiesComponent } from "./hotel-amenities.component";
import {HotelAmenitiesComponentService} from './hotel-amenities.service';
const routes: Routes = [
    { 
        path: '', component: HotelAmenitiesComponent,runGuardsAndResolvers: 'always',
   }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HotelAmenitiesComponent
    ],
    providers:[
        HotelAmenitiesComponentService
    ]
})
export class HotelAmenitiesModule { }