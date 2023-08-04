import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';
import { FormsModule} from "@angular/forms";
import {ProductComponent} from './product.component';
import {ProductviewModule} from '../../component/productview/productview.module';
import {TranslatServicePipeModule} from '../../pipe/transalte.module';
import {TranslateServiceSubService} from '../../pipe/translate-service-sub.service';
import {SanitizeHtmlPipeModule} from "../../pipe/sanitize.module";
import{NgUiViewModule} from '../../component/ngui-in-view/ngUiView.module';
import {OpenNewWindowModule} from "../../directives/newTab.module";
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductviewModule,
    TranslatServicePipeModule,
    SanitizeHtmlPipeModule,
    NgUiViewModule,
    OpenNewWindowModule
  ],
  declarations: [ProductComponent],
  providers:[TranslateServiceSubService],
  exports:      [ ProductComponent,
    CommonModule, FormsModule ]
})
export class ProductModule { }
