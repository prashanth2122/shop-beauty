import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {TranslatServicePipeModule} from '../../pipe/transalte.module';
import {TranslateServiceSubService} from '../../pipe/translate-service-sub.service';
import {MbBreadCrumbComponent} from './mb-bread-crumb.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslatServicePipeModule,
  ],
  declarations: [MbBreadCrumbComponent],
  providers:[
    TranslateServiceSubService,
 ],
  exports:      [ 
    MbBreadCrumbComponent,
    CommonModule, 
    FormsModule ]
})
export class MbBreadCrumbModule { }
