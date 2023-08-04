import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {NotFoundComponent} from './not-found.component';
import { Routes, RouterModule } from '@angular/router';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
const routes: Routes = [
    { path: '', component: NotFoundComponent,runGuardsAndResolvers: 'always' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslatServicePipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotFoundComponent],
  exports:      [ NotFoundComponent,
    CommonModule, FormsModule ]
})
export class Pagenotfoundmodule { }
