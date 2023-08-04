import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {  RouterModule } from '@angular/router';
import {ProductviewComponent} from './productview.component';
import {TranslatServicePipeModule} from '../../pipe/transalte.module';
import {TranslateServiceSubService} from '../../pipe/translate-service-sub.service';
import { CeiboShare } from "../../directives/shareIcon.directive";
import {SanitizeHtmlPipeModule} from "../../pipe/sanitize.module";
import {AccordianModule} from "../../accordion/accordian.module";
import {AccordianItemModule} from "../../accordion-item/accordion-item.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslatServicePipeModule,
    SanitizeHtmlPipeModule,
    RouterModule,
    AccordianModule,
    AccordianItemModule
  ],
  declarations: [ProductviewComponent,CeiboShare],
  providers:[TranslateServiceSubService],
  exports:      [ ProductviewComponent,
    CommonModule, FormsModule ]
})
export class ProductviewModule { }
